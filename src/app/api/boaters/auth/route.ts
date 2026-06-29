import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// ─── Supabase clients ────────────────────────────────────────────────────────
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

function anonClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

// ─── POST /api/boaters/auth ──────────────────────────────────────────────────
// All actions read/write the contacts table (marina_id IS NULL for boaters).
// This is the same table used by the mobile app — one source of truth.
//
// action: "check"       → { email }                  → { hasPIN: bool }
// action: "send-otp"    → { email }                  → { ok: true }
// action: "verify-otp"  → { email, otp }              → { needsPin, userId, access_token, refresh_token }
// action: "set-pin"     → { userId, pinHash, first_name?, last_name? } → { ok, account }
// action: "verify-pin"  → { email, pinHash }          → { access_token, refresh_token, account }
// action: "profile"     → { email }                  → { account }

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { action } = body

    // ─── CHECK ───────────────────────────────────────────────────────────────
    if (action === 'check') {
      const email = (body.email ?? '').toLowerCase().trim()
      if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

      const { data } = await supabaseAdmin
        .from('contacts')
        .select('auth_user_id, pin_hash')
        .eq('email', email)
        .not('pin_hash', 'is', null)
        .is('marina_id', null)
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle()

      return NextResponse.json({ hasPIN: !!(data?.pin_hash && data?.auth_user_id) })
    }

    // ─── SEND OTP ─────────────────────────────────────────────────────────────
    // Supabase sends the verification email — no Resend needed here.
    if (action === 'send-otp') {
      const email = (body.email ?? '').toLowerCase().trim()
      if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

      // If the user already has a PIN in contacts, tell them to sign in with it
      const { data: existing } = await supabaseAdmin
        .from('contacts')
        .select('pin_hash, auth_user_id')
        .eq('email', email)
        .not('pin_hash', 'is', null)
        .is('marina_id', null)
        .maybeSingle()

      if (existing?.pin_hash && existing?.auth_user_id) {
        return NextResponse.json(
          { error: 'Account already exists — please enter your PIN' },
          { status: 400 }
        )
      }

      // Trigger Supabase Auth OTP email
      const { error } = await anonClient().auth.signInWithOtp({
        email,
        options: { shouldCreateUser: true },
      })

      if (error) {
        console.error('send-otp error:', error)
        return NextResponse.json({ error: 'Failed to send code' }, { status: 500 })
      }

      return NextResponse.json({ ok: true })
    }

    // ─── VERIFY OTP ──────────────────────────────────────────────────────────
    if (action === 'verify-otp') {
      const email = (body.email ?? '').toLowerCase().trim()
      const otp = (body.otp ?? '').trim()
      if (!email || !otp) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

      const client = anonClient()
      const { data, error } = await client.auth.verifyOtp({
        email,
        token: otp,
        type: 'email',
      })

      if (error || !data?.user || !data?.session) {
        console.error('verify-otp error:', error)
        return NextResponse.json({ error: 'Invalid or expired code' }, { status: 401 })
      }

      const userId = data.user.id

      // Link or create national-pool contacts row
      const { data: existingRows } = await supabaseAdmin
        .from('contacts')
        .select('id, auth_user_id')
        .eq('email', email)
        .is('marina_id', null)
        .order('created_at', { ascending: true })
        .limit(1)

      const existing = existingRows?.[0] ?? null

      if (existing) {
        // Update auth_user_id to real Supabase UUID
        await supabaseAdmin
          .from('contacts')
          .update({ auth_user_id: userId })
          .eq('id', existing.id)
      } else {
        // Brand-new boater — create national-pool row
        await supabaseAdmin
          .from('contacts')
          .insert({ auth_user_id: userId, email })
      }

      // Auto-couple any marina-scoped rows with this email that have no auth_user_id
      const { data: pendingLinks } = await supabaseAdmin
        .from('contacts')
        .select('id')
        .eq('email', email)
        .not('marina_id', 'is', null)
        .is('auth_user_id', null)

      if (pendingLinks && pendingLinks.length > 0) {
        await supabaseAdmin
          .from('contacts')
          .update({ auth_user_id: userId })
          .in('id', pendingLinks.map((c: { id: string }) => c.id))
      }

      return NextResponse.json({
        needsPin: true,
        userId,
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      })
    }

    // ─── SET PIN ─────────────────────────────────────────────────────────────
    // pinHash = SHA-256 hex of the PIN (same format as mobile app)
    if (action === 'set-pin') {
      const { userId, pinHash, first_name, last_name } = body
      if (!userId || !pinHash) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

      const updatePayload: Record<string, unknown> = {
        pin_hash: pinHash,
        setup_complete: true,
        updated_at: new Date().toISOString(),
      }
      if (first_name) updatePayload.first_name = first_name
      if (last_name) updatePayload.last_name = last_name

      const { error } = await supabaseAdmin
        .from('contacts')
        .update(updatePayload)
        .eq('auth_user_id', userId)
        .is('marina_id', null)

      if (error) return NextResponse.json({ error: error.message }, { status: 500 })

      const { data: contact } = await supabaseAdmin
        .from('contacts')
        .select('id, email, first_name, last_name')
        .eq('auth_user_id', userId)
        .is('marina_id', null)
        .maybeSingle()

      return NextResponse.json({ ok: true, account: contact })
    }

    // ─── VERIFY PIN ──────────────────────────────────────────────────────────
    // pinHash = SHA-256 hex of the PIN (client-side hashed, same as mobile app)
    if (action === 'verify-pin') {
      const email = (body.email ?? '').toLowerCase().trim()
      const pinHash = (body.pinHash ?? '').trim()
      if (!email || !pinHash) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

      const { data: contact } = await supabaseAdmin
        .from('contacts')
        .select('id, email, first_name, last_name, auth_user_id, pin_hash')
        .eq('email', email)
        .not('pin_hash', 'is', null)
        .is('marina_id', null)
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle()

      if (!contact?.pin_hash || !contact?.auth_user_id) {
        return NextResponse.json({ error: 'Account not found' }, { status: 404 })
      }

      if (contact.pin_hash !== pinHash) {
        return NextResponse.json({ error: 'Incorrect PIN' }, { status: 401 })
      }

      // Generate a real Supabase session via admin magic link (no email sent — server-to-server)
      const { data: linkData, error: linkErr } = await supabaseAdmin.auth.admin.generateLink({
        type: 'magiclink',
        email,
      })

      if (linkErr || !linkData?.properties?.email_otp) {
        console.error('generateLink error:', linkErr)
        return NextResponse.json({ error: 'Failed to generate session' }, { status: 500 })
      }

      const client = anonClient()
      const { data: sessionData, error: sessionErr } = await client.auth.verifyOtp({
        email,
        token: linkData.properties.email_otp,
        type: 'email',
      })

      if (sessionErr || !sessionData?.session) {
        console.error('verifyOtp error:', sessionErr)
        return NextResponse.json({ error: 'Session creation failed' }, { status: 500 })
      }

      return NextResponse.json({
        access_token: sessionData.session.access_token,
        refresh_token: sessionData.session.refresh_token,
        account: {
          id: contact.id,
          email: contact.email,
          first_name: contact.first_name,
          last_name: contact.last_name,
        },
      })
    }

    // ─── PROFILE ─────────────────────────────────────────────────────────────
    if (action === 'profile') {
      const email = (body.email ?? '').toLowerCase().trim()
      if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

      const { data: contact } = await supabaseAdmin
        .from('contacts')
        .select('id, email, first_name, last_name, phone, created_at')
        .eq('email', email)
        .is('marina_id', null)
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle()

      if (!contact) return NextResponse.json({ error: 'Not found' }, { status: 404 })
      return NextResponse.json({ account: contact })
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (err) {
    console.error('Boater auth error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)
const RESEND_KEY = process.env.RESEND_API_KEY!

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 40)
}

function hashPin(pin: string): string {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.scryptSync(pin, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

function verifyPin(pin: string, stored: string): boolean {
  try {
    const [salt, hash] = stored.split(':')
    const attempt = crypto.scryptSync(pin, salt, 64).toString('hex')
    return crypto.timingSafeEqual(Buffer.from(attempt, 'hex'), Buffer.from(hash, 'hex'))
  } catch { return false }
}

// POST /api/marina/signup
// action: "check"       → { email } → { hasPIN, hasAccount }
// action: "send-otp"    → { email } → sends OTP
// action: "verify-otp"  → { email, otp } → { ok }
// action: "create"      → { email, otp, pin, firstName, lastName, marinaName, city, state, slips } → { account }
// action: "verify-pin"  → { email, pin } → { account }

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { action } = body

  // ── CHECK ──────────────────────────────────────────────────────────────────
  if (action === 'check') {
    const { email } = body
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })
    const { data } = await supabase
      .from('marina_owner_accounts')
      .select('pin_hash')
      .eq('email', email.toLowerCase().trim())
      .maybeSingle()
    return NextResponse.json({ hasPIN: !!(data?.pin_hash), hasAccount: !!data })
  }

  // ── SEND OTP ───────────────────────────────────────────────────────────────
  if (action === 'send-otp') {
    const { email } = body
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })
    const normalEmail = email.toLowerCase().trim()
    const otp = String(Math.floor(100000 + Math.random() * 900000))
    const expires = new Date(Date.now() + 10 * 60 * 1000).toISOString()

    await supabase.from('marina_owner_accounts').upsert({
      email: normalEmail,
      otp_code: otp,
      otp_expires_at: expires,
      otp_used: false,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'email' })

    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'noreply@ayeayeskipper.com',
        to: [normalEmail],
        subject: 'Your AyeAyeSkipper verification code',
        html: `
<div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:40px 20px">
  <img src="https://ayeayeskipper.com/skipper-avatar.jpg" alt="Skipper" style="width:48px;height:48px;border-radius:50%;margin-bottom:20px"/>
  <h2 style="color:#0d2b4b;margin:0 0 8px">Your verification code</h2>
  <p style="color:#555;margin:0 0 28px">Enter this code to create your marina account. It expires in 10 minutes.</p>
  <div style="font-size:40px;font-weight:900;letter-spacing:8px;color:#0d2b4b;background:#f0f9ff;padding:20px 32px;border-radius:12px;display:inline-block">${otp}</div>
  <p style="color:#999;font-size:12px;margin-top:28px">If you didn't request this, ignore this email.</p>
</div>
        `,
      }),
    })
    return NextResponse.json({ ok: true })
  }

  // ── VERIFY OTP ─────────────────────────────────────────────────────────────
  if (action === 'verify-otp') {
    const { email, otp } = body
    if (!email || !otp) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    const { data: acct } = await supabase
      .from('marina_owner_accounts')
      .select('otp_code, otp_expires_at, otp_used')
      .eq('email', email.toLowerCase().trim())
      .maybeSingle()
    if (!acct) return NextResponse.json({ error: 'Account not found' }, { status: 404 })
    if (acct.otp_used) return NextResponse.json({ error: 'Code already used' }, { status: 400 })
    if (acct.otp_code !== otp) return NextResponse.json({ error: 'Invalid code' }, { status: 401 })
    if (new Date(acct.otp_expires_at) < new Date()) return NextResponse.json({ error: 'Code expired' }, { status: 401 })
    return NextResponse.json({ ok: true })
  }

  // ── CREATE ACCOUNT ─────────────────────────────────────────────────────────
  if (action === 'create') {
    const { email, otp, pin, firstName, lastName, marinaName, city, state, slips } = body
    if (!email || !otp || !pin || !firstName || !marinaName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    const normalEmail = email.toLowerCase().trim()

    // Re-verify OTP
    const { data: acct } = await supabase
      .from('marina_owner_accounts')
      .select('otp_code, otp_expires_at, otp_used')
      .eq('email', normalEmail)
      .maybeSingle()
    if (!acct || acct.otp_code !== otp || acct.otp_used || new Date(acct.otp_expires_at) < new Date()) {
      return NextResponse.json({ error: 'OTP invalid or expired' }, { status: 401 })
    }

    // Generate slug, ensure uniqueness
    let slug = slugify(marinaName)
    const { data: existing } = await supabase
      .from('marinas')
      .select('id')
      .eq('slug', slug)
      .maybeSingle()
    if (existing) slug = `${slug}-${Date.now().toString(36)}`

    // Create marina record
    const { data: marina, error: marinaErr } = await supabase
      .from('marinas')
      .insert({
        name: marinaName,
        city: city || null,
        state: state || null,
        total_slips: slips ? parseInt(slips, 10) : null,
        slug,
      })
      .select('id, name, slug')
      .single()

    if (marinaErr) {
      // slug column may not exist — retry without it
      const { data: marina2, error: marinaErr2 } = await supabase
        .from('marinas')
        .insert({ name: marinaName, city: city || null, state: state || null, total_slips: slips ? parseInt(slips, 10) : null })
        .select('id, name')
        .single()
      if (marinaErr2) return NextResponse.json({ error: 'Failed to create marina' }, { status: 500 })
      Object.assign(marina!, marina2)
    }

    // SHA-256 pin hash for contacts table (Helm auth doctrine §23)
    const { createHash } = await import('crypto')
    const contacts_pin_hash = createHash('sha256').update(pin).digest('hex')

    // Create contacts row linking owner to marina (with PIN set — this is the live auth system)
    await supabase.from('contacts').insert({
      marina_id: marina!.id,
      email: normalEmail,
      first_name: firstName,
      last_name: lastName || null,
      contact_type: 'owner',
      helm_role: 'admin',
      role: 'admin',
      status: 'active',
      pin_hash: contacts_pin_hash,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    // Finalize marina_accounts row (legacy — kept for fallback only)
    const pin_hash = hashPin(pin)
    const session = crypto.randomUUID() + '-' + Date.now()
    await supabase.from('marina_owner_accounts').update({
      pin_hash,
      first_name: firstName,
      last_name: lastName || null,
      marina_id: marina!.id,
      marina_name: marinaName,
      marina_slug: (marina as { slug?: string })?.slug || null,
      otp_used: true,
      otp_code: null,
      updated_at: new Date().toISOString(),
    }).eq('email', normalEmail)

    // Notify Michael
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'noreply@ayeayeskipper.com',
        to: ['mike@expressdocks.com'],
        subject: `🆕 New marina sign-up: ${marinaName}`,
        html: `<p><b>${marinaName}</b> signed up.<br/>Owner: ${firstName} ${lastName || ''} &lt;${normalEmail}&gt;<br/>Location: ${city || '—'}, ${state || '—'}<br/>Slips: ${slips || '—'}<br/>Marina ID: ${marina!.id}<br/>Helm slug: ${(marina as any)?.slug || slug}</p>`,
      }),
    })

    return NextResponse.json({
      ok: true,
      session,
      account: {
        email: normalEmail,
        firstName,
        lastName: lastName || null,
        marinaName,
        marinaId: marina!.id,
        marinaSlug: (marina as any)?.slug || slug,
      },
    })
  }

  // ── VERIFY PIN (returning marina owner) ────────────────────────────────────
  if (action === 'verify-pin') {
    const { email, pin } = body
    if (!email || !pin) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    const { data: acct } = await supabase
      .from('marina_owner_accounts')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .maybeSingle()
    if (!acct?.pin_hash) return NextResponse.json({ error: 'Account not found' }, { status: 404 })
    const match = verifyPin(pin, acct.pin_hash)
    if (!match) return NextResponse.json({ error: 'Incorrect PIN' }, { status: 401 })
    const session = crypto.randomUUID() + '-' + Date.now()
    return NextResponse.json({
      ok: true,
      session,
      account: {
        email: acct.email,
        firstName: acct.first_name,
        lastName: acct.last_name,
        marinaName: acct.marina_name,
        marinaId: acct.marina_id,
        marinaSlug: acct.marina_slug,
      },
    })
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
const RESEND_KEY = process.env.RESEND_API_KEY!

function randOtp() {
  return String(Math.floor(100000 + Math.random() * 900000))
}

function randSession() {
  return crypto.randomUUID() + '-' + Date.now()
}

// POST /api/boaters/auth
// action: "check"     → { email } → returns { hasPIN: bool }
// action: "verify-pin" → { email, pin } → returns { session, account } or error
// action: "send-otp"  → { email } → sends OTP, returns { ok }
// action: "verify-otp" → { email, otp } → returns { needsPin: true }
// action: "set-pin"   → { email, otp, pin } → sets PIN, returns { session, account }
// action: "profile"   → { session } → returns { account }

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { action } = body

    // ─── CHECK ───────────────────────────────────────────────────────────
    if (action === 'check') {
      const { email } = body
      if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

      const { data } = await supabase
        .from('boater_accounts')
        .select('pin_hash')
        .eq('email', email.toLowerCase().trim())
        .single()

      return NextResponse.json({ hasPIN: !!(data?.pin_hash) })
    }

    // ─── VERIFY PIN ──────────────────────────────────────────────────────
    if (action === 'verify-pin') {
      const { email, pin } = body
      if (!email || !pin) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

      const { data: acct } = await supabase
        .from('boater_accounts')
        .select('*')
        .eq('email', email.toLowerCase().trim())
        .single()

      if (!acct?.pin_hash) return NextResponse.json({ error: 'Account not found' }, { status: 404 })

      const match = await bcrypt.compare(pin, acct.pin_hash)
      if (!match) return NextResponse.json({ error: 'Invalid PIN' }, { status: 401 })

      const session = randSession()
      await supabase.from('boater_accounts').update({ updated_at: new Date().toISOString() }).eq('email', email.toLowerCase().trim())

      return NextResponse.json({
        session,
        account: { id: acct.id, email: acct.email, first_name: acct.first_name, last_name: acct.last_name },
      })
    }

    // ─── SEND OTP ────────────────────────────────────────────────────────
    if (action === 'send-otp') {
      const { email } = body
      if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

      const normalEmail = email.toLowerCase().trim()
      const otp = randOtp()
      const expires = new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 min

      // Upsert account
      const { data: existing } = await supabase.from('boater_accounts').select('id, otp_used').eq('email', normalEmail).single()

      if (existing?.otp_used) {
        return NextResponse.json({ error: 'OTP already used — please enter your PIN' }, { status: 400 })
      }

      await supabase.from('boater_accounts').upsert({
        email: normalEmail,
        otp_code: otp,
        otp_expires_at: expires,
        otp_used: false,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'email' })

      // Send via Resend
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
  <p style="color:#555;margin:0 0 28px">Enter this code to create your boater account. It expires in 10 minutes.</p>
  <div style="font-size:40px;font-weight:900;letter-spacing:8px;color:#0d2b4b;background:#f0f9ff;padding:20px 32px;border-radius:12px;display:inline-block">${otp}</div>
  <p style="color:#999;font-size:12px;margin-top:28px">If you didn't request this, ignore this email.</p>
</div>
          `,
        }),
      })

      return NextResponse.json({ ok: true })
    }

    // ─── VERIFY OTP ──────────────────────────────────────────────────────
    if (action === 'verify-otp') {
      const { email, otp } = body
      if (!email || !otp) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

      const { data: acct } = await supabase
        .from('boater_accounts')
        .select('otp_code, otp_expires_at, otp_used')
        .eq('email', email.toLowerCase().trim())
        .single()

      if (!acct) return NextResponse.json({ error: 'Account not found' }, { status: 404 })
      if (acct.otp_used) return NextResponse.json({ error: 'Code already used' }, { status: 400 })
      if (acct.otp_code !== otp) return NextResponse.json({ error: 'Invalid code' }, { status: 401 })
      if (new Date(acct.otp_expires_at) < new Date()) return NextResponse.json({ error: 'Code expired' }, { status: 401 })

      return NextResponse.json({ needsPin: true })
    }

    // ─── SET PIN ─────────────────────────────────────────────────────────
    if (action === 'set-pin') {
      const { email, otp, pin, first_name, last_name } = body
      if (!email || !otp || !pin) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
      if (pin.length < 4 || pin.length > 6) return NextResponse.json({ error: 'PIN must be 4–6 digits' }, { status: 400 })

      const normalEmail = email.toLowerCase().trim()

      const { data: acct } = await supabase
        .from('boater_accounts')
        .select('otp_code, otp_expires_at, otp_used')
        .eq('email', normalEmail)
        .single()

      if (!acct) return NextResponse.json({ error: 'Account not found' }, { status: 404 })
      if (acct.otp_used) return NextResponse.json({ error: 'Code already used' }, { status: 400 })
      if (acct.otp_code !== otp) return NextResponse.json({ error: 'Invalid code' }, { status: 401 })
      if (new Date(acct.otp_expires_at) < new Date()) return NextResponse.json({ error: 'Code expired' }, { status: 401 })

      const pin_hash = await bcrypt.hash(pin, 10)
      const session = randSession()

      await supabase.from('boater_accounts').update({
        pin_hash,
        otp_used: true,
        otp_code: null,
        ...(first_name ? { first_name } : {}),
        ...(last_name ? { last_name } : {}),
        updated_at: new Date().toISOString(),
      }).eq('email', normalEmail)

      const { data: updated } = await supabase.from('boater_accounts').select('id, email, first_name, last_name').eq('email', normalEmail).single()

      return NextResponse.json({
        session,
        account: updated,
      })
    }

    // ─── PROFILE ─────────────────────────────────────────────────────────
    if (action === 'profile') {
      // For now, session is stored client-side with email — just return account
      const { email, session } = body
      if (!email || !session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

      const { data: acct } = await supabase
        .from('boater_accounts')
        .select('id, email, first_name, last_name, phone, boat_name, boat_type, created_at')
        .eq('email', email.toLowerCase().trim())
        .single()

      if (!acct) return NextResponse.json({ error: 'Not found' }, { status: 404 })
      return NextResponse.json({ account: acct })
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (err) {
    console.error('Boater auth error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

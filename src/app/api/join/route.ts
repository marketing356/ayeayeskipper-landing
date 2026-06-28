import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const RESEND_KEY = process.env.RESEND_API_KEY!
const NOTIFY_EMAIL = 'mike@expressdocks.com'
const FROM_EMAIL = 'noreply@ayeayeskipper.com'

function tierFromSlips(slips: string): string {
  const n = parseInt(slips, 10)
  if (isNaN(n)) return 'mate'
  if (n <= 30) return 'mate'
  if (n <= 99) return 'captain'
  return 'admiral'
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      marinaName, yourName, email, phone,
      city, state, slips, currentSoftware,
      interests, message, tier: formTier,
    } = body

    const tier = formTier || tierFromSlips(slips)

    // 1. Write to Supabase
    try {
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
      await supabase.from('marina_leads').insert({
        marina_name: marinaName,
        your_name: yourName,
        email,
        phone,
        city,
        state,
        slips,
        current_software: currentSoftware,
        interests: interests ?? [],
        message,
        tier,
        status: 'new',
      })
    } catch (dbErr) {
      console.error('Supabase write error (non-fatal):', dbErr)
    }

    // 2. Send email notification via Resend
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${RESEND_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: [NOTIFY_EMAIL],
          subject: `🎉 New marina signup: ${marinaName || 'Unknown'} (${tier.toUpperCase()})`,
          html: `
<h2 style="color:#0d2b4b">New Marina Lead — AyeAyeSkipper</h2>
<table style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:14px">
  <tr><td style="padding:8px;background:#f5f5f5;font-weight:bold;width:180px">Marina Name</td><td style="padding:8px">${marinaName || '—'}</td></tr>
  <tr><td style="padding:8px;background:#f5f5f5;font-weight:bold">Contact Name</td><td style="padding:8px">${yourName || '—'}</td></tr>
  <tr><td style="padding:8px;background:#f5f5f5;font-weight:bold">Email</td><td style="padding:8px"><a href="mailto:${email}">${email || '—'}</a></td></tr>
  <tr><td style="padding:8px;background:#f5f5f5;font-weight:bold">Phone</td><td style="padding:8px">${phone || '—'}</td></tr>
  <tr><td style="padding:8px;background:#f5f5f5;font-weight:bold">Location</td><td style="padding:8px">${city || '—'}, ${state || '—'}</td></tr>
  <tr><td style="padding:8px;background:#f5f5f5;font-weight:bold">Slips</td><td style="padding:8px">${slips || '—'}</td></tr>
  <tr><td style="padding:8px;background:#f5f5f5;font-weight:bold">Suggested Tier</td><td style="padding:8px;color:#4dd6c8;font-weight:bold">${tier.toUpperCase()}</td></tr>
  <tr><td style="padding:8px;background:#f5f5f5;font-weight:bold">Current Software</td><td style="padding:8px">${currentSoftware || '—'}</td></tr>
  <tr><td style="padding:8px;background:#f5f5f5;font-weight:bold">Interests</td><td style="padding:8px">${Array.isArray(interests) ? interests.join(', ') : (interests || '—')}</td></tr>
  <tr><td style="padding:8px;background:#f5f5f5;font-weight:bold">Message</td><td style="padding:8px">${message || '—'}</td></tr>
</table>
<p style="margin-top:24px;color:#666;font-size:13px">Submitted via ayeayeskipper.com/join</p>
          `,
        }),
      })
    } catch (emailErr) {
      console.error('Resend error (non-fatal):', emailErr)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Join API error:', err)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

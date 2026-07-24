import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const ENGINE = process.env.SKIPPER_ENGINE_URL || 'https://skipper-engine-production.up.railway.app'
const ENGINE_KEY = process.env.SKIPPER_DATA_API_KEY || ''

// POST /api/transient-request — §37: proxy to Railway, keep Resend email here (Landing-specific template)
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { marina_id } = body

    if (!marina_id)         return NextResponse.json({ error: 'marina_id required' }, { status: 400 })
    if (!body.contact_name) return NextResponse.json({ error: 'Name required' }, { status: 400 })
    if (!body.arrival_date) return NextResponse.json({ error: 'Arrival date required' }, { status: 400 })
    if (!body.contact_email && !body.contact_phone)
      return NextResponse.json({ error: 'Email or phone required' }, { status: 400 })

    // §37: write to DB via Railway
    const railwayRes = await fetch(
      `${ENGINE}/api/v1/marina/${marina_id}/transient-requests`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-skipper-api-key': ENGINE_KEY },
        body: JSON.stringify({
          marina_id,
          status: 'pending',
          contact_name: body.contact_name,
          contact_email: body.contact_email || null,
          contact_phone: body.contact_phone || null,
          vessel_name: body.vessel_name || null,
          vessel_type: body.vessel_type || null,
          loa_ft: body.loa_ft ? Number(body.loa_ft) : null,
          beam_ft: body.beam_ft ? Number(body.beam_ft) : null,
          draft_ft: body.draft_ft ? Number(body.draft_ft) : null,
          shore_power: body.shore_power ?? null,
          fuel_type: body.fuel_type || null,
          arrival_date: body.arrival_date,
          departure_date: body.departure_date || null,
          nights: body.nights ? Number(body.nights) : null,
          notes: body.notes || null,
          source: 'web',
        }),
      }
    )

    if (!railwayRes.ok) {
      const err = await railwayRes.text()
      return NextResponse.json({ error: err }, { status: railwayRes.status })
    }

    const { requests: inserted } = await railwayRes.json().catch(() => ({ requests: null }))

    // Acknowledgment email to boater (Landing-specific, stays here)
    if (body.contact_email && process.env.RESEND_API_KEY) {
      const arrFmt = body.arrival_date
        ? new Date(body.arrival_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
        : body.arrival_date
      const depFmt = body.departure_date
        ? new Date(body.departure_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
        : null
      const firstName = body.contact_name?.split(' ')[0] ?? 'there'

      // Fetch marina name from Railway
      let marinaName = 'the marina'
      try {
        const mr = await fetch(`${ENGINE}/api/v1/marina/${marina_id}/settings`, {
          headers: { 'x-skipper-api-key': ENGINE_KEY }
        })
        if (mr.ok) { const d = await mr.json(); marinaName = d.name || marinaName }
      } catch { /* non-fatal */ }

      const html = `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f0f4f8;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px;">
<table width="100%" style="max-width:540px;background:#fff;border-radius:12px;overflow:hidden;">
<tr><td style="background:#0d2b4b;padding:28px 32px;text-align:center;">
  <div style="font-size:32px;margin-bottom:8px;">⚓</div>
  <div style="color:#4dd6c8;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:4px;">Request Received</div>
  <div style="color:#ffffff;font-size:20px;font-weight:800;">${marinaName}</div>
</td></tr>
<tr><td style="padding:28px 32px;">
  <p style="font-size:16px;color:#334155;margin:0 0 16px;">Hi ${firstName},</p>
  <p style="font-size:15px;color:#334155;margin:0 0 24px;line-height:1.6;">
    We've received your transient slip request at <strong>${marinaName}</strong>. The marina team will confirm availability shortly.
  </p>
  <table width="100%" style="background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0;margin-bottom:24px;">
    <tr><td style="padding:16px 20px;">
      ${arrFmt ? `<div style="margin-bottom:10px;"><span style="font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;">Arrival</span><br><span style="font-size:14px;font-weight:700;color:#0d2b4b;">${arrFmt}</span></div>` : ''}
      ${depFmt ? `<div style="margin-bottom:10px;"><span style="font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;">Departure</span><br><span style="font-size:14px;font-weight:700;color:#0d2b4b;">${depFmt}</span></div>` : ''}
      ${body.vessel_name ? `<div><span style="font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;">Vessel</span><br><span style="font-size:14px;font-weight:700;color:#0d2b4b;">${body.vessel_name}${body.loa_ft ? ` · ${body.loa_ft}ft` : ''}</span></div>` : ''}
    </td></tr>
  </table>
  <p style="font-size:13px;color:#94a3b8;margin:0;">See you on the water! 🌊</p>
</td></tr>
<tr><td style="background:#f8fafc;padding:14px 32px;border-top:1px solid #e2e8f0;text-align:center;">
  <div style="font-size:11px;color:#94a3b8;">Powered by AyeAyeSkipper · ayeayeskipper.com</div>
</td></tr>
</table></td></tr></table></body></html>`

      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: `${marinaName} via AyeAyeSkipper <noreply@ayeayeskipper.com>`,
            to: body.contact_email,
            subject: `⚓ Slip request received — ${marinaName}`,
            html,
          }),
        })
      } catch { /* non-fatal */ }
    }

    return NextResponse.json({ request: inserted })
  } catch (err: unknown) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

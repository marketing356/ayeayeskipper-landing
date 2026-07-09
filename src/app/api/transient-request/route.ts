import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

// POST /api/transient-request
// Public web form submission — no auth required
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      marina_id, contact_name, contact_email, contact_phone,
      vessel_name, vessel_type, loa_ft, beam_ft, draft_ft,
      shore_power, fuel_type,
      arrival_date, departure_date, nights, notes,
    } = body

    if (!marina_id)    return NextResponse.json({ error: 'marina_id required' }, { status: 400 })
    if (!contact_name) return NextResponse.json({ error: 'Name required' }, { status: 400 })
    if (!arrival_date) return NextResponse.json({ error: 'Arrival date required' }, { status: 400 })
    if (!contact_email && !contact_phone)
      return NextResponse.json({ error: 'Email or phone required' }, { status: 400 })

    const now = new Date().toISOString()
    const data: Record<string, unknown> = {
      marina_id, status: 'pending',
      contact_name, contact_email: contact_email || null, contact_phone: contact_phone || null,
      vessel_name: vessel_name || null, vessel_type: vessel_type || null,
      loa_ft: loa_ft ? Number(loa_ft) : null,
      beam_ft: beam_ft ? Number(beam_ft) : null,
      draft_ft: draft_ft ? Number(draft_ft) : null,
      shore_power: shore_power ?? null, fuel_type: fuel_type || null,
      arrival_date, departure_date: departure_date || null,
      nights: nights ? Number(nights) : null,
      notes: notes || null,
      source: 'web',
      created_at: now, updated_at: now,
    }

    const { data: inserted, error } = await supabaseAdmin
      .from('transient_requests')
      .insert(data)
      .select()
      .single()

    if (error) {
      console.error('[transient-request POST]', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Broadcast to Helm via Realtime
    try {
      await supabaseAdmin
        .channel(`marina:${marina_id}`)
        .send({ type: 'broadcast', event: 'change', payload: { table: 'transient_requests', type: 'INSERT', record: inserted } })
    } catch { /* non-fatal */ }

    // Fetch marina name for the email
    let marinaName = 'the marina'
    try {
      const { data: m } = await supabaseAdmin.from('marinas').select('name').eq('id', marina_id).maybeSingle()
      if (m?.name) marinaName = m.name
    } catch { /* non-fatal */ }

    // Acknowledgment email to boater
    if (contact_email && process.env.RESEND_API_KEY) {
      const arrFmt = arrival_date ? new Date(arrival_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : arrival_date
      const depFmt = departure_date ? new Date(departure_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : null
      const firstName = contact_name?.split(' ')[0] ?? 'there'
      const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f0f4f8;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px;">
<table width="100%" style="max-width:540px;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
  <tr><td style="background:#0d2b4b;padding:28px 32px;text-align:center;">
    <div style="font-size:32px;margin-bottom:8px;">⚓</div>
    <div style="color:#4dd6c8;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:4px;">Request Received</div>
    <div style="color:#ffffff;font-size:20px;font-weight:800;">${marinaName}</div>
  </td></tr>
  <tr><td style="padding:28px 32px;">
    <p style="font-size:16px;color:#334155;margin:0 0 16px;">Hi ${firstName},</p>
    <p style="font-size:15px;color:#334155;margin:0 0 24px;line-height:1.6;">
      We've received your transient slip request at <strong>${marinaName}</strong> and forwarded it to the marina team. They'll review your request and confirm availability shortly.
    </p>
    <table width="100%" style="background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0;margin-bottom:24px;">
      <tr><td style="padding:16px 20px;">
        ${arrFmt ? `<div style="margin-bottom:10px;"><span style="font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.6px;">Arrival</span><br><span style="font-size:14px;font-weight:700;color:#0d2b4b;">${arrFmt}</span></div>` : ''}
        ${depFmt ? `<div style="margin-bottom:10px;"><span style="font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.6px;">Departure</span><br><span style="font-size:14px;font-weight:700;color:#0d2b4b;">${depFmt}</span></div>` : ''}
        ${vessel_name ? `<div><span style="font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.6px;">Vessel</span><br><span style="font-size:14px;font-weight:700;color:#0d2b4b;">${vessel_name}${loa_ft ? ` &middot; ${loa_ft}ft` : ''}</span></div>` : ''}
      </td></tr>
    </table>
    <p style="font-size:13px;color:#64748b;line-height:1.6;margin:0 0 20px;">You'll receive another email once the marina confirms your slip. If you have questions in the meantime, contact the marina directly.</p>
    <p style="font-size:13px;color:#94a3b8;margin:0;">See you on the water! 🌊</p>
  </td></tr>
  <tr><td style="background:#f8fafc;padding:14px 32px;border-top:1px solid #e2e8f0;text-align:center;">
    <div style="font-size:11px;color:#94a3b8;">Powered by AyeAyeSkipper &middot; ayeayeskipper.com</div>
  </td></tr>
</table>
</td></tr></table></body></html>`

      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: `${marinaName} via AyeAyeSkipper <noreply@ayeayeskipper.com>`,
            to: contact_email,
            subject: `⚓ Slip request received — ${marinaName}`,
            html,
          }),
        })
      } catch { /* non-fatal */ }
    }

    return NextResponse.json({ request: inserted })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[transient-request POST]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

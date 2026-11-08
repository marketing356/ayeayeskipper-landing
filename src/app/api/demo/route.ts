import { NextRequest, NextResponse } from 'next/server'

const NOTIFY_EMAIL = 'admin@ayeayeskipper.com'
const FROM_EMAIL = 'noreply@ayeayeskipper.com'

function esc(s: unknown) {
  return String(s ?? '').replace(/[<>&"]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' } as Record<string, string>)[c])
}

export async function POST(req: NextRequest) {
  let b: any
  try { b = await req.json() } catch { return NextResponse.json({ error: 'bad request' }, { status: 400 }) }

  // Honeypot: bots fill the hidden field. Pretend success, send nothing.
  if (b.website) return NextResponse.json({ ok: true })

  const name = String(b.name || '').trim().slice(0, 120)
  const email = String(b.email || '').trim().slice(0, 160)
  if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: 'name and a valid email are required' }, { status: 400 })
  }
  const kind = b.kind === 'club' ? 'Yacht club' : 'Marina'
  const key = process.env.RESEND_API_KEY
  if (!key) {
    console.error('demo: RESEND_API_KEY missing, lead NOT delivered', { name, email })
    return NextResponse.json({ error: 'not configured' }, { status: 500 })
  }

  const rows: [string, unknown][] = [
    ['Type', kind], ['Name', name], ['Email', email], ['Phone', b.phone], [kind + ' name', b.place], ['Size', b.size], ['Message', b.message],
  ]
  const html = '<h2>New demo request: ' + esc(b.place || name) + ' (' + kind + ')</h2><table style="border-collapse:collapse">' +
    rows.map(([k, v]) => '<tr><td style="padding:6px 12px;background:#f5f5f5;font-weight:bold">' + esc(k) + '</td><td style="padding:6px 12px">' + esc(v || '-') + '</td></tr>').join('') + '</table>'

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: FROM_EMAIL, to: [NOTIFY_EMAIL], reply_to: email, subject: 'Demo request: ' + (b.place || name) + ' (' + kind + ')', html }),
    })
    if (!r.ok) {
      console.error('demo: Resend rejected', r.status, await r.text().catch(() => ''))
      return NextResponse.json({ error: 'email failed' }, { status: 502 })
    }
  } catch (e) {
    console.error('demo: Resend call failed', e)
    return NextResponse.json({ error: 'email failed' }, { status: 502 })
  }
  return NextResponse.json({ ok: true })
}

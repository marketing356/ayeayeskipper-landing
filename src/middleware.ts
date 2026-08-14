import { NextRequest, NextResponse } from 'next/server'

// SITE-WIDE PASSWORD GATE — TEST PHASE ONLY.
// Locked 2026-08-14 per Michael: site is not ready for public traffic now that
// real SMS (Twilio) is live and costs real money per message.
//
// Switched from HTTP Basic Auth to a cookie-based gate — Vercel's edge network
// was not reliably passing through the WWW-Authenticate header, so browsers showed
// a blank "Authentication required" error page instead of a real login prompt.
// This approach shows an actual login form and sets a cookie on success — works
// on every browser regardless of edge/CDN header handling.
//
// REMOVE this gate only when Michael explicitly says the site is ready to go public.
const GATE_USER = 'abcmarina'
const GATE_PASS = 'skipper2026'
const COOKIE_NAME = 'skipper_site_gate'
const COOKIE_VALUE = 'ok-2026-08-14'

function loginPage(error?: string) {
  return `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>AyeAyeSkipper — Test Phase</title>
<style>
  body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#070f1a;font-family:system-ui,-apple-system,sans-serif;color:#fff}
  form{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.12);border-radius:16px;padding:36px 32px;width:100%;max-width:340px}
  h1{font-size:18px;margin:0 0 4px}
  p{font-size:13px;color:rgba(255,255,255,0.5);margin:0 0 24px}
  label{font-size:12px;font-weight:700;color:rgba(255,255,255,0.6);display:block;margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px}
  input{width:100%;padding:11px 13px;margin-bottom:16px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.15);border-radius:10px;color:#fff;font-size:14px;box-sizing:border-box}
  button{width:100%;padding:13px;background:#4dd6c8;color:#0d2b4b;border:none;border-radius:10px;font-weight:800;font-size:15px;cursor:pointer}
  .err{color:#f87171;font-size:13px;margin-bottom:14px}
</style></head><body>
<form method="POST">
  <h1>🔒 Test Phase</h1>
  <p>This site is not open to the public yet.</p>
  ${error ? `<div class="err">${error}</div>` : ''}
  <label>Username</label>
  <input name="user" autocomplete="username" autofocus />
  <label>Password</label>
  <input name="pass" type="password" autocomplete="current-password" />
  <button type="submit">Enter →</button>
</form>
</body></html>`
}

export async function middleware(req: NextRequest) {
  const cookie = req.cookies.get(COOKIE_NAME)
  if (cookie?.value === COOKIE_VALUE) return NextResponse.next()

  if (req.method === 'POST') {
    const form = await req.formData()
    const user = form.get('user')
    const pass = form.get('pass')
    if (user === GATE_USER && pass === GATE_PASS) {
      const res = NextResponse.redirect(req.url)
      res.cookies.set(COOKIE_NAME, COOKIE_VALUE, {
        httpOnly: true, secure: true, sameSite: 'lax', maxAge: 60 * 60 * 24 * 30, path: '/',
      })
      return res
    }
    return new NextResponse(loginPage('Wrong username or password — try again.'), {
      status: 401, headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  }

  return new NextResponse(loginPage(), {
    status: 401, headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|skipper-avatar.jpg).*)'],
}

import { NextRequest, NextResponse } from 'next/server'

// SITE-WIDE PASSWORD GATE — REMOVED 2026-10-08 per Michael's explicit GO.
// Was locked 2026-08-14 to keep the site off public traffic while real SMS (Twilio)
// was live and costly per message. Removed now because the site needs to be a real,
// publicly-reachable company website for a third-party app review (Clover ISV app
// Site URL field) — a password wall there would fail review the same way the old
// marina-login suggestion would have exposed customer data (it wouldn't have; this
// gate only ever covered the public marketing site, never any marina's Helm login).
// Middleware kept as a no-op pass-through (not deleted outright) so this file stays
// the one obvious place to re-add a gate later if ever needed again.
export async function middleware(_req: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|skipper-avatar.jpg).*)'],
}

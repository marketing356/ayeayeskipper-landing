import { NextRequest, NextResponse } from 'next/server'

// Public paths — no auth required
const PUBLIC_PREFIXES = [
  '/marinas',
  '/api/transient-request',
  '/api/marinas',
  '/boaters',
  '/api/boaters',
]

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Allow public marina pages and booking API without auth
  if (PUBLIC_PREFIXES.some(p => pathname === p || pathname.startsWith(p + '/'))) {
    return NextResponse.next()
  }

  const basicAuth = req.headers.get('authorization')
  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1]
    const [user, pwd] = atob(authValue).split(':')
    if (user === 'Skipper2026' && pwd === 'SkipperBuild2026!') {
      return NextResponse.next()
    }
  }

  return new NextResponse('Authentication Required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="AyeAyeSkipper Preview"' },
  })
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|skipper-avatar.jpg).*)'],
}

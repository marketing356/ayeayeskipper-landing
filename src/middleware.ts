import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
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
    headers: {
      'WWW-Authenticate': 'Basic realm="AyeAyeSkipper Preview"',
    },
  })
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|skipper-avatar.jpg).*)'],
}

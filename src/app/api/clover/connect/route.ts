/**
 * §37 Thin Proxy — Clover OAuth, step 1.
 * One shared connect endpoint on the main site (ayeayeskipper.com) — this is the exact
 * domain registered as the Clover app's Site URL, so no per-marina Clover config is ever
 * needed. Every marina's Helm Connect button calls THIS endpoint; we carry marina_id
 * through Clover's `state` param and hand the owner back to their own Helm at the end.
 * All secrets (CLOVER_APP_SECRET) stay on Railway — never touched here.
 */
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const ENGINE = process.env.SKIPPER_ENGINE_URL || 'https://skipper-engine-production.up.railway.app'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const marinaId = url.searchParams.get('marina_id')
  const returnSlug = url.searchParams.get('return_slug') || ''
  if (!marinaId) return NextResponse.json({ error: 'marina_id required' }, { status: 400 })

  const cfgRes = await fetch(`${ENGINE}/api/v1/clover/config`, { cache: 'no-store' })
  const cfg = await cfgRes.json().catch(() => ({}))
  if (!cfg?.enabled) return NextResponse.json({ error: 'Clover not configured' }, { status: 503 })

  const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ayeayeskipper.com'
  const redirectUri = `${appBaseUrl}/api/clover/callback`
  // state carries both marina_id and return_slug (urlencoded, pipe-delimited) through the
  // round trip so the callback knows which marina to save the connection against AND which
  // marina's Helm subdomain to bounce the owner back to.
  const state = encodeURIComponent(`${marinaId}|${returnSlug}`)
  const params = new URLSearchParams({ client_id: cfg.app_id, redirect_uri: redirectUri, state })
  const authorizeUrl = `${cfg.auth_host}/oauth/v2/authorize?${params.toString()}`
  return NextResponse.redirect(authorizeUrl)
}

/**
 * §37 Thin Proxy — Clover OAuth, step 2.
 * Clover redirects the marina owner HERE after they click Approve. We exchange the code
 * for a token via Railway (Railway holds CLOVER_APP_SECRET, not this site), Railway saves
 * the connection against the marina record, then we bounce the owner back to their OWN
 * marina's Helm settings page using the slug Railway hands back.
 */
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const ENGINE = process.env.SKIPPER_ENGINE_URL || 'https://skipper-engine-production.up.railway.app'
const API_KEY = process.env.SKIPPER_DATA_API_KEY || ''

function helmUrl(slug: string, path: string): string {
  const host = slug ? `https://${slug}.ayeayeskipper.com` : 'https://ayeayeskipper.com'
  return `${host}${path}`
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  const stateRaw = url.searchParams.get('state') || ''
  const errorParam = url.searchParams.get('error')
  // Clover sends merchant_id as its OWN query param on this very redirect (per Clover's
  // documented auth-code flow: "...?merchant_id={MERCHANT_ID}&client_id={APP_ID}&code={CODE}"),
  // NOT inside the later token-exchange response. Confirmed 2026-10-09 against a real sandbox
  // callback: the exchange response only returns access_token/refresh_token, no merchant_id —
  // trusting the exchange response for merchant_id silently dropped every real connection.
  const merchantIdFromRedirect = url.searchParams.get('merchant_id')
  const [marinaId, returnSlug] = decodeURIComponent(stateRaw).split('|')

  if (errorParam) {
    return NextResponse.redirect(helmUrl(returnSlug, `/helm?clover_error=${encodeURIComponent(errorParam)}&active=settings&section=integrations`))
  }
  if (!code || !marinaId) {
    return NextResponse.redirect(helmUrl(returnSlug, `/helm?clover_error=${encodeURIComponent('Missing code or marina reference from Clover')}&active=settings&section=integrations`))
  }

  try {
    const exchangeRes = await fetch(`${ENGINE}/api/v1/clover/exchange`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    })
    const exchange = await exchangeRes.json().catch(() => ({}))
    const merchantId = merchantIdFromRedirect || exchange.merchant_id
    if (!exchangeRes.ok || !exchange.access_token || !merchantId) {
      const msg = exchange?.detail || exchange?.error || 'Clover connection failed'
      return NextResponse.redirect(helmUrl(returnSlug, `/helm?clover_error=${encodeURIComponent(msg)}&active=settings&section=integrations`))
    }

    const saveRes = await fetch(`${ENGINE}/api/v1/marina/${marinaId}/clover/connection`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-skipper-api-key': API_KEY },
      body: JSON.stringify({
        merchant_id: merchantId,
        access_token: exchange.access_token,
        employee_id: exchange.employee_id || null,
        // 2026-10-09 FIX: pass through the renewal token + its expirations so Railway can
        // keep this connection alive instead of it dying the moment access_token expires.
        refresh_token: exchange.refresh_token || null,
        access_token_expiration: exchange.access_token_expiration || null,
        refresh_token_expiration: exchange.refresh_token_expiration || null,
      }),
    })
    const saved = await saveRes.json().catch(() => ({}))
    if (!saveRes.ok) {
      return NextResponse.redirect(helmUrl(returnSlug, `/helm?clover_error=${encodeURIComponent('Connected to Clover but failed to save — try again')}&active=settings&section=integrations`))
    }

    const slug = saved.slug || returnSlug
    return NextResponse.redirect(helmUrl(slug, `/helm?clover_connected=1&active=settings&section=integrations`))
  } catch (e: unknown) {
    return NextResponse.redirect(helmUrl(returnSlug, `/helm?clover_error=${encodeURIComponent((e as Error)?.message || 'Clover connection error')}&active=settings&section=integrations`))
  }
}

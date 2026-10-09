/**
 * Clover's "Alternate Launch Path" — required by Clover for every web app (set in the
 * app's REST Configuration as /api/clover/launch). Clover redirects HERE when a merchant
 * launches the app from the Merchant Dashboard left nav or installs directly from the
 * Clover App Market — in both cases Clover does NOT carry any marina_id of ours, only
 * their own merchant_id.
 *
 * Our actual connect flow is Helm-initiated (marina owner clicks Connect inside their own
 * Helm Settings, which already knows marina_id) — see /api/clover/connect. A bare
 * App-Market-initiated install has no way to know which AyeAyeSkipper marina it belongs
 * to, so we can't silently complete a connection here. Land the merchant on a clear
 * instruction page instead of 404ing (Clover requires this path to resolve).
 */
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  return new NextResponse(
    `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Connect Clover — AyeAyeSkipper</title></head>
    <body style="font-family:system-ui,sans-serif;max-width:480px;margin:80px auto;text-align:center;color:#0f172a">
      <h2>Connect Clover from your Helm</h2>
      <p>To link your Clover account, open your marina's Helm, go to Settings &rarr; Integrations, and click Connect next to Clover. That link already knows your marina, so the connection saves correctly.</p>
    </body></html>`,
    { status: 200, headers: { 'Content-Type': 'text/html' } }
  )
}

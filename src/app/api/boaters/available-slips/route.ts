import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const ENGINE_URL = process.env.SKIPPER_ENGINE_URL || 'https://skipper-engine-production.up.railway.app'
const ENGINE_KEY = process.env.SKIPPER_DATA_API_KEY || ''

// GET /api/boaters/available-slips?marina_id=...&arrival=...&departure=...&loa_ft=...&beam_ft=...&draft_ft=...
// Public endpoint — no auth needed (searching available hot slips)
export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams
  const marina_id = params.get('marina_id')

  if (!marina_id) return NextResponse.json({ error: 'marina_id required' }, { status: 400 })

  const qs = new URLSearchParams()
  for (const [k, v] of params.entries()) {
    if (k !== 'marina_id') qs.set(k, v)
  }

  const res = await fetch(
    `${ENGINE_URL}/api/v1/marina/${marina_id}/available-hot-slips?${qs.toString()}`,
    { headers: { 'x-skipper-api-key': ENGINE_KEY } }
  )

  if (!res.ok) {
    if (res.status === 404) return NextResponse.json({ slips: [] })
    return NextResponse.json({ error: 'Engine error' }, { status: res.status })
  }

  const data = await res.json()
  return NextResponse.json(data)
}

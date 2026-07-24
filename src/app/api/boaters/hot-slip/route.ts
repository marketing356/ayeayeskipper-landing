import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

const ENGINE_URL = process.env.SKIPPER_ENGINE_URL || 'https://skipper-engine-production.up.railway.app'
const ENGINE_KEY = process.env.SKIPPER_DATA_API_KEY || ''

// GET /api/boaters/hot-slip?email=...  → slip offers + points balance
// POST /api/boaters/hot-slip           → { email, start_date, end_date } → create offer
// DELETE /api/boaters/hot-slip?email=...&offer_id=...

async function getAuthId(email: string): Promise<string | null> {
  const { data } = await supabase
    .from('contacts')
    .select('auth_user_id')
    .eq('email', email)
    .is('marina_id', null)
    .maybeSingle()
  return data?.auth_user_id ?? null
}

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email')?.toLowerCase().trim()
  if (!email) return NextResponse.json({ error: 'email required' }, { status: 400 })

  const authId = await getAuthId(email)
  if (!authId) return NextResponse.json({ offers: [], points: 0 })

  const res = await fetch(`${ENGINE_URL}/api/v1/boater/slip-offer`, {
    headers: { 'x-skipper-api-key': ENGINE_KEY, 'X-Boater-Auth': authId },
  })
  if (!res.ok) return NextResponse.json({ offers: [], points: 0 })
  const data = await res.json()
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const email = (body.email ?? '').toLowerCase().trim()
  if (!email) return NextResponse.json({ error: 'email required' }, { status: 400 })

  const authId = await getAuthId(email)
  if (!authId) return NextResponse.json({ error: 'Account not found' }, { status: 404 })

  const res = await fetch(`${ENGINE_URL}/api/v1/boater/slip-offer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-skipper-api-key': ENGINE_KEY,
      'X-Boater-Auth': authId,
    },
    body: JSON.stringify({ start_date: body.start_date, end_date: body.end_date }),
  })
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}

export async function DELETE(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email')?.toLowerCase().trim()
  const offerId = req.nextUrl.searchParams.get('offer_id')
  if (!email || !offerId) return NextResponse.json({ error: 'email and offer_id required' }, { status: 400 })

  const authId = await getAuthId(email)
  if (!authId) return NextResponse.json({ error: 'Account not found' }, { status: 404 })

  const res = await fetch(`${ENGINE_URL}/api/v1/boater/slip-offer/${offerId}`, {
    method: 'DELETE',
    headers: { 'x-skipper-api-key': ENGINE_KEY, 'X-Boater-Auth': authId },
  })
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}

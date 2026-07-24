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

// GET /api/boaters/invoices?email=...
export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email')?.toLowerCase().trim()
  if (!email) return NextResponse.json({ error: 'email required' }, { status: 400 })

  const { data: contact } = await supabase
    .from('contacts')
    .select('auth_user_id')
    .eq('email', email)
    .is('marina_id', null)
    .maybeSingle()

  if (!contact?.auth_user_id) return NextResponse.json({ invoices: [] })

  const res = await fetch(`${ENGINE_URL}/api/v1/boater/invoices`, {
    headers: {
      'x-skipper-api-key': ENGINE_KEY,
      'X-Boater-Auth': contact.auth_user_id,
    },
  })

  if (!res.ok) {
    if (res.status === 404) return NextResponse.json({ invoices: [] })
    return NextResponse.json({ error: 'Engine error' }, { status: res.status })
  }

  const data = await res.json()
  return NextResponse.json(data)
}

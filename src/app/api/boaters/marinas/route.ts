import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

// GET /api/boaters/marinas?email=...
// Returns all marinas this boater is connected to (contacts where marina_id IS NOT NULL)
// Used by the boater dashboard to show which marinas they can message.
export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email')?.toLowerCase().trim()
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

  // Find all marina-scoped contacts rows for this boater
  const { data: contacts, error } = await supabase
    .from('contacts')
    .select('id, auth_user_id, marina_id, helm_role')
    .eq('email', email)
    .not('marina_id', 'is', null)

  if (error || !contacts?.length) {
    return NextResponse.json({ marinas: [] })
  }

  // Fetch marina details for each
  const marinaIds = contacts.map(c => c.marina_id)
  const { data: marinas } = await supabase
    .from('marinas')
    .select('id, name, city, state')
    .in('id', marinaIds)

  const result = contacts.map(c => {
    const m = marinas?.find(m => m.id === c.marina_id)
    return {
      marina_id:   c.marina_id,
      contact_id:  c.id,
      auth_user_id: c.auth_user_id,
      marina_name: m?.name ?? 'Your Marina',
      marina_city: m?.city ?? null,
      marina_state: m?.state ?? null,
    }
  })

  return NextResponse.json({ marinas: result })
}

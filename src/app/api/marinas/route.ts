import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search') || ''
  const id     = searchParams.get('id') || ''

  try {
    if (id) {
      const { data, error } = await supabase
        .from('marinas')
        .select('id,name,city,state,zip,phone,website,total_slips,transient_available,description,address')
        .eq('id', id)
        .single()
      if (error) return NextResponse.json({ marina: null })
      return NextResponse.json({ marina: data })
    }

    let q = supabase
      .from('marinas')
      .select('id,name,city,state,total_slips,transient_available')
      .order('name')

    if (search) {
      q = q.or(`name.ilike.%${search}%,city.ilike.%${search}%,state.ilike.%${search}%`)
    }

    const { data } = await q
    return NextResponse.json({ marinas: data ?? [] })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ marinas: [], error: msg })
  }
}

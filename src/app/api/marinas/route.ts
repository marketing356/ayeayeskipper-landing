import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search') || ''
  const id     = searchParams.get('id')   || ''
  const slug   = searchParams.get('slug') || ''

  try {
    // Single marina lookup — by UUID id, slug param, or auto-detect
    const lookupKey = id || slug
    if (lookupKey) {
      const isUuid = UUID_RE.test(lookupKey)
      // slug param always → slug column; UUID id → id column; else try slug column
      const filterCol = slug ? 'slug' : isUuid ? 'id' : 'slug'
      const { data, error } = await supabase
        .from('marinas')
        .select('id,name,slug,city,state,zip,phone,website,total_slips,transient_available,description,address')
        .eq(filterCol, lookupKey)
        .single()
      if (error || !data) {
        // Fallback: if slug lookup failed, try id
        if (!isUuid) return NextResponse.json({ marina: null })
        const { data: d2 } = await supabase
          .from('marinas')
          .select('id,name,slug,city,state,zip,phone,website,total_slips,transient_available,description,address')
          .eq('id', lookupKey)
          .single()
        return NextResponse.json({ marina: d2 ?? null })
      }
      return NextResponse.json({ marina: data })
    }

    let q = supabase
      .from('marinas')
      .select('id,name,slug,city,state,total_slips,transient_available')
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

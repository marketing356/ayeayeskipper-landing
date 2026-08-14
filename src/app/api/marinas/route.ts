/**
 * §37 Thin Proxy — Public marina directory list (marketing site).
 * All logic lives in Railway (skipper-engine). This file is a pass-through only.
 * Was previously a direct-to-Supabase implementation (Rule 2 violation).
 */
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const E = process.env.SKIPPER_ENGINE_URL || 'https://skipper-engine-production.up.railway.app'
const K = process.env.SKIPPER_DATA_API_KEY || ''
const H = () => ({ 'Content-Type': 'application/json', 'x-skipper-api-key': K })

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search') || ''
  const id     = searchParams.get('id')   || ''
  const slug   = searchParams.get('slug') || ''

  try {
    // Single marina lookup — by UUID id or slug → full storefront (facts + amenities + photos)
    const lookupKey = id || slug
    if (lookupKey) {
      // marinas-list supports slug lookup via q; storefront needs the real marina_id.
      // Resolve id/slug -> marina_id via the list endpoint's slug field, then fetch storefront.
      const listRes = await fetch(`${E}/api/v1/boater/marinas-list`, { headers: H(), cache: 'no-store' })
      const listJson = await listRes.json()
      const match = (listJson.marinas || []).find((m: { id: string; slug?: string }) =>
        m.id === lookupKey || m.slug === lookupKey)
      if (!match) return NextResponse.json({ marina: null })

      const sfRes = await fetch(`${E}/api/v1/marina/${match.id}/storefront`, { headers: H(), cache: 'no-store' })
      const sf = await sfRes.json()
      if (!sfRes.ok) return NextResponse.json({ marina: null })
      // Flatten amenities onto the marina object for the detail page, keep total_slips from the list
      // (storefront's total_slips column is a stale summary field; the list endpoint's is not used
      // here either — real slip count comes from the map/locations data, out of scope for this page).
      return NextResponse.json({
        marina: { ...sf.marina, amenities: sf.amenities, photos: sf.photos, total_slips: match.total_slips },
      })
    }

    const qs = search ? `?q=${encodeURIComponent(search)}` : ''
    const res = await fetch(`${E}/api/v1/boater/marinas-list${qs}`, { headers: H(), cache: 'no-store' })
    const json = await res.json()
    return NextResponse.json({ marinas: json.marinas ?? [] })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ marinas: [], error: msg })
  }
}

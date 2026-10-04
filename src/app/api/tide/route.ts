import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

// Simple in-memory cache for the NOAA station list (edge runtime = per-instance, short-lived, fine for this use)
let stationCache: { id: string; lat: number; lng: number }[] | null = null
let stationCacheTs = 0
const STATION_TTL_MS = 24 * 60 * 60 * 1000 // 24h

async function getNoaaStations(): Promise<{ id: string; lat: number; lng: number }[]> {
  const now = Date.now()
  if (stationCache && now - stationCacheTs < STATION_TTL_MS) return stationCache
  try {
    const res = await fetch(
      'https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/stations.json?type=tidepredictions&units=english',
      { headers: { 'User-Agent': 'AyeAyeSkipper/1.0' } }
    )
    if (!res.ok) return stationCache || []
    const json = await res.json()
    const stations = (json.stations || [])
      .filter((s: any) => s.lat != null && s.lng != null)
      .map((s: any) => ({ id: String(s.id), lat: Number(s.lat), lng: Number(s.lng) }))
    stationCache = stations
    stationCacheTs = now
    return stations
  } catch {
    return stationCache || []
  }
}

function nearestStation(stations: { id: string; lat: number; lng: number }[], lat: number, lng: number): string | null {
  let bestId: string | null = null
  let bestDist = Infinity
  for (const s of stations) {
    const d = (s.lat - lat) ** 2 + (s.lng - lng) ** 2
    if (d < bestDist) { bestDist = d; bestId = s.id }
  }
  return bestId
}

function fmtTime(iso: string): string {
  // NOAA returns "YYYY-MM-DD HH:mm" in local station time
  const d = new Date(iso.replace(' ', 'T'))
  if (isNaN(d.getTime())) return iso
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const lat = parseFloat(searchParams.get('lat') || '')
  const lng = parseFloat(searchParams.get('lng') || '')
  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json({ tide: null, message: 'lat/lng required' }, { status: 400 })
  }

  try {
    const stations = await getNoaaStations()
    const stationId = nearestStation(stations, lat, lng)
    if (!stationId) return NextResponse.json({ tide: null })

    const now = new Date()
    const begin = now.toISOString().slice(0, 10).replace(/-/g, '')
    const endDate = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000)
    const end = endDate.toISOString().slice(0, 10).replace(/-/g, '')

    const predUrl =
      `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter` +
      `?station=${stationId}&product=predictions&datum=MLLW&interval=hilo` +
      `&begin_date=${begin}&end_date=${end}&units=english&time_zone=lst_ldt&format=json`

    const r = await fetch(predUrl)
    if (!r.ok) return NextResponse.json({ tide: null })
    const d = await r.json()
    const preds: { t: string; v: string; type: 'H' | 'L' }[] = d.predictions || []

    const nowMs = now.getTime()
    const upcoming = preds
      .map(p => ({ ...p, ms: new Date(p.t.replace(' ', 'T')).getTime() }))
      .filter(p => p.ms >= nowMs - 15 * 60 * 1000)
      .sort((a, b) => a.ms - b.ms)

    const next = upcoming[0]
    const following = upcoming[1]
    if (!next) return NextResponse.json({ tide: null })

    return NextResponse.json({
      tide: {
        station_id: stationId,
        next: { type: next.type === 'H' ? 'High' : 'Low', time: fmtTime(next.t), height_ft: parseFloat(next.v) },
        following: following ? { type: following.type === 'H' ? 'High' : 'Low', time: fmtTime(following.t), height_ft: parseFloat(following.v) } : null,
      },
    })
  } catch {
    return NextResponse.json({ tide: null })
  }
}

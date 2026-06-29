'use client'
import { useEffect, useState } from 'react'

const TEAL = '#4dd6c8', NAVY = '#0d2b4b'
const FONT = "system-ui,-apple-system,'Segoe UI',Roboto,sans-serif"

type Wx = { icon: string; temp: number; desc: string; wind: number; windDir: string; location: string; nextTide: string | null; tideDir: string }

const WMO: Record<number, { desc: string; icon: string }> = {
  0:{desc:'Clear',icon:'☀️'},1:{desc:'Mostly Clear',icon:'🌤️'},2:{desc:'Partly Cloudy',icon:'⛅'},3:{desc:'Overcast',icon:'☁️'},
  45:{desc:'Foggy',icon:'🌫️'},51:{desc:'Drizzle',icon:'🌦️'},61:{desc:'Rain',icon:'🌧️'},71:{desc:'Snow',icon:'❄️'},
  80:{desc:'Showers',icon:'🌦️'},95:{desc:'Thunderstorm',icon:'⛈️'},
}
const DIRS = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW']
function wmoLookup(code: number) {
  return WMO[code] ?? WMO[Math.floor(code/10)*10] ?? { desc: 'Mixed', icon: '🌡️' }
}

export default function WeatherBar() {
  const [wx, setWx] = useState<Wx | null>(null)

  useEffect(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(async pos => {
      const { latitude: lat, longitude: lon } = pos.coords
      try {
        const [wRes, gRes] = await Promise.all([
          fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weathercode,windspeed_10m,winddirection_10m&temperature_unit=fahrenheit&windspeed_unit=kn`),
          fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`, { headers: { 'User-Agent': 'AyeAyeSkipper/1.0' } }),
        ])
        const [wJson, gJson] = await Promise.all([wRes.json(), gRes.json()])
        const cur = wJson.current
        const cond = wmoLookup(cur.weathercode)
        const windDir = DIRS[Math.round((cur.winddirection_10m ?? 0) / 22.5) % 16]
        const city = gJson.address?.city || gJson.address?.town || gJson.address?.village || ''
        const state = (gJson.address?.state_code || gJson.address?.state || '').slice(0,2).toUpperCase()
        const location = city && state ? `${city}, ${state}` : city || 'Your Location'

        // NOAA tides — nearest station lookup via tidesandcurrents
        let nextTide: string | null = null
        let tideDir = '🌊'
        try {
          const stRes = await fetch(`https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/stations.json?type=tidepredictions`)
          if (stRes.ok) {
            const stJson = await stRes.json()
            const stations = stJson.stations || []
            let nearest = null, minDist = Infinity
            for (const s of stations) {
              const d = Math.hypot(s.lat - lat, s.lng - lon)
              if (d < minDist) { minDist = d; nearest = s }
            }
            if (nearest) {
              const now = new Date()
              const dateStr = now.toISOString().split('T')[0].replace(/-/g,'')
              const tRes = await fetch(`https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?station=${nearest.id}&product=predictions&datum=MLLW&time_zone=lst_ldt&interval=hilo&units=english&format=json&begin_date=${dateStr}&range=24`)
              if (tRes.ok) {
                const tJson = await tRes.json()
                const preds = tJson.predictions || []
                const future = preds.filter((p: {t:string}) => new Date(p.t) > now)
                if (future.length) {
                  const next = future[0]
                  const t = new Date(next.t)
                  const timeStr = t.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
                  nextTide = `${next.type === 'H' ? 'High' : 'Low'} ${timeStr}`
                  tideDir = next.type === 'H' ? '🌊↑' : '🌊↓'
                }
              }
            }
          }
        } catch { /* tides optional */ }

        setWx({ icon: cond.icon, temp: Math.round(cur.temperature_2m), desc: cond.desc, wind: Math.round(cur.windspeed_10m), windDir, location, nextTide, tideDir })
      } catch { /* silent */ }
    }, () => { /* denied — hide bar */ })
  }, [])

  if (!wx) return null

  return (
    <div style={{ background: 'rgba(77,214,200,0.08)', borderBottom: '1px solid rgba(77,214,200,0.15)', padding: '6px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, fontFamily: FONT, flexWrap: 'wrap' }}>
      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>📍 {wx.location}</span>
      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', fontWeight: 700 }}>{wx.icon} {wx.temp}°F · {wx.desc}</span>
      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>💨 {wx.windDir} {wx.wind} kts</span>
      {wx.nextTide && (
        <span style={{ fontSize: 12, color: TEAL, fontWeight: 700 }}>{wx.tideDir} {wx.nextTide}</span>
      )}
    </div>
  )
}

'use client'
import { useEffect, useState } from 'react'

const TEAL = '#4dd6c8'
const FONT = "system-ui,-apple-system,'Segoe UI',Roboto,sans-serif"

type Wx = { icon: string; temp: number; desc: string; wind: number; windDir: string; location: string; lat: number; lng: number }
type Tide = { type: string; time: string; height_ft: number }

const WMO: Record<number, { desc: string; icon: string }> = {
  0:{desc:'Clear',icon:'☀️'},1:{desc:'Mostly Clear',icon:'🌤️'},2:{desc:'Partly Cloudy',icon:'⛅'},3:{desc:'Overcast',icon:'☁️'},
  45:{desc:'Foggy',icon:'🌫️'},51:{desc:'Drizzle',icon:'🌦️'},61:{desc:'Rain',icon:'🌧️'},71:{desc:'Snow',icon:'❄️'},
  80:{desc:'Showers',icon:'🌦️'},95:{desc:'Thunderstorm',icon:'⛈️'},
}
const DIRS = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW']
function wmoLookup(code: number) {
  return WMO[code] ?? WMO[Math.floor(code/10)*10] ?? { desc: 'Mixed', icon: '🌡️' }
}

async function fetchWeather(lat: number, lon: number): Promise<Wx | null> {
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
    return { icon: cond.icon, temp: Math.round(cur.temperature_2m), desc: cond.desc, wind: Math.round(cur.windspeed_10m), windDir, location, lat, lng: lon }
  } catch { return null }
}

async function fetchTide(lat: number, lon: number): Promise<Tide | null> {
  try {
    const res = await fetch(`/api/tide?lat=${lat}&lng=${lon}`)
    const json = await res.json()
    return json?.tide?.next ?? null
  } catch { return null }
}

export default function WeatherBar() {
  const [wx, setWx] = useState<Wx | null>(null)
  const [tide, setTide] = useState<Tide | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let done = false

    async function resolve(lat: number, lon: number) {
      const [wResult, tResult] = await Promise.all([fetchWeather(lat, lon), fetchTide(lat, lon)])
      setWx(wResult)
      setTide(tResult)
      setLoading(false)
    }

    // Try browser geolocation first
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async pos => {
          if (done) return
          done = true
          await resolve(pos.coords.latitude, pos.coords.longitude)
        },
        async () => {
          // Geolocation denied — fall back to IP geolocation
          if (done) return
          done = true
          try {
            const ipRes = await fetch('https://ipapi.co/json/')
            const ipJson = await ipRes.json()
            if (ipJson.latitude && ipJson.longitude) {
              await resolve(ipJson.latitude, ipJson.longitude)
              return
            }
          } catch { /* silent */ }
          setLoading(false)
        },
        { timeout: 5000 }
      )
    } else {
      // No geolocation support — use IP fallback immediately
      fetch('https://ipapi.co/json/')
        .then(r => r.json())
        .then(async ipJson => {
          if (ipJson.latitude && ipJson.longitude) {
            await resolve(ipJson.latitude, ipJson.longitude)
          } else {
            setLoading(false)
          }
        })
        .catch(() => setLoading(false))
    }
  }, [])

  // Always render the bar — show skeleton while loading, weather once ready
  return (
    <div style={{ background: 'rgba(77,214,200,0.08)', borderBottom: '1px solid rgba(77,214,200,0.15)', padding: '6px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, fontFamily: FONT, flexWrap: 'wrap', minHeight: 32 }}>
      {loading ? (
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>🌤️ Loading weather…</span>
      ) : wx ? (
        <>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>📍 {wx.location}</span>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', fontWeight: 700 }}>{wx.icon} {wx.temp}°F · {wx.desc}</span>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>💨 {wx.windDir} {wx.wind} kts</span>
          {tide && (
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>🌊 {tide.type} tide {tide.time} · {tide.height_ft.toFixed(1)}ft</span>
          )}
        </>
      ) : (
        <span style={{ fontSize: 12, color: TEAL, fontWeight: 600 }}>🌊 AyeAyeSkipper — The Marina OS</span>
      )}
    </div>
  )
}

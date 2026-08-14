'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

const DARK  = '#070f1a'
const TEAL  = '#4dd6c8'
const NAVY  = '#0d2b4b'
const FONT  = "system-ui,-apple-system,'Segoe UI',Roboto,sans-serif"
const MUTED = 'rgba(255,255,255,0.55)'

type Marina = {
  id: string
  slug?: string
  name: string
  city: string
  state: string
  total_slips: number
  transient_available?: boolean
  photo_url?: string | null
}

export default function MarinasPage() {
  const [marinas, setMarinas]   = useState<Marina[]>([])
  const [loading, setLoading]   = useState(true)
  const [search,  setSearch]    = useState('')
  const [query,   setQuery]     = useState('')

  const fetchMarinas = useCallback(async (q: string) => {
    setLoading(true)
    try {
      const url = q ? `/api/marinas?search=${encodeURIComponent(q)}` : '/api/marinas'
      const res  = await fetch(url)
      const json = await res.json()
      setMarinas(json.marinas ?? [])
    } catch { setMarinas([]) }
    finally  { setLoading(false) }
  }, [])

  useEffect(() => { fetchMarinas('') }, [fetchMarinas])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    fetchMarinas(search)
    setQuery(search)
  }

  return (
    <div style={{ minHeight: '100vh', background: DARK, fontFamily: FONT, color: '#fff' }}>
      {/* Hero — full-bleed gradient with subtle glow, matches detail page treatment */}
      <div style={{ position:'relative', overflow:'hidden', background:'linear-gradient(135deg,#0d2b4b 0%,#071e38 55%,#04121f 100%)' }}>
        <div style={{ position:'absolute', inset:0, opacity:0.15, backgroundImage:'radial-gradient(circle at 15% 20%, #4dd6c8 0%, transparent 38%), radial-gradient(circle at 85% 80%, #4dd6c8 0%, transparent 32%)' }} />
        <div style={{ position:'relative', maxWidth: 800, margin: '0 auto', padding: '90px 24px 56px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(77,214,200,0.12)', border: '1px solid rgba(77,214,200,0.3)', borderRadius: 24, padding: '6px 16px', marginBottom: 22 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: TEAL, display: 'inline-block', boxShadow:'0 0 8px rgba(77,214,200,0.8)' }} />
            <span style={{ fontSize: 12, color: TEAL, fontWeight: 700, letterSpacing: '1px' }}>MARINA DIRECTORY</span>
          </div>
          <h1 style={{ fontSize: 'clamp(34px,5.5vw,58px)', fontWeight: 900, letterSpacing: '-2px', margin: '0 0 16px', lineHeight: 1.05 }}>
            Find a <span style={{ color: TEAL, textShadow:'0 0 30px rgba(77,214,200,0.4)' }}>Skipper Marina</span>
          </h1>
          <p style={{ fontSize: 17, color: MUTED, margin: '0 0 40px', lineHeight: 1.6 }}>
            Browse AyeAyeSkipper-powered marinas. Request a transient slip instantly — no calls, no paperwork.
          </p>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: 10, maxWidth: 540, margin: '0 auto' }}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, city, or state…"
              style={{ flex: 1, padding: '13px 18px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: 12, color: '#fff', fontSize: 14, fontFamily: FONT, outline: 'none' }}
            />
            <button type="submit"
              style={{ padding: '13px 24px', background: TEAL, color: NAVY, border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: FONT, boxShadow:'0 4px 20px rgba(77,214,200,0.25)' }}>
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Results */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 100px' }}>
        {query && (
          <div style={{ fontSize: 13, color: MUTED, marginBottom: 20 }}>
            Results for &ldquo;{query}&rdquo; — {marinas.length} marina{marinas.length !== 1 ? 's' : ''} found
          </div>
        )}
        {!query && !loading && marinas.length > 0 && (
          <div style={{ fontSize: 13, color: MUTED, marginBottom: 20 }}>{marinas.length} marina{marinas.length !== 1 ? 's' : ''} on Skipper</div>
        )}

        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: MUTED }}>Loading marinas…</div>
        )}

        {!loading && marinas.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>⚓</div>
            <div style={{ fontSize: 16, color: MUTED }}>No marinas found{query ? ` for "${query}"` : ''}.</div>
            {query && (
              <button onClick={() => { setSearch(''); setQuery(''); fetchMarinas('') }}
                style={{ marginTop: 16, padding: '8px 20px', background: 'rgba(77,214,200,0.1)', border: '1px solid rgba(77,214,200,0.3)', borderRadius: 8, color: TEAL, cursor: 'pointer', fontFamily: FONT, fontSize: 13, fontWeight: 700 }}>
                Clear search
              </button>
            )}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 20 }}>
          {marinas.map(m => (
            <Link key={m.id} href={`/marinas/${m.slug || m.id}`} style={{ textDecoration: 'none' }}>
              <div style={{ background: 'linear-gradient(160deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 18, overflow:'hidden', cursor: 'pointer', transition: 'border-color 0.2s, transform 0.2s', height: '100%' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(77,214,200,0.5)'; e.currentTarget.style.transform = 'translateY(-3px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'translateY(0)' }}>
                {/* Card image / gradient banner */}
                <div style={{ position:'relative', height:110, background: m.photo_url
                  ? `url(${m.photo_url}) center/cover`
                  : 'linear-gradient(135deg,#0d2b4b 0%,#0a3652 60%,#071e38 100%)' }}>
                  {!m.photo_url && (
                    <div style={{ position:'absolute', inset:0, opacity:0.18, backgroundImage:'radial-gradient(circle at 25% 30%, #4dd6c8 0%, transparent 45%)' }} />
                  )}
                  <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(7,15,26,0.85) 100%)' }} />
                  <div style={{ position:'absolute', top:10, right:10 }}>
                    {m.transient_available ? (
                      <span style={{ fontSize:10, fontWeight:800, color:'#0d2b4b', background:TEAL, borderRadius:999, padding:'4px 10px', letterSpacing:0.4 }}>⛵ TRANSIENT</span>
                    ) : (
                      <span style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.85)', background:'rgba(0,0,0,0.4)', backdropFilter:'blur(4px)', border:'1px solid rgba(255,255,255,0.2)', borderRadius:999, padding:'4px 10px' }}>SEASONAL</span>
                    )}
                  </div>
                  <div style={{ position:'absolute', bottom:10, left:14, right:14 }}>
                    <div style={{ fontSize:17, fontWeight:900, color:'#fff', letterSpacing:'-0.3px', textShadow:'0 2px 8px rgba(0,0,0,0.6)' }}>{m.name}</div>
                  </div>
                </div>
                <div style={{ padding:'14px 16px 16px' }}>
                  <div style={{ fontSize: 13, color: MUTED, marginBottom: 14, display:'flex', alignItems:'center', gap:5 }}>📍 {m.city}, {m.state}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12, color: MUTED, display:'flex', alignItems:'center', gap:5 }}>⚓ {m.total_slips} slips</span>
                    <span style={{ fontSize: 12, color: TEAL, fontWeight: 800 }}>View marina →</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

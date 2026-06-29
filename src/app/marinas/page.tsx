'use client'
import { useState, useEffect, useCallback } from 'react'
import Nav from '@/components/Nav'
import Link from 'next/link'

const DARK  = '#070f1a'
const TEAL  = '#4dd6c8'
const NAVY  = '#0d2b4b'
const FONT  = "system-ui,-apple-system,'Segoe UI',Roboto,sans-serif"
const MUTED = 'rgba(255,255,255,0.55)'

type Marina = {
  id: string
  name: string
  city: string
  state: string
  total_slips: number
  transient_available?: boolean
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
      <Nav />

      {/* Hero */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '80px 24px 48px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(77,214,200,0.1)', border: '1px solid rgba(77,214,200,0.25)', borderRadius: 24, padding: '6px 16px', marginBottom: 20 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: TEAL, display: 'inline-block' }} />
          <span style={{ fontSize: 12, color: TEAL, fontWeight: 700, letterSpacing: '1px' }}>MARINA DIRECTORY</span>
        </div>
        <h1 style={{ fontSize: 'clamp(32px,5vw,56px)', fontWeight: 900, letterSpacing: '-2px', margin: '0 0 16px', lineHeight: 1.05 }}>
          Find a <span style={{ color: TEAL }}>Skipper Marina</span>
        </h1>
        <p style={{ fontSize: 17, color: MUTED, margin: '0 0 40px', lineHeight: 1.6 }}>
          Browse AyeAyeSkipper-powered marinas. Request a transient slip instantly — no calls, no paperwork.
        </p>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 10, maxWidth: 540, margin: '0 auto' }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, city, or state…"
            style={{ flex: 1, padding: '12px 16px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, color: '#fff', fontSize: 14, fontFamily: FONT, outline: 'none' }}
          />
          <button type="submit"
            style={{ padding: '12px 20px', background: TEAL, color: NAVY, border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: FONT }}>
            Search
          </button>
        </form>
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

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
          {marinas.map(m => (
            <Link key={m.id} href={`/marinas/${m.id}`} style={{ textDecoration: 'none' }}>
              <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 20, cursor: 'pointer', transition: 'border-color 0.15s', height: '100%' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(77,214,200,0.4)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(77,214,200,0.15)', border: '1px solid rgba(77,214,200,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>⚓</div>
                  {m.transient_available && (
                    <span style={{ fontSize: 10, fontWeight: 700, color: TEAL, background: 'rgba(77,214,200,0.1)', border: '1px solid rgba(77,214,200,0.25)', borderRadius: 6, padding: '3px 8px', letterSpacing: 0.5 }}>TRANSIENT</span>
                  )}
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{m.name}</div>
                <div style={{ fontSize: 13, color: MUTED, marginBottom: 14 }}>{m.city}, {m.state}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, color: MUTED }}>{m.total_slips} slips</span>
                  <span style={{ fontSize: 12, color: TEAL, fontWeight: 700 }}>Request a slip →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

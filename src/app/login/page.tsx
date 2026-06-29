'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const NAVY = '#0d2b4b', TEAL = '#4dd6c8', DARK = '#070f1a'
const FONT = "system-ui,-apple-system,'Segoe UI',Roboto,sans-serif"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleContinue() {
    if (!email.includes('@')) { setError('Enter a valid email'); return }
    setLoading(true); setError('')
    try {
      // Check if boater account exists
      const res = await fetch('/api/boaters/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'check', email }),
      })
      const data = await res.json()
      // Whether they have a PIN or not — route to boater auth with email pre-filled
      router.push(`/boaters/auth?email=${encodeURIComponent(email)}`)
    } catch {
      setError('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: DARK, fontFamily: FONT, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>

        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <img src="/skipper-avatar.jpg" alt="Skipper" style={{ width: 56, height: 56, borderRadius: '50%', border: `2px solid ${TEAL}`, marginBottom: 12 }} />
          <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.5px' }}>Welcome back</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 6 }}>Enter your email — Skipper knows who you are</div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '32px 28px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleContinue()}
              autoFocus
              style={{
                width: '100%', padding: '14px 16px',
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 8, color: '#fff', fontSize: 16,
                fontFamily: FONT, outline: 'none', boxSizing: 'border-box',
              }}
            />
            {error && <div style={{ color: '#ff6b6b', fontSize: 13 }}>{error}</div>}
            <button
              onClick={handleContinue}
              disabled={loading}
              style={{
                width: '100%', padding: '14px', background: TEAL, color: NAVY,
                border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 900,
                cursor: loading ? 'not-allowed' : 'pointer', fontFamily: FONT,
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Checking…' : 'Continue →'}
            </button>
          </div>

          <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.07)', textAlign: 'center' }}>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginBottom: 12 }}>Marina owner?</div>
            <a href="https://abc-marina.ayeayeskipper.com" style={{ fontSize: 13, color: TEAL, textDecoration: 'none', fontWeight: 600 }}>
              Go to your marina dashboard →
            </a>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>
          New to AyeAyeSkipper? <a href="/boaters" style={{ color: TEAL, textDecoration: 'none' }}>Boaters start here</a> · <a href="/join" style={{ color: TEAL, textDecoration: 'none' }}>Marinas start here</a>
        </p>
      </div>
    </div>
  )
}

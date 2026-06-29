'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const NAVY = '#0d2b4b', TEAL = '#4dd6c8', DARK = '#070f1a'
const FONT = "system-ui,-apple-system,'Segoe UI',Roboto,sans-serif"

type Account = {
  id: string
  email: string
  first_name?: string
  last_name?: string
  phone?: string
  boat_name?: string
  boat_type?: string
  created_at?: string
}

export default function BoaterDashboard() {
  const router = useRouter()
  const [account, setAccount] = useState<Account | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const session = localStorage.getItem('boater_session')
    const email = localStorage.getItem('boater_email')
    const acctStr = localStorage.getItem('boater_account')
    if (!session || !email) {
      router.replace('/boaters/auth')
      return
    }
    if (acctStr) {
      try { setAccount(JSON.parse(acctStr)) } catch {}
    }
    setLoading(false)
  }, [router])

  function signOut() {
    localStorage.removeItem('boater_session')
    localStorage.removeItem('boater_email')
    localStorage.removeItem('boater_account')
    router.push('/boaters')
  }

  if (loading) return <div style={{ minHeight: '100vh', background: DARK }} />

  const name = account?.first_name ? `${account.first_name}${account.last_name ? ' ' + account.last_name : ''}` : account?.email

  return (
    <div style={{ minHeight: '100vh', background: DARK, fontFamily: FONT, color: '#fff' }}>
      {/* Header */}
      <div style={{ background: NAVY, padding: '40px 40px 32px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontSize: 12, color: TEAL, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 8 }}>Boater Portal</div>
            <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-1.5px', margin: 0 }}>
              {account?.first_name ? `Ahoy, ${account.first_name} 👋` : 'Your Dashboard'}
            </h1>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', margin: '6px 0 0' }}>{account?.email}</p>
          </div>
          <button onClick={signOut} style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.5)', borderRadius: 8, padding: '8px 18px', fontSize: 13, cursor: 'pointer', fontFamily: FONT }}>
            Sign Out
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '48px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          
          {/* Find a Marina */}
          <Link href="/marinas" style={{ textDecoration: 'none' }}>
            <div style={{ background: 'rgba(77,214,200,0.08)', border: `1px solid rgba(77,214,200,0.25)`, borderRadius: 12, padding: 28, cursor: 'pointer', transition: 'all 0.15s' }}>
              <div style={{ fontSize: 36, marginBottom: 14 }}>🗺️</div>
              <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 8, color: '#fff' }}>Find a Marina</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65 }}>Browse Skipper-powered marinas near you. Check availability, book a slip.</div>
              <div style={{ color: TEAL, fontSize: 13, fontWeight: 700, marginTop: 16 }}>Browse marinas →</div>
            </div>
          </Link>

          {/* Bookings */}
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 28 }}>
            <div style={{ fontSize: 36, marginBottom: 14 }}>📋</div>
            <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 8 }}>My Bookings</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65 }}>Your slip reservations will appear here once you make a booking at a Skipper marina.</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', marginTop: 16, fontStyle: 'italic' }}>No bookings yet</div>
          </div>

          {/* Hot Slip */}
          <Link href="/hot-slip" style={{ textDecoration: 'none' }}>
            <div style={{ background: 'rgba(255,100,50,0.06)', border: '1px solid rgba(255,100,50,0.2)', borderRadius: 12, padding: 28, cursor: 'pointer' }}>
              <div style={{ fontSize: 36, marginBottom: 14 }}>🔥</div>
              <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 8, color: '#fff' }}>Hot Slip™</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65 }}>Annual tenants list slips when cruising. Real slips at real marinas — no random lots.</div>
              <div style={{ color: '#ff6e3a', fontSize: 13, fontWeight: 700, marginTop: 16 }}>Browse hot slips →</div>
            </div>
          </Link>

          {/* Profile */}
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 28 }}>
            <div style={{ fontSize: 36, marginBottom: 14 }}>⚙️</div>
            <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 8 }}>My Profile</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
              {[
                ['Email', account?.email || '—'],
                ['Name', account?.first_name ? `${account.first_name} ${account.last_name || ''}`.trim() : '—'],
              ].map(([label, val]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</span>
                  <span style={{ color: 'rgba(255,255,255,0.75)' }}>{val}</span>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', marginTop: 16, fontStyle: 'italic' }}>Profile editing coming soon</div>
          </div>
        </div>

        {/* Ask Skipper CTA */}
        <div style={{ marginTop: 48, background: `linear-gradient(135deg, ${NAVY}, rgba(13,43,75,0.6))`, border: `1px solid rgba(77,214,200,0.2)`, borderRadius: 16, padding: '36px 40px', textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>💬</div>
          <h3 style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.5px', margin: '0 0 8px' }}>Have a question?</h3>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', margin: '0 0 20px', lineHeight: 1.65 }}>
            Ask Skipper anything — slip availability, marina amenities, local conditions, booking help.
          </p>
          <Link href="/" style={{ padding: '12px 28px', background: TEAL, color: NAVY, borderRadius: 8, fontSize: 14, fontWeight: 800, textDecoration: 'none', display: 'inline-block' }}>
            Ask Skipper →
          </Link>
        </div>
      </div>
    </div>
  )
}

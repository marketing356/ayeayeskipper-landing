'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const NAVY = '#0d2b4b', TEAL = '#4dd6c8', DARK = '#070f1a'
const FONT = "system-ui,-apple-system,'Segoe UI',Roboto,sans-serif"

type Account = { email: string; first_name?: string; last_name?: string }

export default function BoaterDashboard() {
  const router = useRouter()
  const [account, setAccount] = useState<Account | null>(null)

  useEffect(() => {
    const raw = localStorage.getItem('boater_account')
    if (!raw) { router.replace('/boaters/auth'); return }
    try { setAccount(JSON.parse(raw)) } catch { router.replace('/boaters/auth') }
  }, [router])

  function signOut() {
    localStorage.removeItem('boater_account')
    localStorage.removeItem('boater_email')
    router.push('/boaters/auth')
  }

  if (!account) return <div style={{ minHeight: '100vh', background: DARK }} />

  const name = [account.first_name, account.last_name].filter(Boolean).join(' ') || account.email.split('@')[0]

  const QUICK_LINKS = [
    { icon: '🗺️', label: 'Browse Marinas', desc: 'Find slips, request transient docking', href: '/marinas' },
    { icon: '💬', label: 'Talk to Skipper', desc: 'Marina comms, questions, trip planning', href: '/boaters' },
    { icon: '⚓', label: 'Find a Slip', desc: 'Search available transient slips now', href: '/transient' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: DARK, fontFamily: FONT, color: '#fff' }}>

      {/* Header */}
      <div style={{ background: NAVY, borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src="/skipper-avatar.jpg" alt="Skipper" style={{ width: 36, height: 36, borderRadius: '50%', border: `2px solid ${TEAL}` }} />
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: '-0.3px' }}>AyeAyeSkipper</div>
            <div style={{ fontSize: 11, color: TEAL, fontWeight: 600 }}>Boater Portal</div>
          </div>
        </div>
        <button onClick={signOut} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 6, color: 'rgba(255,255,255,0.5)', fontSize: 12, padding: '6px 14px', cursor: 'pointer', fontFamily: FONT }}>
          Sign Out
        </button>
      </div>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '48px 24px' }}>

        {/* Welcome */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-1px', marginBottom: 6 }}>
            Hey {name} 👋
          </div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)' }}>{account.email}</div>
        </div>

        {/* Quick links */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 14 }}>Quick Access</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {QUICK_LINKS.map(link => (
              <button key={link.href} onClick={() => router.push(link.href)}
                style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '16px 20px', cursor: 'pointer', fontFamily: FONT, textAlign: 'left', width: '100%' }}>
                <span style={{ fontSize: 28, flexShrink: 0 }}>{link.icon}</span>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 3 }}>{link.label}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{link.desc}</div>
                </div>
                <span style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.2)', fontSize: 18 }}>›</span>
              </button>
            ))}
          </div>
        </div>

        {/* Full app promo — not a forced redirect, just an option */}
        <div style={{ background: `linear-gradient(135deg, rgba(77,214,200,0.1) 0%, rgba(13,43,75,0.4) 100%)`, border: `1px solid ${TEAL}33`, borderRadius: 16, padding: '24px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 4 }}>Want the full experience?</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>
              Ship&apos;s log, vessel history, engine tracking, and more — open in the Skipper app.
            </div>
          </div>
          <a href="https://app.ayeayeskipper.com" target="_blank" rel="noreferrer"
            style={{ padding: '12px 24px', background: TEAL, color: NAVY, borderRadius: 8, fontSize: 14, fontWeight: 800, textDecoration: 'none', flexShrink: 0, fontFamily: FONT }}>
            Open Skipper App →
          </a>
        </div>

      </div>
    </div>
  )
}

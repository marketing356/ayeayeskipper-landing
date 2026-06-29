'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const NAVY = '#0d2b4b', TEAL = '#4dd6c8', DARK = '#070f1a'
const FONT = "system-ui,-apple-system,'Segoe UI',Roboto,sans-serif"

type MarinaAccount = {
  email: string
  firstName: string
  lastName: string | null
  marinaName: string
  marinaId: string
  marinaSlug: string | null
}

export default function MarinaAccountPage() {
  const router = useRouter()
  const [account, setAccount] = useState<MarinaAccount | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const session = localStorage.getItem('marina_session')
    const acctStr = localStorage.getItem('marina_account')
    if (!session || !acctStr) {
      router.replace('/marina-login')
      return
    }
    try { setAccount(JSON.parse(acctStr)) } catch {}
    setLoading(false)
  }, [router])

  function signOut() {
    localStorage.removeItem('marina_session')
    localStorage.removeItem('marina_account')
    router.push('/')
  }

  if (loading) return <div style={{ minHeight: '100vh', background: DARK }} />

  const helmUrl = account?.marinaSlug
    ? `https://${account.marinaSlug}.ayeayeskipper.com`
    : null

  return (
    <div style={{ minHeight: '100vh', background: DARK, fontFamily: FONT, color: '#fff' }}>

      {/* Header */}
      <div style={{ background: NAVY, padding: '40px 40px 32px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontSize: 11, color: TEAL, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 8 }}>Marina Account</div>
            <h1 style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-1px', margin: 0 }}>
              {account?.marinaName}
            </h1>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', margin: '6px 0 0' }}>
              {account?.firstName} {account?.lastName} · {account?.email}
            </p>
          </div>
          <button onClick={signOut} style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.5)', borderRadius: 8, padding: '8px 18px', fontSize: 13, cursor: 'pointer', fontFamily: FONT }}>
            Sign Out
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20, marginBottom: 40 }}>

          {/* Helm access */}
          <div style={{ background: helmUrl ? 'rgba(77,214,200,0.08)' : 'rgba(255,255,255,0.04)', border: helmUrl ? `1px solid rgba(77,214,200,0.3)` : '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 28 }}>
            <div style={{ fontSize: 32, marginBottom: 14 }}>⚓</div>
            <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 8 }}>Your Helm</div>
            {helmUrl ? (
              <>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, margin: '0 0 16px' }}>
                  Your marina dashboard is live and ready.
                </p>
                <a href={helmUrl} target="_blank" rel="noopener noreferrer"
                  style={{ color: TEAL, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
                  Open {helmUrl} →
                </a>
              </>
            ) : (
              <>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, margin: '0 0 8px' }}>
                  Your Helm is being set up. You'll receive an email within 1 business day with your dashboard link.
                </p>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', fontStyle: 'italic' }}>Provisioning in progress</div>
              </>
            )}
          </div>

          {/* Subscription */}
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 28 }}>
            <div style={{ fontSize: 32, marginBottom: 14 }}>💳</div>
            <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 8 }}>Subscription</div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(77,214,200,0.1)', border: `1px solid rgba(77,214,200,0.3)`, borderRadius: 20, padding: '4px 12px', marginBottom: 12 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: TEAL }} />
              <span style={{ fontSize: 12, color: TEAL, fontWeight: 700 }}>30-Day Free Trial</span>
            </div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, margin: '0 0 16px' }}>
              No credit card needed during trial. Billing starts after your Helm is provisioned.
            </p>
            <a href="/pricing" style={{ color: TEAL, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
              View pricing →
            </a>
          </div>

          {/* Marina info */}
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 28 }}>
            <div style={{ fontSize: 32, marginBottom: 14 }}>🗺️</div>
            <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 16 }}>Marina Info</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                ['Marina', account?.marinaName],
                ['Account Email', account?.email],
                ['Owner', `${account?.firstName} ${account?.lastName || ''}`.trim()],
              ].map(([label, val]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</span>
                  <span style={{ color: 'rgba(255,255,255,0.75)', textAlign: 'right', maxWidth: 180 }}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Help block */}
        <div style={{ background: `linear-gradient(135deg, ${NAVY}, rgba(13,43,75,0.5))`, border: `1px solid rgba(77,214,200,0.2)`, borderRadius: 16, padding: '32px 36px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 6 }}>Questions while you wait?</div>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', margin: 0, lineHeight: 1.65 }}>
              Ask Skipper anything about the platform, migration, or setup.
            </p>
          </div>
          <a href="/" style={{ padding: '12px 28px', background: TEAL, color: NAVY, borderRadius: 8, fontSize: 14, fontWeight: 800, textDecoration: 'none', whiteSpace: 'nowrap' }}>
            Ask Skipper →
          </a>
        </div>
      </div>
    </div>
  )
}

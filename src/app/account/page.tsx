'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

const NAVY = '#0d2b4b'
const TEAL = '#4dd6c8'
const DARK = '#070f1a'
const FONT = "system-ui,-apple-system,'Segoe UI',Roboto,sans-serif"

const TIER_LABELS: Record<string, string> = {
  mate:    'Mate',
  captain: 'Captain',
  admiral: 'Admiral',
}
const TIER_PRICES: Record<string, number> = {
  mate:    299,
  captain: 499,
  admiral: 799,
}

type Account = {
  email: string
  firstName: string
  lastName: string | null
  contactId: string
  marinaId: string
  marinaName: string
  marinaSlug: string | null
  totalSlips: number | null
  planTier: string
  billingStatus: string
  trialEndsAt: string | null
  hasPaymentMethod: boolean
}

type NetworkMarina = {
  id: string
  name: string
  city: string | null
  state: string | null
  total_slips: number | null
  slug: string | null
  billing_status: string
}

export default function MarinaAccountPage() {
  const router = useRouter()
  const [account, setAccount] = useState<Account | null>(null)
  const [network, setNetwork]  = useState<NetworkMarina[]>([])
  const [daysLeft, setDaysLeft] = useState<number | null>(null)
  const [loading, setLoading]  = useState(true)

  const loadNetwork = useCallback(async () => {
    try {
      const res = await fetch('/api/marina/billing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get-network' }),
      })
      const data = await res.json()
      if (data.marinas) setNetwork(data.marinas)
    } catch {}
  }, [])

  useEffect(() => {
    const acctStr = localStorage.getItem('marina_account')
    if (!acctStr) { router.replace('/marina-login'); return }
    try {
      const acct: Account = JSON.parse(acctStr)
      setAccount(acct)
      if (acct.trialEndsAt) {
        const end = new Date(acct.trialEndsAt)
        const days = Math.max(0, Math.ceil((end.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
        setDaysLeft(days)
      }
    } catch { router.replace('/marina-login'); return }
    setLoading(false)
    loadNetwork()
  }, [router, loadNetwork])

  function signOut() {
    localStorage.removeItem('marina_session')
    localStorage.removeItem('marina_account')
    router.push('/')
  }

  if (loading || !account) {
    return <div style={{ minHeight: '100vh', background: DARK }} />
  }

  const helmUrl = account.marinaSlug
    ? `https://${account.marinaSlug}.ayeayeskipper.com`
    : null

  const isTrialing = account.billingStatus === 'trialing'
  const tierLabel  = TIER_LABELS[account.planTier] ?? 'Mate'
  const tierPrice  = TIER_PRICES[account.planTier] ?? 299

  // Trial banner color
  const trialUrgent = daysLeft !== null && daysLeft <= 5
  const trialWarning = daysLeft !== null && daysLeft <= 10

  return (
    <div style={{ minHeight: '100vh', background: DARK, fontFamily: FONT, color: '#fff' }}>

      {/* ── Trial countdown banner ── */}
      {isTrialing && daysLeft !== null && (
        <div style={{
          background: trialUrgent ? 'rgba(255,80,80,0.15)' : trialWarning ? 'rgba(255,180,0,0.12)' : 'rgba(77,214,200,0.1)',
          borderBottom: `1px solid ${trialUrgent ? 'rgba(255,80,80,0.3)' : trialWarning ? 'rgba(255,180,0,0.3)' : 'rgba(77,214,200,0.25)'}`,
          padding: '10px 40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          flexWrap: 'wrap' as const,
        }}>
          <span style={{ fontSize: 13, color: trialUrgent ? '#ff8080' : trialWarning ? '#ffcc44' : TEAL, fontWeight: 700 }}>
            ⏱ {daysLeft === 0 ? 'Trial ends today' : `${daysLeft} day${daysLeft === 1 ? '' : 's'} left in your free trial`}
          </span>
          {!account.hasPaymentMethod && (
            <a href="/account/billing" style={{
              background: trialUrgent ? '#ff5050' : TEAL,
              color: trialUrgent ? '#fff' : NAVY,
              borderRadius: 6, padding: '5px 14px', fontSize: 12, fontWeight: 800,
              textDecoration: 'none',
            }}>
              Add payment method →
            </a>
          )}
        </div>
      )}

      {/* ── Header ── */}
      <div style={{ background: NAVY, padding: '36px 40px 28px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' as const, gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <img src="/skipper-avatar.jpg" alt="Skipper" style={{ width: 36, height: 36, borderRadius: '50%', border: `2px solid ${TEAL}` }} />
              <span style={{ fontSize: 11, color: TEAL, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' as const }}>
                AyeAyeSkipper Portal
              </span>
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 900, letterSpacing: '-0.8px', margin: 0 }}>
              {account.marinaName}
            </h1>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: '4px 0 0' }}>
              {account.firstName} {account.lastName} · {account.email}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              background: 'rgba(77,214,200,0.1)', border: `1px solid rgba(77,214,200,0.3)`,
              borderRadius: 20, padding: '5px 14px', fontSize: 12, color: TEAL, fontWeight: 700,
            }}>
              {tierLabel} · ${tierPrice}/mo
            </div>
            <button onClick={signOut} style={{
              background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.45)', borderRadius: 8, padding: '8px 16px',
              fontSize: 12, cursor: 'pointer', fontFamily: FONT,
            }}>
              Sign out
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '40px 40px' }}>

        {/* ── Quick action cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, marginBottom: 40 }}>

          {/* Helm card */}
          <div style={{
            background: helmUrl ? 'rgba(77,214,200,0.06)' : 'rgba(255,255,255,0.03)',
            border: helmUrl ? '1px solid rgba(77,214,200,0.25)' : '1px solid rgba(255,255,255,0.07)',
            borderRadius: 14, padding: 24,
          }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>⚓</div>
            <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 6 }}>Your Helm</div>
            {helmUrl ? (
              <>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: '0 0 14px', lineHeight: 1.6 }}>
                  Your marina dashboard — manage slips, staff, guests, and billing.
                </p>
                <a href={helmUrl} target="_blank" rel="noopener noreferrer"
                  style={{ color: TEAL, fontSize: 13, fontWeight: 800, textDecoration: 'none' }}>
                  Open Helm →
                </a>
              </>
            ) : (
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', margin: 0, lineHeight: 1.6 }}>
                Your Helm is being provisioned. You'll receive an email within 1 business day.
              </p>
            )}
          </div>

          {/* Billing card */}
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 14, padding: 24,
          }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>💳</div>
            <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 6 }}>Subscription</div>
            <div style={{ marginBottom: 12 }}>
              {isTrialing ? (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  background: 'rgba(77,214,200,0.1)', border: '1px solid rgba(77,214,200,0.3)',
                  borderRadius: 20, padding: '3px 10px', fontSize: 11, color: TEAL, fontWeight: 700,
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: TEAL, display: 'inline-block' }} />
                  Free Trial
                </span>
              ) : account.billingStatus === 'active' ? (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  background: 'rgba(77,214,200,0.1)', border: '1px solid rgba(77,214,200,0.3)',
                  borderRadius: 20, padding: '3px 10px', fontSize: 11, color: TEAL, fontWeight: 700,
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: TEAL, display: 'inline-block' }} />
                  Active
                </span>
              ) : (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.3)',
                  borderRadius: 20, padding: '3px 10px', fontSize: 11, color: '#ff8080', fontWeight: 700,
                }}>
                  {account.billingStatus}
                </span>
              )}
            </div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: '0 0 14px', lineHeight: 1.6 }}>
              {tierLabel} plan · ${tierPrice}/mo
              {account.hasPaymentMethod ? ' · Card on file' : ' · No card yet'}
            </p>
            <a href="/account/billing" style={{ color: TEAL, fontSize: 13, fontWeight: 800, textDecoration: 'none' }}>
              {account.hasPaymentMethod ? 'View billing →' : 'Add payment method →'}
            </a>
          </div>

          {/* Marina info card */}
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 14, padding: 24,
          }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>🗺️</div>
            <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 14 }}>Marina Info</div>
            {[
              ['Marina',  account.marinaName],
              ['Slips',   account.totalSlips?.toString() ?? '—'],
              ['Tier',    `${tierLabel} ($${tierPrice}/mo)`],
              ['Contact', account.email],
            ].map(([label, val]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                <span style={{ color: 'rgba(255,255,255,0.35)' }}>{label}</span>
                <span style={{ color: 'rgba(255,255,255,0.75)', textAlign: 'right' as const, maxWidth: 170 }}>{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Skipper Marina Network ── */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0, letterSpacing: '-0.4px' }}>
              ⚓ Skipper Marina Network
            </h2>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
              {network.length} marina{network.length !== 1 ? 's' : ''}
            </span>
          </div>

          {network.length === 0 ? (
            <div style={{
              background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 12, padding: 24, textAlign: 'center' as const,
            }}>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, margin: 0 }}>Loading network...</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
              {network.map(m => {
                const isOwn = m.id === account.marinaId
                const helmLink = m.slug ? `https://${m.slug}.ayeayeskipper.com` : null
                return (
                  <div key={m.id} style={{
                    background: isOwn ? 'rgba(77,214,200,0.06)' : 'rgba(255,255,255,0.02)',
                    border: isOwn ? '1px solid rgba(77,214,200,0.2)' : '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 10, padding: '16px 18px',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.3 }}>{m.name}</div>
                      {isOwn && (
                        <span style={{ fontSize: 10, color: TEAL, fontWeight: 700, background: 'rgba(77,214,200,0.1)', borderRadius: 4, padding: '2px 6px', flexShrink: 0, marginLeft: 6 }}>
                          YOU
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: m.total_slips ? 6 : 0 }}>
                      {[m.city, m.state].filter(Boolean).join(', ') || 'Location TBD'}
                    </div>
                    {m.total_slips && (
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>
                        {m.total_slips} slips
                      </div>
                    )}
                    {isOwn && helmLink && (
                      <a href={helmLink} target="_blank" rel="noopener noreferrer"
                        style={{ display: 'inline-block', marginTop: 10, color: TEAL, fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>
                        Open Helm →
                      </a>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* ── Help block ── */}
        <div style={{
          background: `linear-gradient(135deg, ${NAVY}, rgba(13,43,75,0.5))`,
          border: `1px solid rgba(77,214,200,0.15)`,
          borderRadius: 14, padding: '28px 32px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' as const, gap: 16,
        }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 4 }}>Need help?</div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: 0, lineHeight: 1.6 }}>
              Ask Skipper anything about setup, migration, or features.
            </p>
          </div>
          <a href="/" style={{
            padding: '11px 24px', background: TEAL, color: NAVY, borderRadius: 8,
            fontSize: 13, fontWeight: 800, textDecoration: 'none', whiteSpace: 'nowrap' as const,
          }}>
            Ask Skipper →
          </a>
        </div>
      </div>
    </div>
  )
}

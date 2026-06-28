'use client'
import Link from 'next/link'
import { useState } from 'react'

const TEAL = '#4dd6c8'
const NAVY = '#0d2b4b'
const DARK = '#070f1a'
const FONT = "system-ui,-apple-system,'Segoe UI',Roboto,sans-serif"

const TIERS = [
  {
    name: 'MATE',
    label: 'UP TO 30 SLIPS',
    subtitle: 'No transient program',
    price: '$299',
    per: '/mo',
    badge: null as string | null,
    highlight: false,
    features: [
      'Full Helm marina management dashboard',
      'Slip Logic™ live color-coded marina map',
      'Asset Logic™ — slips, moorings, storage, parking',
      'Skipper app for all staff and slip holders',
      'Tenant messaging + announcements',
      'Lease management + e-sign',
      'Billing + late payment automation',
      'Work orders + maintenance tracking',
      'Unlimited staff accounts',
      'Unlimited tenant profiles',
      'Full support included',
    ],
  },
  {
    name: 'CAPTAIN',
    label: '31–99 SLIPS',
    subtitle: 'Or any transient program',
    price: '$499',
    per: '/mo',
    badge: 'MOST POPULAR',
    highlight: true,
    features: [
      'Everything in Mate',
      'Transient booking & Hot Slip™ revenue program',
      'Waitlist intelligence',
      'Fuel dock module',
      'Rack + trailer + PWC storage tracking',
      'SMS via Skipper (Twilio)',
      'QuickBooks sync',
      'Multi-dock management',
      'Skipper Gangway™ migration (same day)',
    ],
  },
  {
    name: 'ADMIRAL',
    label: '100+ SLIPS',
    subtitle: 'Large & multi-marina operations',
    price: '$799',
    per: '/mo',
    badge: 'ENTERPRISE',
    highlight: false,
    features: [
      'Everything in Captain',
      'Unlimited slips — no cap',
      'Multi-marina dashboard',
      'Custom Skipper training on your data',
      'Priority onboarding specialist',
      'White-label tenant portal',
      'SLA + priority support',
      'Dedicated account manager',
    ],
  },
]

const COMPARE = [
  { feature: 'Monthly software fee', skipper: '$299–$799', dockwa: '$1,300–$1,500' },
  { feature: 'Booking commission', skipper: 'ZERO', dockwa: '15% per booking' },
  { feature: 'Pay to rank higher', skipper: 'Never', dockwa: 'Yes — paid tiers' },
  { feature: 'Marina map included', skipper: '✓', dockwa: '✗' },
  { feature: 'Tenant/slip holder app', skipper: '✓', dockwa: '✗' },
  { feature: 'Lease + e-sign', skipper: '✓', dockwa: '✗' },
  { feature: 'Annual savings vs. Dockwa', skipper: '$9,600–$14,400', dockwa: '—' },
]

function CheckoutButton({ tier, highlight }: { tier: string; highlight: boolean }) {
  const [loading, setLoading] = useState(false)

  async function handleCheckout() {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: tier.toLowerCase() }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else alert('Something went wrong. Please try again.')
    } catch {
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      style={{
        display: 'block',
        width: '100%',
        textAlign: 'center',
        padding: '14px 24px',
        background: highlight ? TEAL : 'rgba(77,214,200,0.12)',
        color: highlight ? NAVY : TEAL,
        borderRadius: 10,
        fontWeight: 700,
        fontSize: 15,
        border: highlight ? 'none' : `1px solid ${TEAL}`,
        cursor: loading ? 'not-allowed' : 'pointer',
        opacity: loading ? 0.7 : 1,
        fontFamily: FONT,
      }}
    >
      {loading ? 'Redirecting...' : 'Start Free Trial'}
    </button>
  )
}

export default function Pricing() {
  return (
    <div style={{ minHeight: '100vh', background: DARK, fontFamily: FONT, color: '#fff' }}>

      {/* Nav */}
      <nav style={{ padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <Link href="/" style={{ color: TEAL, fontWeight: 700, fontSize: 18, textDecoration: 'none', letterSpacing: 1 }}>
          AYEAYESKIPPER
        </Link>
        <Link href="/join" style={{ background: TEAL, color: NAVY, padding: '10px 24px', borderRadius: 8, fontWeight: 700, textDecoration: 'none', fontSize: 14 }}>
          Start Free Trial
        </Link>
      </nav>

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '80px 20px 60px' }}>
        <div style={{ color: TEAL, fontSize: 13, fontWeight: 700, letterSpacing: 3, marginBottom: 16 }}>PRICING</div>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 800, margin: '0 0 20px', lineHeight: 1.1 }}>
          Flat rate. No surprises.<br />No booking cuts.
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 18, maxWidth: 540, margin: '0 auto 12px' }}>
          One price covers everything. Marinas keep 100% of every booking — we charge boaters a small service fee at checkout.
        </p>
        <p style={{ color: TEAL, fontWeight: 600, fontSize: 15 }}>First 30 days free. No credit card required.</p>
      </div>

      {/* Tiers */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px 80px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
        {TIERS.map((tier) => (
          <div key={tier.name} style={{
            background: tier.highlight ? NAVY : 'rgba(255,255,255,0.03)',
            border: `2px solid ${tier.highlight ? TEAL : 'rgba(255,255,255,0.1)'}`,
            borderRadius: 16,
            padding: 36,
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
          }}>
            {tier.badge && (
              <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: TEAL, color: NAVY, fontSize: 11, fontWeight: 800, letterSpacing: 2, padding: '5px 16px', borderRadius: 20 }}>
                {tier.badge}
              </div>
            )}
            <div style={{ color: TEAL, fontSize: 12, fontWeight: 800, letterSpacing: 3, marginBottom: 8 }}>{tier.name}</div>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{tier.label}</div>
            <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, marginBottom: 28 }}>{tier.subtitle}</div>
            <div style={{ marginBottom: 32 }}>
              <span style={{ fontSize: 52, fontWeight: 800, color: tier.highlight ? TEAL : '#fff' }}>{tier.price}</span>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16 }}>{tier.per}</span>
            </div>
            <ul style={{ listStyle: 'none', margin: '0 0 36px', padding: 0, flex: 1 }}>
              {tier.features.map((f) => (
                <li key={f} style={{ display: 'flex', gap: 10, marginBottom: 12, fontSize: 14, color: 'rgba(255,255,255,0.8)', alignItems: 'flex-start' }}>
                  <span style={{ color: TEAL, fontWeight: 700, flexShrink: 0 }}>✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <CheckoutButton tier={tier.name} highlight={tier.highlight} />
          </div>
        ))}
      </div>

      {/* Interaction Fee note */}
      <div style={{ maxWidth: 700, margin: '0 auto 80px', padding: '0 20px', textAlign: 'center' }}>
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '28px 32px' }}>
          <div style={{ fontWeight: 700, marginBottom: 10 }}>Interaction Fee — Cost Recovery Only</div>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, margin: 0, lineHeight: 1.7 }}>
            Every AI interaction is logged by tokens used. We pass our exact cost through — zero markup, never a profit center.
            Most marinas pay $5–$15/mo. Heavy users: up to $25/mo. We call it an Interaction Fee, not an AI fee.
          </p>
        </div>
      </div>

      {/* vs Dockwa */}
      <div style={{ maxWidth: 800, margin: '0 auto 80px', padding: '0 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ color: TEAL, fontSize: 12, fontWeight: 800, letterSpacing: 3, marginBottom: 12 }}>THE COMPARISON</div>
          <h2 style={{ fontSize: 32, fontWeight: 800, margin: 0 }}>Dockwa charges you to be found.<br />We just make sure boaters find you.</h2>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', background: 'rgba(255,255,255,0.06)', padding: '16px 24px', fontWeight: 700, fontSize: 13 }}>
            <span></span>
            <span style={{ color: TEAL, textAlign: 'center' }}>AyeAyeSkipper</span>
            <span style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>Dockwa</span>
          </div>
          {COMPARE.map((row, i) => (
            <div key={row.feature} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '14px 24px', borderTop: '1px solid rgba(255,255,255,0.06)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>{row.feature}</span>
              <span style={{ color: TEAL, fontWeight: 700, fontSize: 14, textAlign: 'center' }}>{row.skipper}</span>
              <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14, textAlign: 'center' }}>{row.dockwa}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ textAlign: 'center', padding: '0 20px 100px' }}>
        <h2 style={{ fontSize: 36, fontWeight: 800, margin: '0 0 16px' }}>Ready to run on Skipper?</h2>
        <p style={{ color: 'rgba(255,255,255,0.55)', marginBottom: 32 }}>30 days free. No credit card. Your data is yours from day one.</p>
        <Link href="/join" style={{ display: 'inline-block', background: TEAL, color: NAVY, padding: '18px 48px', borderRadius: 12, fontWeight: 800, fontSize: 18, textDecoration: 'none' }}>
          Start Free Trial →
        </Link>
      </div>
    </div>
  )
}

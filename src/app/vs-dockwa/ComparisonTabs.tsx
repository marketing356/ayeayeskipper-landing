'use client'
import { useState } from 'react'

const TEAL = '#4dd6c8'

type CompetitorId = 'molo' | 'dockside' | 'dockwa' | 'dockmaster' | 'harbourassist'

interface Row { feature: string; skipper: string; competitor: string }

interface Competitor {
  id: CompetitorId
  label: string
  tier: 'primary' | 'secondary' | 'legacy'
  note?: string
  rows: Row[]
}

const COMPETITORS: Competitor[] = [
  {
    id: 'molo',
    label: 'Molo',
    tier: 'primary',
    rows: [
      { feature: 'Monthly fee (flat)', skipper: '$299–$499/mo', competitor: 'varies' },
      { feature: 'Transaction fees', skipper: 'Zero. Ever.', competitor: '% per booking' },
      { feature: 'Marina owns customer data', skipper: 'Always', competitor: 'Platform owns' },
      { feature: 'Asset Logic™ map', skipper: 'Live color map', competitor: 'limited' },
      { feature: 'Skipper Engine™', skipper: 'Exclusive', competitor: '—' },
      { feature: 'Tenant portal (mobile)', skipper: 'Included', competitor: 'limited' },
      { feature: 'Migration tool', skipper: 'Skipper Gangway™ — same day', competitor: 'manual' },
      { feature: 'Setup time', skipper: 'Same afternoon', competitor: 'days' },
      { feature: 'Contract e-sign', skipper: '✓', competitor: 'limited' },
    ],
  },
  {
    id: 'dockside',
    label: 'Dockside',
    tier: 'primary',
    rows: [
      { feature: 'Monthly fee (flat)', skipper: '$299–$499/mo', competitor: 'varies' },
      { feature: 'Transaction fees', skipper: 'Zero. Ever.', competitor: '% per booking' },
      { feature: 'Marina owns customer data', skipper: 'Always', competitor: 'yours (limited export)' },
      { feature: 'Asset Logic™ map', skipper: 'Live color map', competitor: '—' },
      { feature: 'Skipper Engine™', skipper: 'Exclusive', competitor: '—' },
      { feature: 'Tenant portal (mobile)', skipper: 'Included', competitor: 'limited' },
      { feature: 'Migration tool', skipper: 'Skipper Gangway™ — same day', competitor: 'manual' },
      { feature: 'Setup time', skipper: 'Same afternoon', competitor: 'days' },
      { feature: 'Contract e-sign', skipper: '✓', competitor: 'limited' },
    ],
  },
  {
    id: 'dockwa',
    label: 'Dockwa',
    tier: 'secondary',
    note: 'In the transient booking space only.',
    rows: [
      { feature: 'Monthly fee (flat)', skipper: '$299–$499/mo', competitor: '% of bookings' },
      { feature: 'Transaction fees', skipper: 'Zero. Ever.', competitor: '% per booking' },
      { feature: 'Marina owns customer data', skipper: 'Always', competitor: 'Platform owns' },
      { feature: 'Hot Slip™ tenant revenue', skipper: 'Built in', competitor: '—' },
      { feature: 'Asset Logic™ map', skipper: 'Live color map', competitor: '—' },
      { feature: 'Skipper Engine™', skipper: 'Exclusive', competitor: '—' },
      { feature: 'Tenant portal (mobile)', skipper: 'Included', competitor: 'limited' },
      { feature: 'Migration tool', skipper: 'Skipper Gangway™ — same day', competitor: 'manual' },
      { feature: 'Setup time', skipper: 'Same afternoon', competitor: 'days–weeks' },
      { feature: 'Contract e-sign', skipper: '✓', competitor: '✓' },
    ],
  },
  {
    id: 'dockmaster',
    label: 'Dockmaster',
    tier: 'legacy',
    rows: [
      { feature: 'Monthly fee (flat)', skipper: '$299–$499/mo', competitor: '$200–$500+' },
      { feature: 'Transaction fees', skipper: 'Zero. Ever.', competitor: 'per transaction' },
      { feature: 'Marina owns customer data', skipper: 'Always', competitor: 'yours' },
      { feature: 'Asset Logic™ map', skipper: 'Live color map', competitor: 'limited' },
      { feature: 'Skipper Engine™', skipper: 'Exclusive', competitor: '—' },
      { feature: 'Tenant portal (mobile)', skipper: 'Included', competitor: '—' },
      { feature: 'Migration tool', skipper: 'Skipper Gangway™ — same day', competitor: 'manual' },
      { feature: 'Setup time', skipper: 'Same afternoon', competitor: 'weeks' },
      { feature: 'Contract e-sign', skipper: '✓', competitor: '✓' },
    ],
  },
  {
    id: 'harbourassist',
    label: 'Harbour Assist',
    tier: 'legacy',
    rows: [
      { feature: 'Monthly fee (flat)', skipper: '$299–$499/mo', competitor: 'varies' },
      { feature: 'Transaction fees', skipper: 'Zero. Ever.', competitor: 'per booking' },
      { feature: 'Marina owns customer data', skipper: 'Always', competitor: 'yours' },
      { feature: 'Asset Logic™ map', skipper: 'Live color map', competitor: '—' },
      { feature: 'Skipper Engine™', skipper: 'Exclusive', competitor: '—' },
      { feature: 'Tenant portal (mobile)', skipper: 'Included', competitor: 'limited' },
      { feature: 'Migration tool', skipper: 'Skipper Gangway™ — same day', competitor: 'manual' },
      { feature: 'Setup time', skipper: 'Same afternoon', competitor: 'days' },
      { feature: 'Contract e-sign', skipper: '✓', competitor: 'limited' },
    ],
  },
]

function skipperWins(row: Row): boolean {
  const bad = ['%','manual','varies','limited','—','weeks','days–weeks','$200']
  return bad.some(b => row.competitor.toLowerCase().includes(b.toLowerCase())) ||
    row.competitor === '—' ||
    (row.skipper === '✓' && row.competitor !== '✓')
}

export default function ComparisonTabs() {
  const [active, setActive] = useState<CompetitorId>('molo')
  const competitor = COMPETITORS.find(c => c.id === active)!

  return (
    <div>
      {/* Tab bar */}
      <div style={{ display:'flex', gap:6, marginBottom:24, flexWrap:'wrap' }}>
        {COMPETITORS.map(c => {
          const isActive = c.id === active
          const isPrimary = c.tier === 'primary'
          const isLegacy = c.tier === 'legacy'
          return (
            <button
              key={c.id}
              onClick={() => setActive(c.id)}
              style={{
                padding: isPrimary ? '10px 20px' : '7px 14px',
                borderRadius: 8,
                border: isActive
                  ? `2px solid ${TEAL}`
                  : isLegacy
                  ? '1px solid rgba(255,255,255,0.1)'
                  : '1px solid rgba(255,255,255,0.2)',
                background: isActive
                  ? `${TEAL}18`
                  : isLegacy
                  ? 'rgba(255,255,255,0.03)'
                  : 'rgba(255,255,255,0.06)',
                color: isActive ? TEAL : isLegacy ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.7)',
                fontWeight: isActive ? 800 : isPrimary ? 700 : 500,
                fontSize: isPrimary ? 14 : 12,
                cursor: 'pointer',
                fontFamily: "system-ui,-apple-system,'Segoe UI',Roboto,sans-serif",
                transition: 'all 0.15s',
                letterSpacing: isLegacy ? '0px' : '-0.2px',
              }}
            >
              {c.label}
              {isLegacy && <span style={{ fontSize:10, opacity:0.6, marginLeft:4 }}>legacy</span>}
            </button>
          )
        })}
      </div>

      {/* Transient note for Dockwa */}
      {competitor.note && (
        <div style={{
          background: 'rgba(255,200,80,0.07)',
          border: '1px solid rgba(255,200,80,0.2)',
          borderRadius: 10,
          padding: '10px 18px',
          marginBottom: 16,
          fontSize: 13,
          color: 'rgba(255,210,100,0.9)',
          fontStyle: 'italic',
        }}>
          ℹ️ {competitor.note}
        </div>
      )}

      {/* Table */}
      <div style={{ borderRadius:16, overflow:'hidden', border:'1px solid rgba(255,255,255,0.08)' }}>
        {/* Header */}
        <div style={{ display:'grid', gridTemplateColumns:'1.3fr 1fr 1fr' }}>
          <div style={{ background:'rgba(255,255,255,0.03)', padding:'14px 20px', fontSize:12, color:'rgba(255,255,255,0.3)', fontWeight:700, textTransform:'uppercase', letterSpacing:'1px' }}>Feature</div>
          <div style={{ background:`${TEAL}18`, padding:'14px 20px', fontSize:12, color:TEAL, fontWeight:800, textTransform:'uppercase', letterSpacing:'1px', textAlign:'center', borderLeft:`1px solid ${TEAL}30` }}>⚓ AyeAyeSkipper</div>
          <div style={{ background:'rgba(255,255,255,0.04)', padding:'14px 20px', fontSize:12, color:'rgba(255,255,255,0.4)', fontWeight:700, textTransform:'uppercase', letterSpacing:'1px', textAlign:'center', borderLeft:'1px solid rgba(255,255,255,0.06)' }}>{competitor.label}</div>
        </div>

        {/* Rows */}
        {competitor.rows.map((row, i) => {
          const wins = skipperWins(row)
          return (
            <div key={i} style={{ display:'grid', gridTemplateColumns:'1.3fr 1fr 1fr', borderTop:'1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ background:'rgba(255,255,255,0.02)', padding:'14px 20px', fontSize:13, color:'rgba(255,255,255,0.65)', display:'flex', alignItems:'center' }}>
                {row.feature}
              </div>
              <div style={{ background:`${TEAL}07`, padding:'14px 20px', fontSize:13, color:'rgba(255,255,255,0.9)', display:'flex', alignItems:'center', justifyContent:'center', textAlign:'center', gap:8, borderLeft:`1px solid ${TEAL}15`, fontWeight:600 }}>
                <span style={{ color:TEAL, flexShrink:0, fontWeight:900 }}>✓</span>{row.skipper}
              </div>
              <div style={{ background: wins ? 'rgba(255,60,60,0.04)' : 'rgba(255,255,255,0.025)', padding:'14px 20px', fontSize:13, color: wins ? 'rgba(255,150,150,0.85)' : 'rgba(255,255,255,0.55)', display:'flex', alignItems:'center', justifyContent:'center', textAlign:'center', gap:8, borderLeft:'1px solid rgba(255,255,255,0.04)' }}>
                {wins && <span style={{ color:'rgba(255,80,80,0.8)', flexShrink:0, fontWeight:900 }}>✕</span>}{row.competitor}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
export const metadata: Metadata = {
  title: "Pricing — AyeAyeSkipper",
  description: "Simple flat-rate pricing. 50 slips and under: $299/mo. 50+ slips: $499/mo. First month free. Zero transaction fees. Zero booking commissions. Everything included."
}

const TEAL = '#4dd6c8', NAVY = '#0d2b4b', FONT = "system-ui,-apple-system,'Segoe UI',Roboto,sans-serif"

const TIERS = [
  {
    label: '50 SLIPS & UNDER',
    price: '$299',
    per: '/mo',
    badge: null as string | null,
    color: 'rgba(255,255,255,0.03)' as string,
    border: 'rgba(255,255,255,0.12)' as string,
    features: [
      ['Every Skipper feature — nothing held back', true],
      ['Slip Logic™ live color-coded marina map', true],
      ['Asset Logic™ — slips, moorings, storage, parking', true],
      ['Hot Slip™ tenant revenue program', true],
      ['Transient bookings — zero commission', true],
      ['Skipper Gangway™ migration (same day)', true],
      ['Contracts + e-sign', true],
      ['Tenant portal (mobile, no app required)', true],
      ['The Briefing Room daily operations brief', true],
      ['Unlimited staff accounts', true],
      ['Unlimited tenant profiles', true],
      ['Wait list intelligence', true],
      ['Full support included', true],
    ] as [string, boolean][],
  },
  {
    label: '50+ SLIPS',
    price: '$499',
    per: '/mo',
    badge: 'BEST FOR LARGER MARINAS',
    color: NAVY,
    border: TEAL,
    features: [
      ['Everything in the 50-slip plan', true],
      ['Unlimited slips — no cap', true],
      ['Multi-dock management', true],
      ['Fuel dock module', true],
      ['Rack + trailer + PWC storage tracking', true],
      ['SMS via Skipper (Twilio)', true],
      ['QuickBooks sync', true],
      ['Custom Skipper training on your data', true],
      ['Multi-marina dashboard', true],
      ['Priority onboarding specialist', true],
      ['White-label tenant portal', true],
      ['SLA + priority support', true],
    ] as [string, boolean][],
  },
]

export default function Pricing() {
  return (
    <div style={{ minHeight:'100vh', background:'#070f1a', fontFamily:FONT, color:'#fff' }}>
      {/* Hero */}
      <div style={{ maxWidth:800, margin:'0 auto', padding:'80px 40px 48px', textAlign:'center' }}>
        <h1 style={{ fontSize:'clamp(36px,5vw,58px)', fontWeight:900, letterSpacing:'-2px', margin:'0 0 16px' }}>Dead simple pricing.</h1>
        <p style={{ fontSize:17, color:'rgba(255,255,255,0.55)', lineHeight:1.65, margin:'0 0 12px' }}>
          Two plans. Flat rate. Everything included.<br/>
          Zero transaction fees. Zero booking commissions. Zero surprises.
        </p>
        <p style={{ fontSize:15, color:TEAL, fontWeight:700, margin:0 }}>
          Marinas switching from Molo and Dockside save thousands every year.
        </p>
      </div>

      {/* No-fee banner */}
      <div style={{ maxWidth:900, margin:'0 auto 40px', padding:'0 40px' }}>
        <div style={{ background:`${TEAL}10`, border:`1px solid ${TEAL}25`, borderRadius:10, padding:'16px 24px', display:'flex', gap:16, alignItems:'center' }}>
          <span style={{ fontSize:20 }}>⚓</span>
          <div style={{ fontSize:14, color:'rgba(255,255,255,0.7)', lineHeight:1.6 }}>
            <strong style={{ color:TEAL }}>No transaction fees. Ever.</strong> Unlike Dockwa and other platforms, AyeAyeSkipper never takes a percentage of your bookings. Your transient revenue is 100% yours. <strong style={{ color:'#fff' }}>First month free on both plans.</strong>
          </div>
        </div>
      </div>

      {/* Tiers */}
      <div style={{ maxWidth:860, margin:'0 auto', padding:'0 40px 80px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:20, marginBottom:48 }}>
          {TIERS.map(tier => (
            <div key={tier.label} style={{ background:tier.color, border:`2px solid ${tier.border}`, borderRadius:16, padding:'32px', position:'relative', display:'flex', flexDirection:'column' }}>
              {tier.badge && (
                <div style={{ position:'absolute', top:-14, left:'50%', transform:'translateX(-50%)', background:TEAL, color:NAVY, padding:'5px 18px', borderRadius:20, fontSize:11, fontWeight:800, whiteSpace:'nowrap', letterSpacing:'0.5px' }}>{tier.badge}</div>
              )}
              <div style={{ fontSize:12, color:TEAL, fontWeight:700, letterSpacing:'1.5px', marginBottom:10 }}>{tier.label}</div>
              <div style={{ display:'flex', alignItems:'baseline', gap:4, marginBottom:4 }}>
                <span style={{ fontSize:56, fontWeight:900, letterSpacing:'-3px' }}>{tier.price}</span>
                <span style={{ color:'rgba(255,255,255,0.4)', fontSize:15 }}>{tier.per}</span>
              </div>
              <div style={{ fontSize:14, color:TEAL, fontWeight:700, marginBottom:4 }}>First month free</div>
              <div style={{ fontSize:13, color:'rgba(255,255,255,0.35)', marginBottom:24 }}>No contracts · Cancel anytime</div>
              <div style={{ borderTop:'1px solid rgba(255,255,255,0.08)', paddingTop:20, flex:1, marginBottom:24 }}>
                {tier.features.map(([f]) => (
                  <div key={f} style={{ display:'flex', gap:10, alignItems:'flex-start', marginBottom:12, fontSize:13.5, color:'rgba(255,255,255,0.8)' }}>
                    <span style={{ color:TEAL, flexShrink:0, marginTop:1 }}>✓</span>{f}
                  </div>
                ))}
              </div>
              <Link href="/join" style={{ display:'block', textAlign:'center', padding:'14px', background: tier.border === TEAL ? TEAL : 'rgba(255,255,255,0.07)', color: tier.border === TEAL ? NAVY : '#fff', border:'none', borderRadius:8, fontSize:15, fontWeight:700, cursor:'pointer', fontFamily:FONT, textDecoration:'none' }}>
                Get Started — First Month Free
              </Link>
            </div>
          ))}
        </div>

        {/* What every plan includes */}
        <div style={{ marginBottom:64 }}>
          <h2 style={{ fontSize:32, fontWeight:900, letterSpacing:'-1.5px', textAlign:'center', margin:'0 0 36px' }}>What every plan includes</h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:14 }}>
            {[
              ['🗺️','Your custom marina map','Built from your layout. Every slip, dock, mooring — exactly as it is.'],
              ['🔄','Free migration','Skipper Gangway™ moves your data from any system. Same day.'],
              ['🚀','Same-day onboarding','Live the same afternoon. No weeks of setup.'],
              ['👥','Unlimited staff','Everyone on your team — no per-seat charges.'],
              ['🌐','Unlimited tenants','100 or 1,000 tenant profiles — no extra cost.'],
              ['📱','Tenant portal','Every tenant gets mobile access. Included in all plans.'],
              ['🔒','Your data, always','Export your data anytime. You own it completely.'],
              ['🛟','Support included','We don\'t charge extra for help. It\'s part of the deal.'],
            ].map(([icon, title, desc]) => (
              <div key={title as string} style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:10, padding:'18px' }}>
                <div style={{ fontSize:22, marginBottom:8 }}>{icon}</div>
                <div style={{ fontWeight:700, fontSize:14, marginBottom:4 }}>{title as string}</div>
                <div style={{ fontSize:12, color:'rgba(255,255,255,0.45)', lineHeight:1.6 }}>{desc as string}</div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div style={{ maxWidth:700, margin:'0 auto' }}>
          <h2 style={{ fontSize:28, fontWeight:900, letterSpacing:'-1px', textAlign:'center', margin:'0 0 32px' }}>Pricing questions</h2>
          {[
            ['Are there any transaction fees?','Never. AyeAyeSkipper charges a flat monthly subscription only. We never take a percentage of your transient bookings, slip renewals, fuel sales, or any other revenue. Your income is 100% yours.'],
            ['What if my marina is right at 50 slips?','Go with whichever plan fits. If you\'re 48 slips but growing fast, we\'d suggest starting with 50+. If you\'re at exactly 50 and not expanding, the lower plan is right.'],
            ['Is there a setup fee?','No. We build your marina map, migrate your data, and onboard your team at no extra cost. It\'s part of the subscription.'],
            ['Can I cancel anytime?','Yes. Month-to-month on all plans. No cancellation fee. Your data is always exportable.'],
            ['What\'s included in Skipper Gangway™ migration?','We migrate tenant records, slip assignments, lease history, payment records, and boat specs from Dockmaster, Marina Controller, Dockwa, Molo, Dockside, and CSV/Excel. Usually done same day.'],
            ['Do you offer non-profit or municipal marina pricing?','Yes — contact us. We work with municipal harbors and non-profit sailing clubs at a reduced rate.'],
          ].map(([q, a]) => (
            <div key={q as string} style={{ borderBottom:'1px solid rgba(255,255,255,0.07)', padding:'20px 0' }}>
              <div style={{ fontWeight:700, fontSize:15, marginBottom:10, color:'#fff' }}>{q}</div>
              <div style={{ fontSize:14, color:'rgba(255,255,255,0.55)', lineHeight:1.75 }}>{a}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ textAlign:'center', padding:'80px 40px', borderTop:'1px solid rgba(255,255,255,0.07)' }}>
        <h2 style={{ fontSize:40, fontWeight:900, letterSpacing:'-1.5px', margin:'0 0 16px' }}>First month free.<br/>No commitment.</h2>
        <p style={{ color:'rgba(255,255,255,0.45)', fontSize:15, marginBottom:36 }}>We build your marina map before the demo. You see Skipper running your actual operation — then decide.</p>
        <Link href="/join" style={{ display:'inline-block', padding:'18px 48px', background:TEAL, color:NAVY, borderRadius:8, fontSize:16, fontWeight:800, textDecoration:'none', fontFamily:FONT }}>Get Started Free →</Link>
      </div>
    </div>
  )
}

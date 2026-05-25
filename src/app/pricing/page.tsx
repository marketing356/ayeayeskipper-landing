import type { Metadata } from 'next'
import Link from 'next/link'
export const metadata: Metadata = { title: "Pricing", description: "Simple, honest pricing. One flat monthly fee. Zero transaction fees. No booking commissions. Everything included." }

const TEAL = '#4dd6c8', NAVY = '#0d2b4b', FONT = "system-ui,-apple-system,'Segoe UI',Roboto,sans-serif"

const tiers = [
  {
    name: 'First Mate', price: 99, slips: 'Up to 50 slips', desc: 'For small marinas and boatyards getting off spreadsheets.',
    color: 'rgba(255,255,255,0.03)', border: 'rgba(255,255,255,0.1)',
    features: [
      ['Skipper AI — unlimited conversations', true],
      ['Slip management + live marina map', true],
      ['Tenant profiles (unlimited tenants)', true],
      ['Transient bookings', true],
      ['Tenant portal + app', true],
      ['Contracts + e-sign', true],
      ['Wait list management', true],
      ['Email notifications', true],
      ['Hot Slip™', false],
      ['Fuel dock module', false],
      ['Storage tracking', false],
      ['The Briefing Room', false],
      ['SMS via Skipper', false],
      ['Skipper Gangway™ migration', false],
    ]
  },
  {
    name: 'Captain', price: 249, slips: 'Up to 150 slips', desc: 'For established marinas that want to run a serious operation.', popular: true,
    color: NAVY, border: TEAL,
    features: [
      ['Skipper AI — unlimited conversations', true],
      ['Slip management + live marina map', true],
      ['Tenant profiles (unlimited tenants)', true],
      ['Transient bookings', true],
      ['Tenant portal + app', true],
      ['Contracts + e-sign', true],
      ['Wait list management', true],
      ['Email notifications', true],
      ['Hot Slip™ — tenants earn when away', true],
      ['Fuel dock module', true],
      ['Storage tracking (rack, trailer, PWC)', true],
      ['The Briefing Room — daily operations brief', true],
      ['SMS via Skipper (Twilio)', true],
      ['Skipper Gangway™ migration — included', true],
    ]
  },
  {
    name: 'Commodore', price: null, slips: 'Unlimited slips', desc: 'For large marinas, multi-location operations, and resort properties.',
    color: 'rgba(255,255,255,0.03)', border: 'rgba(255,255,255,0.1)',
    features: [
      ['Everything in Captain', true],
      ['Multi-marina dashboard', true],
      ['Custom Skipper training on your data', true],
      ['QuickBooks / accounting integration', true],
      ['Dedicated onboarding specialist', true],
      ['Custom API integrations', true],
      ['SLA guarantee', true],
      ['Priority phone support', true],
      ['Custom Skipper Gangway™ migration', true],
      ['White-label tenant portal', true],
      ['Custom reporting', true],
      ['Enterprise billing', true],
    ]
  }
]

export default function Pricing() {
  return (
    <div style={{ minHeight:'100vh', background:'#070f1a', fontFamily:FONT, color:'#fff' }}>
      {/* Hero */}
      <div style={{ maxWidth:800, margin:'0 auto', padding:'80px 40px 48px', textAlign:'center' }}>
        <h1 style={{ fontSize:'clamp(36px,5vw,58px)', fontWeight:900, letterSpacing:'-2px', margin:'0 0 16px' }}>Simple, honest pricing.</h1>
        <p style={{ fontSize:17, color:'rgba(255,255,255,0.55)', lineHeight:1.65, margin:0 }}>
          One flat monthly fee. Zero transaction fees. Zero booking commissions. Zero surprises.<br/>Everything Skipper does is included in your plan.
        </p>
      </div>

      {/* Reminder banner */}
      <div style={{ maxWidth:900, margin:'0 auto 48px', padding:'0 40px' }}>
        <div style={{ background:`${TEAL}10`, border:`1px solid ${TEAL}25`, borderRadius:10, padding:'16px 24px', display:'flex', gap:16, alignItems:'center' }}>
          <span style={{ fontSize:20 }}>⚓</span>
          <div style={{ fontSize:14, color:'rgba(255,255,255,0.7)', lineHeight:1.6 }}>
            <strong style={{ color:TEAL }}>No transaction fees. Ever.</strong> Unlike Dockwa and other platforms, AyeAyeSkipper never takes a percentage of your bookings. Your transient revenue is 100% yours.
          </div>
        </div>
      </div>

      {/* Tiers */}
      <div style={{ maxWidth:1060, margin:'0 auto', padding:'0 40px 80px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20, marginBottom:48 }}>
          {tiers.map(tier => (
            <div key={tier.name} style={{ background:tier.color, border:`2px solid ${tier.border}`, borderRadius:16, padding:'32px', position:'relative', display:'flex', flexDirection:'column' }}>
              {tier.popular && <div style={{ position:'absolute', top:-14, left:'50%', transform:'translateX(-50%)', background:TEAL, color:NAVY, padding:'5px 18px', borderRadius:20, fontSize:11, fontWeight:800, whiteSpace:'nowrap', letterSpacing:'0.5px' }}>MOST POPULAR</div>}
              <div style={{ marginBottom:24 }}>
                <div style={{ fontSize:13, color:TEAL, fontWeight:700, marginBottom:8 }}>{tier.name}</div>
                <div style={{ display:'flex', alignItems:'baseline', gap:4, marginBottom:8 }}>
                  {tier.price ? (
                    <><span style={{ fontSize:52, fontWeight:900, letterSpacing:'-3px' }}>${tier.price}</span><span style={{ color:'rgba(255,255,255,0.4)', fontSize:15 }}>/mo</span></>
                  ) : (
                    <span style={{ fontSize:40, fontWeight:900, letterSpacing:'-2px' }}>Custom</span>
                  )}
                </div>
                <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', marginBottom:10 }}>{tier.slips}</div>
                <div style={{ fontSize:13, color:'rgba(255,255,255,0.55)', lineHeight:1.6 }}>{tier.desc}</div>
              </div>
              <div style={{ borderTop:'1px solid rgba(255,255,255,0.08)', paddingTop:20, flex:1, marginBottom:24 }}>
                {tier.features.map(([f, included]) => (
                  <div key={f as string} style={{ display:'flex', gap:10, alignItems:'flex-start', marginBottom:11, fontSize:13, color: included ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.25)' }}>
                    <span style={{ color: included ? TEAL : 'rgba(255,255,255,0.2)', flexShrink:0, fontSize:12, marginTop:1 }}>{included ? '✓' : '—'}</span>
                    {f as string}
                  </div>
                ))}
              </div>
              <Link href="/demo" style={{ display:'block', textAlign:'center', padding:'13px', background: tier.popular ? TEAL : 'rgba(255,255,255,0.07)', color: tier.popular ? NAVY : '#fff', border:'none', borderRadius:8, fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:FONT, textDecoration:'none' }}>
                {tier.price ? 'Get Started' : 'Contact Us'}
              </Link>
            </div>
          ))}
        </div>

        {/* Annual note */}
        <div style={{ textAlign:'center', marginBottom:64 }}>
          <div style={{ display:'inline-block', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:10, padding:'12px 24px', fontSize:13, color:'rgba(255,255,255,0.5)' }}>
            💡 Annual plans available — save 2 months. Ask us during demo.
          </div>
        </div>

        {/* What's included */}
        <div style={{ marginBottom:64 }}>
          <h2 style={{ fontSize:32, fontWeight:900, letterSpacing:'-1.5px', textAlign:'center', margin:'0 0 36px' }}>What every plan includes</h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:14 }}>
            {[
              ['🗺️','Your custom marina map','Built from your layout. Every slip, dock, mooring.'],
              ['🔄','Free migration','We move your data from any system. Skipper Gangway™.'],
              ['🚀','Same-day onboarding','Live the same afternoon. No weeks of setup.'],
              ['👥','Unlimited staff','Everyone on your team, no per-seat charges.'],
              ['🌐','Unlimited tenants','100 or 1,000 tenant profiles — no extra cost.'],
              ['📱','Tenant portal','Every tenant gets the app. Included in all plans.'],
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
            ['What if I need more slips than my plan allows?','Just move up a tier — or contact us, we\'ll work something out. We don\'t nickel and dime on slip count overages.'],
            ['Is there a setup fee?','No. We build your marina map, migrate your data, and onboard your team at no extra cost. It\'s part of the subscription.'],
            ['Can I cancel anytime?','Yes. Month-to-month on all plans. No cancellation fee. Your data is always exportable.'],
            ['What\'s included in Skipper Gangway™ migration?','We migrate tenant records, slip assignments, lease history, payment records, and boat specs from Dockmaster, Marina Controller, Dockwa, and CSV/Excel. Usually done same day.'],
            ['Do you offer non-profit or municipal marina pricing?','Yes — contact us. We work with municipal harbors and non-profit sailing clubs at a reduced rate.'],
          ].map(([q, a]) => (
            <div key={q as string} style={{ borderBottom:'1px solid rgba(255,255,255,0.07)', padding:'20px 0' }}>
              <div style={{ fontWeight:700, fontSize:15, marginBottom:10, color:'#fff' }}>{q}</div>
              <div style={{ fontSize:14, color:'rgba(255,255,255,0.55)', lineHeight:1.75 }}>{a}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

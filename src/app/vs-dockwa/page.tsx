import type { Metadata } from 'next'
import Link from 'next/link'
export const metadata: Metadata = { title: "AyeAyeSkipper vs. Dockwa", description: "Why marina owners are leaving Dockwa for AyeAyeSkipper. Zero transaction fees, you own the customer, your money goes directly to you." }

const TEAL = '#4dd6c8', NAVY = '#0d2b4b', FONT = "system-ui,-apple-system,'Segoe UI',Roboto,sans-serif"

export default function VsDockwa() {
  return (
    <div style={{ minHeight:'100vh', background:'#070f1a', fontFamily:FONT, color:'#fff' }}>
      {/* Hero */}
      <div style={{ maxWidth:900, margin:'0 auto', padding:'80px 40px 60px', textAlign:'center' }}>
        <div style={{ display:'inline-flex', gap:8, alignItems:'center', background:'rgba(255,80,80,0.08)', border:'1px solid rgba(255,80,80,0.2)', borderRadius:24, padding:'6px 16px', marginBottom:24 }}>
          <span style={{ fontSize:12, color:'rgba(255,140,140,1)', fontWeight:700, letterSpacing:'1px' }}>THE HONEST COMPARISON</span>
        </div>
        <h1 style={{ fontSize:'clamp(36px,6vw,68px)', fontWeight:900, letterSpacing:'-2.5px', lineHeight:1.05, margin:'0 0 24px' }}>
          AyeAyeSkipper<br/>vs. <span style={{ color:'rgba(255,255,255,0.3)' }}>Dockwa</span>
        </h1>
        <p style={{ fontSize:18, color:'rgba(255,255,255,0.6)', maxWidth:580, margin:'0 auto', lineHeight:1.65 }}>
          Dockwa built a great booking tool. They also built a business model that takes a cut of everything you earn. We didn't.
        </p>
      </div>

      {/* The core issue */}
      <div style={{ maxWidth:860, margin:'0 auto', padding:'0 40px 80px' }}>
        <div style={{ background:'rgba(255,80,80,0.06)', border:'1px solid rgba(255,80,80,0.15)', borderRadius:16, padding:'36px 40px', marginBottom:48 }}>
          <div style={{ fontSize:13, color:'rgba(255,140,140,0.9)', fontWeight:700, textTransform:'uppercase', letterSpacing:'1px', marginBottom:16 }}>The Dockwa Business Model</div>
          <p style={{ fontSize:16, color:'rgba(255,255,255,0.75)', lineHeight:1.8, margin:0 }}>
            Dockwa charges marinas a platform fee on every transient booking made through their system. They also become the intermediary between you and your customer — <strong style={{ color:'#fff' }}>boaters build a relationship with Dockwa, not with your marina.</strong> When a boater books a slip, they're booking "on Dockwa." Your marina is just an inventory listing on someone else's platform. If Dockwa raises fees tomorrow, you have no leverage. Your customers are theirs.
          </p>
        </div>

        {/* Comparison table */}
        <div style={{ borderRadius:16, overflow:'hidden', border:'1px solid rgba(255,255,255,0.08)', marginBottom:60 }}>
          <div style={{ display:'grid', gridTemplateColumns:'1.2fr 1fr 1fr' }}>
            <div style={{ background:'rgba(255,255,255,0.03)', padding:'16px 20px', fontSize:12, color:'rgba(255,255,255,0.3)', fontWeight:700, textTransform:'uppercase', letterSpacing:'1px' }}>The Question</div>
            <div style={{ background:'rgba(255,80,80,0.08)', padding:'16px 20px', fontSize:12, color:'rgba(255,140,140,0.9)', fontWeight:700, textTransform:'uppercase', letterSpacing:'1px', textAlign:'center' }}>Dockwa</div>
            <div style={{ background:`${TEAL}12`, padding:'16px 20px', fontSize:12, color:TEAL, fontWeight:700, textTransform:'uppercase', letterSpacing:'1px', textAlign:'center' }}>AyeAyeSkipper</div>
          </div>
          {[
            ['Who owns the customer relationship?','Dockwa does','You do. Always.'],
            ['Transaction fees on bookings?','Yes — % of every booking','$0. Zero. Never.'],
            ['Where does the money go?','Through Dockwa first','Directly to your bank'],
            ['What if Dockwa raises fees?','You\'re stuck','Irrelevant — we charge a flat subscription'],
            ['Do boaters book "on your marina"?','No — they book on Dockwa','Yes — your brand, your relationship'],
            ['Can boaters contact you directly?','Filtered through Dockwa messaging','Direct. Always.'],
            ['Does the platform know your full operation?','Booking only','Entire marina: slips, tenants, fuel, storage, contracts, waitlist'],
            ['Can Skipper run your whole marina?','No — Dockwa is booking only','Yes — full marina OS'],
            ['Staff training required?','Yes — new software to learn','No — just talk to Skipper'],
            ['Can you migrate away easily?','Painful — they hold your data','Skipper Gangway™ — we migrate you in, not trap you'],
            ['What do boaters get?','Booking confirmation','Marine expert in their pocket, free, forever'],
            ['Annual contracts?','Often yes','Never. Month to month.'],
          ].map(([q, bad, good], i) => (
            <div key={i} style={{ display:'grid', gridTemplateColumns:'1.2fr 1fr 1fr', borderTop:'1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ background:'rgba(255,255,255,0.02)', padding:'16px 20px', fontSize:13, color:'rgba(255,255,255,0.7)', display:'flex', alignItems:'center' }}>{q}</div>
              <div style={{ background:'rgba(255,60,60,0.04)', padding:'16px 20px', fontSize:13, color:'rgba(255,160,160,0.8)', display:'flex', alignItems:'center', justifyContent:'center', textAlign:'center', gap:8, borderLeft:'1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ color:'rgba(255,80,80,0.7)', flexShrink:0 }}>✕</span>{bad}
              </div>
              <div style={{ background:`${TEAL}06`, padding:'16px 20px', fontSize:13, color:'rgba(255,255,255,0.85)', display:'flex', alignItems:'center', justifyContent:'center', textAlign:'center', gap:8, borderLeft:'1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ color:TEAL, flexShrink:0 }}>✓</span>{good}
              </div>
            </div>
          ))}
        </div>

        {/* The real math */}
        <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding:'40px', marginBottom:60 }}>
          <h2 style={{ fontSize:28, fontWeight:900, letterSpacing:'-1px', margin:'0 0 20px' }}>What Dockwa actually costs you</h2>
          <p style={{ fontSize:14, color:'rgba(255,255,255,0.55)', marginBottom:28, lineHeight:1.7 }}>Let's run the math for a marina doing $120,000/year in transient bookings:</p>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:28 }}>
            <div style={{ background:'rgba(255,80,80,0.08)', border:'1px solid rgba(255,80,80,0.15)', borderRadius:12, padding:'24px' }}>
              <div style={{ fontSize:13, color:'rgba(255,140,140,0.8)', fontWeight:700, textTransform:'uppercase', letterSpacing:'1px', marginBottom:12 }}>Dockwa</div>
              <div style={{ fontSize:13, color:'rgba(255,255,255,0.6)', lineHeight:2 }}>
                Platform fee (est. 3-5%): <strong style={{ color:'rgba(255,140,140,1)' }}>–$4,800/yr</strong><br/>
                Annual subscription: <strong style={{ color:'rgba(255,140,140,1)' }}>–$2,400/yr</strong><br/>
                Lost customer data: <strong style={{ color:'rgba(255,140,140,1)' }}>priceless</strong><br/>
                <span style={{ display:'block', marginTop:12, fontSize:15, color:'rgba(255,120,120,1)', fontWeight:700 }}>Total cost: $7,200+ per year</span>
                <span style={{ fontSize:11, color:'rgba(255,255,255,0.3)' }}>Plus the compounding cost of boaters knowing Dockwa, not you</span>
              </div>
            </div>
            <div style={{ background:`${TEAL}10`, border:`1px solid ${TEAL}25`, borderRadius:12, padding:'24px' }}>
              <div style={{ fontSize:13, color:TEAL, fontWeight:700, textTransform:'uppercase', letterSpacing:'1px', marginBottom:12 }}>AyeAyeSkipper</div>
              <div style={{ fontSize:13, color:'rgba(255,255,255,0.6)', lineHeight:2 }}>
                Transaction fees: <strong style={{ color:TEAL }}>$0</strong><br/>
                Captain plan: <strong style={{ color:TEAL }}>$2,988/yr</strong><br/>
                Customer data: <strong style={{ color:TEAL }}>yours forever</strong><br/>
                <span style={{ display:'block', marginTop:12, fontSize:15, color:TEAL, fontWeight:700 }}>Total cost: $2,988/yr</span>
                <span style={{ fontSize:11, color:'rgba(255,255,255,0.3)' }}>Plus boaters who know and trust YOUR marina brand</span>
              </div>
            </div>
          </div>
          <div style={{ textAlign:'center', padding:'20px', background:'rgba(77,214,200,0.06)', borderRadius:10 }}>
            <span style={{ fontSize:24, fontWeight:900, color:TEAL }}>You keep an extra $4,200+ every year</span>
            <span style={{ fontSize:14, color:'rgba(255,255,255,0.5)', display:'block', marginTop:6 }}>And your customers actually know who you are.</span>
          </div>
        </div>

        {/* What Dockwa doesn't do */}
        <div style={{ marginBottom:60 }}>
          <h2 style={{ fontSize:28, fontWeight:900, letterSpacing:'-1px', margin:'0 0 24px' }}>Dockwa is a booking tool. AyeAyeSkipper is your entire marina.</h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:14 }}>
            {[
              '🚫 Dockwa doesn\'t manage your slip tenants',
              '🚫 Dockwa doesn\'t track fuel inventory',
              '🚫 Dockwa doesn\'t run your waitlist',
              '🚫 Dockwa doesn\'t manage storage',
              '🚫 Dockwa doesn\'t send lease contracts',
              '🚫 Dockwa doesn\'t know your pedestal map',
              '🚫 Dockwa doesn\'t track work orders',
              '🚫 Dockwa doesn\'t brief you every morning',
              '🚫 Dockwa doesn\'t learn your marina',
              '🚫 Dockwa doesn\'t have Hot Slip™ for annual tenants',
              '🚫 Dockwa doesn\'t give your tenants a marina expert',
              '🚫 Dockwa doesn\'t migrate you to something better',
            ].map((item, i) => (
              <div key={i} style={{ background:'rgba(255,80,80,0.04)', border:'1px solid rgba(255,80,80,0.1)', borderRadius:8, padding:'12px 16px', fontSize:13, color:'rgba(255,255,255,0.6)' }}>{item}</div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign:'center', background:`${TEAL}08`, border:`1px solid ${TEAL}20`, borderRadius:16, padding:'60px 40px' }}>
          <h2 style={{ fontSize:36, fontWeight:900, letterSpacing:'-1.5px', margin:'0 0 16px' }}>Ready to stop paying Dockwa?</h2>
          <p style={{ fontSize:15, color:'rgba(255,255,255,0.55)', marginBottom:36, maxWidth:480, margin:'0 auto 36px' }}>We migrate everything from Dockwa in one day. Skipper Gangway™ handles it automatically. You don't lose a single reservation or tenant record.</p>
          <Link href="/demo" style={{ display:'inline-block', padding:'18px 44px', background:TEAL, color:NAVY, borderRadius:8, fontSize:16, fontWeight:800, textDecoration:'none', fontFamily:FONT }}>Switch to Skipper — Free Demo</Link>
          <p style={{ marginTop:16, fontSize:12, color:'rgba(255,255,255,0.25)' }}>No contracts. No setup fee. Your Dockwa data migrated free.</p>
        </div>
      </div>
    </div>
  )
}

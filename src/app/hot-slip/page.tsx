import type { Metadata } from 'next'
import Link from 'next/link'
export const metadata: Metadata = { title: "Hot Slip™ — Earn from your slip when you're away", description: "Hot Slip™ by AyeAyeSkipper lets annual tenants earn transient rental revenue when they're away. A first-of-its-kind feature in marina management." }

const TEAL = '#4dd6c8', NAVY = '#0d2b4b', FONT = "system-ui,-apple-system,'Segoe UI',Roboto,sans-serif"

export default function HotSlip() {
  return (
    <div style={{ minHeight:'100vh', background:'#070f1a', fontFamily:FONT, color:'#fff' }}>
      {/* Hero */}
      <div style={{ maxWidth:900, margin:'0 auto', padding:'80px 40px 60px', textAlign:'center' }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(255,140,0,0.1)', border:'1px solid rgba(255,140,0,0.25)', borderRadius:24, padding:'6px 16px', marginBottom:24 }}>
          <span style={{ fontSize:12, color:'rgba(255,180,60,1)', fontWeight:700, letterSpacing:'1px' }}>EXCLUSIVE — AYEAYESKIPPER ONLY</span>
        </div>
        <h1 style={{ fontSize:'clamp(40px,6vw,76px)', fontWeight:900, letterSpacing:'-3px', lineHeight:1.02, margin:'0 0 24px' }}>
          🔥 Hot Slip™
        </h1>
        <p style={{ fontSize:22, color:'rgba(255,255,255,0.7)', margin:'0 0 16px', fontWeight:600 }}>Your annual tenants earn money when they're away.</p>
        <p style={{ fontSize:17, color:'rgba(255,255,255,0.5)', maxWidth:580, margin:'0 auto', lineHeight:1.65 }}>
          An empty slip is lost revenue. Hot Slip™ fixes that — without you lifting a finger.
        </p>
      </div>

      {/* How it works */}
      <div style={{ maxWidth:900, margin:'0 auto', padding:'0 40px 80px' }}>
        <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding:'48px', marginBottom:60 }}>
          <h2 style={{ fontSize:28, fontWeight:900, letterSpacing:'-1px', margin:'0 0 36px', textAlign:'center' }}>How Hot Slip™ works</h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:24 }}>
            {[
              ['1','Tenant marks it hot','Tenant is heading out for a week. They text Skipper "activate Hot Slip" or tap the button in their portal. Done.'],
              ['2','Slip opens for transients','Skipper automatically makes the slip available in the transient booking system for the tenant\'s away dates.'],
              ['3','Transient books the slip','A visiting boater books the slip. Skipper handles check-in, the slip assignment, and the stay — zero staff involvement.'],
              ['4','Everyone gets paid','At checkout, the revenue is split per your marina\'s config (e.g. 60% tenant / 40% marina). Tenant earns while they\'re on the water.'],
            ].map(([num, title, desc]) => (
              <div key={num} style={{ textAlign:'center' }}>
                <div style={{ width:48, height:48, borderRadius:'50%', background:'rgba(255,140,0,0.15)', border:'2px solid rgba(255,140,0,0.3)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px', fontSize:18, fontWeight:900, color:'rgba(255,180,60,1)' }}>{num}</div>
                <div style={{ fontWeight:700, fontSize:15, marginBottom:8 }}>{title}</div>
                <div style={{ fontSize:13, color:'rgba(255,255,255,0.5)', lineHeight:1.65 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* The math */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24, marginBottom:60 }}>
          <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:14, padding:'32px' }}>
            <h3 style={{ fontSize:20, fontWeight:900, margin:'0 0 16px' }}>For the marina</h3>
            <p style={{ fontSize:14, color:'rgba(255,255,255,0.55)', lineHeight:1.75, marginBottom:20 }}>
              An annual tenant with a 40-foot slip pays you once a year. With Hot Slip™, that slip now earns additional transient income every time they're away — maybe 4–8 weeks a year. A 150-slip marina where 30% of tenants activate Hot Slip™ can generate tens of thousands in additional annual revenue from inventory that was already sitting empty.
            </p>
            <div style={{ background:'rgba(77,214,200,0.06)', border:`1px solid rgba(77,214,200,0.15)`, borderRadius:10, padding:'16px 18px' }}>
              <div style={{ fontSize:13, color:TEAL, fontWeight:700, marginBottom:6 }}>Example math</div>
              <div style={{ fontSize:13, color:'rgba(255,255,255,0.6)', lineHeight:1.8 }}>
                45 Hot Slip™ tenants × 5 away weeks/yr × $120/night × 4 nights/week × 40% marina share<br/>
                <strong style={{ color:TEAL, fontSize:16 }}> = $43,200 additional annual revenue</strong>
              </div>
            </div>
          </div>
          <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:14, padding:'32px' }}>
            <h3 style={{ fontSize:20, fontWeight:900, margin:'0 0 16px' }}>For the tenant</h3>
            <p style={{ fontSize:14, color:'rgba(255,255,255,0.55)', lineHeight:1.75, marginBottom:20 }}>
              Annual slip fees are significant. Hot Slip™ gives tenants a way to earn back part of what they pay — without any hassle. Their slip is managed by Skipper while they're gone. They get a notification when someone books it and a statement of earnings when they return. Their slip is always waiting for them when they come back.
            </p>
            <div style={{ background:'rgba(255,140,0,0.06)', border:'1px solid rgba(255,140,0,0.15)', borderRadius:10, padding:'16px 18px' }}>
              <div style={{ fontSize:13, color:'rgba(255,180,60,1)', fontWeight:700, marginBottom:6 }}>Example earnings</div>
              <div style={{ fontSize:13, color:'rgba(255,255,255,0.6)', lineHeight:1.8 }}>
                5 away weeks × $120/night × 4 nights/week × 60% tenant share<br/>
                <strong style={{ color:'rgba(255,180,60,1)', fontSize:16 }}> = $1,440 back in their pocket</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Objection handling */}
        <div style={{ marginBottom:60 }}>
          <h2 style={{ fontSize:28, fontWeight:900, letterSpacing:'-1px', margin:'0 0 28px' }}>Questions we get about Hot Slip™</h2>
          {[
            ['What if the tenant returns early?','Skipper flags the booking conflict and handles it. New transient bookings respect the tenant\'s return date window — no doubles, no surprises.'],
            ['What if a transient damages the slip?','Standard marina liability policy applies. The slip is managed by the marina — not by the tenant — during the Hot Slip™ period. Your insurance coverage is unchanged.'],
            ['Can tenants opt out?','Of course. Hot Slip™ is always optional. A tenant activates it only when they choose to. Marina operators can also restrict it by dock row or slip type.'],
            ['How is the revenue split configured?','You set the split for your marina — 60/40, 70/30, 80/20, whatever makes sense. Different rates can be set for different slip types if you want.'],
            ['Does Skipper handle the transient check-in?','Yes. Skipper assigns the slip, manages the stay, and collects the rate. Staff doesn\'t need to know who\'s in a Hot Slip™ vs. a regular transient slot.'],
          ].map(([q, a]) => (
            <div key={q as string} style={{ borderBottom:'1px solid rgba(255,255,255,0.07)', padding:'20px 0' }}>
              <div style={{ fontWeight:700, fontSize:15, marginBottom:10 }}>{q}</div>
              <div style={{ fontSize:14, color:'rgba(255,255,255,0.55)', lineHeight:1.75 }}>{a}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign:'center', background:'rgba(255,140,0,0.06)', border:'1px solid rgba(255,140,0,0.15)', borderRadius:16, padding:'60px 40px' }}>
          <div style={{ fontSize:40, marginBottom:16 }}>🔥</div>
          <h2 style={{ fontSize:32, fontWeight:900, letterSpacing:'-1.5px', margin:'0 0 14px' }}>Hot Slip™ is included in the Captain plan.</h2>
          <p style={{ fontSize:15, color:'rgba(255,255,255,0.5)', marginBottom:32, maxWidth:460, margin:'0 auto 32px' }}>Available on Captain ($249/mo) and Commodore plans. See it live in your marina during the demo.</p>
          <Link href="/join" style={{ display:'inline-block', padding:'18px 44px', background:TEAL, color:NAVY, borderRadius:8, fontSize:16, fontWeight:800, textDecoration:'none', fontFamily:FONT }}>See Hot Slip™ in Action</Link>
        </div>
      </div>
    </div>
  )
}

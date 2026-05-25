import type { Metadata } from 'next'
import Link from 'next/link'
export const metadata: Metadata = { title: "About", description: "Why we built AyeAyeSkipper — the marina OS built around AI. The story of Slip Logic™, Hot Slip™, and why marina operators deserve better software." }

const TEAL = '#4dd6c8', NAVY = '#0d2b4b', FONT = "system-ui,-apple-system,'Segoe UI',Roboto,sans-serif"

export default function About() {
  return (
    <div style={{ minHeight:'100vh', background:'#070f1a', fontFamily:FONT, color:'#fff' }}>

      {/* Hero */}
      <div style={{ maxWidth:820, margin:'0 auto', padding:'80px 40px 60px' }}>
        <div style={{ fontSize:12, color:TEAL, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', marginBottom:16 }}>Our Story</div>
        <h1 style={{ fontSize:'clamp(36px,5vw,62px)', fontWeight:900, letterSpacing:'-2.5px', margin:'0 0 28px', lineHeight:1.05 }}>Marina operators deserve better than what they've been sold.</h1>
        <p style={{ fontSize:18, color:'rgba(255,255,255,0.65)', lineHeight:1.75, marginBottom:20 }}>
          For decades, marina software has been designed around the software company's needs — not the marina operator's. Complicated interfaces. Annual contracts. Seat fees. Booking commissions. Platforms that own your customer relationship and charge you for the privilege.
        </p>
        <p style={{ fontSize:18, color:'rgba(255,255,255,0.65)', lineHeight:1.75 }}>
          We built AyeAyeSkipper because we believe the person who built the marina, maintains the docks, and knows every tenant by name should be running a modern operation — not fighting software that was designed for someone else.
        </p>
      </div>

      {/* The philosophy */}
      <div style={{ background:'rgba(255,255,255,0.02)', borderTop:'1px solid rgba(255,255,255,0.07)', borderBottom:'1px solid rgba(255,255,255,0.07)', padding:'72px 40px' }}>
        <div style={{ maxWidth:960, margin:'0 auto' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:60 }}>
            <div>
              <h2 style={{ fontSize:32, fontWeight:900, letterSpacing:'-1.5px', margin:'0 0 20px' }}>The marina owns everything. We run the operation.</h2>
              <p style={{ fontSize:15, color:'rgba(255,255,255,0.6)', lineHeight:1.8, margin:0 }}>
                Skipper is not a marketplace. We don't take a cut of your bookings. We don't own your customer relationship. We don't hold your data hostage. We're not Dockwa. We're an operating system — like the software that runs a hospital or a hotel — that happens to be built specifically for marinas. You pay a flat subscription. We run your marina. Your money, your customers, your brand.
              </p>
            </div>
            <div>
              <h2 style={{ fontSize:32, fontWeight:900, letterSpacing:'-1.5px', margin:'0 0 20px' }}>AI that actually knows your marina.</h2>
              <p style={{ fontSize:15, color:'rgba(255,255,255,0.6)', lineHeight:1.8, margin:0 }}>
                We never call Skipper "AI." Not because we're embarrassed by it — because the word undersells it. Skipper isn't a chatbot. It's an expert that knows your specific marina. Your slips. Your tenants. Your rates. Your history. Ask Skipper anything about your operation and it answers like someone who's been working your docks for ten years.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* The technology */}
      <div style={{ maxWidth:860, margin:'0 auto', padding:'72px 40px' }}>
        <h2 style={{ fontSize:36, fontWeight:900, letterSpacing:'-1.5px', margin:'0 0 40px' }}>The technology behind the platform.</h2>
        <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
          {[
            {
              name: 'Slip Logic™',
              desc: 'The core engine. Slip Logic™ maps every slip in your marina, tracks occupancy and payment status in real time, and powers the color-coded map that shows your entire operation at a glance. It\'s the reason Skipper can tell you instantly who\'s overdue, who\'s expiring, and which slips are available. No other marina platform has this.',
            },
            {
              name: 'Hot Slip™',
              desc: 'A revenue innovation that didn\'t exist before we built it. Annual tenants mark their slip available when they\'re away. The slip is automatically listed for transients. Revenue is split between tenant and marina. When the tenant returns, their slip is waiting. Everyone earns more from the same infrastructure.',
            },
            {
              name: 'Skipper Gangway™',
              desc: 'Custom adaptation models that migrate any marina platform to AyeAyeSkipper. Whether you\'re on Dockmaster, Dockwa, Marina Controller, or a spreadsheet that\'s been growing since 1997 — Skipper Gangway reads it, maps it, validates it, and imports it. You don\'t start from zero. You start from exactly where you are.',
            },
            {
              name: 'Mooring Logic™',
              desc: 'For marinas with mooring fields — a specialty that most marina software handles as an afterthought. Mooring Logic™ maps every ball in the field, tracks chain specs, swing radius, last inspection, assigned vessel, and leases. Skipper Hail™ lets boaters request a launch via text — no radio chatter, no hold music.',
            },
          ].map((t, i) => (
            <div key={t.name} style={{ padding:'36px 0', borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.07)' : 'none', display:'grid', gridTemplateColumns:'200px 1fr', gap:40, alignItems:'start' }}>
              <div>
                <div style={{ fontSize:18, fontWeight:900, color:TEAL, letterSpacing:'-0.5px' }}>{t.name}</div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', fontWeight:700, textTransform:'uppercase', letterSpacing:'1.5px', marginTop:4 }}>Proprietary</div>
              </div>
              <p style={{ fontSize:15, color:'rgba(255,255,255,0.6)', lineHeight:1.8, margin:0 }}>{t.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* The company */}
      <div style={{ background:'rgba(255,255,255,0.02)', borderTop:'1px solid rgba(255,255,255,0.07)', padding:'72px 40px' }}>
        <div style={{ maxWidth:860, margin:'0 auto' }}>
          <h2 style={{ fontSize:36, fontWeight:900, letterSpacing:'-1.5px', margin:'0 0 28px' }}>Built by people who care about the water.</h2>
          <p style={{ fontSize:16, color:'rgba(255,255,255,0.6)', lineHeight:1.8, marginBottom:20 }}>
            AyeAyeSkipper is a product of <strong style={{ color:'#fff' }}>Next-Gen Marine</strong>, a company built around the belief that the marine industry deserves modern technology. We're not a Silicon Valley startup parachuting into marina management. We come from the boating world — we know what a pile slip is, we know what "stand by on 16" means, and we know why the channel depth matters more than the font on the app.
          </p>
          <p style={{ fontSize:16, color:'rgba(255,255,255,0.6)', lineHeight:1.8, marginBottom:36 }}>
            We operate under <strong style={{ color:'#fff' }}>Mariner and Sailor LLC</strong>, a marine-focused entity that also includes charter booking (MarinerAndSailor.com), dock manufacturing (ExpressDocks.com), and custom aluminum boat building (RIBITBoats.com). The marine industry is our industry. AyeAyeSkipper is our operating system for it.
          </p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
            {[
              ['⚓','AyeAyeSkipper','Marina OS + Skipper AI'],
              ['🚤','MarinerAndSailor.com','Charter booking platform'],
              ['🛥️','RIBITBoats.com','Custom aluminum RIBs'],
            ].map(([icon, name, desc]) => (
              <div key={name as string} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:10, padding:'18px' }}>
                <div style={{ fontSize:24, marginBottom:8 }}>{icon}</div>
                <div style={{ fontWeight:700, fontSize:14, marginBottom:4 }}>{name as string}</div>
                <div style={{ fontSize:12, color:'rgba(255,255,255,0.45)' }}>{desc as string}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ textAlign:'center', padding:'80px 40px' }}>
        <h2 style={{ fontSize:40, fontWeight:900, letterSpacing:'-2px', margin:'0 0 16px' }}>Ready to run on Skipper?</h2>
        <p style={{ color:'rgba(255,255,255,0.45)', fontSize:15, marginBottom:36 }}>We'll build your marina and have Skipper ready before we even get on the phone.</p>
        <Link href="/demo" style={{ display:'inline-block', padding:'18px 48px', background:TEAL, color:NAVY, borderRadius:8, fontSize:16, fontWeight:800, textDecoration:'none', fontFamily:FONT }}>Book a Free Demo</Link>
      </div>
    </div>
  )
}

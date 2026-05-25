import type { Metadata } from 'next'
import Link from 'next/link'
export const metadata: Metadata = { title: "Skipper Gangway™ — Migrate from any marina software", description: "Skipper Gangway™ migrates your marina from Dockmaster, Dockwa, Marina Controller, or spreadsheets to AyeAyeSkipper. Same day. Zero data loss." }

const TEAL = '#4dd6c8', NAVY = '#0d2b4b', FONT = "system-ui,-apple-system,'Segoe UI',Roboto,sans-serif"

export default function SkipperGangway() {
  return (
    <div style={{ minHeight:'100vh', background:'#070f1a', fontFamily:FONT, color:'#fff' }}>
      {/* Hero */}
      <div style={{ maxWidth:900, margin:'0 auto', padding:'80px 40px 60px', textAlign:'center' }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:`${TEAL}10`, border:`1px solid ${TEAL}25`, borderRadius:24, padding:'6px 16px', marginBottom:24 }}>
          <span style={{ fontSize:12, color:TEAL, fontWeight:700, letterSpacing:'1px' }}>INCLUDED IN ALL CAPTAIN + COMMODORE PLANS</span>
        </div>
        <h1 style={{ fontSize:'clamp(38px,6vw,72px)', fontWeight:900, letterSpacing:'-3px', lineHeight:1.02, margin:'0 0 20px' }}>Skipper Gangway™</h1>
        <p style={{ fontSize:22, color:'rgba(255,255,255,0.65)', maxWidth:620, margin:'0 auto 16px', fontWeight:600 }}>Whatever you're running today — we migrate it.</p>
        <p style={{ fontSize:16, color:'rgba(255,255,255,0.45)', maxWidth:560, margin:'0 auto', lineHeight:1.65 }}>
          Switching marina software has always been painful. Skipper Gangway™ makes it a non-event. We handle the migration. You're live the same day.
        </p>
      </div>

      {/* Supported platforms */}
      <div style={{ background:'rgba(255,255,255,0.02)', borderTop:'1px solid rgba(255,255,255,0.07)', borderBottom:'1px solid rgba(255,255,255,0.07)', padding:'60px 40px' }}>
        <div style={{ maxWidth:900, margin:'0 auto' }}>
          <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', fontWeight:700, textTransform:'uppercase', letterSpacing:'1.5px', textAlign:'center', marginBottom:36 }}>Platforms we migrate from</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:14 }}>
            {[
              ['🔧','Dockmaster','Automated migration'],
              ['🔧','Marina Controller','Automated migration'],
              ['🔧','Dockwa','Full export import'],
              ['🔧','Harbour Assist','Automated migration'],
              ['🔧','Swell','Automated migration'],
              ['📊','Excel / CSV','AI-powered column mapping'],
              ['📄','Google Sheets','AI-powered column mapping'],
              ['📁','Any format','Custom Gangway build'],
            ].map(([icon, name, note]) => (
              <div key={name as string} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:10, padding:'18px 16px', textAlign:'center' }}>
                <div style={{ fontSize:24, marginBottom:8 }}>{icon}</div>
                <div style={{ fontWeight:700, fontSize:14, marginBottom:4 }}>{name as string}</div>
                <div style={{ fontSize:11, color:TEAL, fontWeight:600 }}>{note as string}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* What migrates */}
      <div style={{ maxWidth:900, margin:'0 auto', padding:'72px 40px' }}>
        <h2 style={{ fontSize:32, fontWeight:900, letterSpacing:'-1.5px', margin:'0 0 36px' }}>What Skipper Gangway™ migrates</h2>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:60 }}>
          {[
            ['👤','Tenant records','Name, contact info, emergency contact, boat details, insurance, documents on file — all migrated exactly'],
            ['⚓','Slip assignments','Who\'s in which slip, since when, at what rate — mapped to your actual marina layout'],
            ['📋','Lease history','Historical and current leases, start/end dates, rate changes over time'],
            ['💳','Payment history','What\'s been paid, what\'s outstanding, payment method preferences'],
            ['🛥️','Boat specifications','Vessel names, LOA, beam, draft, type — matched to tenants automatically'],
            ['📅','Reservation history','Transient booking records, recurring visitors, booking patterns'],
            ['📊','Rate structures','Your rate tables — nightly, weekly, seasonal, slip-type-specific'],
            ['📁','Documents','Signed contracts, insurance certs, photo IDs — attached to tenant records'],
          ].map(([icon, title, desc]) => (
            <div key={title as string} style={{ display:'flex', gap:14, padding:'18px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:10 }}>
              <span style={{ fontSize:24, flexShrink:0 }}>{icon}</span>
              <div>
                <div style={{ fontWeight:700, fontSize:14, marginBottom:4 }}>{title as string}</div>
                <div style={{ fontSize:12, color:'rgba(255,255,255,0.5)', lineHeight:1.65 }}>{desc as string}</div>
              </div>
            </div>
          ))}
        </div>

        {/* The process */}
        <h2 style={{ fontSize:28, fontWeight:900, letterSpacing:'-1px', margin:'0 0 28px' }}>How Skipper Gangway™ works</h2>
        <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
          {[
            ['Export your current system','Request a data export from your current platform (we\'ll tell you exactly what to ask for) or send us a spreadsheet. Any format works.'],
            ['Gangway maps your data','Skipper Gangway™ reads your data structure, maps every column and record to our schema, and flags any fields that need clarification.'],
            ['We validate before import','You get a summary: X tenants, Y slips, Z leases — matched and ready. Nothing goes live until you sign off.'],
            ['Import and go live','One click. Your marina is live in AyeAyeSkipper with all your data exactly where it should be. Same day.'],
          ].map(([title, desc], i) => (
            <div key={i} style={{ display:'flex', gap:24, padding:'28px 0', borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.07)' : 'none', alignItems:'flex-start' }}>
              <div style={{ width:36, height:36, borderRadius:'50%', background:`${TEAL}15`, border:`1px solid ${TEAL}30`, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, color:TEAL, fontSize:15, flexShrink:0 }}>{i+1}</div>
              <div>
                <div style={{ fontWeight:700, fontSize:17, marginBottom:6 }}>{title}</div>
                <div style={{ fontSize:14, color:'rgba(255,255,255,0.55)', lineHeight:1.7 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Guarantee */}
      <div style={{ background:`${TEAL}08`, border:`1px solid ${TEAL}20`, margin:'0 40px 80px', borderRadius:16, padding:'48px', maxWidth:820, marginLeft:'auto', marginRight:'auto' }}>
        <h2 style={{ fontSize:28, fontWeight:900, letterSpacing:'-1px', margin:'0 0 16px', textAlign:'center' }}>Zero data loss guarantee.</h2>
        <p style={{ fontSize:15, color:'rgba(255,255,255,0.6)', lineHeight:1.75, textAlign:'center', maxWidth:560, margin:'0 auto 32px' }}>
          We validate every record before we import a single byte. You review the migration summary and approve it. If something doesn't look right, we fix it before going live. No marina has ever lost data through a Skipper Gangway™ migration.
        </p>
        <div style={{ textAlign:'center' }}>
          <Link href="/demo" style={{ display:'inline-block', padding:'16px 40px', background:TEAL, color:NAVY, borderRadius:8, fontSize:15, fontWeight:800, textDecoration:'none', fontFamily:FONT }}>Start Your Migration — Free</Link>
        </div>
      </div>
    </div>
  )
}

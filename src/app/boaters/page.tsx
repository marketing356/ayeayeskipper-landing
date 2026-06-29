'use client'
import { useRouter } from 'next/navigation'

const NAVY = '#0d2b4b'
const TEAL = '#4dd6c8'
const DARK = '#070f1a'
const FONT = "system-ui,-apple-system,'Segoe UI',Roboto,sans-serif"

export default function BoatersPage() {
  const router = useRouter()

  return (
    <div style={{ minHeight:'100vh', background:DARK, fontFamily:FONT, color:'#fff' }}>

      {/* HERO */}
      <div style={{ background:NAVY, padding:'80px 40px 60px', textAlign:'center' }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(77,214,200,0.1)', border:'1px solid rgba(77,214,200,0.25)', borderRadius:24, padding:'6px 16px', marginBottom:28 }}>
          <span style={{ width:7, height:7, borderRadius:'50%', background:TEAL, display:'inline-block' }}></span>
          <span style={{ fontSize:12, color:TEAL, fontWeight:700, letterSpacing:'1px' }}>FREE FOR BOATERS — ALWAYS</span>
        </div>
        <h1 style={{ fontSize:'clamp(36px,5.5vw,56px)', fontWeight:900, letterSpacing:'-2.5px', lineHeight:1.05, margin:'0 0 16px', color:'#fff' }}>
          Find a marina.<br/><span style={{ color:TEAL }}>Book a slip.</span><br/>No phone tag.
        </h1>
        <p style={{ fontSize:18, color:'rgba(255,255,255,0.6)', maxWidth:520, margin:'0 auto 40px', lineHeight:1.65 }}>
          Skipper-powered marinas let you check availability, book a transient slip, and get real answers instantly — no hold music, no emails into the void.
        </p>
        <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
          <button onClick={() => router.push('/marinas')} style={{ padding:'16px 36px', background:TEAL, color:NAVY, border:'none', borderRadius:8, fontSize:15, fontWeight:800, cursor:'pointer', fontFamily:FONT, letterSpacing:'-0.3px' }}>
            Browse Marinas →
          </button>
        </div>
        <p style={{ marginTop:16, fontSize:12, color:'rgba(255,255,255,0.3)' }}>Free to browse. No account required.</p>
      </div>

      {/* VALUE PROPS */}
      <div style={{ maxWidth:1000, margin:'0 auto', padding:'80px 40px' }}>
        <div style={{ textAlign:'center', marginBottom:56 }}>
          <div style={{ fontSize:12, color:TEAL, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', marginBottom:12 }}>Built for boaters</div>
          <h2 style={{ fontSize:38, fontWeight:900, letterSpacing:'-2px', margin:0 }}>Everything you need on the water.</h2>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:20 }}>
          {[
            ['🗺️','Real-time availability','See which slips are open right now. No more calling ahead hoping for a yes.'],
            ['💬','Ask Skipper anything','"Is there a pump-out at Bayview Marina?" Just ask. Skipper knows every marina\'s layout, amenities, and policies.'],
            ['⚡','Instant booking','Request a slip and get confirmed fast. No phone tag, no waiting on a callback at end of day.'],
            ['💰','Always free for boaters','Zero booking fees. Zero markup. Marinas set their own rates — you pay exactly what they charge.'],
            ['🔥','Hot Slip™','Annual tenants list their slip when they\'re cruising. You get a real slip at a real marina, not a random open lot.'],
            ['📱','No app required','Text, web, or native app — however you reach Skipper, it works. Most boaters just text.'],
          ].map(([icon, title, desc]) => (
            <div key={title as string} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:12, padding:28 }}>
              <div style={{ fontSize:32, marginBottom:14 }}>{icon}</div>
              <div style={{ fontWeight:800, fontSize:16, marginBottom:8, letterSpacing:'-0.3px' }}>{title}</div>
              <div style={{ fontSize:13, color:'rgba(255,255,255,0.55)', lineHeight:1.7 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* VS DOCKWA FOR BOATERS */}
      <div style={{ background:'rgba(255,255,255,0.02)', borderTop:'1px solid rgba(255,255,255,0.07)', padding:'80px 40px' }}>
        <div style={{ maxWidth:700, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:40 }}>
            <h2 style={{ fontSize:34, fontWeight:900, letterSpacing:'-1.5px', margin:'0 0 12px' }}>Why boaters are leaving Dockwa</h2>
            <p style={{ fontSize:15, color:'rgba(255,255,255,0.45)', lineHeight:1.65 }}>3.8 stars on Google Play. Here&apos;s what real users are saying:</p>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {[
              ['"Horrendous app. Can\'t get PDF or JPG to upload from my phone, One Drive, Google, Amazon or anywhere." — 1-star review, Aug 2024','Document uploads broken on Android'],
              ['"Never experienced such a hassle to setup a simple reservation. Insane waste of time." — 1-star review','Setup takes hours for basic tasks'],
              ['"Updates to a profile must be done on a computer, not a mobile device — but the app doesn\'t tell you why it\'s not working." — real review','Key features locked to desktop only'],
              ['Dockwa controls search ranking. Pay-to-play placement means the best marina isn\'t always what you see first.','Pay-to-play search results'],
            ].map(([quote, label]) => (
              <div key={label as string} style={{ background:'rgba(255,80,80,0.04)', border:'1px solid rgba(255,80,80,0.12)', borderRadius:12, padding:'20px 24px' }}>
                <div style={{ fontSize:11, color:'rgba(255,140,140,0.7)', fontWeight:700, textTransform:'uppercase', letterSpacing:'1px', marginBottom:8 }}>{label}</div>
                <div style={{ fontSize:13, color:'rgba(255,255,255,0.55)', lineHeight:1.65, fontStyle:'italic' }}>{quote}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding:'80px 40px', textAlign:'center' }}>
        <div style={{ maxWidth:560, margin:'0 auto' }}>
          <h2 style={{ fontSize:42, fontWeight:900, letterSpacing:'-2px', margin:'0 0 16px', lineHeight:1.05 }}>
            Ready to find your slip?
          </h2>
          <p style={{ fontSize:16, color:'rgba(255,255,255,0.5)', marginBottom:36, lineHeight:1.65 }}>
            Browse Skipper-powered marinas. Free, fast, no account needed.
          </p>
          <button onClick={() => router.push('/marinas')} style={{ padding:'18px 44px', background:TEAL, color:NAVY, border:'none', borderRadius:8, fontSize:17, fontWeight:900, cursor:'pointer', fontFamily:FONT, letterSpacing:'-0.3px' }}>
            Browse Marinas →
          </button>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ borderTop:'1px solid rgba(255,255,255,0.07)', padding:'40px', textAlign:'center' }}>
        <button onClick={() => router.push('/')} style={{ fontSize:13, color:'rgba(255,255,255,0.3)', background:'none', border:'none', cursor:'pointer', fontFamily:FONT }}>
          ← Back to AyeAyeSkipper.com
        </button>
      </div>
    </div>
  )
}

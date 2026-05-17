'use client'
const NAVY='#0d2b4b', TEAL='#4dd6c8', FONT="system-ui,-apple-system,'Segoe UI',Roboto,sans-serif"
export default function Landing() {
  return (
    <div style={{ minHeight:'100vh', background:'#0a1628', fontFamily:FONT, color:'#fff' }}>
      {/* Nav */}
      <nav style={{ padding:'20px 40px', display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ fontSize:24 }}>⚓</span>
          <span style={{ fontSize:20, fontWeight:900, letterSpacing:'-0.5px' }}>AyeAyeSkipper</span>
        </div>
        <div style={{ display:'flex', gap:20, alignItems:'center' }}>
          <a href="#features" style={{ color:'rgba(255,255,255,0.7)', textDecoration:'none', fontSize:14 }}>Features</a>
          <a href="#pricing" style={{ color:'rgba(255,255,255,0.7)', textDecoration:'none', fontSize:14 }}>Pricing</a>
          <button style={{ padding:'8px 20px', background:TEAL, color:NAVY, border:'none', borderRadius:6, fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:FONT }}>Get Started</button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ maxWidth:960, margin:'0 auto', padding:'80px 40px', textAlign:'center' }}>
        <div style={{ fontSize:13, color:TEAL, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', marginBottom:16 }}>Powered by Slip Logic™</div>
        <h1 style={{ fontSize:'clamp(36px,6vw,72px)', fontWeight:900, letterSpacing:'-2px', lineHeight:1.05, margin:'0 0 24px' }}>
          We run on <span style={{ color:TEAL }}>Skipper.</span>
        </h1>
        <p style={{ fontSize:18, color:'rgba(255,255,255,0.7)', maxWidth:560, margin:'0 auto 40px', lineHeight:1.6 }}>
          The marina management OS built around AI. Slips, tenants, fuel, storage, guests — Skipper handles everything so your team doesn't have to.
        </p>
        <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
          <button style={{ padding:'16px 36px', background:TEAL, color:NAVY, border:'none', borderRadius:8, fontSize:16, fontWeight:800, cursor:'pointer', fontFamily:FONT }}>Book a Demo</button>
          <button style={{ padding:'16px 36px', background:'transparent', color:'#fff', border:'2px solid rgba(255,255,255,0.3)', borderRadius:8, fontSize:16, fontWeight:700, cursor:'pointer', fontFamily:FONT }}>Learn More</button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ background:'rgba(255,255,255,0.04)', borderTop:'1px solid rgba(255,255,255,0.08)', borderBottom:'1px solid rgba(255,255,255,0.08)', padding:'40px', display:'flex', justifyContent:'center', gap:60, flexWrap:'wrap' }}>
        {[['$0','Platform fees'],['100%','Marina owns the customer'],['24/7','Skipper is always on'],['5 min','Average onboarding']].map(([n,l]) => (
          <div key={l} style={{ textAlign:'center' }}>
            <div style={{ fontSize:36, fontWeight:900, color:TEAL }}>{n}</div>
            <div style={{ fontSize:13, color:'rgba(255,255,255,0.5)', marginTop:4 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Features */}
      <div id="features" style={{ maxWidth:1100, margin:'0 auto', padding:'80px 40px' }}>
        <h2 style={{ fontSize:36, fontWeight:900, textAlign:'center', marginBottom:60 }}>Everything your marina needs</h2>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:24 }}>
          {[
            ['⚓','Slip Management','Assign tenants, track leases, manage renewals. Color-coded by payment status so you see the whole marina at a glance.'],
            ['💬','Skipper AI','Dock hands text Skipper from the dock. Tenants message Skipper from the app. Everything gets logged and actioned.'],
            ['📊','Live Operations','Pedestals, safety stations, fuel levels, work orders — all in one dashboard. Skipper alerts you before problems become emergencies.'],
            ['⛽','Fuel Dock','Track tank levels, set prices, record every sale. Skipper flags when it\'s time to order.'],
            ['🏗️','Storage & Assets','Rack storage, trailers, jet skis — every asset tracked with location history. Launch calendar built in.'],
            ['🛥️','Transient Bookings','Guests check in, Skipper assigns a slip, charges are calculated automatically. Receipt at checkout.'],
            ['📅','Wait List','8 people waiting? Skipper notifies the next match when a slip opens. No phone tag.'],
            ['📋','Marina Map','Your exact marina in 2D + 3D. Pedestal labels, safety stations, mooring balls — all on one live map.'],
          ].map(([icon, title, desc]) => (
            <div key={title} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:12, padding:24 }}>
              <div style={{ fontSize:28, marginBottom:12 }}>{icon}</div>
              <div style={{ fontWeight:700, fontSize:16, marginBottom:8 }}>{title}</div>
              <div style={{ fontSize:13, color:'rgba(255,255,255,0.6)', lineHeight:1.6 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div id="pricing" style={{ background:'rgba(255,255,255,0.02)', borderTop:'1px solid rgba(255,255,255,0.08)', padding:'80px 40px' }}>
        <h2 style={{ fontSize:36, fontWeight:900, textAlign:'center', marginBottom:60 }}>Simple pricing. No surprises.</h2>
        <div style={{ display:'flex', gap:24, justifyContent:'center', flexWrap:'wrap', maxWidth:900, margin:'0 auto' }}>
          {[
            ['First Mate','$99/mo','Up to 50 slips','In-app messaging, basic reports, Skipper AI, marina map'],
            ['Captain','$249/mo','Up to 150 slips','Everything + SMS texting, fuel dock, storage tracking, transient bookings','popular'],
            ['Commodore','Custom','Unlimited slips','Everything + QuickBooks, custom integrations, dedicated support'],
          ].map(([name, price, slips, features, badge]) => (
            <div key={name} style={{ flex:'1', minWidth:240, background: badge ? NAVY : 'rgba(255,255,255,0.04)', border:`2px solid ${badge ? TEAL : 'rgba(255,255,255,0.1)'}`, borderRadius:12, padding:28, position:'relative' }}>
              {badge && <div style={{ position:'absolute', top:-12, left:'50%', transform:'translateX(-50%)', background:TEAL, color:NAVY, padding:'4px 14px', borderRadius:20, fontSize:11, fontWeight:800 }}>MOST POPULAR</div>}
              <div style={{ fontSize:14, color:TEAL, fontWeight:700, marginBottom:8 }}>{name}</div>
              <div style={{ fontSize:36, fontWeight:900, marginBottom:4 }}>{price}</div>
              <div style={{ fontSize:13, color:'rgba(255,255,255,0.5)', marginBottom:20 }}>{slips}</div>
              <div style={{ fontSize:13, color:'rgba(255,255,255,0.7)', lineHeight:1.8 }}>{features}</div>
              <button style={{ width:'100%', marginTop:24, padding:'12px', background:badge?TEAL:NAVY, color:badge?NAVY:'#fff', border:badge?'none':`1px solid rgba(255,255,255,0.2)`, borderRadius:6, fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:FONT }}>
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop:'1px solid rgba(255,255,255,0.08)', padding:'40px', textAlign:'center', color:'rgba(255,255,255,0.4)', fontSize:13 }}>
        <div style={{ fontSize:18, fontWeight:800, marginBottom:8 }}>⚓ AyeAyeSkipper</div>
        <div>Powered by Slip Logic™ · Next-Gen Marine · © 2026</div>
        <div style={{ marginTop:8 }}>Built by Mariner and Sailor LLC · Annapolis, MD</div>
      </div>
    </div>
  )
}

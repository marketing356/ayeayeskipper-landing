'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const NAVY = '#0d2b4b'
const TEAL = '#4dd6c8'
const DARK = '#070f1a'
const FONT = "system-ui,-apple-system,'Segoe UI',Roboto,sans-serif"

export default function Landing() {
  const router = useRouter()
  const [openFaq, setOpenFaq] = useState<number|null>(null)
  const [chatMsg, setChatMsg] = useState('')
  const [lastExchange, setLastExchange] = useState<{user:string, reply:string}|null>(null)
  const [chatLoading, setChatLoading] = useState(false)
  const chatRef = useRef<HTMLDivElement>(null)

  // Homepage is the decision point — clear any prior audience choice on mount.
  useEffect(() => {
    if (typeof window !== 'undefined') sessionStorage.removeItem('audience')
  }, [])

  const scrollToMarina = () => {
    if (typeof window !== 'undefined') sessionStorage.setItem('audience', 'marina')
    document.getElementById('marina-section')?.scrollIntoView({ behavior: 'smooth' })
  }

  async function sendChat(overrideMsg?: string) {
    const message = (overrideMsg ?? chatMsg).trim()
    if (!message || chatLoading) return
    setChatMsg('')
    setChatLoading(true)
    setLastExchange({ user: message, reply: '' })
    try {
      const res = await fetch('/api/skipper-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      })
      const data = await res.json()
      setLastExchange({ user: message, reply: data.reply ?? '' })
    } catch {
      setLastExchange({ user: message, reply: "Aye aye — I'm having a little trouble right now. Head to /join and we'll sort it out." })
    } finally {
      setChatLoading(false)
      setTimeout(() => chatRef.current?.scrollTo({ top: 9999, behavior: 'smooth' }), 60)
    }
  }

  const PROMPT_CHIPS = [
    'How do I get my marina on board?',
    'What is Hot Slip™?',
    'What does it cost?',
    'How does migration work?',
  ]

  return (
    <div style={{ minHeight:'100vh', background:DARK, fontFamily:FONT, color:'#fff' }}>

      {/* ══════════════════════════ HERO — MARINA-FIRST ══════════════════════════ */}
      <div style={{ minHeight:'92vh', background:DARK, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'70px 40px 40px', textAlign:'center' }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(77,214,200,0.1)', border:'1px solid rgba(77,214,200,0.25)', borderRadius:24, padding:'6px 16px', marginBottom:24 }}>
          <span style={{ width:7, height:7, borderRadius:'50%', background:TEAL, display:'inline-block' }}></span>
          <span style={{ fontSize:12, color:TEAL, fontWeight:700, letterSpacing:'1px' }}>THE MARINA OS BUILT AROUND SKIPPER</span>
        </div>
        <h1 style={{ fontSize:'clamp(34px,5.5vw,56px)', fontWeight:900, letterSpacing:'-2.5px', margin:'0 0 14px', lineHeight:1.05, color:'#fff', maxWidth:820 }}>
          We build your marina from <span style={{ color:TEAL }}>satellite to screen.</span>
        </h1>
        <p style={{ fontSize:18, color:'rgba(255,255,255,0.55)', margin:'0 0 48px', maxWidth:560, lineHeight:1.6 }}>
          Every slip, every dock, every boat — modeled from real satellite imagery into a live, operational marina map. See exactly how it happens below.
        </p>

        {/* 4-STEP VISUAL PROOF SEQUENCE */}
        <div style={{ width:'100%', maxWidth:1180, display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }} className="proof-grid">
          {[
            { n:'01', label:'We find your marina', sub:'Satellite imagery, traced to the inch', img:'/collage/final-1-satellite.jpg' },
            { n:'02', label:'We build it in 3D', sub:'Every dock, slip, and vessel modeled to scale', img:'/collage/final-2-3dmodel.jpg' },
            { n:'03', label:'Your live Chart Room', sub:'Real-time 2D operational map — click any slip', img:'/collage/final-3-chartroom.jpg' },
            { n:'04', label:'One database, every view', sub:'The map, the money, the tenants — always in sync', img:'/collage/final-4-dashboard.jpg' },
          ].map(step => (
            <div key={step.n} style={{ textAlign:'left' }}>
              <div style={{ position:'relative', borderRadius:12, overflow:'hidden', border:'1px solid rgba(77,214,200,0.2)', aspectRatio:'4/3', background:'#0a1a2e' }}>
                <img src={step.img} alt={step.label} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
                <div style={{ position:'absolute', top:8, left:8, background:'rgba(13,43,75,0.85)', color:TEAL, fontSize:12, fontWeight:900, padding:'3px 9px', borderRadius:6, letterSpacing:'0.5px' }}>{step.n}</div>
              </div>
              <div style={{ fontWeight:800, fontSize:14, marginTop:10, color:'#fff', letterSpacing:'-0.2px' }}>{step.label}</div>
              <div style={{ fontSize:12, color:'rgba(255,255,255,0.45)', marginTop:3, lineHeight:1.5 }}>{step.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap', marginTop:44 }}>
          <button onClick={() => router.push('/join')} style={{ padding:'17px 38px', background:TEAL, color:NAVY, border:'none', borderRadius:8, fontSize:15, fontWeight:900, cursor:'pointer', fontFamily:FONT, letterSpacing:'-0.3px' }}>See Your Marina Built →</button>
          <button onClick={() => router.push('/demo')} style={{ padding:'17px 38px', background:'rgba(255,255,255,0.06)', color:'#fff', border:'1px solid rgba(255,255,255,0.15)', borderRadius:8, fontSize:15, fontWeight:600, cursor:'pointer', fontFamily:FONT }}>Explore a Live Demo</button>
        </div>
        <p style={{ marginTop:18, fontSize:12, color:'rgba(255,255,255,0.3)' }}>No contracts. No setup fees. We build your marina map at no cost, before you pay a cent.</p>

        {/* Boater link — small, demoted, not a competing path */}
        <button onClick={() => { if (typeof window !== 'undefined') sessionStorage.setItem('audience', 'boater'); router.push('/boaters') }} style={{ marginTop:40, background:'none', border:'none', color:'rgba(255,255,255,0.3)', fontSize:12, cursor:'pointer', fontFamily:FONT, textDecoration:'underline', textUnderlineOffset:3 }}>
          Looking for a slip instead? Boater info →
        </button>
      </div>
      <style>{`
        @media (max-width: 860px) {
          .proof-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
      `}</style>
      <style>{`
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(77,214,200,0.4), 0 0 40px rgba(77,214,200,0.2); }
          50% { box-shadow: 0 0 0 18px rgba(77,214,200,0), 0 0 80px rgba(77,214,200,0.35); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes bubble-in {
          0% { opacity: 0; transform: scale(0.85) translateY(8px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes btn-pulse {
          0% { box-shadow: 0 0 0 0 rgba(77,214,200,0.4); }
          70% { box-shadow: 0 0 0 20px rgba(77,214,200,0); }
          100% { box-shadow: 0 0 0 0 rgba(77,214,200,0); }
        }
        @keyframes sonar {
          0% { transform: translate(-50%,-50%) scale(1); opacity: 0.5; }
          100% { transform: translate(-50%,-50%) scale(2.8); opacity: 0; }
        }
        @keyframes typing-dot {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-5px); opacity: 1; }
        }
        @keyframes chip-in {
          0% { opacity: 0; transform: translateY(6px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* ═══════════════════════════════════════ HERO ═══════════════════════════════════════ */}
      <div id="marina-section" style={{ background:NAVY, padding:'80px 40px 60px', textAlign:'center' }}>
        {/* Badge */}
        <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(77,214,200,0.1)', border:'1px solid rgba(77,214,200,0.25)', borderRadius:24, padding:'6px 16px', marginBottom:28 }}>
          <span style={{ width:7, height:7, borderRadius:'50%', background:TEAL, display:'inline-block' }}></span>
          <span style={{ fontSize:12, color:TEAL, fontWeight:700, letterSpacing:'1px' }}>THE MARINA OS BUILT AROUND SKIPPER</span>
        </div>

        {/* Headline */}
        <h1 style={{ fontSize:'clamp(40px,5.5vw,52px)', fontWeight:900, letterSpacing:'-2.5px', lineHeight:1.05, margin:'0 0 16px', color:'#fff' }}>
          We run on <span style={{ color:TEAL }}>Skipper.</span>
        </h1>
        <p style={{ fontSize:20, color:TEAL, margin:'0 0 40px', fontWeight:600, letterSpacing:'-0.3px' }}>
          The AI marina OS. Slips, tenants, bookings, fuel — ask him anything.
        </p>

        {/* Skipper avatar — glowing pulse circle */}
        <div style={{ display:'flex', justifyContent:'center', marginBottom:32 }}>
          <div style={{ position:'relative', display:'flex', justifyContent:'center', alignItems:'center', width:130, height:130 }}>
            {/* Sonar rings */}
            {[0, 0.9, 1.8].map((delay, i) => (
              <div key={i} style={{
                position:'absolute', top:'50%', left:'50%',
                width:110, height:110, borderRadius:'50%',
                border:`2px solid rgba(77,214,200,${0.4 - i*0.1})`,
                animation:`sonar 2.7s ease-out ${delay}s infinite`,
                pointerEvents:'none',
              }} />
            ))}
            <div style={{
              width:100, height:100, borderRadius:'50%',
              overflow:'hidden',
              border:'3px solid rgba(77,214,200,0.7)',
              animation:'pulse-glow 2.4s ease-in-out infinite, float 3.5s ease-in-out infinite',
              zIndex:5,
              background:'#122d4a',
            }}>
              <img src="/skipper-avatar.jpg" alt="Skipper" style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center 10%' }} />
            </div>
          </div>
        </div>

        {/* Chat exchange display */}
        {(lastExchange || chatLoading) && (
          <div ref={chatRef} style={{ maxWidth:560, margin:'0 auto 20px', display:'flex', flexDirection:'column', gap:10, animation:'bubble-in 0.35s ease' }}>
            {lastExchange?.user && (
              <div style={{ alignSelf:'flex-end', background:TEAL, color:NAVY, borderRadius:'14px 14px 2px 14px', padding:'10px 16px', fontSize:14, fontWeight:600, maxWidth:'80%' }}>
                {lastExchange.user}
              </div>
            )}
            {chatLoading ? (
              <div style={{ alignSelf:'flex-start', display:'flex', alignItems:'center', gap:6, background:'rgba(255,255,255,0.07)', borderRadius:'14px 14px 14px 2px', padding:'10px 18px' }}>
                <img src="/skipper-avatar.jpg" alt="" style={{ width:22, height:22, borderRadius:'50%', objectFit:'cover', flexShrink:0 }} />
                {[0,0.2,0.4].map(d => (
                  <span key={d} style={{ width:7, height:7, borderRadius:'50%', background:'rgba(77,214,200,0.7)', display:'inline-block', animation:`typing-dot 1.2s ${d}s ease-in-out infinite` }} />
                ))}
              </div>
            ) : lastExchange?.reply ? (
              <div style={{ alignSelf:'flex-start', display:'flex', gap:10, alignItems:'flex-start', maxWidth:'80%' }}>
                <img src="/skipper-avatar.jpg" alt="Skipper" style={{ width:28, height:28, borderRadius:'50%', objectFit:'cover', flexShrink:0, marginTop:2, border:'1px solid rgba(77,214,200,0.4)' }} />
                <div style={{ background:'rgba(255,255,255,0.07)', borderRadius:'14px 14px 14px 2px', padding:'10px 14px', fontSize:14, color:'rgba(255,255,255,0.9)', lineHeight:1.55 }}>
                  {lastExchange.reply}
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* Chat input */}
        <div style={{ maxWidth:560, margin:'0 auto 16px' }}>
          <div style={{ display:'flex', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(77,214,200,0.3)', borderRadius:12, overflow:'hidden' }}>
            <input
              value={chatMsg}
              onChange={e => setChatMsg(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendChat()}
              placeholder="Ask Skipper anything..."
              style={{ flex:1, background:'transparent', border:'none', outline:'none', color:'#fff', fontSize:15, fontFamily:FONT, padding:'14px 18px' }}
            />
            <button
              onClick={() => sendChat()}
              disabled={chatLoading}
              style={{ background:TEAL, color:NAVY, border:'none', padding:'14px 22px', fontSize:18, fontWeight:900, cursor:'pointer', flexShrink:0, opacity: chatLoading ? 0.6 : 1 }}
            >↑</button>
          </div>
        </div>

        {/* Prompt chips */}
        <div style={{ display:'flex', justifyContent:'center', gap:10, flexWrap:'wrap', maxWidth:640, margin:'0 auto' }}>
          {PROMPT_CHIPS.map((chip, i) => (
            <button
              key={chip}
              onClick={() => sendChat(chip)}
              style={{
                background:'rgba(255,255,255,0.06)', border:'1px solid rgba(77,214,200,0.25)',
                color:'rgba(255,255,255,0.8)', borderRadius:20, padding:'7px 16px',
                fontSize:13, fontWeight:500, cursor:'pointer', fontFamily:FONT,
                animation:`chip-in 0.4s ease ${i * 0.07}s both`,
                transition:'background 0.15s, border-color 0.15s',
              }}
            >{chip}</button>
          ))}
        </div>

        {/* Sub-CTAs */}
        <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap', marginTop:32 }}>
          <button onClick={() => router.push('/join')} style={{ padding:'16px 36px', background:TEAL, color:NAVY, border:'none', borderRadius:8, fontSize:15, fontWeight:800, cursor:'pointer', fontFamily:FONT, letterSpacing:'-0.3px', animation:'btn-pulse 2s infinite' }}>Book a Demo</button>
          <button onClick={() => router.push('/demo')} style={{ padding:'16px 36px', background:'rgba(255,255,255,0.06)', color:'#fff', border:'1px solid rgba(255,255,255,0.15)', borderRadius:8, fontSize:15, fontWeight:600, cursor:'pointer', fontFamily:FONT }}>See It Live →</button>
        </div>
        <p style={{ marginTop:16, fontSize:12, color:'rgba(255,255,255,0.3)' }}>No contracts. No setup fees. Your data, your marina, your money.</p>
      </div>

      {/* STATS BAR */}
      <div style={{ borderTop:'1px solid rgba(255,255,255,0.07)', borderBottom:'1px solid rgba(255,255,255,0.07)', padding:'36px 40px', display:'flex', justifyContent:'center', gap:80, flexWrap:'wrap', background:'rgba(255,255,255,0.02)' }}>
        {[['$0','Platform fees. Ever.'],['0%','Transaction rake'],['100%','You own the customer'],['1 day','To go live']].map(([n,l]) => (
          <div key={l} style={{ textAlign:'center' }}>
            <div style={{ fontSize:40, fontWeight:900, color:TEAL, letterSpacing:'-2px' }}>{n}</div>
            <div style={{ fontSize:13, color:'rgba(255,255,255,0.45)', marginTop:6 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* THE DIFFERENCE — AyeAyeSkipper vs. The Rest */}
      <div id="vs--dockwa" style={{ maxWidth:960, margin:'0 auto', padding:'100px 40px' }}>
        <div style={{ textAlign:'center', marginBottom:56 }}>
          <div style={{ fontSize:12, color:TEAL, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', marginBottom:12 }}>Why Marinas Are Switching</div>
          <h2 style={{ fontSize:42, fontWeight:900, letterSpacing:'-2px', margin:0 }}>AyeAyeSkipper vs. The Rest</h2>
          <p style={{ fontSize:15, color:'rgba(255,255,255,0.45)', marginTop:16, marginBottom:0 }}>Full comparison vs Molo, Dockside, Dockwa &amp; more → <a href="/vs-dockwa" style={{ color:TEAL, textDecoration:'none', fontWeight:600 }}>See the full chart</a></p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:3, borderRadius:16, overflow:'hidden' }}>
          <div style={{ background:`${TEAL}15`, padding:'16px 24px', fontWeight:700, fontSize:13, color:TEAL, textTransform:'uppercase', letterSpacing:'1px', borderBottom:`1px solid ${TEAL}30` }}>AyeAyeSkipper</div>
          <div style={{ background:'rgba(255,255,255,0.04)', padding:'16px 24px', fontWeight:700, fontSize:13, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:'1px' }}>Molo, Dockside &amp; Others</div>
          {[
            ['Zero transaction fees. You keep 100%.','Platform takes a cut of every booking'],
            ['Your customers. Your data. Full stop.','They own the customer relationship'],
            ['Payments go directly to your bank account.','Your money flows through their system'],
            ['Boaters book with YOU — your brand, your rep.','Boaters book on the platform, not your marina'],
            ['Skipper learns YOUR marina. Every slip, every tenant.','Rigid software built for a generic marina'],
            ['Skipper Gangway™ migrates everything same day.','Switching means losing all your data'],
            ['Just talk to Skipper. No training required.','Your team learns new software'],
            ['Flat monthly. One price. Everything included.','Per seat, per transaction, or both'],
          ].map(([good, bad], i) => (
            <>
              <div key={`g${i}`} style={{ background:`${TEAL}08`, padding:'16px 24px', fontSize:14, color:'rgba(255,255,255,0.85)', display:'flex', alignItems:'center', gap:10, borderBottom:`1px solid ${TEAL}15` }}>
                <span style={{ color:TEAL, fontSize:16, flexShrink:0 }}>✓</span>{good}
              </div>
              <div key={`b${i}`} style={{ background:'rgba(255,255,255,0.025)', padding:'16px 24px', fontSize:14, color:'rgba(255,255,255,0.5)', display:'flex', alignItems:'center', gap:10, borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ color:'rgba(255,80,80,0.7)', fontSize:16, flexShrink:0 }}>✕</span>{bad}
              </div>
            </>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <div id="features" style={{ background:'rgba(255,255,255,0.02)', borderTop:'1px solid rgba(255,255,255,0.07)', padding:'100px 40px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:64 }}>
            <div style={{ fontSize:12, color:TEAL, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', marginBottom:12 }}>Everything. One Platform.</div>
            <h2 style={{ fontSize:42, fontWeight:900, letterSpacing:'-2px', margin:0 }}>Skipper runs your entire operation.</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:20 }}>
            {[
              ['Slip Management + Slip Logic™','Color-coded live map of every slip. Green = paid. Red = overdue. Yellow = expiring. Skipper flags problems before you spot them.'],
              ['Asset Logic™','Every slip, mooring, yard space, rack, and parking spot — one map, one database. Assign, vacate, transfer. Skipper handles it all.'],
              ['Hot Slip™','Annual tenants mark their slip available when they\'re away. Transients book it. Tenant earns. Marina profits. Everyone wins.'],
              ['Just Talk to Skipper','No forms, no menus. Text or voice. "Who\'s overdue?" "Book Slip B12 for a 32-footer tonight." Skipper handles it.'],
              ['Live Marina Map','Your exact marina in 2D. Every slip, mooring ball, pedestal, safety station — labeled, color-coded, and always current.'],
              ['Fuel Dock','Track tank levels, log every sale, set pump prices. Skipper alerts when it\'s time to reorder.'],
              ['Storage & Assets','Rack storage, trailers, PWCs — every asset tracked with location history. Launch calendar built in.'],
              ['Transient Bookings','Guest arrives, Skipper assigns a slip, calculates the charge, sends a receipt. Zero staff involvement.'],
              ['Contracts + E-Sign','Skipper sends the lease, tenant signs on their phone. Captured, timestamped, logged. No printer required.'],
              ['Wait List Intelligence','8 people waiting? When a slip opens, Skipper matches the best fit and notifies them automatically.'],
              ['Skipper Gangway™','Already on Dockmaster, Dockwa, Marina Controller, or spreadsheets? Skipper Gangway™ migrates everything. Live same day.'],
              ['The Briefing Room','Every morning: who\'s arriving, who\'s departing, what\'s overdue, what the weather\'s doing. Skipper briefs you so you\'re never caught off guard.'],
              ['Tenant Portal','Your tenants get their own Skipper-powered app. View their lease, pay invoices, request maintenance, check their slip.'],
            ].map(([title, desc]) => (
              <div key={title} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:12, padding:28, borderTop:`2px solid ${TEAL}` }}>
                <div style={{ fontWeight:800, fontSize:16, marginBottom:10, letterSpacing:'-0.3px' }}>{title}</div>
                <div style={{ fontSize:13, color:'rgba(255,255,255,0.55)', lineHeight:1.7 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div id="how-it-works" style={{ maxWidth:900, margin:'0 auto', padding:'100px 40px' }}>
        <div style={{ textAlign:'center', marginBottom:64 }}>
          <div style={{ fontSize:12, color:TEAL, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', marginBottom:12 }}>Zero friction onboarding</div>
          <h2 style={{ fontSize:42, fontWeight:900, letterSpacing:'-2px', margin:0 }}>Live in one afternoon.</h2>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
          {[
            ['01','We build your marina in 3D','Send us your marina layout. Our team builds your exact marina — every slip, mooring, fuel dock, storage rack. Usually done same day.'],
            ['02','Skipper learns your data','We load your existing tenant list, slip assignments, and rates. If you\'re on another platform, Skipper Gangway™ migrates everything automatically.'],
            ['03','Your team just talks to Skipper','No training sessions. No user manuals. Just open Skipper and say what you need. Skipper figures out the rest.'],
            ['04','You\'re running','Billing, renewals, transient bookings, fuel, storage, waitlist — all live. You\'re fully operational the same afternoon.'],
          ].map(([num, title, desc], i) => (
            <div key={num} style={{ display:'flex', gap:28, padding:'32px 0', borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.07)' : 'none' }}>
              <div style={{ fontSize:40, fontWeight:900, color:`${TEAL}50`, letterSpacing:'-2px', minWidth:52, paddingTop:4 }}>{num}</div>
              <div>
                <div style={{ fontWeight:800, fontSize:18, marginBottom:8, letterSpacing:'-0.3px' }}>{title}</div>
                <div style={{ fontSize:14, color:'rgba(255,255,255,0.55)', lineHeight:1.7 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PAYMENTS SECTION */}
      <div style={{ background:'rgba(255,255,255,0.02)', borderTop:'1px solid rgba(255,255,255,0.07)', borderBottom:'1px solid rgba(255,255,255,0.07)', padding:'80px 40px' }}>
        <div style={{ maxWidth:900, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr', gap:60, alignItems:'center' }}>
          <div>
            <div style={{ fontSize:12, color:TEAL, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', marginBottom:16 }}>Your money stays yours</div>
            <h2 style={{ fontSize:38, fontWeight:900, letterSpacing:'-1.5px', margin:'0 0 20px', lineHeight:1.1 }}>We're not in the payment business. You are.</h2>
            <p style={{ fontSize:15, color:'rgba(255,255,255,0.6)', lineHeight:1.75, marginBottom:20 }}>
              Skipper tracks invoices and records payments. That's it. Your tenants pay you however you've always collected — terminal, check, ACH, whatever. We never touch your money.
            </p>
            <p style={{ fontSize:15, color:'rgba(255,255,255,0.6)', lineHeight:1.75 }}>
              If you're a newer marina without processing in place, Skipper can set you up with your own Stripe account — money goes straight to your bank, never through ours.
            </p>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {[
              ['You collect payments your way','Terminal, check, ACH, wire — Skipper logs whatever you record.'],
              ['Money goes to your bank','We never hold, process, or touch marina funds. Period.'],
              ['Full payment tracking','Skipper knows who\'s paid, who\'s overdue, and who\'s about to expire.'],
              ['Optional Stripe setup','No processor yet? We help you set up your own Stripe. Straight to your account.'],
            ].map(([title, desc]) => (
              <div key={title} style={{ display:'flex', gap:14, padding:'16px', background:'rgba(255,255,255,0.04)', borderRadius:10, border:'1px solid rgba(255,255,255,0.07)', borderLeft:`2px solid ${TEAL}` }}>
                <div>
                  <div style={{ fontWeight:700, fontSize:14, marginBottom:3 }}>{title}</div>
                  <div style={{ fontSize:12, color:'rgba(255,255,255,0.5)' }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PARTNER MARINAS */}
      <div style={{ maxWidth:1100, margin:'0 auto', padding:'100px 40px' }}>
        <div style={{ textAlign:'center', marginBottom:56 }}>
          <div style={{ fontSize:12, color:TEAL, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', marginBottom:12 }}>FOUNDING PARTNER PROGRAM</div>
          <h2 style={{ fontSize:42, fontWeight:900, letterSpacing:'-2px', margin:'0 0 14px' }}>Built with real marinas.<br/>Run by Skipper.</h2>
          <p style={{ color:'rgba(255,255,255,0.45)', fontSize:15, maxWidth:500, margin:'0 auto' }}>We're onboarding our first founding partners now — they help shape every feature before anyone else sees it.</p>
        </div>
        <div style={{ display:'flex', justifyContent:'center' }}>
          <a href="/join" style={{ background:'rgba(77,214,200,0.04)', border:`2px dashed rgba(77,214,200,0.25)`, borderRadius:14, padding:28, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textDecoration:'none', color:'#fff', textAlign:'center', minHeight:160, width:'100%', maxWidth:360 }}>
            <div style={{ fontWeight:700, fontSize:16, color:TEAL, letterSpacing:'-0.3px' }}>Your marina could be first →</div>
            <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', marginTop:6 }}>Join as a founding partner</div>
          </a>
        </div>
      </div>

      {/* ═══════════════════════════════════════ PRICING ═══════════════════════════════════════ */}
      <div id="pricing" style={{ maxWidth:860, margin:'0 auto', padding:'100px 40px' }}>
        <div style={{ textAlign:'center', marginBottom:56 }}>
          <div style={{ fontSize:12, color:TEAL, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', marginBottom:12 }}>Simple, honest pricing</div>
          <h2 style={{ fontSize:42, fontWeight:900, letterSpacing:'-2px', margin:'0 0 12px' }}>Dead simple. Four plans.</h2>
          <p style={{ color:'rgba(255,255,255,0.45)', fontSize:15, maxWidth:480, margin:'0 auto' }}>
            Flat rate by slip count. Everything included. Zero transaction fees. Zero booking commissions. Zero surprises.<br/>
            Marinas switching from Molo, Dockside, and DockMaster save thousands every year.
          </p>
        </div>

        {/* No-fee banner */}
        <div style={{ background:`${TEAL}10`, border:`1px solid ${TEAL}25`, borderRadius:10, padding:'14px 22px', display:'flex', gap:14, alignItems:'center', marginBottom:32, borderLeft:`3px solid ${TEAL}` }}>
          <div style={{ fontSize:14, color:'rgba(255,255,255,0.7)', lineHeight:1.5 }}>
            <strong style={{ color:TEAL }}>Zero transaction fees. Ever.</strong> Unlike Dockwa and others, we never take a cut of your bookings. Your transient revenue is 100% yours. First month free on every plan.
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:16, marginBottom:28 }}>
          {[
            {
              label:'DECKHAND',
              sub:'UP TO 29 SLIPS',
              price:'$199',
              per:'/mo',
              badge: null,
              color:'rgba(255,255,255,0.04)',
              border:'rgba(255,255,255,0.12)',
              features:[
                'Full Helm marina management dashboard',
                'Slip Logic™ live marina map',
                'Asset Logic™ — slips, moorings, storage, parking',
                'Skipper app for every staff + slip holder',
                'Contracts + e-sign',
                'Billing + late-payment automation',
                'Unlimited staff + tenant profiles',
                'Full support included',
              ]
            },
            {
              label:'MATE',
              sub:'30–50 SLIPS',
              price:'$299',
              per:'/mo',
              badge: null,
              color:'rgba(255,255,255,0.04)',
              border:'rgba(255,255,255,0.12)',
              features:[
                'Everything in Deckhand',
                'Hot Slip™ tenant revenue program',
                'Transient bookings — zero commission',
                'Waitlist intelligence',
                'Fuel dock module',
                'Rack + trailer + PWC storage tracking',
              ]
            },
            {
              label:'CAPTAIN',
              sub:'51–150 SLIPS',
              price:'$499',
              per:'/mo',
              badge:'MOST POPULAR',
              color:NAVY,
              border:TEAL,
              features:[
                'Everything in Mate',
                'SMS via Skipper (Twilio)',
                'QuickBooks sync',
                'Multi-dock management',
                'Skipper Gangway™ migration (same day)',
                'Configurable haul/launch billing',
                'Free website, built + hosted, yours to keep',
              ]
            },
            {
              label:'ADMIRAL',
              sub:'151+ SLIPS',
              price:'$799',
              per:'/mo',
              badge:'ENTERPRISE',
              color:'rgba(255,255,255,0.04)',
              border:'rgba(255,255,255,0.12)',
              features:[
                'Everything in Captain',
                'Unlimited slips — no cap',
                'Skipper Portfolio — one login across every marina you own',
                'Custom Skipper training on your data',
                'Priority onboarding specialist',
                'White-label tenant portal',
                'SLA + priority support',
                'Dedicated account manager',
              ]
            }
          ].map(tier => (
            <div key={tier.label} style={{ background:tier.color, border:`2px solid ${tier.border}`, borderRadius:14, padding:24, position:'relative', display:'flex', flexDirection:'column' }}>
              {tier.badge && (
                <div style={{ position:'absolute', top:-14, left:'50%', transform:'translateX(-50%)', background:TEAL, color:NAVY, padding:'5px 16px', borderRadius:20, fontSize:10, fontWeight:800, whiteSpace:'nowrap', letterSpacing:'0.5px' }}>{tier.badge}</div>
              )}
              <div style={{ fontSize:15, color:TEAL, fontWeight:900, letterSpacing:'1px', marginBottom:2 }}>{tier.label}</div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', fontWeight:700, letterSpacing:'1px', marginBottom:14 }}>{tier.sub}</div>
              <div style={{ display:'flex', alignItems:'baseline', gap:4, marginBottom:4 }}>
                <span style={{ fontSize:40, fontWeight:900, letterSpacing:'-2px' }}>{tier.price}</span>
                <span style={{ color:'rgba(255,255,255,0.4)', fontSize:14 }}>{tier.per}</span>
              </div>
              <div style={{ fontSize:12, color:TEAL, fontWeight:600, marginBottom:4 }}>First month free</div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.35)', marginBottom:18 }}>No contracts · Cancel anytime</div>
              <div style={{ borderTop:'1px solid rgba(255,255,255,0.1)', paddingTop:16, flex:1, marginBottom:20 }}>
                {tier.features.map(f => (
                  <div key={f} style={{ display:'flex', gap:10, alignItems:'flex-start', marginBottom:10, fontSize:13, color:'rgba(255,255,255,0.8)' }}>
                    <span style={{ color:TEAL, flexShrink:0, marginTop:1 }}>✓</span>{f}
                  </div>
                ))}
              </div>
              <button onClick={() => router.push('/join')} style={{ width:'100%', padding:'13px', background: tier.border === TEAL ? TEAL : 'rgba(255,255,255,0.08)', color: tier.border === TEAL ? NAVY : '#fff', border:'none', borderRadius:8, fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:FONT }}>
                Get Started — First Month Free
              </button>
            </div>
          ))}
        </div>
        <p style={{ textAlign:'center', fontSize:13, color:'rgba(255,255,255,0.3)' }}>All plans include custom marina map build, full data migration, same-day onboarding, and ongoing support. No setup fees.</p>
      </div>

      {/* FAQ */}
      <div style={{ background:'rgba(255,255,255,0.02)', borderTop:'1px solid rgba(255,255,255,0.07)', padding:'80px 40px' }}>
        <div style={{ maxWidth:740, margin:'0 auto' }}>
          <h2 style={{ fontSize:36, fontWeight:900, letterSpacing:'-1.5px', textAlign:'center', marginBottom:48 }}>Questions we get a lot</h2>
          {[
            ['Do we have to stop using our current payment processor?','No. Skipper works with whatever you already use. Your terminal, your bank, your process. Skipper just logs what you record.'],
            ['What happens to our existing tenant data?','Skipper Gangway™ migrates it. Spreadsheets, Dockmaster, Marina Controller, Dockwa exports — we\'ve seen it all. Usually done same day.'],
            ['Do boaters need to download an app?','Nope. Skipper works over text, web, or native app. Most boaters just text Skipper like they would a person.'],
            ['What if we lose internet at the marina?','The Helm works on local network. Skipper goes to standby mode but your data and map are always accessible offline.'],
            ['Can we have multiple staff using Skipper?','Yes — unlimited staff accounts on all plans. Everyone talks to the same Skipper, sees the same data.'],
            ['Is there a long-term contract?','No. Month-to-month on all plans. We keep you because Skipper earns it, not because you\'re locked in.'],
          ].map(([q, a], i) => (
            <div key={i} style={{ borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width:'100%', padding:'20px 0', background:'none', border:'none', color:'#fff', textAlign:'left', fontSize:15, fontWeight:700, cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center', fontFamily:FONT }}>
                {q}
                <span style={{ color:TEAL, fontSize:20, flexShrink:0 }}>{openFaq === i ? '−' : '+'}</span>
              </button>
              {openFaq === i && <div style={{ paddingBottom:20, fontSize:14, color:'rgba(255,255,255,0.6)', lineHeight:1.75 }}>{a}</div>}
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════ SITELOGIC™ TEASER ═══════════════════════════════════ */}
      <div style={{ background:'linear-gradient(135deg, #061a10 0%, #0a1f1a 50%, #061a10 100%)', borderTop:'1px solid rgba(77,214,200,0.15)', borderBottom:'1px solid rgba(77,214,200,0.15)', padding:'80px 40px', textAlign:'center' }}>
        <div style={{ maxWidth:680, margin:'0 auto' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(77,214,200,0.08)', border:'1px solid rgba(77,214,200,0.2)', borderRadius:24, padding:'6px 16px', marginBottom:24 }}>
            <span style={{ fontSize:11, color:'rgba(100,230,180,0.9)', fontWeight:700, letterSpacing:'1.5px' }}>COMING SOON</span>
          </div>
          <h2 style={{ fontSize:'clamp(28px,4vw,42px)', fontWeight:900, letterSpacing:'-2px', margin:'0 0 16px', color:'#fff' }}>
            SiteLogic™ — Built for RV Parks & Campgrounds
          </h2>
          <p style={{ fontSize:16, color:'rgba(255,255,255,0.6)', lineHeight:1.75, marginBottom:32, maxWidth:560, margin:'0 auto 32px' }}>
            The same platform that runs marinas — rebuilt for RV parks, campgrounds, and outdoor hospitality. Same Asset Logic™ engine. Same Skipper. Same zero-fee model. If you manage sites instead of slips, SiteLogic™ is coming for you.
          </p>
          <button onClick={() => router.push('/join?type=rv')} style={{ padding:'16px 36px', background:'rgba(77,214,200,0.12)', color:TEAL, border:`1.5px solid ${TEAL}`, borderRadius:8, fontSize:15, fontWeight:700, cursor:'pointer', fontFamily:FONT, letterSpacing:'-0.2px' }}>
            Get Early Access →
          </button>
        </div>
      </div>

      {/* URGENCY CTA */}
      <div style={{ maxWidth:1000, margin:'60px auto 0', padding:'0 40px' }}>
        <div style={{ position:'relative', overflow:'hidden', borderRadius:20, padding:'64px 48px', textAlign:'center', background:'linear-gradient(135deg, #1a0d2e 0%, #0d2b4b 55%, #070f1a 100%)', border:'1px solid rgba(77,214,200,0.2)' }}>
          <h2 style={{ fontSize:'clamp(28px,4vw,44px)', fontWeight:900, letterSpacing:'-2px', margin:'0 0 18px', lineHeight:1.1, color:'#fff' }}>
            Every season you run it by hand is <span style={{ color:'#ffb347' }}>revenue you don't get back.</span>
          </h2>
          <p style={{ fontSize:16, color:'rgba(255,255,255,0.55)', maxWidth:560, margin:'0 auto 36px', lineHeight:1.7 }}>
            Empty slips while a tenant's away. Invoices chased by hand. A dock crew calling the office for answers Skipper could give instantly. AyeAyeSkipper gives you back the one thing you can't buy more of — <strong style={{ color:'#fff' }}>your time</strong>.
          </p>
          <div style={{ display:'flex', gap:16, justifyContent:'center', flexWrap:'wrap' }}>
            <button onClick={() => router.push('/join')} style={{ padding:'18px 40px', background:TEAL, color:NAVY, border:'none', borderRadius:8, fontSize:16, fontWeight:900, cursor:'pointer', fontFamily:FONT, letterSpacing:'-0.2px' }}>Start Your Free Trial →</button>
            <button onClick={() => router.push('/demo')} style={{ padding:'18px 40px', background:'transparent', color:'#fff', border:'1px solid rgba(255,255,255,0.25)', borderRadius:8, fontSize:16, fontWeight:600, cursor:'pointer', fontFamily:FONT }}>Book a Free Consultation</button>
          </div>
          <p style={{ marginTop:20, fontSize:12, color:'rgba(255,255,255,0.35)' }}>No credit card required. No contracts. See Skipper running your actual marina in days, not weeks.</p>
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding:'80px 40px 100px', textAlign:'center' }}>
        <div style={{ maxWidth:640, margin:'0 auto' }}>
          <h2 style={{ fontSize:48, fontWeight:900, letterSpacing:'-2.5px', margin:'0 0 20px', lineHeight:1.05 }}>Your marina.<br/><span style={{ color:TEAL }}>Your Skipper.</span></h2>
          <p style={{ fontSize:16, color:'rgba(255,255,255,0.55)', marginBottom:40, lineHeight:1.7 }}>We'll build your marina in 3D and have Skipper ready to run your operation by end of week. First month free. No commitment required.</p>
          <button onClick={() => router.push('/join')} style={{ padding:'20px 52px', background:TEAL, color:NAVY, border:'none', borderRadius:8, fontSize:18, fontWeight:900, cursor:'pointer', fontFamily:FONT, letterSpacing:'-0.3px' }}>Book a Free Demo</button>
          <p style={{ marginTop:16, fontSize:12, color:'rgba(255,255,255,0.25)' }}>We build your marina map at no cost. See Skipper running your actual marina before you pay a cent.</p>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ borderTop:'1px solid rgba(255,255,255,0.07)', padding:'48px 40px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:20 }}>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
            <img src="/skipper-avatar.jpg" alt="Skipper" style={{ width:28, height:28, borderRadius:'50%', objectFit:'cover' }} />
            <span style={{ fontWeight:900, fontSize:16 }}>AyeAyeSkipper</span>
          </div>
          <div style={{ fontSize:12, color:'rgba(255,255,255,0.3)' }}>Powered by Slip Logic™ · © 2026 Next-Gen Marine · Mariner and Sailor LLC</div>
        </div>
        <div style={{ display:'flex', gap:28 }}>
          {[['Privacy','#'],['Terms','/terms'],['Contact','mailto:sales@ayeayeskipper.com']].map(([l,h]) => (
            <a key={l} href={h} style={{ fontSize:13, color:'rgba(255,255,255,0.35)', textDecoration:'none' }}>{l}</a>
          ))}
        </div>
      </div>
    </div>
  )
}

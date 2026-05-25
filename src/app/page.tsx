'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

const NAVY = '#0d2b4b'
const TEAL = '#4dd6c8'
const DARK = '#070f1a'
const FONT = "system-ui,-apple-system,'Segoe UI',Roboto,sans-serif"

const SKIPPER_REPLIES: Record<string, string> = {
  price: "Plans start at $99/month — flat rate, no transaction fees, ever.",
  cost: "Plans start at $99/month — flat rate, no transaction fees, ever.",
  migrate: "Skipper Gangway™ migrates everything from Dockwa, Dockmaster, or spreadsheets. Usually done same day.",
  switch: "Skipper Gangway™ migrates everything from Dockwa, Dockmaster, or spreadsheets. Usually done same day.",
  dockwa: "Unlike Dockwa, we take zero transaction fees. Your customers stay YOUR customers — not theirs.",
  slip: "Slip Logic™ gives you a live color-coded map of every slip — green = paid, red = overdue, yellow = expiring.",
  hot: "Hot Slip™ lets annual tenants mark their slip available when they're away. Transients book it, tenant earns, marina profits.",
  booking: "Skipper handles transient bookings automatically — guest arrives, Skipper assigns a slip, charges, and sends a receipt.",
  contract: "Skipper sends leases digitally, tenant signs on their phone. Captured, timestamped, logged. No printer required.",
  train: "No training needed. Your team just talks to Skipper — text or voice. No manuals, no menus.",
}

function getSkipperReply(msg: string): string {
  const lower = msg.toLowerCase()
  for (const [key, reply] of Object.entries(SKIPPER_REPLIES)) {
    if (lower.includes(key)) return reply
  }
  return null as unknown as string
}

export default function Landing() {
  const router = useRouter()
  const [openFaq, setOpenFaq] = useState<number|null>(null)
  const [chatMsg, setChatMsg] = useState('')
  const [chatHistory, setChatHistory] = useState<{from:'user'|'skipper', text:string}[]>([])
  const [skipperTyping, setSkipperTyping] = useState(false)
  const chatRef = useRef<HTMLDivElement>(null)

  function sendChat() {
    const msg = chatMsg.trim()
    if (!msg || skipperTyping) return
    const reply = getSkipperReply(msg)
    const replyText = reply ?? "Great question! Let me show you in a live demo — I'll walk you through your actual marina. Book a free demo above! ⚓"
    setChatHistory(prev => [...prev, { from: 'user' as const, text: msg }])
    setChatMsg('')
    setSkipperTyping(true)
    setTimeout(() => chatRef.current?.scrollTo({ top: 9999, behavior: 'smooth' }), 30)
    // Human-ish delay: longer replies take a touch longer
    const delay = 800 + Math.min(replyText.length * 12, 700)
    setTimeout(() => {
      setSkipperTyping(false)
      setChatHistory(prev => [...prev, { from: 'skipper' as const, text: replyText }])
      setTimeout(() => chatRef.current?.scrollTo({ top: 9999, behavior: 'smooth' }), 30)
    }, delay)
  }

  return (
    <div style={{ minHeight:'100vh', background:DARK, fontFamily:FONT, color:'#fff' }}>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-14px); }
        }
        @keyframes bubble-in {
          0% { opacity: 0; transform: scale(0.8) translateY(10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes btn-pulse {
          0% { box-shadow: 0 0 0 0 rgba(77,214,200,0.4); }
          70% { box-shadow: 0 0 0 20px rgba(77,214,200,0); }
          100% { box-shadow: 0 0 0 0 rgba(77,214,200,0); }
        }
        @keyframes sonar {
          0% { transform: translate(-50%,-50%) scale(1); opacity: 0.6; }
          100% { transform: translate(-50%,-50%) scale(2.6); opacity: 0; }
        }
        @keyframes typing-dot {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>

      {/* HERO */}
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'80px 40px 60px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:40, alignItems:'center' }}>
        {/* LEFT: Copy */}
        <div>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(77,214,200,0.1)', border:'1px solid rgba(77,214,200,0.25)', borderRadius:24, padding:'6px 16px', marginBottom:28 }}>
            <span style={{ width:7, height:7, borderRadius:'50%', background:TEAL, display:'inline-block' }}></span>
            <span style={{ fontSize:12, color:TEAL, fontWeight:700, letterSpacing:'1px' }}>THE MARINA OS BUILT AROUND AI</span>
          </div>
          <h1 style={{ fontSize:'clamp(40px,5.5vw,76px)', fontWeight:900, letterSpacing:'-3px', lineHeight:1.0, margin:'0 0 24px' }}>
            We run on <span style={{ color:TEAL }}>Skipper.</span>
          </h1>
          <p style={{ fontSize:18, color:'rgba(255,255,255,0.65)', maxWidth:520, margin:'0 0 40px', lineHeight:1.7 }}>
            Slips. Tenants. Fuel. Storage. Guests. Contracts. Skipper manages your entire marina so your team can focus on the water — not the paperwork.
          </p>
          <div style={{ display:'flex', gap:14, flexWrap:'wrap' }}>
            <button onClick={() => router.push('/join')} style={{ padding:'18px 40px', background:TEAL, color:NAVY, border:'none', borderRadius:8, fontSize:16, fontWeight:800, cursor:'pointer', fontFamily:FONT, letterSpacing:'-0.3px', animation:'btn-pulse 2s infinite' }}>Book a Demo</button>
            <button onClick={() => router.push('/demo')} style={{ padding:'18px 40px', background:'rgba(255,255,255,0.06)', color:'#fff', border:'1px solid rgba(255,255,255,0.15)', borderRadius:8, fontSize:16, fontWeight:600, cursor:'pointer', fontFamily:FONT }}>See It Live →</button>
          </div>
          <p style={{ marginTop:20, fontSize:12, color:'rgba(255,255,255,0.3)' }}>No contracts. No setup fees. Your data, your marina, your money.</p>
        </div>

        {/* RIGHT: Skipper + Chat */}
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:24 }}>

          {/* Skipper circle with sonar rings */}
          <div style={{ position:'relative', display:'flex', justifyContent:'center', alignItems:'center', width:340, height:340 }}>
            {/* Sonar rings — 3 staggered */}
            {[0, 0.9, 1.8].map((delay, i) => (
              <div key={i} style={{
                position:'absolute',
                top:'50%', left:'50%',
                width:310, height:310,
                borderRadius:'50%',
                border:`2px solid rgba(77,214,200,${0.35 - i*0.08})`,
                animation:`sonar 2.7s ease-out ${delay}s infinite`,
                pointerEvents:'none',
              }} />
            ))}
            {/* Speech bubble */}
            <div style={{ position:'absolute', top:-14, right:-20, background:'#fff', color:'#0d2b4b', borderRadius:14, padding:'12px 16px', fontSize:12, fontWeight:700, maxWidth:210, boxShadow:'0 8px 40px rgba(0,0,0,0.35)', zIndex:10, lineHeight:1.5, animation:'bubble-in 0.6s ease 0.5s both' }}>
              Hey! I'm Skipper — ask me anything about running your marina.
              <div style={{ position:'absolute', bottom:-9, left:30, width:0, height:0, borderLeft:'9px solid transparent', borderRight:'9px solid transparent', borderTop:'9px solid #fff' }} />
            </div>
            {/* Skipper circle */}
            <div style={{
              width:280, height:280,
              borderRadius:'50%',
              overflow:'hidden',
              border:`4px solid rgba(77,214,200,0.6)`,
              boxShadow:'0 0 60px rgba(77,214,200,0.22), 0 20px 60px rgba(0,0,0,0.4)',
              animation:'float 3.5s ease-in-out infinite',
              flexShrink:0,
              background:'#122d4a',
              zIndex:5,
            }}>
              <img
                src="/skipper-avatar.jpg"
                alt="Skipper"
                style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center 10%' }}
              />
            </div>
          </div>

          {/* Chat box */}
          <div style={{ width:'100%', maxWidth:380, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(77,214,200,0.25)', borderRadius:16, overflow:'hidden' }}>
            {/* Chat history */}
            {(chatHistory.length > 0 || skipperTyping) && (
              <div ref={chatRef} style={{ maxHeight:180, overflowY:'auto', padding:'14px 16px', display:'flex', flexDirection:'column', gap:10 }}>
                {chatHistory.map((m, i) => (
                  <div key={i} style={{
                    alignSelf: m.from === 'user' ? 'flex-end' : 'flex-start',
                    background: m.from === 'user' ? TEAL : 'rgba(255,255,255,0.08)',
                    color: m.from === 'user' ? NAVY : '#fff',
                    borderRadius: m.from === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                    padding:'9px 13px',
                    fontSize:13,
                    maxWidth:'85%',
                    lineHeight:1.5,
                    fontWeight: m.from === 'skipper' ? 500 : 600,
                  }}>{m.text}</div>
                ))}
                {skipperTyping && (
                  <div style={{ alignSelf:'flex-start', background:'rgba(255,255,255,0.08)', borderRadius:'12px 12px 12px 2px', padding:'10px 16px', display:'flex', gap:5, alignItems:'center' }}>
                    {[0,0.2,0.4].map(d => (
                      <span key={d} style={{ width:7, height:7, borderRadius:'50%', background:'rgba(77,214,200,0.7)', display:'inline-block', animation:`typing-dot 1.2s ${d}s ease-in-out infinite` }} />
                    ))}
                  </div>
                )}
              </div>
            )}
            {/* Input row */}
            <div style={{ display:'flex', alignItems:'center', borderTop: chatHistory.length > 0 ? '1px solid rgba(255,255,255,0.07)' : 'none', padding:'12px 14px', gap:10 }}>
              <input
                value={chatMsg}
                onChange={e => setChatMsg(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendChat()}
                placeholder="Ask Skipper anything..."
                style={{ flex:1, background:'transparent', border:'none', outline:'none', color:'#fff', fontSize:14, fontFamily:FONT, '::placeholder': { color: 'rgba(255,255,255,0.35)' } } as React.CSSProperties}
              />
              <button
                onClick={sendChat}
                style={{ background:TEAL, color:NAVY, border:'none', borderRadius:8, padding:'8px 16px', fontSize:13, fontWeight:800, cursor:'pointer', fontFamily:FONT, flexShrink:0 }}
              >Ask ⚓</button>
            </div>
          </div>
        </div>
      </div>

      {/* STATS BAR */}
      <div style={{ borderTop:'1px solid rgba(255,255,255,0.07)', borderBottom:'1px solid rgba(255,255,255,0.07)', padding:'36px 40px', display:'flex', justifyContent:'center', gap:80, flexWrap:'wrap', background:'rgba(255,255,255,0.02)' }}>
        {[['$0','Platform fees. Ever.'],['0%','Transaction rake'],['100%','You own the customer'],['5 min','To onboard a new marina']].map(([n,l]) => (
          <div key={l} style={{ textAlign:'center' }}>
            <div style={{ fontSize:40, fontWeight:900, color:TEAL, letterSpacing:'-2px' }}>{n}</div>
            <div style={{ fontSize:13, color:'rgba(255,255,255,0.45)', marginTop:6 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* THE DIFFERENCE — vs Dockwa */}
      <div id="vs--dockwa" style={{ maxWidth:960, margin:'0 auto', padding:'100px 40px' }}>
        <div style={{ textAlign:'center', marginBottom:56 }}>
          <div style={{ fontSize:12, color:TEAL, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', marginBottom:12 }}>Why Marinas Are Switching</div>
          <h2 style={{ fontSize:42, fontWeight:900, letterSpacing:'-2px', margin:0 }}>You built the marina.<br/>You should own the business.</h2>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:3, borderRadius:16, overflow:'hidden' }}>
          {/* Header row */}
          <div style={{ background:'rgba(255,255,255,0.04)', padding:'16px 24px', fontWeight:700, fontSize:13, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:'1px' }}>The Old Way (Dockwa + others)</div>
          <div style={{ background:`${TEAL}15`, padding:'16px 24px', fontWeight:700, fontSize:13, color:TEAL, textTransform:'uppercase', letterSpacing:'1px', borderBottom:`1px solid ${TEAL}30` }}>⚓ AyeAyeSkipper</div>
          {[
            ['Platform takes a cut of every booking','Zero transaction fees. You keep 100%.'],
            ['They own the customer relationship','Your customers. Your data. Full stop.'],
            ['Your money flows through their system','Payments go directly to your bank account.'],
            ['Boaters book on Dockwa, not your marina','Boaters book with YOU — your brand, your rep.'],
            ['Rigid software built for a generic marina','Skipper learns YOUR marina. Every slip, every tenant.'],
            ['Switching means losing all your data','Skipper Gangway™ migrates everything in minutes.'],
            ['Your team learns new software','Just talk to Skipper. No training required.'],
            ['You pay per seat or per transaction','Flat monthly. One price. Everything included.'],
          ].map(([bad, good], i) => (
            <>
              <div key={`b${i}`} style={{ background:'rgba(255,255,255,0.025)', padding:'16px 24px', fontSize:14, color:'rgba(255,255,255,0.5)', display:'flex', alignItems:'center', gap:10, borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ color:'rgba(255,80,80,0.7)', fontSize:16, flexShrink:0 }}>✕</span>{bad}
              </div>
              <div key={`g${i}`} style={{ background:`${TEAL}08`, padding:'16px 24px', fontSize:14, color:'rgba(255,255,255,0.85)', display:'flex', alignItems:'center', gap:10, borderBottom:`1px solid ${TEAL}15` }}>
                <span style={{ color:TEAL, fontSize:16, flexShrink:0 }}>✓</span>{good}
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
              ['⚓','Slip Management + Slip Logic™','Color-coded live map of every slip. Green = paid. Red = overdue. Yellow = expiring. Skipper flags problems before you spot them.'],
              ['🔥','Hot Slip™','Annual tenants mark their slip available when they\'re away. Transients book it. Tenant earns. Marina profits. Everyone wins.'],
              ['💬','Just Talk to Skipper','No forms, no menus. Text or voice. "Who\'s overdue?" "Book Slip B12 for a 32-footer tonight." Skipper handles it.'],
              ['🗺️','Live Marina Map','Your exact marina in 2D. Every slip, mooring ball, pedestal, safety station — labeled, color-coded, and always current.'],
              ['⛽','Fuel Dock','Track tank levels, log every sale, set pump prices. Skipper alerts when it\'s time to reorder.'],
              ['🏗️','Storage & Assets','Rack storage, trailers, PWCs — every asset tracked with location history. Launch calendar built in.'],
              ['🛥️','Transient Bookings','Guest arrives, Skipper assigns a slip, calculates the charge, sends a receipt. Zero staff involvement.'],
              ['📋','Contracts + E-Sign','Skipper sends the lease, tenant signs on their phone. Captured, timestamped, logged. No printer required.'],
              ['📅','Wait List Intelligence','8 people waiting? When a slip opens, Skipper matches the best fit and notifies them automatically.'],
              ['🔌','Skipper Gangway™','Already on Dockmaster, Dockwa, Marina Controller, or spreadsheets? Skipper Gangway migrates everything. You\'re live the same day.'],
              ['📊','The Briefing Room','Every morning: who\'s arriving, who\'s departing, what\'s overdue, what the weather\'s doing. Skipper briefs you so you\'re never caught off guard.'],
              ['👤','Tenant Portal','Your tenants get their own Skipper-powered app. View their lease, pay invoices, request maintenance, check their slip.'],
            ].map(([icon, title, desc]) => (
              <div key={title} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:12, padding:28, transition:'border-color 0.2s' }}>
                <div style={{ fontSize:32, marginBottom:14 }}>{icon}</div>
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
              ['💳','You collect payments your way','Terminal, check, ACH, wire — Skipper logs whatever you record.'],
              ['🏦','Money goes to your bank','We never hold, process, or touch marina funds. Period.'],
              ['📊','Full payment tracking','Skipper knows who\'s paid, who\'s overdue, and who\'s about to expire.'],
              ['🔌','Optional Stripe setup','No processor yet? We help you set up your own Stripe. Straight to your account.'],
            ].map(([icon, title, desc]) => (
              <div key={title} style={{ display:'flex', gap:14, padding:'16px', background:'rgba(255,255,255,0.04)', borderRadius:10, border:'1px solid rgba(255,255,255,0.07)' }}>
                <span style={{ fontSize:22, flexShrink:0 }}>{icon}</span>
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
          <div style={{ fontSize:12, color:TEAL, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', marginBottom:12 }}>MARINAS ON BOARD</div>
          <h2 style={{ fontSize:42, fontWeight:900, letterSpacing:'-2px', margin:'0 0 14px' }}>Built with real marinas.<br/>Run by Skipper.</h2>
          <p style={{ color:'rgba(255,255,255,0.45)', fontSize:15, maxWidth:500, margin:'0 auto' }}>Our founding partners helped shape every feature.</p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:20 }}>
          {/* Partner card */}
          <div style={{ background:'rgba(255,255,255,0.04)', border:`2px solid rgba(77,214,200,0.35)`, borderRadius:14, padding:28, position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:`linear-gradient(90deg, ${TEAL}, rgba(77,214,200,0.3))` }} />
            <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(77,214,200,0.12)', border:`1px solid rgba(77,214,200,0.3)`, borderRadius:20, padding:'3px 12px', marginBottom:16 }}>
              <span style={{ width:6, height:6, borderRadius:'50%', background:TEAL, display:'inline-block' }}></span>
              <span style={{ fontSize:11, color:TEAL, fontWeight:700, letterSpacing:'0.5px' }}>FOUNDING PARTNER</span>
            </div>
            <div style={{ fontWeight:900, fontSize:20, letterSpacing:'-0.5px', marginBottom:6 }}>Bayside Marina</div>
            <div style={{ fontSize:13, color:'rgba(255,255,255,0.45)', marginBottom:16 }}>📍 Demo Bay, FL</div>
            <div style={{ fontSize:13, color:'rgba(255,255,255,0.6)', display:'flex', gap:16 }}>
              <span>43 slips</span>
              <span style={{ color:TEAL }}>🔥 Hot Slip™ Active</span>
            </div>
          </div>
          {/* CTA card */}
          <a href="/join" style={{ background:'rgba(77,214,200,0.04)', border:`2px dashed rgba(77,214,200,0.25)`, borderRadius:14, padding:28, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textDecoration:'none', color:'#fff', textAlign:'center', minHeight:160, transition:'border-color 0.2s, background 0.2s' }}>
            <div style={{ fontSize:32, marginBottom:12 }}>⚓</div>
            <div style={{ fontWeight:700, fontSize:16, color:TEAL, letterSpacing:'-0.3px' }}>Your marina could be next →</div>
            <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', marginTop:6 }}>Join as a founding partner</div>
          </a>
        </div>
      </div>

      {/* PRICING */}
      <div id="pricing" style={{ maxWidth:1000, margin:'0 auto', padding:'100px 40px' }}>
        <div style={{ textAlign:'center', marginBottom:56 }}>
          <div style={{ fontSize:12, color:TEAL, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', marginBottom:12 }}>Simple, honest pricing</div>
          <h2 style={{ fontSize:42, fontWeight:900, letterSpacing:'-2px', margin:'0 0 12px' }}>One flat fee. Everything included.</h2>
          <p style={{ color:'rgba(255,255,255,0.45)', fontSize:15 }}>No transaction fees. No booking commissions. No surprises.</p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20 }}>
          {[
            { name:'First Mate', price:'$99', per:'/mo', slips:'Up to 50 slips', color:'rgba(255,255,255,0.04)', border:'rgba(255,255,255,0.1)', features:['Skipper AI (unlimited)', 'Slip management', 'Tenant profiles', 'Live marina map', 'Transient bookings', 'Tenant portal', 'Email support'] },
            { name:'Captain', price:'$249', per:'/mo', slips:'Up to 150 slips', color:`${NAVY}`, border:TEAL, popular:true, features:['Everything in First Mate', 'Hot Slip™ transient revenue', 'Fuel dock module', 'Rack storage tracking', 'Contracts + e-sign', 'The Briefing Room', 'SMS via Skipper', 'Priority support'] },
            { name:'Commodore', price:'Custom', per:'', slips:'Unlimited slips', color:'rgba(255,255,255,0.04)', border:'rgba(255,255,255,0.1)', features:['Everything in Captain', 'Skipper Gangway™ migration', 'Multi-marina dashboard', 'QuickBooks integration', 'Custom Skipper training', 'Dedicated onboarding', 'SLA + phone support'] },
          ].map(tier => (
            <div key={tier.name} style={{ background:tier.color, border:`2px solid ${tier.border}`, borderRadius:14, padding:28, position:'relative' }}>
              {tier.popular && <div style={{ position:'absolute', top:-13, left:'50%', transform:'translateX(-50%)', background:TEAL, color:NAVY, padding:'4px 16px', borderRadius:20, fontSize:11, fontWeight:800, whiteSpace:'nowrap' }}>MOST POPULAR</div>}
              <div style={{ fontSize:13, color:TEAL, fontWeight:700, marginBottom:6 }}>{tier.name}</div>
              <div style={{ display:'flex', alignItems:'baseline', gap:4, marginBottom:4 }}>
                <span style={{ fontSize:42, fontWeight:900, letterSpacing:'-2px' }}>{tier.price}</span>
                <span style={{ color:'rgba(255,255,255,0.4)', fontSize:14 }}>{tier.per}</span>
              </div>
              <div style={{ fontSize:13, color:'rgba(255,255,255,0.45)', marginBottom:20 }}>{tier.slips}</div>
              <div style={{ borderTop:'1px solid rgba(255,255,255,0.1)', paddingTop:18, marginBottom:24 }}>
                {tier.features.map(f => (
                  <div key={f} style={{ display:'flex', gap:8, alignItems:'center', marginBottom:10, fontSize:13, color:'rgba(255,255,255,0.75)' }}>
                    <span style={{ color:TEAL, flexShrink:0 }}>✓</span>{f}
                  </div>
                ))}
              </div>
              <button onClick={() => { if (tier.price === 'Custom') { window.location.href = 'mailto:sales@ayeayeskipper.com' } else { router.push('/join') } }} style={{ width:'100%', padding:'12px', background: tier.popular ? TEAL : 'rgba(255,255,255,0.08)', color: tier.popular ? NAVY : '#fff', border:'none', borderRadius:7, fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:FONT }}>
                {tier.price === 'Custom' ? 'Contact Us' : 'Get Started'}
              </button>
            </div>
          ))}
        </div>
        <p style={{ textAlign:'center', marginTop:28, fontSize:13, color:'rgba(255,255,255,0.3)' }}>No contracts. Cancel anytime. All plans include setup, onboarding, and your marina map.</p>
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

      {/* CTA */}
      <div style={{ padding:'100px 40px', textAlign:'center' }}>
        <div style={{ maxWidth:640, margin:'0 auto' }}>
          <h2 style={{ fontSize:48, fontWeight:900, letterSpacing:'-2.5px', margin:'0 0 20px', lineHeight:1.05 }}>Your marina.<br/><span style={{ color:TEAL }}>Your Skipper.</span></h2>
          <p style={{ fontSize:16, color:'rgba(255,255,255,0.55)', marginBottom:40, lineHeight:1.7 }}>We'll build your marina in 3D and have Skipper ready to run your operation by end of week. No commitment required.</p>
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

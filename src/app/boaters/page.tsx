'use client'
import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

const NAVY = '#0d2b4b'
const TEAL = '#4dd6c8'
const DARK = '#070f1a'
const FONT = "system-ui,-apple-system,'Segoe UI',Roboto,sans-serif"

export default function BoatersPage() {
  const router = useRouter()

  const [chatMsg,      setChatMsg]      = useState('')
  const [chatLoading,  setChatLoading]  = useState(false)
  const [lastExchange, setLastExchange] = useState<{ user: string; reply: string } | null>(null)
  const chatRef = useRef<HTMLDivElement>(null)

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
        body: JSON.stringify({ message, mode: 'boater' }),
      })
      const data = await res.json()
      setLastExchange({ user: message, reply: data.reply ?? '' })
    } catch {
      setLastExchange({ user: message, reply: "Aye aye — having a little trouble right now. Head to /marinas to browse slips. ⚓" })
    } finally {
      setChatLoading(false)
      setTimeout(() => chatRef.current?.scrollTo({ top: 9999, behavior: 'smooth' }), 60)
    }
  }

  const PROMPT_CHIPS = [
    'Talk to your marina right now',
    'Find a slip near me this weekend',
    'Log my trip — miles, crew, fuel',
    'Track my boat\'s full history',
    'What\'s the Boat Fax feature?',
    'Ask Skipper anything',
  ]

  return (
    <div style={{ minHeight:'100vh', background:DARK, fontFamily:FONT, color:'#fff' }}>

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
        @keyframes bounce {
          0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)}
        }
      `}</style>

      {/* ═══════════════════════ HERO — SKIPPER FRONT AND CENTER ═══════════════════════ */}
      <div style={{ background:NAVY, padding:'80px 40px 60px', textAlign:'center' }}>

        {/* Badge */}
        <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(77,214,200,0.1)', border:'1px solid rgba(77,214,200,0.25)', borderRadius:24, padding:'6px 16px', marginBottom:28 }}>
          <span style={{ width:7, height:7, borderRadius:'50%', background:TEAL, display:'inline-block' }}></span>
          <span style={{ fontSize:12, color:TEAL, fontWeight:700, letterSpacing:'1px' }}>FREE FOR BOATERS — ALWAYS</span>
        </div>

        {/* Headline */}
        <h1 style={{ fontSize:'clamp(36px,5vw,52px)', fontWeight:900, letterSpacing:'-2px', lineHeight:1.05, margin:'0 0 12px', color:'#fff' }}>
          Your boat. Your marina.<br/><span style={{ color:TEAL }}>All in Skipper.</span>
        </h1>
        <p style={{ fontSize:17, color:'rgba(255,255,255,0.5)', margin:'0 0 36px', maxWidth:480, lineHeight:1.65, marginLeft:'auto', marginRight:'auto' }}>
          Talk to your marina, log trips, track your boat's full history, and book slips — no phone calls, no paperwork, no app learning curve.
        </p>

        {/* Skipper avatar */}
        <div style={{ display:'flex', justifyContent:'center', marginBottom:28 }}>
          <div style={{ position:'relative', display:'flex', justifyContent:'center', alignItems:'center', width:130, height:130 }}>
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
        <div style={{ maxWidth:560, margin:'0 auto 14px' }}>
          <div style={{ display:'flex', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(77,214,200,0.3)', borderRadius:12, overflow:'hidden' }}>
            <input
              value={chatMsg}
              onChange={e => setChatMsg(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendChat()}
              placeholder="Ask Skipper about your boat, marina, slips..."
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
        <div style={{ display:'flex', justifyContent:'center', gap:10, flexWrap:'wrap', maxWidth:640, margin:'0 auto 32px' }}>
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

        {/* CTA */}
        <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
          <button onClick={() => window.location.href='https://app.ayeayeskipper.com'} style={{ padding:'16px 36px', background:TEAL, color:NAVY, border:'none', borderRadius:8, fontSize:15, fontWeight:800, cursor:'pointer', fontFamily:FONT, letterSpacing:'-0.3px' }}>
            Get Started Free →
          </button>
          <button onClick={() => router.push('/marinas')} style={{ padding:'16px 36px', background:'rgba(255,255,255,0.06)', color:'#fff', border:'1px solid rgba(255,255,255,0.15)', borderRadius:8, fontSize:15, fontWeight:600, cursor:'pointer', fontFamily:FONT }}>
            Browse Marinas
          </button>
        </div>
        <p style={{ marginTop:14, fontSize:12, color:'rgba(255,255,255,0.3)' }}>Free forever. No credit card. No catch.</p>
      </div>

      {/* FEATURES */}
      <div style={{ maxWidth:1000, margin:'0 auto', padding:'80px 40px' }}>
        <div style={{ textAlign:'center', marginBottom:56 }}>
          <div style={{ fontSize:12, color:TEAL, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', marginBottom:12 }}>Everything for boaters</div>
          <h2 style={{ fontSize:38, fontWeight:900, letterSpacing:'-2px', margin:0 }}>Your boat's command center.</h2>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:20 }}>
          {[
            ['💬','Talk to your marina instantly','No calls. No hold music. No office hours. Message your dock master, request a pump-out, flag a slip issue, ask about your bill — all through Skipper. Skipper handles it.'],
            ['🗺️','Find a slip, book it fast','See which transient slips are open right now at Skipper-powered marinas. Request and get confirmed fast — no callbacks.'],
            ['📓','Ship\'s Log','Every trip logged: departure, destination, distance, crew aboard, weather and sea state, fuel used, engine hours start and end, notes. Your permanent nautical record.'],
            ['🚗','Boat Fax™','Every haul-out, every service, every maintenance record, every engine hour — time-stamped and permanent. Like Carfax for your boat. Sell your boat someday? Hand over the full history.'],
            ['🛥️','Vessel management','Full specs, HIN, registration, unlimited photos by category. Tenders and dinghies linked to the parent vessel. Your boat\'s passport lives in Skipper.'],
            ['⚙️','Engine tracking','Hours logged per engine. Service intervals. Full history. Never miss a service again.'],
            ['🔥','Hot Slip™','Annual slip at a Skipper marina? List it when you\'re cruising and earn back. Need a slip somewhere new? Book a listed one at a "full" marina. First program of its kind.'],
            ['🔌','Transient booking','Find marinas with available slips, check rates and amenities, book instantly across the Skipper network.'],
            ['⚓','Ask Skipper anything','Weather, tides, boating regs, troubleshooting, docking tips — Skipper knows boating. Ask anything, get a real answer fast.'],
          ].map(([icon, title, desc]) => (
            <div key={title as string} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:12, padding:28 }}>
              <div style={{ fontSize:32, marginBottom:14 }}>{icon}</div>
              <div style={{ fontWeight:800, fontSize:16, marginBottom:8, letterSpacing:'-0.3px' }}>{title}</div>
              <div style={{ fontSize:13, color:'rgba(255,255,255,0.55)', lineHeight:1.7 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* BOAT FAX CALLOUT */}
      <div style={{ background:'linear-gradient(135deg, #061528 0%, #0a1f1a 100%)', borderTop:'1px solid rgba(77,214,200,0.15)', borderBottom:'1px solid rgba(77,214,200,0.15)', padding:'80px 40px', textAlign:'center' }}>
        <div style={{ maxWidth:640, margin:'0 auto' }}>
          <div style={{ fontSize:48, marginBottom:16 }}>🚗</div>
          <h2 style={{ fontSize:'clamp(28px,4vw,40px)', fontWeight:900, letterSpacing:'-2px', margin:'0 0 16px', color:'#fff' }}>
            Carfax for your boat.
          </h2>
          <p style={{ fontSize:16, color:'rgba(255,255,255,0.6)', lineHeight:1.75, marginBottom:32, maxWidth:520, margin:'0 auto 32px' }}>
            Skipper stores every haul-out, every service record, every maintenance job, every engine hour — permanently attached to your vessel. When you sell, you hand over a complete history that protects you and tells the full story of your boat's life.
          </p>
          <button onClick={() => window.location.href='https://app.ayeayeskipper.com'} style={{ padding:'16px 36px', background:TEAL, color:NAVY, border:'none', borderRadius:8, fontSize:15, fontWeight:800, cursor:'pointer', fontFamily:FONT }}>
            Start your boat's history →
          </button>
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
            Ready to put Skipper<br/><span style={{ color:TEAL }}>on your boat?</span>
          </h2>
          <p style={{ fontSize:16, color:'rgba(255,255,255,0.5)', marginBottom:36, lineHeight:1.65 }}>
            Free forever. Everything for boaters — marina comms, trip logs, vessel history, slip booking — in one place.
          </p>
          <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
            <button onClick={() => window.location.href='https://app.ayeayeskipper.com'} style={{ padding:'18px 44px', background:TEAL, color:NAVY, border:'none', borderRadius:8, fontSize:17, fontWeight:900, cursor:'pointer', fontFamily:FONT, letterSpacing:'-0.3px' }}>
              Get Started Free →
            </button>
            <button onClick={() => router.push('/marinas')} style={{ padding:'18px 44px', background:'rgba(255,255,255,0.06)', color:'#fff', border:'1px solid rgba(255,255,255,0.15)', borderRadius:8, fontSize:17, fontWeight:600, cursor:'pointer', fontFamily:FONT }}>
              Browse Marinas
            </button>
          </div>
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

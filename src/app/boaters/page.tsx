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
      setLastExchange({ user: message, reply: "Aye aye — I'm having a little trouble right now. Head to /marinas to browse slips. ⚓" })
    } finally {
      setChatLoading(false)
      setTimeout(() => chatRef.current?.scrollTo({ top: 9999, behavior: 'smooth' }), 60)
    }
  }

  const PROMPT_CHIPS = [
    'Find a slip near me',
    'What is Hot Slip™?',
    'Is it free for boaters?',
    'How do I book a slip?',
  ]

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

      {/* SKIPPER CHAT — BOATER */}
      <div style={{ background:'#0a1e32', padding:'80px 40px' }}>
        <div style={{ maxWidth:680, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:40 }}>
            <div style={{ fontSize:12, color:TEAL, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', marginBottom:12 }}>Ask Skipper Anything</div>
            <h2 style={{ fontSize:'clamp(28px,4vw,42px)', fontWeight:900, letterSpacing:'-1.5px', margin:'0 0 12px', lineHeight:1.1 }}>
              Your boating assistant.<br/>No hold music. No voicemail.
            </h2>
            <p style={{ fontSize:15, color:'rgba(255,255,255,0.45)', lineHeight:1.65, maxWidth:480, margin:'0 auto' }}>
              Ask about Hot Slip™ availability, how booking works, or just find your next marina.
            </p>
          </div>

          {/* Chat card */}
          <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(77,214,200,0.2)', borderRadius:20, overflow:'hidden' }}>

            {/* Header */}
            <div style={{ display:'flex', alignItems:'center', gap:14, padding:'18px 24px', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ width:44, height:44, borderRadius:'50%', background:'linear-gradient(135deg,#4dd6c8,#1a4a8e)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>⚓</div>
              <div>
                <div style={{ fontWeight:800, fontSize:15, letterSpacing:'-0.3px' }}>Skipper</div>
                <div style={{ fontSize:12, color:TEAL, display:'flex', alignItems:'center', gap:5 }}>
                  <span style={{ width:6, height:6, borderRadius:'50%', background:TEAL, display:'inline-block' }}></span>
                  Online — ask me anything
                </div>
              </div>
            </div>

            {/* Messages */}
            <div ref={chatRef} style={{ padding:'24px', minHeight:160, maxHeight:300, overflowY:'auto' }}>
              {!lastExchange && (
                <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
                  <div style={{ width:32, height:32, borderRadius:'50%', background:'linear-gradient(135deg,#4dd6c8,#1a4a8e)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>⚓</div>
                  <div style={{ background:'rgba(255,255,255,0.06)', borderRadius:'0 14px 14px 14px', padding:'12px 16px', maxWidth:'85%' }}>
                    <p style={{ margin:0, fontSize:14, color:'rgba(255,255,255,0.85)', lineHeight:1.6 }}>
                      Hey! I&apos;m Skipper — I help boaters find slips, understand marinas, and skip the phone tag. What are you looking for?
                    </p>
                  </div>
                </div>
              )}
              {lastExchange && (
                <>
                  <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:14 }}>
                    <div style={{ background:'rgba(77,214,200,0.15)', border:'1px solid rgba(77,214,200,0.25)', borderRadius:'14px 14px 0 14px', padding:'10px 14px', maxWidth:'80%', fontSize:14, color:'#fff', lineHeight:1.55 }}>
                      {lastExchange.user}
                    </div>
                  </div>
                  <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
                    <div style={{ width:32, height:32, borderRadius:'50%', background:'linear-gradient(135deg,#4dd6c8,#1a4a8e)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>⚓</div>
                    <div style={{ background:'rgba(255,255,255,0.06)', borderRadius:'0 14px 14px 14px', padding:'12px 16px', maxWidth:'85%' }}>
                      {chatLoading && !lastExchange.reply
                        ? <div style={{ display:'flex', gap:5, alignItems:'center' }}>{[0,1,2].map(i=><span key={i} style={{ width:7, height:7, borderRadius:'50%', background:'rgba(77,214,200,0.5)', display:'inline-block', animation:`bounce 1s ${i*0.2}s infinite` }}/>)}</div>
                        : <p style={{ margin:0, fontSize:14, color:'rgba(255,255,255,0.85)', lineHeight:1.6 }}>{lastExchange.reply}</p>
                      }
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Prompt chips */}
            {!lastExchange && (
              <div style={{ display:'flex', flexWrap:'wrap', gap:8, padding:'0 24px 16px' }}>
                {PROMPT_CHIPS.map(chip => (
                  <button key={chip} onClick={() => sendChat(chip)}
                    style={{ padding:'7px 14px', background:'rgba(77,214,200,0.08)', border:'1px solid rgba(77,214,200,0.25)', borderRadius:20, fontSize:12, color:TEAL, cursor:'pointer', fontFamily:FONT, fontWeight:600, whiteSpace:'nowrap' }}>
                    {chip}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div style={{ padding:'0 16px 16px', display:'flex', gap:10 }}>
              <input
                value={chatMsg}
                onChange={e => setChatMsg(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendChat()}
                placeholder="Ask about slips, Hot Slip™, booking, anything..."
                style={{ flex:1, background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:10, padding:'12px 16px', color:'#fff', fontSize:14, fontFamily:FONT, outline:'none' }}
              />
              <button onClick={() => sendChat()} disabled={chatLoading || !chatMsg.trim()}
                style={{ padding:'12px 20px', background: chatLoading || !chatMsg.trim() ? 'rgba(77,214,200,0.3)' : TEAL, color: NAVY, border:'none', borderRadius:10, fontSize:14, fontWeight:800, cursor: chatLoading || !chatMsg.trim() ? 'not-allowed' : 'pointer', fontFamily:FONT, transition:'background 0.15s' }}>
                {chatLoading ? '…' : '→'}
              </button>
            </div>
          </div>

          <p style={{ textAlign:'center', marginTop:14, fontSize:12, color:'rgba(255,255,255,0.25)' }}>
            Free forever. No account needed to chat.
          </p>
        </div>
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

      <style>{`
        @keyframes bounce {
          0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)}
        }
      `}</style>
    </div>
  )
}

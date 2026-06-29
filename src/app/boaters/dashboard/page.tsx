'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

const NAVY = '#0d2b4b', TEAL = '#4dd6c8', DARK = '#070f1a'
const FONT = "system-ui,-apple-system,'Segoe UI',Roboto,sans-serif"

type Account  = { email: string; first_name?: string; last_name?: string }
type MarinaConn = { marina_id: string; contact_id: string; auth_user_id: string; marina_name: string; marina_city: string | null; marina_state: string | null }
type Msg = { id: string; direction: 'inbound' | 'outbound'; sender_name: string; body: string; created_at: string; channel: string }

export default function BoaterDashboard() {
  const router  = useRouter()
  const [account,  setAccount]  = useState<Account | null>(null)
  const [marinas,  setMarinas]  = useState<MarinaConn[]>([])
  const [active,   setActive]   = useState<MarinaConn | null>(null)
  const [messages, setMessages] = useState<Msg[]>([])
  const [input,    setInput]    = useState('')
  const [sending,  setSending]  = useState(false)
  const [loadingMsgs, setLoadingMsgs] = useState(false)
  const [view,     setView]     = useState<'home' | 'chat'>('home')
  const bottomRef  = useRef<HTMLDivElement>(null)
  const pollRef    = useRef<ReturnType<typeof setInterval> | null>(null)

  // Load session
  useEffect(() => {
    const raw = localStorage.getItem('boater_account')
    if (!raw) { router.replace('/boaters/auth'); return }
    try {
      const acct = JSON.parse(raw) as Account
      setAccount(acct)
      fetchMarinas(acct.email)
    } catch { router.replace('/boaters/auth') }
  }, [router])

  async function fetchMarinas(email: string) {
    try {
      const res = await fetch(`/api/boaters/marinas?email=${encodeURIComponent(email)}`)
      const d   = await res.json()
      setMarinas(d.marinas ?? [])
    } catch { /* silent */ }
  }

  async function openChat(marina: MarinaConn) {
    setActive(marina)
    setView('chat')
    setMessages([])
    setLoadingMsgs(true)
    await loadMessages(marina)
    setLoadingMsgs(false)
    // Poll for new messages every 8 seconds
    if (pollRef.current) clearInterval(pollRef.current)
    pollRef.current = setInterval(() => loadMessages(marina), 8000)
  }

  async function loadMessages(marina: MarinaConn) {
    if (!account) return
    try {
      const res = await fetch(`/api/boaters/messages?email=${encodeURIComponent(account.email)}&marina_id=${marina.marina_id}`)
      const d   = await res.json()
      setMessages(d.messages ?? [])
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 60)
    } catch { /* silent */ }
  }

  async function sendMessage() {
    if (!input.trim() || !active || !account || sending) return
    const body = input.trim()
    setInput('')
    setSending(true)
    // Optimistic: show boater message immediately
    const tempId = 'temp-' + Date.now()
    const tempMsg: Msg = { id: tempId, direction: 'inbound', sender_name: 'You', body, created_at: new Date().toISOString(), channel: 'web' }
    setMessages(prev => [...prev, tempMsg])
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 60)
    try {
      // Build conversation history for engine context
      const history = messages.slice(-12).map(m => ({
        role:    m.direction === 'inbound' ? 'user' : 'assistant',
        content: m.body,
      }))
      const res = await fetch('/api/boaters/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: account.email, marina_id: active.marina_id, body, history }),
      })
      const data = await res.json()
      // Refresh thread from DB — engine wrote both messages (inbound + reply)
      await loadMessages(active)
      // If engine returned a reply but DB refresh didn't catch it yet, show inline
      if (data.reply && data.reply !== '') {
        setMessages(prev => {
          const hasReply = prev.some(m => m.direction === 'outbound' && m.body === data.reply)
          if (hasReply) return prev
          return [...prev, { id: 'reply-' + Date.now(), direction: 'outbound', sender_name: 'Skipper', body: data.reply, created_at: new Date().toISOString(), channel: 'web' }]
        })
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 60)
      }
    } catch { /* silent */ }
    setSending(false)
  }

  // Cleanup poll on unmount
  useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current) }, [])

  function signOut() {
    if (pollRef.current) clearInterval(pollRef.current)
    localStorage.removeItem('boater_account')
    localStorage.removeItem('boater_email')
    router.push('/boaters/auth')
  }

  if (!account) return <div style={{ minHeight: '100vh', background: DARK }} />

  const name = [account.first_name, account.last_name].filter(Boolean).join(' ') || account.email.split('@')[0]

  return (
    <div style={{ minHeight: '100vh', background: DARK, fontFamily: FONT, color: '#fff', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{ background: NAVY, borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {view === 'chat' && active ? (
            <button onClick={() => { setView('home'); if (pollRef.current) clearInterval(pollRef.current) }}
              style={{ background: 'none', border: 'none', color: TEAL, cursor: 'pointer', fontSize: 20, padding: '0 8px 0 0', fontFamily: FONT }}>←</button>
          ) : null}
          <img src="/skipper-avatar.jpg" alt="Skipper" style={{ width: 32, height: 32, borderRadius: '50%', border: `2px solid ${TEAL}` }} />
          <div>
            <div style={{ fontSize: 14, fontWeight: 800 }}>
              {view === 'chat' && active ? active.marina_name : 'AyeAyeSkipper'}
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
              {view === 'chat' && active
                ? [active.marina_city, active.marina_state].filter(Boolean).join(', ')
                : name}
            </div>
          </div>
        </div>
        <button onClick={signOut} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 6, color: 'rgba(255,255,255,0.4)', fontSize: 12, padding: '5px 12px', cursor: 'pointer', fontFamily: FONT }}>
          Sign Out
        </button>
      </div>

      {/* HOME VIEW */}
      {view === 'home' && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px 20px', maxWidth: 620, margin: '0 auto', width: '100%' }}>

          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 24, fontWeight: 900, letterSpacing: '-0.8px', marginBottom: 4 }}>Hey {name} 👋</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{account.email}</div>
          </div>

          {/* Marina connections — messaging */}
          {marinas.length > 0 && (
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 12 }}>Your Marinas</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {marinas.map(m => (
                  <button key={m.marina_id} onClick={() => openChat(m)}
                    style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(77,214,200,0.06)', border: `1px solid ${TEAL}33`, borderRadius: 12, padding: '14px 18px', cursor: 'pointer', fontFamily: FONT, textAlign: 'left', width: '100%' }}>
                    <span style={{ fontSize: 24 }}>⚓</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{m.marina_name}</div>
                      {(m.marina_city || m.marina_state) && (
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
                          {[m.marina_city, m.marina_state].filter(Boolean).join(', ')}
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 12, color: TEAL, fontWeight: 600 }}>Message</span>
                      <span style={{ color: TEAL, fontSize: 16 }}>›</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {marinas.length === 0 && (
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '20px', marginBottom: 28, textAlign: 'center' }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>⚓</div>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>No marina connections yet</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>
                When a Skipper-powered marina adds you as a tenant, they&apos;ll appear here and you can message them directly.
              </div>
            </div>
          )}

          {/* Quick links */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 12 }}>Explore</div>
            {[
              { icon: '🗺️', label: 'Browse Marinas', desc: 'Find slips, request transient docking', href: '/marinas' },
              { icon: '💬', label: 'Ask Skipper', desc: 'Weather, tides, boating questions', href: '/boaters' },
              { icon: '⚓', label: 'Find a Slip', desc: 'Available transient slips near you', href: '/transient' },
            ].map(link => (
              <button key={link.href} onClick={() => router.push(link.href)}
                style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '14px 16px', cursor: 'pointer', fontFamily: FONT, textAlign: 'left', width: '100%', marginBottom: 8 }}>
                <span style={{ fontSize: 22 }}>{link.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{link.label}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{link.desc}</div>
                </div>
                <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 16 }}>›</span>
              </button>
            ))}
          </div>

          {/* Open app option */}
          <div style={{ marginTop: 24, background: `linear-gradient(135deg,rgba(77,214,200,0.08),rgba(13,43,75,0.3))`, border: `1px solid ${TEAL}33`, borderRadius: 12, padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 3 }}>Full Skipper experience</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Ship&apos;s log, vessel history, engine tracking</div>
            </div>
            <a href="https://app.ayeayeskipper.com" target="_blank" rel="noreferrer"
              style={{ padding: '10px 20px', background: TEAL, color: NAVY, borderRadius: 8, fontSize: 13, fontWeight: 800, textDecoration: 'none', fontFamily: FONT }}>
              Open App →
            </a>
          </div>
        </div>
      )}

      {/* CHAT VIEW */}
      {view === 'chat' && active && (
        <>
          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 680, margin: '0 auto', width: '100%' }}>
            {loadingMsgs && (
              <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 13, padding: '40px 0' }}>Loading messages…</div>
            )}
            {!loadingMsgs && messages.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>💬</div>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>Start a conversation</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>
                  Message {active.marina_name} directly. Skipper will respond right away.
                </div>
              </div>
            )}
            {messages.map(msg => {
              const isBoater = msg.direction === 'inbound'
              return (
                <div key={msg.id} style={{ display: 'flex', justifyContent: isBoater ? 'flex-end' : 'flex-start', gap: 8 }}>
                  {!isBoater && (
                    <img src="/skipper-avatar.jpg" alt="Marina" style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0, marginTop: 4, border: `1px solid ${TEAL}55` }} />
                  )}
                  <div style={{ maxWidth: '78%' }}>
                    {!isBoater && (
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 4 }}>{msg.sender_name}</div>
                    )}
                    <div style={{
                      background: isBoater ? TEAL : 'rgba(255,255,255,0.08)',
                      color: isBoater ? NAVY : '#fff',
                      borderRadius: isBoater ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                      padding: '10px 14px',
                      fontSize: 14,
                      lineHeight: 1.55,
                      fontWeight: isBoater ? 600 : 400,
                    }}>
                      {msg.body}
                    </div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 4, textAlign: isBoater ? 'right' : 'left' }}>
                      {new Date(msg.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                    </div>
                  </div>
                </div>
              )
            })}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '12px 16px', background: 'rgba(0,0,0,0.3)', flexShrink: 0 }}>
            <div style={{ display: 'flex', gap: 10, maxWidth: 680, margin: '0 auto' }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                placeholder={`Message ${active.marina_name}…`}
                style={{ flex: 1, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, color: '#fff', fontSize: 14, padding: '11px 14px', outline: 'none', fontFamily: FONT }}
              />
              <button onClick={sendMessage} disabled={!input.trim() || sending}
                style={{ background: TEAL, color: NAVY, border: 'none', borderRadius: 10, width: 44, fontSize: 18, fontWeight: 900, cursor: input.trim() && !sending ? 'pointer' : 'not-allowed', opacity: input.trim() && !sending ? 1 : 0.4 }}>
                ↑
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

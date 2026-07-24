'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'

const NAVY = '#0d2b4b'
const TEAL = '#4dd6c8'
const DARK = '#070f1a'
const FONT = "system-ui,-apple-system,'Segoe UI',Roboto,sans-serif"

type Tab = 'slip' | 'invoices' | 'messages' | 'hot-slip' | 'book'

// ─── helpers ────────────────────────────────────────────────────────────────
function fmt$$(cents: number | null | undefined) {
  if (cents == null) return '—'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100)
}
function fmtDate(d: string | null | undefined) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
function fmtDateShort(d: string | null | undefined) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// ─── types ───────────────────────────────────────────────────────────────────
interface SlipData {
  slip?: { label?: string; slip_type?: string; length_ft?: number; beam_ft?: number; marina_name?: string; marina_city?: string; marina_state?: string }
  vessel?: { asset_name?: string; make?: string; length_ft?: number; beam_ft?: number; vessel_type?: string }
  lease?: { start_date?: string; end_date?: string; rate_per_month?: number; status?: string }
}
interface Invoice {
  id: string; invoice_number?: string; status?: string; total_cents?: number; due_date?: string; issued_date?: string
  line_items?: { description?: string; quantity?: number; unit_price_cents?: number; total_cents?: number }[]
}
interface Message {
  id: string; body?: string; sender_type?: string; created_at?: string; read_at?: string | null
}
interface HotSlipOffer {
  id: string; start_date?: string; end_date?: string; status?: string
}
interface Marina { id: string; name?: string; city?: string; state?: string; total_slips?: number }
interface HotSlipResult {
  id: string; label?: string; slip_type?: string; length_ft?: number; beam_ft?: number
  marina_id?: string; marina_name?: string; marina_city?: string; start_date?: string; end_date?: string
}

// ─── status badge ────────────────────────────────────────────────────────────
function Badge({ s }: { s?: string }) {
  const map: Record<string, [string, string]> = {
    paid: ['#22c55e', '#052e16'],
    active: ['#22c55e', '#052e16'],
    pending: ['#f59e0b', '#1c0f00'],
    overdue: ['#ef4444', '#1f0000'],
    draft: ['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.6)'],
    cancelled: ['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.4)'],
    booked: ['#4dd6c8', '#022822'],
    available: ['#22c55e', '#052e16'],
  }
  const [bg, color] = map[s?.toLowerCase() ?? ''] ?? ['rgba(255,255,255,0.12)', 'rgba(255,255,255,0.5)']
  return (
    <span style={{ display: 'inline-block', background: bg, color, fontSize: 11, fontWeight: 700, borderRadius: 20, padding: '2px 10px', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
      {s ?? 'unknown'}
    </span>
  )
}

// ─── card wrapper ─────────────────────────────────────────────────────────────
function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 14, padding: '24px', marginBottom: 16, ...style }}>
      {children}
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.38)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, marginBottom: 4 }}>{children}</div>
}
function Value({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 14 }}>{children}</div>
}

function Empty({ icon, msg }: { icon: string; msg: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px', color: 'rgba(255,255,255,0.3)' }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontSize: 14 }}>{msg}</div>
    </div>
  )
}

function Spinner() {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
      <div style={{ width: 32, height: 32, border: '3px solid rgba(255,255,255,0.1)', borderTopColor: TEAL, borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto' }} />
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
export default function BoaterDashboard() {
  const router = useRouter()
  const [tab, setTab]             = useState<Tab>('slip')
  const [email, setEmail]         = useState<string | null>(null)
  const [account, setAccount]     = useState<{ first_name?: string; last_name?: string; email?: string } | null>(null)

  // slip
  const [slipData, setSlipData]   = useState<SlipData | null>(null)
  const [slipLoading, setSlipLoading] = useState(false)

  // invoices
  const [invoices, setInvoices]   = useState<Invoice[]>([])
  const [invLoading, setInvLoading] = useState(false)
  const [expandedInv, setExpandedInv] = useState<string | null>(null)

  // messages
  const [marinas, setMarinas]     = useState<{ marina_id: string; marina_name: string }[]>([])
  const [selMarina, setSelMarina] = useState<string | null>(null)
  const [messages, setMessages]   = useState<Message[]>([])
  const [msgLoading, setMsgLoading] = useState(false)
  const [chatInput, setChatInput] = useState('')
  const [chatSending, setChatSending] = useState(false)
  const msgRef = useRef<HTMLDivElement>(null)

  // hot slip
  const [offers, setOffers]       = useState<HotSlipOffer[]>([])
  const [points, setPoints]       = useState(0)
  const [hotLoading, setHotLoading] = useState(false)
  const [newStart, setNewStart]   = useState('')
  const [newEnd, setNewEnd]       = useState('')
  const [offerSaving, setOfferSaving] = useState(false)
  const [offerErr, setOfferErr]   = useState('')

  // book a slip
  const [marinaSearch, setMarinaSearch] = useState('')
  const [marinaResults, setMarinaResults] = useState<Marina[]>([])
  const [marinaSearching, setMarinaSearching] = useState(false)
  const [bookMarina, setBookMarina] = useState<Marina | null>(null)
  const [bookArrival, setBookArrival] = useState('')
  const [bookDeparture, setBookDeparture] = useState('')
  const [bookLoa, setBookLoa]     = useState('')
  const [bookBeam, setBookBeam]   = useState('')
  const [availSlips, setAvailSlips] = useState<HotSlipResult[]>([])
  const [searching, setSearching] = useState(false)
  const [bookSubmitting, setBookSubmitting] = useState(false)
  const [bookDone, setBookDone]   = useState(false)
  const [bookErr, setBookErr]     = useState('')

  // ── auth guard ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return
    const e = localStorage.getItem('boater_email')
    if (!e) { router.replace('/boaters/auth'); return }
    setEmail(e)
    try {
      const a = localStorage.getItem('boater_account')
      if (a) setAccount(JSON.parse(a))
    } catch { /* */ }
  }, [router])

  // ── load slip ──────────────────────────────────────────────────────────
  const loadSlip = useCallback(async (e: string) => {
    setSlipLoading(true)
    const res = await fetch(`/api/boaters/slip?email=${encodeURIComponent(e)}`).catch(() => null)
    if (res?.ok) { const d = await res.json(); setSlipData(d) }
    setSlipLoading(false)
  }, [])

  // ── load invoices ──────────────────────────────────────────────────────
  const loadInvoices = useCallback(async (e: string) => {
    setInvLoading(true)
    const res = await fetch(`/api/boaters/invoices?email=${encodeURIComponent(e)}`).catch(() => null)
    if (res?.ok) { const d = await res.json(); setInvoices(d.invoices ?? []) }
    setInvLoading(false)
  }, [])

  // ── load marinas ──────────────────────────────────────────────────────
  const loadMarinas = useCallback(async (e: string) => {
    const res = await fetch(`/api/boaters/marinas?email=${encodeURIComponent(e)}`).catch(() => null)
    if (res?.ok) {
      const d = await res.json()
      setMarinas(d.marinas ?? [])
      if (d.marinas?.length) setSelMarina(d.marinas[0].marina_id)
    }
  }, [])

  // ── load messages ──────────────────────────────────────────────────────
  const loadMessages = useCallback(async (e: string, marinaId: string) => {
    setMsgLoading(true)
    const res = await fetch(`/api/boaters/messages?email=${encodeURIComponent(e)}&marina_id=${marinaId}`).catch(() => null)
    if (res?.ok) { const d = await res.json(); setMessages(d.messages ?? []) }
    setMsgLoading(false)
    setTimeout(() => msgRef.current?.scrollTo({ top: 9999, behavior: 'smooth' }), 60)
  }, [])

  // ── load hot slip ──────────────────────────────────────────────────────
  const loadHotSlip = useCallback(async (e: string) => {
    setHotLoading(true)
    const res = await fetch(`/api/boaters/hot-slip?email=${encodeURIComponent(e)}`).catch(() => null)
    if (res?.ok) { const d = await res.json(); setOffers(d.offers ?? []); setPoints(d.points_balance ?? d.points ?? 0) }
    setHotLoading(false)
  }, [])

  // ── tab switch → auto-load ─────────────────────────────────────────────
  useEffect(() => {
    if (!email) return
    if (tab === 'slip' && !slipData && !slipLoading) loadSlip(email)
    if (tab === 'invoices' && !invoices.length && !invLoading) loadInvoices(email)
    if (tab === 'messages' && !marinas.length && !msgLoading) loadMarinas(email)
    if (tab === 'hot-slip' && !hotLoading) loadHotSlip(email)
  }, [tab, email, slipData, slipLoading, invoices.length, invLoading, marinas.length, msgLoading, hotLoading, loadSlip, loadInvoices, loadMarinas, loadHotSlip])

  // ── load messages when marina selected ────────────────────────────────
  useEffect(() => {
    if (email && selMarina && tab === 'messages') loadMessages(email, selMarina)
  }, [email, selMarina, tab, loadMessages])

  // ── send message ──────────────────────────────────────────────────────
  async function sendMessage() {
    if (!chatInput.trim() || chatSending || !email || !selMarina) return
    const body = chatInput.trim()
    setChatInput('')
    setChatSending(true)
    setMessages(prev => [...prev, { id: 'tmp', body, sender_type: 'boater', created_at: new Date().toISOString() }])
    setTimeout(() => msgRef.current?.scrollTo({ top: 9999, behavior: 'smooth' }), 60)
    const res = await fetch('/api/boaters/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, marina_id: selMarina, body }),
    }).catch(() => null)
    if (res?.ok) {
      const d = await res.json()
      if (d.reply) {
        setMessages(prev => [...prev, { id: 'reply-' + Date.now(), body: d.reply, sender_type: 'skipper', created_at: new Date().toISOString() }])
        setTimeout(() => msgRef.current?.scrollTo({ top: 9999, behavior: 'smooth' }), 60)
      }
    }
    setChatSending(false)
  }

  // ── add hot slip offer ─────────────────────────────────────────────────
  async function addOffer() {
    if (!newStart || !newEnd || !email) return setOfferErr('Select start and end dates')
    if (newEnd <= newStart) return setOfferErr('End date must be after start date')
    setOfferSaving(true); setOfferErr('')
    const res = await fetch('/api/boaters/hot-slip', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, start_date: newStart, end_date: newEnd }),
    }).catch(() => null)
    if (res?.ok) {
      setNewStart(''); setNewEnd('')
      loadHotSlip(email)
    } else {
      const d = await res?.json().catch(() => ({}))
      setOfferErr(d?.error ?? 'Failed to save — please try again')
    }
    setOfferSaving(false)
  }

  // ── delete hot slip offer ─────────────────────────────────────────────
  async function deleteOffer(id: string) {
    if (!email) return
    await fetch(`/api/boaters/hot-slip?email=${encodeURIComponent(email)}&offer_id=${id}`, { method: 'DELETE' })
    setOffers(prev => prev.filter(o => o.id !== id))
  }

  // ── marina search ─────────────────────────────────────────────────────
  async function searchMarinas() {
    if (!marinaSearch.trim()) return
    setMarinaSearching(true)
    const res = await fetch(`/api/marinas?search=${encodeURIComponent(marinaSearch)}`).catch(() => null)
    if (res?.ok) { const d = await res.json(); setMarinaResults(d.marinas ?? []) }
    setMarinaSearching(false)
  }

  // ── search available slips ────────────────────────────────────────────
  async function searchAvailSlips() {
    if (!bookMarina || !bookArrival || !bookDeparture) return
    setSearching(true); setAvailSlips([])
    const qs = new URLSearchParams({
      marina_id: bookMarina.id,
      arrival: bookArrival,
      departure: bookDeparture,
      ...(bookLoa ? { loa_ft: bookLoa } : {}),
      ...(bookBeam ? { beam_ft: bookBeam } : {}),
    })
    const res = await fetch(`/api/boaters/available-slips?${qs}`).catch(() => null)
    if (res?.ok) { const d = await res.json(); setAvailSlips(d.slips ?? d.available_slips ?? []) }
    setSearching(false)
  }

  // ── submit transient request ──────────────────────────────────────────
  async function submitRequest(slipId?: string) {
    if (!bookMarina || !bookArrival || !bookDeparture || !email) return
    setBookSubmitting(true); setBookErr('')
    const a = account
    const res = await fetch('/api/transient-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        marina_id: bookMarina.id,
        contact_name: [a?.first_name, a?.last_name].filter(Boolean).join(' ') || email,
        contact_email: email,
        arrival_date: bookArrival,
        departure_date: bookDeparture,
        loa_ft: bookLoa ? Number(bookLoa) : null,
        beam_ft: bookBeam ? Number(bookBeam) : null,
        requested_slip_id: slipId ?? null,
        source: 'web-dashboard',
      }),
    }).catch(() => null)
    if (res?.ok) { setBookDone(true) }
    else {
      const d = await res?.json().catch(() => ({}))
      setBookErr(d?.error ?? 'Something went wrong — please try again')
    }
    setBookSubmitting(false)
  }

  function signOut() {
    localStorage.removeItem('boater_email')
    localStorage.removeItem('boater_account')
    localStorage.removeItem('boater_access_token')
    localStorage.removeItem('boater_refresh_token')
    router.push('/boaters/auth')
  }

  if (!email) return null // redirecting

  const firstName = account?.first_name || email?.split('@')[0] || 'Captain'

  // ─── UI ────────────────────────────────────────────────────────────────

  const TABS: { id: Tab; icon: string; label: string }[] = [
    { id: 'slip',     icon: '⚓', label: 'My Slip'    },
    { id: 'invoices', icon: '📄', label: 'Invoices'   },
    { id: 'messages', icon: '💬', label: 'Messages'   },
    { id: 'hot-slip', icon: '🔥', label: 'Hot Slip'   },
    { id: 'book',     icon: '🗺️', label: 'Book a Slip' },
  ]

  const inp: React.CSSProperties = {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 8,
    color: '#fff',
    fontSize: 14,
    fontFamily: FONT,
    padding: '10px 14px',
    outline: 'none',
    boxSizing: 'border-box',
  }

  const btnTeal: React.CSSProperties = {
    background: TEAL, color: NAVY, border: 'none', borderRadius: 8,
    padding: '10px 20px', fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: FONT,
  }

  const btnGhost: React.CSSProperties = {
    background: 'rgba(255,255,255,0.06)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 8, padding: '10px 18px', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: FONT,
  }

  return (
    <div style={{ minHeight: '100vh', background: DARK, fontFamily: FONT, color: '#fff' }}>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.25); }
        input:focus, textarea:focus { border-color: rgba(77,214,200,0.45) !important; }
        .tab-btn:hover { background: rgba(255,255,255,0.07) !important; }
        .msg-bubble-boater { align-self: flex-end; background: ${TEAL}; color: ${NAVY}; border-radius: 16px 16px 3px 16px; }
        .msg-bubble-other  { align-self: flex-start; background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.9); border-radius: 16px 16px 16px 3px; }
        .marina-row:hover { background: rgba(255,255,255,0.07) !important; cursor: pointer; }
        .offer-row:hover { background: rgba(255,255,255,0.05) !important; }
        .slip-result:hover { border-color: rgba(77,214,200,0.4) !important; }
      `}</style>

      {/* ── Top bar ── */}
      <div style={{ background: NAVY, borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 22 }}>⚓</span>
          <span style={{ color: TEAL, fontWeight: 800, fontSize: 16, letterSpacing: '-0.4px' }}>Skipper</span>
          <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 13, marginLeft: 4 }}>/ Boater Dashboard</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>Hi, {firstName}</span>
          <button onClick={signOut} style={{ ...btnGhost, padding: '6px 14px', fontSize: 12 }}>Sign out</button>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 20px' }}>

        {/* ── Tab bar ── */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 24, overflowX: 'auto', paddingBottom: 2 }}>
          {TABS.map(t => (
            <button
              key={t.id}
              className="tab-btn"
              onClick={() => setTab(t.id)}
              style={{
                background: tab === t.id ? 'rgba(77,214,200,0.12)' : 'transparent',
                border: tab === t.id ? '1px solid rgba(77,214,200,0.35)' : '1px solid rgba(255,255,255,0.08)',
                color: tab === t.id ? TEAL : 'rgba(255,255,255,0.55)',
                borderRadius: 8, padding: '9px 18px', fontSize: 14, fontWeight: tab === t.id ? 700 : 500,
                cursor: 'pointer', fontFamily: FONT, whiteSpace: 'nowrap', flexShrink: 0,
                transition: 'all 0.15s',
              }}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* ══════════════════ MY SLIP ══════════════════ */}
        {tab === 'slip' && (
          <div>
            {slipLoading && <Spinner />}
            {!slipLoading && !slipData?.slip && !slipData?.lease && (
              <Empty icon="⚓" msg="No active slip on file. Contact your marina to get set up." />
            )}
            {!slipLoading && (slipData?.slip || slipData?.vessel || slipData?.lease) && (
              <>
                {slipData?.slip && (
                  <Card>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                      <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: '-0.4px' }}>Your Slip</div>
                      <Badge s={slipData.lease?.status ?? 'active'} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '4px 24px' }}>
                      {slipData.slip.label && <><Label>Slip</Label><Value>{slipData.slip.label}</Value></>}
                      {slipData.slip.slip_type && <><Label>Type</Label><Value style={{ textTransform: 'capitalize' }}>{slipData.slip.slip_type}</Value></>}
                      {slipData.slip.length_ft && <><Label>Length</Label><Value>{slipData.slip.length_ft} ft</Value></>}
                      {slipData.slip.beam_ft && <><Label>Beam</Label><Value>{slipData.slip.beam_ft} ft</Value></>}
                      {slipData.slip.marina_name && <><Label>Marina</Label><Value>{slipData.slip.marina_name}{slipData.slip.marina_city ? `, ${slipData.slip.marina_city}, ${slipData.slip.marina_state}` : ''}</Value></>}
                    </div>
                  </Card>
                )}

                {slipData?.vessel && (
                  <Card>
                    <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: '-0.4px', marginBottom: 20 }}>Your Vessel</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '4px 24px' }}>
                      {slipData.vessel.asset_name && <><Label>Vessel Name</Label><Value>{slipData.vessel.asset_name}</Value></>}
                      {slipData.vessel.make && <><Label>Make</Label><Value>{slipData.vessel.make}</Value></>}
                      {slipData.vessel.vessel_type && <><Label>Type</Label><Value style={{ textTransform: 'capitalize' }}>{slipData.vessel.vessel_type}</Value></>}
                      {slipData.vessel.length_ft && <><Label>LOA</Label><Value>{slipData.vessel.length_ft} ft</Value></>}
                      {slipData.vessel.beam_ft && <><Label>Beam</Label><Value>{slipData.vessel.beam_ft} ft</Value></>}
                    </div>
                  </Card>
                )}

                {slipData?.lease && (
                  <Card>
                    <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: '-0.4px', marginBottom: 20 }}>Lease</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '4px 24px' }}>
                      <><Label>Start</Label><Value>{fmtDate(slipData.lease.start_date)}</Value></>
                      <><Label>End</Label><Value>{fmtDate(slipData.lease.end_date)}</Value></>
                      {slipData.lease.rate_per_month && <><Label>Monthly Rate</Label><Value>{fmt$$(slipData.lease.rate_per_month ? slipData.lease.rate_per_month * 100 : null)}</Value></>}
                    </div>
                  </Card>
                )}
              </>
            )}
          </div>
        )}

        {/* ══════════════════ INVOICES ══════════════════ */}
        {tab === 'invoices' && (
          <div>
            {invLoading && <Spinner />}
            {!invLoading && !invoices.length && (
              <Empty icon="📄" msg="No invoices found." />
            )}
            {!invLoading && invoices.map(inv => (
              <Card key={inv.id} style={{ cursor: 'pointer' }}>
                <div
                  onClick={() => setExpandedInv(expandedInv === inv.id ? null : inv.id)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{inv.invoice_number ?? `Invoice #${inv.id.slice(0,8)}`}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 3 }}>Due {fmtDate(inv.due_date)} · Issued {fmtDate(inv.issued_date)}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
                    <div style={{ fontSize: 18, fontWeight: 800 }}>{fmt$$(inv.total_cents)}</div>
                    <Badge s={inv.status} />
                    <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 16 }}>{expandedInv === inv.id ? '▲' : '▼'}</span>
                  </div>
                </div>

                {expandedInv === inv.id && inv.line_items?.length ? (
                  <div style={{ marginTop: 16, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 16 }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                          <th style={{ textAlign: 'left', paddingBottom: 8, fontWeight: 700 }}>Description</th>
                          <th style={{ textAlign: 'right', paddingBottom: 8, fontWeight: 700 }}>Qty</th>
                          <th style={{ textAlign: 'right', paddingBottom: 8, fontWeight: 700 }}>Unit</th>
                          <th style={{ textAlign: 'right', paddingBottom: 8, fontWeight: 700 }}>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {inv.line_items.map((li, i) => (
                          <tr key={i} style={{ borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: 14 }}>
                            <td style={{ padding: '8px 0', color: 'rgba(255,255,255,0.8)' }}>{li.description ?? '—'}</td>
                            <td style={{ padding: '8px 0', textAlign: 'right', color: 'rgba(255,255,255,0.5)' }}>{li.quantity ?? 1}</td>
                            <td style={{ padding: '8px 0', textAlign: 'right', color: 'rgba(255,255,255,0.5)' }}>{fmt$$(li.unit_price_cents)}</td>
                            <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 600 }}>{fmt$$(li.total_cents)}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr style={{ borderTop: '1px solid rgba(255,255,255,0.12)' }}>
                          <td colSpan={3} style={{ paddingTop: 10, fontWeight: 700, fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>Total</td>
                          <td style={{ paddingTop: 10, textAlign: 'right', fontWeight: 800, fontSize: 16 }}>{fmt$$(inv.total_cents)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                ) : expandedInv === inv.id ? (
                  <div style={{ marginTop: 16, fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>No line items on file.</div>
                ) : null}
              </Card>
            ))}
          </div>
        )}

        {/* ══════════════════ MESSAGES ══════════════════ */}
        {tab === 'messages' && (
          <div>
            {!marinas.length && !msgLoading && (
              <Empty icon="💬" msg="No marina connection found. Your marina needs to add you to their system first." />
            )}

            {marinas.length > 1 && (
              <div style={{ marginBottom: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {marinas.map(m => (
                  <button
                    key={m.marina_id}
                    onClick={() => setSelMarina(m.marina_id)}
                    style={{
                      ...btnGhost,
                      borderColor: selMarina === m.marina_id ? `rgba(77,214,200,0.5)` : 'rgba(255,255,255,0.12)',
                      color: selMarina === m.marina_id ? TEAL : 'rgba(255,255,255,0.6)',
                      fontSize: 13,
                    }}
                  >
                    {m.marina_name}
                  </button>
                ))}
              </div>
            )}

            {marinas.length > 0 && (
              <Card style={{ display: 'flex', flexDirection: 'column', height: 520, padding: 0, overflow: 'hidden' }}>
                {/* header */}
                <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)', fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>💬</span>
                  <span>{marinas.find(m => m.marina_id === selMarina)?.marina_name ?? 'Your Marina'}</span>
                </div>

                {/* messages */}
                <div
                  ref={msgRef}
                  style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}
                >
                  {msgLoading && <Spinner />}
                  {!msgLoading && !messages.length && (
                    <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: 13, paddingTop: 40 }}>
                      No messages yet — send one below ↓
                    </div>
                  )}
                  {messages.map((m, i) => {
                    const isBoater = m.sender_type === 'boater'
                    return (
                      <div key={m.id ?? i} style={{ display: 'flex', flexDirection: 'column' }}>
                        <div
                          className={isBoater ? 'msg-bubble-boater' : 'msg-bubble-other'}
                          style={{ maxWidth: '75%', padding: '10px 14px', fontSize: 14, lineHeight: 1.5, alignSelf: isBoater ? 'flex-end' : 'flex-start', borderRadius: isBoater ? '16px 16px 3px 16px' : '16px 16px 16px 3px' }}
                        >
                          {!isBoater && (
                            <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 4, color: TEAL, opacity: 0.8 }}>
                              {m.sender_type === 'skipper' ? '⚓ Skipper' : 'Marina'}
                            </div>
                          )}
                          {m.body}
                        </div>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', marginTop: 3, alignSelf: isBoater ? 'flex-end' : 'flex-start', padding: '0 4px' }}>
                          {m.created_at ? new Date(m.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : ''}
                        </div>
                      </div>
                    )
                  })}
                  {chatSending && (
                    <div style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.06)', borderRadius: '16px 16px 16px 3px', padding: '10px 18px', display: 'flex', gap: 5 }}>
                      {[0, 0.2, 0.4].map(d => (
                        <span key={d} style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(77,214,200,0.6)', display: 'inline-block', animation: `spin 1s ${d}s ease-in-out infinite` }} />
                      ))}
                    </div>
                  )}
                </div>

                {/* input */}
                <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: 8 }}>
                  <input
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                    placeholder="Message your marina…"
                    style={{ ...inp, flex: 1, fontSize: 14 }}
                  />
                  <button onClick={sendMessage} disabled={chatSending || !chatInput.trim()} style={{ ...btnTeal, padding: '10px 18px', opacity: chatSending || !chatInput.trim() ? 0.6 : 1 }}>↑</button>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* ══════════════════ HOT SLIP ══════════════════ */}
        {tab === 'hot-slip' && (
          <div>
            {hotLoading && <Spinner />}
            {!hotLoading && (
              <>
                {/* Points balance */}
                <Card style={{ background: 'linear-gradient(135deg, rgba(77,214,200,0.12) 0%, rgba(13,43,75,0.6) 100%)', border: '1px solid rgba(77,214,200,0.25)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: 11, color: TEAL, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 6 }}>🔥 Hot Slip™ Points Balance</div>
                      <div style={{ fontSize: 36, fontWeight: 900, letterSpacing: '-1px' }}>{(points / 100).toFixed(2)} pts</div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>Earned when your slip is used by a transient boater</div>
                    </div>
                    <div style={{ fontSize: 48 }}>🔥</div>
                  </div>
                </Card>

                {/* Add new offer */}
                <Card>
                  <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 16 }}>List Your Slip</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 16, lineHeight: 1.5 }}>
                    Going away? List your dates below. Transient boaters can book your slip — you earn points.
                  </div>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                    <div style={{ flex: 1, minWidth: 140 }}>
                      <Label>Away From</Label>
                      <input type="date" value={newStart} onChange={e => { setNewStart(e.target.value); setOfferErr('') }} style={{ ...inp, width: '100%' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 140 }}>
                      <Label>Away Until</Label>
                      <input type="date" value={newEnd} onChange={e => { setNewEnd(e.target.value); setOfferErr('') }} style={{ ...inp, width: '100%' }} />
                    </div>
                    <button onClick={addOffer} disabled={offerSaving || !newStart || !newEnd} style={{ ...btnTeal, opacity: offerSaving || !newStart || !newEnd ? 0.6 : 1 }}>
                      {offerSaving ? 'Saving…' : '+ List Dates'}
                    </button>
                  </div>
                  {offerErr && <div style={{ color: '#f87171', fontSize: 13, marginTop: 10 }}>{offerErr}</div>}
                </Card>

                {/* Existing offers */}
                {!offers.length && (
                  <Empty icon="📅" msg="No away dates listed. Add dates above to start earning." />
                )}
                {offers.map(o => (
                  <Card key={o.id} className="offer-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15 }}>{fmtDateShort(o.start_date)} → {fmtDateShort(o.end_date)}</div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 3 }}>
                        {o.start_date && o.end_date
                          ? `${Math.round((new Date(o.end_date).getTime() - new Date(o.start_date).getTime()) / 86400000)} days`
                          : ''}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <Badge s={o.status ?? 'available'} />
                      <button
                        onClick={() => deleteOffer(o.id)}
                        style={{ background: 'rgba(239,68,68,0.12)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 6, padding: '6px 12px', fontSize: 12, cursor: 'pointer', fontFamily: FONT }}
                      >Remove</button>
                    </div>
                  </Card>
                ))}
              </>
            )}
          </div>
        )}

        {/* ══════════════════ BOOK A SLIP ══════════════════ */}
        {tab === 'book' && (
          <div>
            {bookDone ? (
              <Card style={{ textAlign: 'center', padding: '60px 20px' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Request sent!</div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 28 }}>
                  The marina will confirm your slip shortly. Check your email at {email} for updates.
                </div>
                <button onClick={() => { setBookDone(false); setAvailSlips([]); setBookMarina(null) }} style={btnTeal}>
                  Book another slip →
                </button>
              </Card>
            ) : (
              <>
                {/* Step 1 — find marina */}
                {!bookMarina && (
                  <Card>
                    <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 16 }}>Find a Marina</div>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                      <input
                        value={marinaSearch}
                        onChange={e => setMarinaSearch(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && searchMarinas()}
                        placeholder="City, state, or marina name…"
                        style={{ ...inp, flex: 1 }}
                      />
                      <button onClick={searchMarinas} disabled={marinaSearching} style={{ ...btnTeal, opacity: marinaSearching ? 0.7 : 1 }}>
                        {marinaSearching ? '…' : 'Search'}
                      </button>
                    </div>
                    {marinaResults.map(m => (
                      <div
                        key={m.id}
                        className="marina-row"
                        onClick={() => { setBookMarina(m); setMarinaResults([]) }}
                        style={{ padding: '12px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)', marginBottom: 8, background: 'rgba(255,255,255,0.03)', transition: 'background 0.15s' }}
                      >
                        <div style={{ fontWeight: 700, fontSize: 14 }}>{m.name}</div>
                        {(m.city || m.state) && <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{[m.city, m.state].filter(Boolean).join(', ')}</div>}
                      </div>
                    ))}
                  </Card>
                )}

                {/* Step 2 — dates + dims */}
                {bookMarina && (
                  <>
                    <Card>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                        <div style={{ fontSize: 15, fontWeight: 800 }}>{bookMarina.name}</div>
                        <button onClick={() => { setBookMarina(null); setAvailSlips([]) }} style={{ ...btnGhost, fontSize: 12, padding: '5px 12px' }}>Change marina</button>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10, marginBottom: 16 }}>
                        <div>
                          <Label>Arrival</Label>
                          <input type="date" value={bookArrival} onChange={e => setBookArrival(e.target.value)} style={{ ...inp, width: '100%' }} />
                        </div>
                        <div>
                          <Label>Departure</Label>
                          <input type="date" value={bookDeparture} onChange={e => setBookDeparture(e.target.value)} style={{ ...inp, width: '100%' }} />
                        </div>
                        <div>
                          <Label>Vessel LOA (ft)</Label>
                          <input type="number" placeholder="e.g. 35" value={bookLoa} onChange={e => setBookLoa(e.target.value)} style={{ ...inp, width: '100%' }} />
                        </div>
                        <div>
                          <Label>Beam (ft)</Label>
                          <input type="number" placeholder="e.g. 12" value={bookBeam} onChange={e => setBookBeam(e.target.value)} style={{ ...inp, width: '100%' }} />
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        <button
                          onClick={searchAvailSlips}
                          disabled={searching || !bookArrival || !bookDeparture}
                          style={{ ...btnTeal, opacity: searching || !bookArrival || !bookDeparture ? 0.6 : 1 }}
                        >
                          {searching ? 'Searching…' : '🔥 Check Hot Slip™ Availability'}
                        </button>
                        <button
                          onClick={() => submitRequest()}
                          disabled={bookSubmitting || !bookArrival || !bookDeparture}
                          style={{ ...btnGhost, opacity: bookSubmitting || !bookArrival || !bookDeparture ? 0.6 : 1 }}
                        >
                          {bookSubmitting ? 'Sending…' : 'Request Any Available Slip'}
                        </button>
                      </div>
                      {bookErr && <div style={{ color: '#f87171', fontSize: 13, marginTop: 10 }}>{bookErr}</div>}
                    </Card>

                    {/* Step 3 — available hot slips */}
                    {availSlips.length > 0 && (
                      <Card>
                        <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 4 }}>🔥 Hot Slip™ Availability</div>
                        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 16 }}>
                          These slips are listed by annual tenants going away. Book one directly.
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                          {availSlips.map(s => (
                            <div
                              key={s.id}
                              className="slip-result"
                              style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, transition: 'border-color 0.15s' }}
                            >
                              <div>
                                <div style={{ fontWeight: 700, fontSize: 15 }}>Slip {s.label ?? s.id.slice(0, 8)}</div>
                                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 3 }}>
                                  {s.slip_type ?? ''}{s.length_ft ? ` · ${s.length_ft}ft` : ''}{s.beam_ft ? ` · ${s.beam_ft}ft beam` : ''}
                                </div>
                                {s.start_date && s.end_date && (
                                  <div style={{ fontSize: 12, color: TEAL, marginTop: 4, fontWeight: 600 }}>
                                    Available {fmtDateShort(s.start_date)} – {fmtDateShort(s.end_date)}
                                  </div>
                                )}
                              </div>
                              <button
                                onClick={() => submitRequest(s.id)}
                                disabled={bookSubmitting}
                                style={{ ...btnTeal, flexShrink: 0, opacity: bookSubmitting ? 0.7 : 1 }}
                              >
                                Book →
                              </button>
                            </div>
                          ))}
                        </div>
                      </Card>
                    )}

                    {!searching && availSlips.length === 0 && bookArrival && bookDeparture && (
                      <Card style={{ textAlign: 'center', padding: '32px 20px' }}>
                        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 14 }}>
                          No Hot Slip™ listings found for those dates. You can still request any available slip from the marina.
                        </div>
                        <button
                          onClick={() => submitRequest()}
                          disabled={bookSubmitting}
                          style={{ ...btnTeal, opacity: bookSubmitting ? 0.7 : 1 }}
                        >
                          {bookSubmitting ? 'Sending…' : 'Request Any Available Slip'}
                        </button>
                      </Card>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        )}

      </div>
    </div>
  )
}

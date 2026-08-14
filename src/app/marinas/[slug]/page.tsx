'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const DARK  = '#070f1a'
const TEAL  = '#4dd6c8'
const NAVY  = '#0d2b4b'
const FONT  = "system-ui,-apple-system,'Segoe UI',Roboto,sans-serif"
const MUTED = 'rgba(255,255,255,0.55)'

type Marina = {
  id: string; slug?: string; name: string; city: string; state: string; zip?: string
  phone?: string; website?: string; email?: string; total_slips: number
  transient_available?: boolean; description?: string; address?: string
  max_vessel_loa_ft?: number|null; max_draft_ft?: number|null; vhf_channel?: string|null
  approach_notes?: string|null; min_approach_depth_ft?: number|null; min_channel_depth_ft?: number|null
  mean_low_water_dock_depth_ft?: number|null
  amenities?: Record<string, boolean|string|null>
  photos?: { id:string; url:string; caption:string|null; is_hero:boolean }[]
}

const AMENITY_LABELS: [string,string][] = [
  ['fuel_dock','Fuel Dock'], ['dockage','Dockage'], ['water_hookup','Water Hookup'],
  ['water_taxi','Water Taxi'], ['dinghy_dock','Dinghy Dock'], ['wifi','Wi-Fi'],
  ['restrooms','Restrooms'], ['showers','Showers'], ['laundry','Laundry'], ['trash','Trash'],
  ['ice','Ice'], ['atm','ATM'], ['swimming_pool','Swimming Pool'], ['groceries','Groceries'],
  ['alcohol','Alcohol'], ['medical','Medical Facility'], ['hotels','Hotels'],
  ['restaurants','Restaurants Nearby'], ['restaurant_on_property','Restaurant On-Site'],
  ['ship_store','Ship Store'], ['dog_park','Dog Park'], ['pet_friendly','Pet Friendly'],
  ['dry_stack','Dry Stack'], ['land_storage','Land Storage'], ['travel_lift','Travel Lift'],
  ['repair_crane','Repair Crane'], ['engine_service','Engine Service'],
  ['propeller_service','Propeller Service'], ['service_maintenance','Service & Maintenance'],
  ['security','Security'], ['pump_out','Pump-Out'], ['pharmacy','Pharmacy'], ['beach','Beach'], ['golf','Golf'],
]

function InfoStat({ label, value }: { label:string; value:string }) {
  return (
    <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:10, padding:'10px 14px' }}>
      <div style={{ fontSize:10, color:MUTED, textTransform:'uppercase', letterSpacing:0.5, fontWeight:700, marginBottom:3 }}>{label}</div>
      <div style={{ fontSize:15, color:'#fff', fontWeight:800 }}>{value}</div>
    </div>
  )
}

export default function MarinaDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const [marina,    setMarina]    = useState<Marina|null>(null)
  const [loading,   setLoading]   = useState(true)
  const [submitted, setSubmitted] = useState(false)
  const [submitting,setSubmitting]= useState(false)
  const [error,     setError]     = useState<string|null>(null)

  // Form fields
  const today    = new Date().toISOString().split('T')[0]
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]
  const [name,       setName]       = useState('')
  const [email,      setEmail]      = useState('')
  const [phone,      setPhone]      = useState('')
  const [vesselName, setVesselName] = useState('')
  const [vesselType, setVesselType] = useState('')
  const [loa,        setLoa]        = useState('')
  const [beam,       setBeam]       = useState('')
  const [draft,      setDraft]      = useState('')
  const [shorePower, setShorePower] = useState(false)
  const [fuelType,   setFuelType]   = useState('')
  const [arrival,    setArrival]    = useState(today)
  const [departure,  setDeparture]  = useState(tomorrow)
  const [notes,      setNotes]      = useState('')

  useEffect(() => {
    // Support both slug and legacy UUID in the URL param
    const param = UUID_RE.test(slug) ? `id=${slug}` : `slug=${slug}`
    fetch(`/api/marinas?${param}`)
      .then(r => r.json())
      .then(j => { setMarina(j.marina); setLoading(false) })
      .catch(() => setLoading(false))
  }, [slug])

  function calcNights() {
    try {
      const a = new Date(arrival), d = new Date(departure)
      const n = Math.round((d.getTime() - a.getTime()) / 86400000)
      return n > 0 ? n : 1
    } catch { return 1 }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!marina) return
    setSubmitting(true); setError(null)
    try {
      const res = await fetch('/api/transient-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          marina_id:      marina.id,
          contact_name:   name,
          contact_email:  email || null,
          contact_phone:  phone || null,
          vessel_name:    vesselName || null,
          vessel_type:    vesselType || null,
          loa_ft:         loa ? Number(loa) : null,
          beam_ft:        beam ? Number(beam) : null,
          draft_ft:       draft ? Number(draft) : null,
          shore_power:    shorePower,
          fuel_type:      fuelType || null,
          arrival_date:   arrival,
          departure_date: departure,
          nights:         calcNights(),
          notes:          notes || null,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Submission failed')
      setSubmitted(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '11px 14px',
    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 10, color: '#fff', fontSize: 14, fontFamily: FONT, outline: 'none', boxSizing: 'border-box',
  }
  const labelStyle: React.CSSProperties = { display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.6)', marginBottom: 5 }

  if (loading) return (
    <div style={{ minHeight:'100vh', background:DARK, fontFamily:FONT, color:'#fff' }}>
      <div style={{ textAlign:'center', padding:'120px 24px', color:MUTED }}>Loading marina…</div>
    </div>
  )

  if (!marina) return (
    <div style={{ minHeight:'100vh', background:DARK, fontFamily:FONT, color:'#fff' }}>
      <div style={{ textAlign:'center', padding:'120px 24px' }}>
        <div style={{ fontSize:40, marginBottom:16 }}>⚓</div>
        <div style={{ fontSize:18, color:MUTED, marginBottom:24 }}>Marina not found.</div>
        <Link href="/marinas" style={{ color:TEAL, fontWeight:700 }}>← Back to directory</Link>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight:'100vh', background:DARK, fontFamily:FONT, color:'#fff' }}>

      {/* Marina header */}
      <div style={{ maxWidth:900, margin:'0 auto', padding:'60px 24px 0' }}>
        <Link href="/marinas" style={{ display:'inline-flex', alignItems:'center', gap:6, color:MUTED, fontSize:13, textDecoration:'none', marginBottom:24 }}>
          ← All marinas
        </Link>
        <div style={{ display:'flex', alignItems:'flex-start', gap:20, marginBottom:40, flexWrap:'wrap' }}>
          <div style={{ width:64, height:64, borderRadius:16, background:'rgba(77,214,200,0.15)', border:'1px solid rgba(77,214,200,0.3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, flexShrink:0 }}>⚓</div>
          <div style={{ flex:1 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap', marginBottom:6 }}>
              <h1 style={{ fontSize:'clamp(22px,4vw,36px)', fontWeight:900, letterSpacing:'-1px', margin:0 }}>{marina.name}</h1>
              {marina.transient_available && (
                <span style={{ fontSize:10, fontWeight:700, color:TEAL, background:'rgba(77,214,200,0.1)', border:'1px solid rgba(77,214,200,0.25)', borderRadius:6, padding:'3px 8px' }}>TRANSIENT AVAILABLE</span>
              )}
            </div>
            <div style={{ fontSize:14, color:MUTED }}>{marina.address ? `${marina.address}, ` : ''}{marina.city}, {marina.state}{marina.zip ? ` ${marina.zip}` : ''}</div>
            <div style={{ display:'flex', gap:20, marginTop:10, flexWrap:'wrap' }}>
              <span style={{ fontSize:13, color:MUTED }}>{marina.total_slips} slips</span>
              {marina.phone && <span style={{ fontSize:13, color:MUTED }}>{marina.phone}</span>}
              {marina.vhf_channel && <span style={{ fontSize:13, color:MUTED }}>VHF {marina.vhf_channel}</span>}
              {marina.website && <a href={marina.website.startsWith('http') ? marina.website : `https://${marina.website}`} target="_blank" rel="noreferrer" style={{ fontSize:13, color:TEAL }}>{marina.website}</a>}
            </div>
            {marina.description && (
              <p style={{ fontSize:14, color:MUTED, marginTop:12, lineHeight:1.6, maxWidth:600 }}>{marina.description}</p>
            )}
          </div>
        </div>

        {/* Photo strip */}
        {marina.photos && marina.photos.length > 0 && (
          <div style={{ display:'flex', gap:10, overflowX:'auto', marginBottom:40, paddingBottom:4 }}>
            {marina.photos.map(p => (
              <img key={p.id} src={p.url} alt={p.caption || marina!.name} style={{ height:160, width:'auto', borderRadius:12, objectFit:'cover', flexShrink:0 }} />
            ))}
          </div>
        )}

        {/* Berth Capacity */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:16, marginBottom:32 }}>
          <InfoStat label="Slips" value={String(marina.total_slips ?? '—')} />
          {marina.max_vessel_loa_ft != null && <InfoStat label="Max Vessel LOA" value={`${marina.max_vessel_loa_ft} ft`} />}
          {marina.max_draft_ft != null && <InfoStat label="Max Draft" value={`${marina.max_draft_ft} ft`} />}
        </div>

        {/* Approach */}
        {(marina.approach_notes || marina.min_approach_depth_ft != null || marina.min_channel_depth_ft != null || marina.mean_low_water_dock_depth_ft != null) && (
          <div style={{ marginBottom:32 }}>
            <div style={{ fontSize:13, fontWeight:800, color:TEAL, textTransform:'uppercase', letterSpacing:1, marginBottom:10 }}>Approach</div>
            {marina.approach_notes && <p style={{ fontSize:14, color:MUTED, lineHeight:1.6, marginBottom:12, maxWidth:600 }}>{marina.approach_notes}</p>}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:16 }}>
              {marina.min_approach_depth_ft != null && <InfoStat label="Min. Approach Depth" value={`${marina.min_approach_depth_ft} ft`} />}
              {marina.min_channel_depth_ft != null && <InfoStat label="Min. Channel Depth" value={`${marina.min_channel_depth_ft} ft`} />}
              {marina.mean_low_water_dock_depth_ft != null && <InfoStat label="Mean Low Water Dock Depth" value={`${marina.mean_low_water_dock_depth_ft} ft`} />}
            </div>
          </div>
        )}

        {/* Services & Amenities */}
        {marina.amenities && (
          <div style={{ marginBottom:40 }}>
            <div style={{ fontSize:13, fontWeight:800, color:TEAL, textTransform:'uppercase', letterSpacing:1, marginBottom:14 }}>Services &amp; Amenities</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:'10px 20px' }}>
              {AMENITY_LABELS.filter(([key]) => {
                const v = marina!.amenities![key]
                return v === true || (typeof v === 'string' && v.trim())
              }).map(([key,label]) => {
                const v = marina!.amenities![key]
                return (
                  <div key={key} style={{ display:'flex', justifyContent:'space-between', fontSize:13, borderBottom:'1px solid rgba(255,255,255,0.06)', padding:'6px 0' }}>
                    <span style={{ color:MUTED }}>{label}</span>
                    <span style={{ color:TEAL, fontWeight:700 }}>{v === true ? 'Yes' : v}</span>
                  </div>
                )
              })}
            </div>
            {AMENITY_LABELS.every(([key]) => { const v = marina!.amenities![key]; return v !== true && !(typeof v === 'string' && v.trim()) }) && (
              <p style={{ fontSize:13, color:MUTED }}>Amenity details coming soon for this marina.</p>
            )}
          </div>
        )}
      </div>

      {/* Booking form */}
      <div style={{ maxWidth:900, margin:'0 auto', padding:'0 24px 100px', display:'grid', gridTemplateColumns:'minmax(0,1fr) minmax(0,380px)', gap:40, alignItems:'start' }}>
        {/* Left — form */}
        <div>
          <h2 style={{ fontSize:24, fontWeight:900, letterSpacing:'-0.8px', margin:'0 0 24px' }}>Request a Transient Slip</h2>

          {submitted ? (
            <div style={{ background:'rgba(77,214,200,0.08)', border:`2px solid ${TEAL}`, borderRadius:16, padding:'48px 32px', textAlign:'center' }}>
              <div style={{ fontSize:48, marginBottom:16 }}>⚓</div>
              <h3 style={{ fontSize:22, fontWeight:900, color:TEAL, margin:'0 0 10px' }}>Request sent!</h3>
              <p style={{ fontSize:15, color:MUTED, margin:'0 0 24px', lineHeight:1.6 }}>
                {marina.name} will review your request and respond shortly. Check your email for confirmation.
              </p>
              <Link href="/marinas"
                style={{ display:'inline-block', padding:'10px 24px', background:'rgba(77,214,200,0.1)', border:'1px solid rgba(77,214,200,0.3)', borderRadius:10, color:TEAL, fontWeight:700, fontSize:14, textDecoration:'none' }}>
                Browse more marinas
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
              {/* Dates */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div>
                  <label style={labelStyle}>Arrival Date *</label>
                  <input type="date" required value={arrival} min={today} onChange={e => setArrival(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Departure Date</label>
                  <input type="date" value={departure} min={arrival} onChange={e => setDeparture(e.target.value)} style={inputStyle} />
                </div>
              </div>
              <div style={{ fontSize:12, color:MUTED, marginTop:-8 }}>{calcNights()} night{calcNights()!==1?'s':''}</div>

              {/* Contact */}
              <div>
                <label style={labelStyle}>Your Name *</label>
                <input required value={name} onChange={e => setName(e.target.value)} placeholder="Captain Jane Smith" style={inputStyle} />
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div>
                  <label style={labelStyle}>Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Phone</label>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="(555) 000-0000" style={inputStyle} />
                </div>
              </div>

              {/* Vessel */}
              <div style={{ borderTop:'1px solid rgba(255,255,255,0.08)', paddingTop:16 }}>
                <div style={{ fontSize:12, fontWeight:700, color:MUTED, textTransform:'uppercase', letterSpacing:1, marginBottom:12 }}>Vessel Info</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
                  <div>
                    <label style={labelStyle}>Vessel Name</label>
                    <input value={vesselName} onChange={e => setVesselName(e.target.value)} placeholder="e.g. Sea Breeze" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Vessel Type</label>
                    <select value={vesselType} onChange={e => setVesselType(e.target.value)} style={{ ...inputStyle, cursor:'pointer' }}>
                      <option value="">Select type</option>
                      <option value="powerboat">Powerboat</option>
                      <option value="sailboat">Sailboat</option>
                      <option value="catamaran">Catamaran</option>
                      <option value="trawler">Trawler</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12 }}>
                  <div>
                    <label style={labelStyle}>LOA (ft)</label>
                    <input type="number" min={10} max={300} value={loa} onChange={e => setLoa(e.target.value)} placeholder="e.g. 42" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Beam (ft)</label>
                    <input type="number" min={4} max={80} value={beam} onChange={e => setBeam(e.target.value)} placeholder="e.g. 14" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Draft (ft)</label>
                    <input type="number" min={1} max={30} value={draft} onChange={e => setDraft(e.target.value)} placeholder="e.g. 4.5" style={inputStyle} />
                  </div>
                </div>
              </div>

              {/* Needs */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div>
                  <label style={{ ...labelStyle, display:'flex', alignItems:'center', gap:8, cursor:'pointer' }}>
                    <input type="checkbox" checked={shorePower} onChange={e => setShorePower(e.target.checked)} style={{ width:15, height:15, accentColor:TEAL }} />
                    Shore power needed
                  </label>
                </div>
                <div>
                  <label style={labelStyle}>Fuel Type</label>
                  <select value={fuelType} onChange={e => setFuelType(e.target.value)} style={{ ...inputStyle, cursor:'pointer' }}>
                    <option value="">Not needed</option>
                    <option value="diesel">Diesel</option>
                    <option value="gasoline">Gasoline</option>
                    <option value="electric">Electric</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label style={labelStyle}>Notes (optional)</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="Special requests, preferred slip type, etc."
                  style={{ ...inputStyle, resize:'none' as const }} />
              </div>

              {error && (
                <div style={{ fontSize:13, color:'#f87171', background:'rgba(248,113,113,0.08)', border:'1px solid rgba(248,113,113,0.2)', borderRadius:10, padding:'10px 14px' }}>{error}</div>
              )}

              <button type="submit" disabled={submitting}
                style={{ padding:'14px', fontSize:16, fontWeight:800, color:NAVY, background: submitting ? 'rgba(77,214,200,0.5)' : TEAL, border:'none', borderRadius:12, cursor: submitting ? 'default':'pointer', fontFamily:FONT }}>
                {submitting ? 'Sending…' : 'Send Request to Marina ⚓'}
              </button>
              <p style={{ fontSize:12, color:MUTED, textAlign:'center', margin:0 }}>Free to submit. Marina will respond directly.</p>
            </form>
          )}
        </div>

        {/* Right — info sidebar */}
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:14, padding:20 }}>
            <div style={{ fontSize:12, fontWeight:700, color:TEAL, textTransform:'uppercase', letterSpacing:1, marginBottom:14 }}>How it works</div>
            {[
              { icon:'📋', text:'Submit your request with dates and vessel specs' },
              { icon:'⚡', text:'Marina gets notified instantly via Skipper' },
              { icon:'✅', text:'They confirm availability and assign your slip' },
              { icon:'⚓', text:'Arrive and enjoy — no paperwork on arrival' },
            ].map((item, i) => (
              <div key={i} style={{ display:'flex', gap:12, marginBottom:14, alignItems:'flex-start' }}>
                <span style={{ fontSize:18, flexShrink:0 }}>{item.icon}</span>
                <span style={{ fontSize:13, color:MUTED, lineHeight:1.5 }}>{item.text}</span>
              </div>
            ))}
          </div>
          <div style={{ background:'rgba(77,214,200,0.06)', border:'1px solid rgba(77,214,200,0.15)', borderRadius:14, padding:20 }}>
            <div style={{ fontSize:13, fontWeight:700, color:TEAL, marginBottom:8 }}>Want to track your request?</div>
            <div style={{ fontSize:13, color:MUTED, lineHeight:1.6, marginBottom:14 }}>
              Download the AyeAyeSkipper app to see your request status, get messages from the marina, and manage future bookings.
            </div>
            <Link href="https://app.ayeayeskipper.com"
              style={{ display:'block', textAlign:'center', padding:'9px 16px', background:TEAL, color:NAVY, borderRadius:9, fontWeight:700, fontSize:13, textDecoration:'none' }}>
              Open Skipper App
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

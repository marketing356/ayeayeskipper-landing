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

// [key, label, icon] — grouped into categories below for a scannable, icon-led amenity grid
const AMENITY_META: Record<string, [string,string]> = {
  fuel_dock: ['⛽','Fuel Dock'], dockage: ['⚓','Dockage'], water_hookup: ['💧','Water Hookup'],
  water_taxi: ['🚤','Water Taxi'], dinghy_dock: ['🛶','Dinghy Dock'], wifi: ['📶','Wi-Fi'],
  restrooms: ['🚹','Restrooms'], showers: ['🚿','Showers'], laundry: ['🧺','Laundry'],
  trash: ['🗑️','Trash'], ice: ['🧊','Ice'], atm: ['🏦','ATM'],
  swimming_pool: ['🏊','Swimming Pool'], groceries: ['🛒','Groceries'],
  alcohol: ['🍺','Alcohol'], medical: ['⚕️','Medical Facility'], hotels: ['🏨','Hotels'],
  restaurants: ['🍽️','Restaurants Nearby'], restaurant_on_property: ['🍽️','Restaurant On-Site'],
  ship_store: ['🏪','Ship Store'], dog_park: ['🐕','Dog Park'], pet_friendly: ['🐾','Pet Friendly'],
  dry_stack: ['🏗️','Dry Stack'], land_storage: ['🏗️','Land Storage'],
  travel_lift: ['🏗️','Travel Lift'], repair_crane: ['🚧','Repair Crane'],
  engine_service: ['🔧','Engine Service'], propeller_service: ['⚙️','Propeller Service'],
  service_maintenance: ['🛠️','Service & Maintenance'], security: ['🔒','Security'],
  pump_out: ['🚩','Pump-Out'], pharmacy: ['💊','Pharmacy'], beach: ['🏖️','Beach'], golf: ['⛳','Golf'],
}

const AMENITY_GROUPS: [string,string[]][] = [
  ['Docking & Fuel', ['fuel_dock','dockage','water_hookup','dry_stack','land_storage']],
  ['On-Site', ['ship_store','restaurant_on_property','swimming_pool','wifi','security']],
  ['Facilities', ['restrooms','showers','laundry','trash','ice','atm','pump_out']],
  ['Service & Repair', ['engine_service','propeller_service','service_maintenance','repair_crane','travel_lift']],
  ['Getting Around', ['water_taxi','dinghy_dock','pet_friendly','dog_park']],
  ['Nearby', ['groceries','alcohol','medical','hotels','restaurants','pharmacy','beach','golf']],
]

function InfoStat({ label, value, icon }: { label:string; value:string; icon?:string }) {
  return (
    <div style={{ background:'linear-gradient(160deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))', border:'1px solid rgba(255,255,255,0.1)', borderRadius:14, padding:'14px 16px', position:'relative', overflow:'hidden' }}>
      {icon && <div style={{ position:'absolute', top:10, right:12, fontSize:22, opacity:0.25 }}>{icon}</div>}
      <div style={{ fontSize:10, color:MUTED, textTransform:'uppercase', letterSpacing:0.8, fontWeight:800, marginBottom:5 }}>{label}</div>
      <div style={{ fontSize:20, color:'#fff', fontWeight:900, letterSpacing:'-0.3px' }}>{value}</div>
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

      {/* Hero */}
      <div style={{ position:'relative', height: marina.photos && marina.photos.length > 0 ? 380 : 220, overflow:'hidden' }}>
        {marina.photos && marina.photos.length > 0 ? (
          <img src={marina.photos.find(p=>p.is_hero)?.url || marina.photos[0].url} alt={marina.name}
            style={{ width:'100%', height:'100%', objectFit:'cover', filter:'brightness(0.55)' }} />
        ) : (
          <div style={{ width:'100%', height:'100%', background:'linear-gradient(135deg,#0d2b4b 0%,#071e38 55%,#04121f 100%)' }}>
            <div style={{ position:'absolute', inset:0, opacity:0.12, backgroundImage:'radial-gradient(circle at 20% 30%, #4dd6c8 0%, transparent 40%), radial-gradient(circle at 80% 70%, #4dd6c8 0%, transparent 35%)' }} />
          </div>
        )}
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg, rgba(7,15,26,0) 0%, rgba(7,15,26,0.4) 60%, rgba(7,15,26,1) 100%)' }} />
        <div style={{ position:'absolute', top:20, left:0, right:0, maxWidth:900, margin:'0 auto', padding:'0 24px' }}>
          <Link href="/marinas" style={{ display:'inline-flex', alignItems:'center', gap:6, color:'rgba(255,255,255,0.85)', fontSize:13, textDecoration:'none', background:'rgba(0,0,0,0.35)', backdropFilter:'blur(6px)', padding:'6px 14px', borderRadius:999, border:'1px solid rgba(255,255,255,0.15)' }}>
            ← All marinas
          </Link>
        </div>
        <div style={{ position:'absolute', bottom:0, left:0, right:0, maxWidth:900, margin:'0 auto', padding:'0 24px 28px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap', marginBottom:8 }}>
            <span style={{ fontSize:11, fontWeight:800, color:'#0d2b4b', background:TEAL, borderRadius:999, padding:'4px 12px', letterSpacing:0.5 }}>⚓ SKIPPER MARINA</span>
            {marina.transient_available ? (
              <span style={{ fontSize:11, fontWeight:800, color:'#fff', background:'rgba(74,222,128,0.25)', border:'1px solid rgba(74,222,128,0.5)', borderRadius:999, padding:'4px 12px' }}>⛵ TRANSIENT WELCOME</span>
            ) : (
              <span style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.7)', background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:999, padding:'4px 12px' }}>SEASONAL &amp; STORAGE</span>
            )}
          </div>
          <h1 style={{ fontSize:'clamp(28px,5vw,48px)', fontWeight:900, letterSpacing:'-1.5px', margin:'0 0 8px', textShadow:'0 2px 20px rgba(0,0,0,0.5)' }}>{marina.name}</h1>
          <div style={{ display:'flex', gap:18, flexWrap:'wrap', fontSize:14, color:'rgba(255,255,255,0.85)' }}>
            <span>📍 {marina.address ? `${marina.address}, ` : ''}{marina.city}, {marina.state}{marina.zip ? ` ${marina.zip}` : ''}</span>
            {marina.phone && <span>📞 {marina.phone}</span>}
            {marina.vhf_channel && <span>📻 VHF {marina.vhf_channel}</span>}
          </div>
        </div>
      </div>

      <div style={{ maxWidth:900, margin:'0 auto', padding:'40px 24px 0' }}>
        {marina.website && (
          <a href={marina.website.startsWith('http') ? marina.website : `https://${marina.website}`} target="_blank" rel="noreferrer"
            style={{ display:'inline-flex', alignItems:'center', gap:6, fontSize:13, color:TEAL, fontWeight:700, textDecoration:'none', marginBottom:20 }}>
            🌐 {marina.website} →
          </a>
        )}

        {marina.description && (
          <div style={{ marginBottom:36 }}>
            <div style={{ fontSize:13, fontWeight:800, color:TEAL, textTransform:'uppercase', letterSpacing:1, marginBottom:10 }}>About</div>
            <p style={{ fontSize:15, color:'rgba(255,255,255,0.85)', lineHeight:1.7, maxWidth:640 }}>{marina.description}</p>
          </div>
        )}

        {/* Extra photos beyond hero */}
        {marina.photos && marina.photos.length > 1 && (
          <div style={{ display:'flex', gap:10, overflowX:'auto', marginBottom:36, paddingBottom:4 }}>
            {marina.photos.slice(1).map(p => (
              <img key={p.id} src={p.url} alt={p.caption || marina!.name} style={{ height:150, width:'auto', borderRadius:14, objectFit:'cover', flexShrink:0, border:'1px solid rgba(255,255,255,0.1)' }} />
            ))}
          </div>
        )}

        {/* Berth Capacity */}
        <div style={{ marginBottom:36 }}>
          <div style={{ fontSize:13, fontWeight:800, color:TEAL, textTransform:'uppercase', letterSpacing:1, marginBottom:14 }}>Berth Capacity</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))', gap:12 }}>
            <InfoStat icon="⚓" label="Slips" value={String(marina.total_slips ?? '—')} />
            {marina.max_vessel_loa_ft != null && <InfoStat icon="🚤" label="Max Vessel LOA" value={`${marina.max_vessel_loa_ft} ft`} />}
            {marina.max_draft_ft != null && <InfoStat icon="🌊" label="Max Draft" value={`${marina.max_draft_ft} ft`} />}
          </div>
        </div>

        {/* Approach */}
        {(marina.approach_notes || marina.min_approach_depth_ft != null || marina.min_channel_depth_ft != null || marina.mean_low_water_dock_depth_ft != null) && (
          <div style={{ marginBottom:36 }}>
            <div style={{ fontSize:13, fontWeight:800, color:TEAL, textTransform:'uppercase', letterSpacing:1, marginBottom:14 }}>🧭 Approach</div>
            {marina.approach_notes && <p style={{ fontSize:14, color:MUTED, lineHeight:1.6, marginBottom:14, maxWidth:600 }}>{marina.approach_notes}</p>}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))', gap:12 }}>
              {marina.min_approach_depth_ft != null && <InfoStat label="Min. Approach Depth" value={`${marina.min_approach_depth_ft} ft`} />}
              {marina.min_channel_depth_ft != null && <InfoStat label="Min. Channel Depth" value={`${marina.min_channel_depth_ft} ft`} />}
              {marina.mean_low_water_dock_depth_ft != null && <InfoStat label="MLW Dock Depth" value={`${marina.mean_low_water_dock_depth_ft} ft`} />}
            </div>
          </div>
        )}

        {/* Services & Amenities — icon-grouped */}
        {marina.amenities && (() => {
          const amenities = marina!.amenities!
          const isSet = (k: string) => { const v = amenities[k]; return v === true || (typeof v === 'string' && v.trim().length > 0) }
          const anySet = Object.keys(AMENITY_META).some(isSet)
          return (
            <div style={{ marginBottom:44 }}>
              <div style={{ fontSize:13, fontWeight:800, color:TEAL, textTransform:'uppercase', letterSpacing:1, marginBottom:18 }}>Services &amp; Amenities</div>
              {!anySet && <p style={{ fontSize:13, color:MUTED }}>Amenity details coming soon for this marina.</p>}
              {AMENITY_GROUPS.map(([groupName, keys]) => {
                const active = keys.filter(isSet)
                if (active.length === 0) return null
                return (
                  <div key={groupName} style={{ marginBottom:20 }}>
                    <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:0.8, marginBottom:10 }}>{groupName}</div>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:10 }}>
                      {active.map(key => {
                        const [icon, label] = AMENITY_META[key]
                        const v = amenities[key]
                        const extra = typeof v === 'string' ? v : null
                        return (
                          <div key={key} style={{ display:'flex', alignItems:'center', gap:8, background:'rgba(77,214,200,0.08)', border:'1px solid rgba(77,214,200,0.2)', borderRadius:999, padding:'8px 14px' }}>
                            <span style={{ fontSize:16 }}>{icon}</span>
                            <span style={{ fontSize:13, color:'#fff', fontWeight:600 }}>{label}</span>
                            {extra && <span style={{ fontSize:11, color:TEAL, fontWeight:700 }}>({extra})</span>}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          )
        })()}
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

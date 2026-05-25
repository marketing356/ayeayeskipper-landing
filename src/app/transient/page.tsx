'use client'
import { useState } from 'react'
import Nav from '@/components/Nav'

const NAVY = '#0d2b4b'
const TEAL = '#4dd6c8'
const DARK = '#070f1a'
const FONT = "system-ui,-apple-system,'Segoe UI',Roboto,sans-serif"

const REGIONS = [
  'Northeast',
  'Southeast',
  'Gulf Coast',
  'Great Lakes',
  'Pacific Coast',
  'Other',
]

const HOW_IT_WORKS = [
  { icon: '🔍', step: 'Search partner marinas', desc: 'Browse AyeAyeSkipper-powered marinas in your destination. See live slip availability before you leave the dock.' },
  { icon: '📱', step: 'Book through Skipper', desc: 'Reserve your slip in seconds. Skipper confirms instantly, sends dock instructions, and handles payment.' },
  { icon: '⚓', step: 'Arrive and enjoy', desc: "Your slip is ready when you arrive. No paperwork, no waiting. Just tie up and explore." },
]

export default function TransientPage() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    homePort: '',
    boatLength: '',
    boatType: '',
    regions: [] as string[],
    howHeard: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  function setField(k: string, v: string) {
    setForm(f => ({ ...f, [k]: v }))
  }

  function toggleRegion(region: string) {
    setForm(f => ({
      ...f,
      regions: f.regions.includes(region)
        ? f.regions.filter(r => r !== region)
        : [...f.regions, region],
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch('/api/transient', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setSubmitted(true)
    } catch {
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 8,
    color: '#fff',
    fontSize: 14,
    fontFamily: FONT,
    outline: 'none',
    boxSizing: 'border-box',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 13,
    fontWeight: 600,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 6,
  }

  return (
    <div style={{ minHeight: '100vh', background: DARK, fontFamily: FONT, color: '#fff' }}>
      <Nav />

      {/* Hero */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '80px 24px 60px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(77,214,200,0.1)', border: '1px solid rgba(77,214,200,0.25)', borderRadius: 24, padding: '6px 16px', marginBottom: 20 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: TEAL, display: 'inline-block' }}></span>
          <span style={{ fontSize: 12, color: TEAL, fontWeight: 700, letterSpacing: '1px' }}>TRANSIENT BOATER NETWORK</span>
        </div>
        <h1 style={{ fontSize: 'clamp(36px,5.5vw,64px)', fontWeight: 900, letterSpacing: '-2.5px', margin: '0 0 20px', lineHeight: 1.02 }}>
          Find Your <span style={{ color: TEAL }}>Next Slip</span>
        </h1>
        <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: 1.65, maxWidth: 560, marginLeft: 'auto', marginRight: 'auto' }}>
          Join the AyeAyeSkipper transient network. Get notified when slips open near you.
        </p>
      </div>

      {/* How It Works */}
      <div style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.07)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '60px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 12, color: TEAL, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 10 }}>Simple as it gets</div>
            <h2 style={{ fontSize: 34, fontWeight: 900, letterSpacing: '-1.5px', margin: 0 }}>How it works</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
            {HOW_IT_WORKS.map((item, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 28, textAlign: 'center' }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>{item.icon}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12 }}>
                  <span style={{ width: 24, height: 24, borderRadius: '50%', background: `rgba(77,214,200,0.15)`, border: `1px solid ${TEAL}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900, color: TEAL, flexShrink: 0 }}>{i + 1}</span>
                  <div style={{ fontWeight: 800, fontSize: 16, letterSpacing: '-0.3px' }}>{item.step}</div>
                </div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Signup Form */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '80px 24px 100px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-1.5px', margin: '0 0 12px' }}>Join the List</h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', margin: 0 }}>We'll notify you when slips open in your preferred regions.</p>
        </div>

        {submitted ? (
          <div style={{ background: 'rgba(77,214,200,0.08)', border: `2px solid ${TEAL}`, borderRadius: 16, padding: '64px 40px', textAlign: 'center' }}>
            <div style={{ fontSize: 56, marginBottom: 20 }}>⚓</div>
            <h2 style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-1px', margin: '0 0 12px', color: TEAL }}>You're on the list!</h2>
            <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.7)', margin: 0 }}>
              We'll notify you when slips open in your area. ⚓
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ background: `${NAVY}cc`, border: '1px solid rgba(77,214,200,0.2)', borderRadius: 16, padding: '40px', display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* First + Last Name side by side */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={labelStyle}>First Name *</label>
                <input required style={inputStyle} value={form.firstName} onChange={e => setField('firstName', e.target.value)} placeholder="First" />
              </div>
              <div>
                <label style={labelStyle}>Last Name *</label>
                <input required style={inputStyle} value={form.lastName} onChange={e => setField('lastName', e.target.value)} placeholder="Last" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={labelStyle}>Email *</label>
              <input required type="email" style={inputStyle} value={form.email} onChange={e => setField('email', e.target.value)} placeholder="captain@example.com" />
            </div>

            {/* Phone */}
            <div>
              <label style={labelStyle}>Phone</label>
              <input type="tel" style={inputStyle} value={form.phone} onChange={e => setField('phone', e.target.value)} placeholder="(555) 000-0000" />
            </div>

            {/* Home Port */}
            <div>
              <label style={labelStyle}>Home Port / Marina</label>
              <input style={inputStyle} value={form.homePort} onChange={e => setField('homePort', e.target.value)} placeholder="e.g. Bayside Marina, Tampa FL" />
            </div>

            {/* Boat Length */}
            <div>
              <label style={labelStyle}>Boat Length (ft)</label>
              <input type="number" min={10} max={200} style={inputStyle} value={form.boatLength} onChange={e => setField('boatLength', e.target.value)} placeholder="e.g. 35" />
            </div>

            {/* Boat Type */}
            <div>
              <label style={labelStyle}>Boat Type</label>
              <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.boatType} onChange={e => setField('boatType', e.target.value)}>
                <option value="">Select boat type</option>
                <option value="Powerboat">Powerboat</option>
                <option value="Sailboat">Sailboat</option>
                <option value="Catamaran">Catamaran</option>
                <option value="PWC">PWC</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Preferred Regions */}
            <div>
              <label style={labelStyle}>Preferred Regions</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {REGIONS.map(region => (
                  <label key={region} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>
                    <div
                      onClick={() => toggleRegion(region)}
                      style={{
                        width: 18, height: 18, borderRadius: 4,
                        border: `2px solid ${form.regions.includes(region) ? TEAL : 'rgba(255,255,255,0.25)'}`,
                        background: form.regions.includes(region) ? TEAL : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, cursor: 'pointer', transition: 'all 0.15s',
                      }}
                    >
                      {form.regions.includes(region) && <span style={{ color: NAVY, fontSize: 12, fontWeight: 900 }}>✓</span>}
                    </div>
                    {region}
                  </label>
                ))}
              </div>
            </div>

            {/* How did you hear */}
            <div>
              <label style={labelStyle}>How did you hear about us?</label>
              <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.howHeard} onChange={e => setField('howHeard', e.target.value)}>
                <option value="">Select one</option>
                <option value="Marina referral">Marina referral</option>
                <option value="Social media">Social media</option>
                <option value="Google">Google</option>
                <option value="Friend">Friend</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '16px 32px',
                background: TEAL,
                color: NAVY,
                border: 'none',
                borderRadius: 8,
                fontSize: 16,
                fontWeight: 800,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: FONT,
                opacity: loading ? 0.7 : 1,
                letterSpacing: '-0.3px',
              }}
            >
              {loading ? 'Joining...' : 'Join the Transient Network ⚓'}
            </button>

            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', textAlign: 'center', margin: 0 }}>
              Free to join. No spam. Just slip availability notifications.
            </p>
          </form>
        )}
      </div>
    </div>
  )
}

'use client'
import { useState } from 'react'
import Nav from '@/components/Nav'

const NAVY = '#0d2b4b'
const TEAL = '#4dd6c8'
const DARK = '#070f1a'
const FONT = "system-ui,-apple-system,'Segoe UI',Roboto,sans-serif"

const INTERESTS = [
  'Hot Slip™ Revenue Program',
  'Transient Booking',
  'Full Marina OS',
  'SiteLogic™ — RV Parks & Campgrounds',
  'Just looking',
]

export default function JoinPage() {
  const [form, setForm] = useState({
    marinaName: '',
    yourName: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    slips: '',
    currentSoftware: '',
    interests: [] as string[],
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  function setField(k: string, v: string) {
    setForm(f => ({ ...f, [k]: v }))
  }

  function toggleInterest(interest: string) {
    setForm(f => ({
      ...f,
      interests: f.interests.includes(interest)
        ? f.interests.filter(i => i !== interest)
        : [...f.interests, interest],
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch('/api/join', {
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

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '80px 24px 100px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(77,214,200,0.1)', border: '1px solid rgba(77,214,200,0.25)', borderRadius: 24, padding: '6px 16px', marginBottom: 20 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: TEAL, display: 'inline-block' }}></span>
            <span style={{ fontSize: 12, color: TEAL, fontWeight: 700, letterSpacing: '1px' }}>MARINA OPERATOR SIGNUP</span>
          </div>
          <h1 style={{ fontSize: 'clamp(32px,5vw,52px)', fontWeight: 900, letterSpacing: '-2px', margin: '0 0 16px', lineHeight: 1.05 }}>
            Get Started with <span style={{ color: TEAL }}>AyeAyeSkipper</span>
          </h1>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.55)', margin: 0, lineHeight: 1.6 }}>
            Tell us about your marina. We'll reach out within 24 hours.
          </p>
        </div>

        {submitted ? (
          <div style={{ background: 'rgba(77,214,200,0.08)', border: `2px solid ${TEAL}`, borderRadius: 16, padding: '64px 40px', textAlign: 'center' }}>
            <div style={{ fontSize: 56, marginBottom: 20 }}>⚓</div>
            <h2 style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-1px', margin: '0 0 12px', color: TEAL }}>We got it!</h2>
            <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.7)', margin: 0 }}>
              Expect a call within 24 hours. ⚓
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ background: `${NAVY}cc`, border: '1px solid rgba(77,214,200,0.2)', borderRadius: 16, padding: '40px', display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* Marina Name */}
            <div>
              <label style={labelStyle}>Marina Name *</label>
              <input required style={inputStyle} value={form.marinaName} onChange={e => setField('marinaName', e.target.value)} placeholder="e.g. Bayside Marina" />
            </div>

            {/* Your Name */}
            <div>
              <label style={labelStyle}>Your Name *</label>
              <input required style={inputStyle} value={form.yourName} onChange={e => setField('yourName', e.target.value)} placeholder="First and last name" />
            </div>

            {/* Email */}
            <div>
              <label style={labelStyle}>Email *</label>
              <input required type="email" style={inputStyle} value={form.email} onChange={e => setField('email', e.target.value)} placeholder="you@yourmarina.com" />
            </div>

            {/* Phone */}
            <div>
              <label style={labelStyle}>Phone *</label>
              <input required type="tel" style={inputStyle} value={form.phone} onChange={e => setField('phone', e.target.value)} placeholder="(555) 000-0000" />
            </div>

            {/* City + State side by side */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={labelStyle}>City *</label>
                <input required style={inputStyle} value={form.city} onChange={e => setField('city', e.target.value)} placeholder="Marina City" />
              </div>
              <div>
                <label style={labelStyle}>State *</label>
                <input required style={inputStyle} value={form.state} onChange={e => setField('state', e.target.value)} placeholder="FL" maxLength={2} />
              </div>
            </div>

            {/* Number of Slips */}
            <div>
              <label style={labelStyle}>Number of Slips *</label>
              <input required type="number" min={1} style={inputStyle} value={form.slips} onChange={e => setField('slips', e.target.value)} placeholder="e.g. 120" />
            </div>

            {/* Plan hint */}
            {form.slips && (
              <div style={{ background: 'rgba(77,214,200,0.07)', border: '1px solid rgba(77,214,200,0.2)', borderRadius: 8, padding: '12px 16px', fontSize: 13, color: TEAL }}>
                ⚓ Based on your slip count: <strong>{Number(form.slips) <= 50 ? '$299/mo (50 slips & under)' : '$499/mo (50+ slips)'}</strong> — first month free.
              </div>
            )}

            {/* Currently using */}
            <div>
              <label style={labelStyle}>Currently using</label>
              <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.currentSoftware} onChange={e => setField('currentSoftware', e.target.value)}>
                <option value="">Select your current system</option>
                <option value="Dockwa">Dockwa</option>
                <option value="DockMaster">DockMaster</option>
                <option value="Harbour Assist">Harbour Assist</option>
                <option value="Paper/Spreadsheets">Paper / Spreadsheets</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Interested in */}
            <div>
              <label style={labelStyle}>Interested in</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {INTERESTS.map(interest => (
                  <label key={interest} style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>
                    <div
                      onClick={() => toggleInterest(interest)}
                      style={{
                        width: 18, height: 18, borderRadius: 4,
                        border: `2px solid ${form.interests.includes(interest) ? TEAL : 'rgba(255,255,255,0.25)'}`,
                        background: form.interests.includes(interest) ? TEAL : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, cursor: 'pointer', transition: 'all 0.15s',
                      }}
                    >
                      {form.interests.includes(interest) && <span style={{ color: NAVY, fontSize: 12, fontWeight: 900 }}>✓</span>}
                    </div>
                    {interest}
                  </label>
                ))}
              </div>
            </div>

            {/* Message */}
            <div>
              <label style={labelStyle}>Message (optional)</label>
              <textarea
                style={{ ...inputStyle, minHeight: 100, resize: 'vertical' }}
                value={form.message}
                onChange={e => setField('message', e.target.value)}
                placeholder="Anything else we should know?"
              />
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
              {loading ? 'Sending...' : 'Get Started with Skipper ⚓'}
            </button>

            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', textAlign: 'center', margin: 0 }}>
              No contracts. No setup fees. First month free. We’ll reach out within 24 hours.
            </p>
          </form>
        )}
      </div>
    </div>
  )
}

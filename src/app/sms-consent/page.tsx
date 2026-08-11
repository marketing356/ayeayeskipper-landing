'use client'
import { useState } from 'react'

export default function SmsConsent() {
  const [phone, setPhone]         = useState('')
  const [agreed, setAgreed]       = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError]         = useState('')

  function formatPhone(val: string) {
    const digits = val.replace(/\D/g, '').slice(0, 10)
    if (digits.length <= 3) return digits
    if (digits.length <= 6) return `(${digits.slice(0,3)}) ${digits.slice(3)}`
    return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const digits = phone.replace(/\D/g, '')
    if (digits.length < 10) { setError('Please enter a valid 10-digit US phone number.'); return }
    if (!agreed) { setError('You must check the consent box to opt in.'); return }
    setError('')
    setSubmitted(true)
  }

  const S = {
    page: {
      minHeight: '100vh',
      background: '#050f1c',
      color: '#fff',
      fontFamily: "system-ui,-apple-system,'Segoe UI',Roboto,sans-serif",
      padding: '60px 20px',
    } as React.CSSProperties,
    wrap: { maxWidth: 560, margin: '0 auto' } as React.CSSProperties,
    logo: { fontSize: 22, fontWeight: 900, color: '#4dd6c8', marginBottom: 32, display: 'block' } as React.CSSProperties,
    h1: { fontSize: 28, fontWeight: 900, marginBottom: 8 } as React.CSSProperties,
    sub: { color: 'rgba(255,255,255,0.5)', fontSize: 13, marginBottom: 36 } as React.CSSProperties,
    label: { display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' as const, letterSpacing: 0.5, marginBottom: 6 },
    input: {
      width: '100%', padding: '13px 15px', background: 'rgba(255,255,255,0.07)',
      border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, color: '#fff',
      fontSize: 16, outline: 'none', boxSizing: 'border-box' as const, marginBottom: 20,
    } as React.CSSProperties,
    consentBox: {
      background: 'rgba(77,214,200,0.06)', border: '1px solid rgba(77,214,200,0.2)',
      borderRadius: 12, padding: '18px', marginBottom: 16,
    } as React.CSSProperties,
    checkRow: { display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer' } as React.CSSProperties,
    checkbox: { width: 20, height: 20, marginTop: 2, flexShrink: 0, accentColor: '#4dd6c8', cursor: 'pointer' } as React.CSSProperties,
    consentText: { fontSize: 13, lineHeight: 1.7, color: 'rgba(255,255,255,0.8)' } as React.CSSProperties,
    disclosures: {
      fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.8, marginBottom: 20,
    } as React.CSSProperties,
    btn: {
      width: '100%', padding: '15px', background: '#4dd6c8', color: '#050f1c',
      border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 900,
      cursor: 'pointer', marginBottom: 8,
    } as React.CSSProperties,
    error: { color: '#f87171', fontSize: 13, marginBottom: 12 } as React.CSSProperties,
    divider: { borderTop: '1px solid rgba(255,255,255,0.08)', margin: '36px 0 24px' } as React.CSSProperties,
    policyRow: { display: 'flex', gap: 20, fontSize: 12, color: 'rgba(255,255,255,0.35)' } as React.CSSProperties,
    link: { color: '#4dd6c8', textDecoration: 'none' } as React.CSSProperties,
  }

  if (submitted) return (
    <div style={S.page}>
      <div style={S.wrap}>
        <span style={S.logo}>AyeAyeSkipper</span>
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>✅</div>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>You&apos;re opted in!</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>
            You&apos;ll receive SMS notifications from your marina via AyeAyeSkipper at the number you provided.<br /><br />
            Reply <strong>STOP</strong> at any time to unsubscribe. Reply <strong>HELP</strong> for assistance.<br />
            Msg &amp; Data rates may apply.
          </p>
        </div>
      </div>
    </div>
  )

  return (
    <div style={S.page}>
      <div style={S.wrap}>
        <span style={S.logo}>AyeAyeSkipper</span>
        <h1 style={S.h1}>Sign up for Marina SMS Alerts</h1>
        <p style={S.sub}>
          MARINER AND SAILOR COMPANY · (866) 434-8771 · Middletown, DE
        </p>

        <form onSubmit={handleSubmit}>
          {/* Phone number field */}
          <label style={S.label}>Your Mobile Phone Number *</label>
          <input
            type="tel"
            inputMode="numeric"
            placeholder="(555) 000-0000"
            value={phone}
            onChange={e => setPhone(formatPhone(e.target.value))}
            style={S.input}
            required
          />

          {/* Standalone SMS consent checkbox */}
          <div style={S.consentBox}>
            <label style={S.checkRow}>
              <input
                type="checkbox"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                style={S.checkbox}
                required
              />
              <span style={S.consentText}>
                <strong>I agree to receive SMS text messages from AyeAyeSkipper</strong> (MARINER AND SAILOR COMPANY)
                at the phone number above. Messages may include marina operational communications such as:
                invoice notifications, payment reminders, lease renewals, dock assignments, haul-out scheduling,
                and general marina announcements. Message frequency varies (typically 2–6 messages per month).
                This consent is not a condition of any purchase or lease agreement.
              </span>
            </label>
          </div>

          {/* Required disclosures */}
          <p style={S.disclosures}>
            By opting in, you acknowledge: Msg &amp; Data rates may apply. Reply <strong style={{ color: 'rgba(255,255,255,0.6)' }}>STOP</strong> to
            unsubscribe at any time. Reply <strong style={{ color: 'rgba(255,255,255,0.6)' }}>HELP</strong> for help.
            AyeAyeSkipper will not share your phone number with third parties for marketing purposes.
          </p>

          {error && <p style={S.error}>{error}</p>}

          <button type="submit" style={S.btn}>
            Opt In to SMS Notifications →
          </button>

          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', textAlign: 'center', lineHeight: 1.6 }}>
            Your consent is separate from our Privacy Policy and Terms of Service.
          </p>
        </form>

        <div style={S.divider} />

        {/* Program details */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
            SMS Program Details
          </div>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.8 }}>
            <strong style={{ color: 'rgba(255,255,255,0.55)' }}>Program name:</strong> AyeAyeSkipper Marina Notifications<br />
            <strong style={{ color: 'rgba(255,255,255,0.55)' }}>Sender:</strong> MARINER AND SAILOR COMPANY, 651 N. Broad St, Middletown, DE 19709<br />
            <strong style={{ color: 'rgba(255,255,255,0.55)' }}>Number:</strong> (866) 434-8771<br />
            <strong style={{ color: 'rgba(255,255,255,0.55)' }}>Message types:</strong> Invoice notifications, payment reminders, lease renewals, dock assignments, operational announcements<br />
            <strong style={{ color: 'rgba(255,255,255,0.55)' }}>Frequency:</strong> Varies — typically 2–6 messages per month per marina<br />
            <strong style={{ color: 'rgba(255,255,255,0.55)' }}>Cost:</strong> Msg &amp; Data rates may apply<br />
            <strong style={{ color: 'rgba(255,255,255,0.55)' }}>Opt-out:</strong> Reply STOP to any message<br />
            <strong style={{ color: 'rgba(255,255,255,0.55)' }}>Help:</strong> Reply HELP or email admin@ayeayeskipper.com
          </p>
        </div>

        {/* Policy links — on same page per Twilio requirement */}
        <div style={S.policyRow}>
          <a href="/privacy" style={S.link}>Privacy Policy</a>
          <a href="/terms" style={S.link}>Terms of Service</a>
          <a href="mailto:admin@ayeayeskipper.com" style={S.link}>Contact Us</a>
        </div>
      </div>
    </div>
  )
}

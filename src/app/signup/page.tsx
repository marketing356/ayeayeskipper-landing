'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const NAVY = '#0d2b4b', TEAL = '#4dd6c8', DARK = '#070f1a'
const FONT = "system-ui,-apple-system,'Segoe UI',Roboto,sans-serif"

type Step = 'email' | 'otp' | 'details' | 'pin'

export default function MarinaSignupPage() {
  const router = useRouter()
  const [step, setStep]           = useState<Step>('email')
  const [email, setEmail]         = useState('')
  const [otp, setOtp]             = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName]   = useState('')
  const [marinaName, setMarinaName] = useState('')
  const [city, setCity]           = useState('')
  const [state, setState]         = useState('')
  const [slips, setSlips]         = useState('')
  const [pin, setPin]             = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')

  const inputStyle = {
    width: '100%', padding: '13px 16px',
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 8, color: '#fff', fontSize: 15,
    fontFamily: FONT, outline: 'none', boxSizing: 'border-box' as const,
  }
  const btnStyle = {
    width: '100%', padding: '14px', background: TEAL, color: NAVY,
    border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 900,
    cursor: loading ? 'not-allowed' as const : 'pointer' as const,
    fontFamily: FONT, opacity: loading ? 0.7 : 1,
  }
  const rowStyle = { display: 'flex', gap: 10 }

  async function handleEmail() {
    if (!email.includes('@')) { setError('Enter a valid email'); return }
    setLoading(true); setError('')
    try {
      // Check if account already exists
      const check = await fetch('/api/marina/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'check', email }),
      })
      const checkData = await check.json()
      if (checkData.hasPIN) {
        // Returning owner — go to login
        router.push(`/marina-login?email=${encodeURIComponent(email)}`)
        return
      }
      // New owner — send OTP
      const res = await fetch('/api/marina/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send-otp', email }),
      })
      const data = await res.json()
      if (data.error) { setError(data.error); return }
      setStep('otp')
    } catch { setError('Something went wrong. Try again.') }
    finally { setLoading(false) }
  }

  async function handleOtp() {
    if (otp.length < 6) { setError('Enter the 6-digit code'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/marina/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify-otp', email, otp }),
      })
      const data = await res.json()
      if (data.error) { setError(data.error); return }
      setStep('details')
    } catch { setError('Something went wrong. Try again.') }
    finally { setLoading(false) }
  }

  function handleDetails() {
    if (!firstName.trim()) { setError('Enter your first name'); return }
    if (!marinaName.trim()) { setError('Enter your marina name'); return }
    setError('')
    setStep('pin')
  }

  async function handlePin() {
    if (pin.length < 4) { setError('Choose a 4-digit PIN'); return }
    if (pin !== confirmPin) { setError("PINs don't match"); return }
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/marina/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create', email, otp, pin,
          firstName, lastName, marinaName, city, state, slips,
        }),
      })
      const data = await res.json()
      if (data.error) { setError(data.error); return }
      // Store session
      localStorage.setItem('marina_session', data.session)
      localStorage.setItem('marina_account', JSON.stringify(data.account))
      router.push('/account')
    } catch { setError('Something went wrong. Try again.') }
    finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight: '100vh', background: DARK, fontFamily: FONT, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ width: '100%', maxWidth: 460 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <img src="/skipper-avatar.jpg" alt="Skipper" style={{ width: 56, height: 56, borderRadius: '50%', border: `2px solid ${TEAL}`, marginBottom: 12 }} />
          <div style={{ fontSize: 24, fontWeight: 900, letterSpacing: '-0.5px' }}>Get your marina on Skipper</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 6 }}>
            {step === 'email' && 'Start with your email'}
            {step === 'otp'   && `We sent a code to ${email}`}
            {step === 'details' && 'Tell us about your marina'}
            {step === 'pin'   && 'Set a PIN for quick access'}
          </div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '32px 28px' }}>

          {/* Progress dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 28 }}>
            {(['email','otp','details','pin'] as Step[]).map((s, i) => (
              <div key={s} style={{
                width: 8, height: 8, borderRadius: '50%',
                background: ['email','otp','details','pin'].indexOf(step) >= i
                  ? TEAL : 'rgba(255,255,255,0.15)',
                transition: 'background 0.2s',
              }} />
            ))}
          </div>

          {/* STEP: EMAIL */}
          {step === 'email' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input type="email" placeholder="your@email.com" value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleEmail()}
                style={inputStyle} autoFocus />
              {error && <div style={{ color: '#ff6b6b', fontSize: 13 }}>{error}</div>}
              <button onClick={handleEmail} disabled={loading} style={btnStyle}>
                {loading ? 'Checking…' : 'Continue →'}
              </button>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', textAlign: 'center', margin: '8px 0 0', lineHeight: 1.6 }}>
                Already have an account? <a href="/marina-login" style={{ color: TEAL, textDecoration: 'none' }}>Sign in →</a>
              </p>
            </div>
          )}

          {/* STEP: OTP */}
          {step === 'otp' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input type="text" inputMode="numeric" placeholder="6-digit code" maxLength={6}
                value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g,''))}
                onKeyDown={e => e.key === 'Enter' && handleOtp()}
                style={{ ...inputStyle, letterSpacing: '8px', fontSize: 24, textAlign: 'center' }} autoFocus />
              {error && <div style={{ color: '#ff6b6b', fontSize: 13 }}>{error}</div>}
              <button onClick={handleOtp} disabled={loading} style={btnStyle}>
                {loading ? 'Verifying…' : 'Verify →'}
              </button>
              <button onClick={() => { setStep('email'); setOtp(''); setError('') }}
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', fontSize: 12, cursor: 'pointer', fontFamily: FONT }}>
                ← Use a different email
              </button>
            </div>
          )}

          {/* STEP: MARINA DETAILS */}
          {step === 'details' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={rowStyle}>
                <input type="text" placeholder="First name" value={firstName}
                  onChange={e => setFirstName(e.target.value)} style={inputStyle} autoFocus />
                <input type="text" placeholder="Last name" value={lastName}
                  onChange={e => setLastName(e.target.value)} style={inputStyle} />
              </div>
              <input type="text" placeholder="Marina name" value={marinaName}
                onChange={e => setMarinaName(e.target.value)} style={inputStyle} />
              <div style={rowStyle}>
                <input type="text" placeholder="City" value={city}
                  onChange={e => setCity(e.target.value)} style={inputStyle} />
                <input type="text" placeholder="State" value={state}
                  onChange={e => setState(e.target.value)} style={{ ...inputStyle, maxWidth: 90 }} maxLength={2} />
              </div>
              <input type="number" placeholder="Total slips" value={slips}
                onChange={e => setSlips(e.target.value)} style={inputStyle} min="1" />
              {error && <div style={{ color: '#ff6b6b', fontSize: 13 }}>{error}</div>}
              <button onClick={handleDetails} style={btnStyle}>Continue →</button>
            </div>
          )}

          {/* STEP: PIN */}
          {step === 'pin' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: '0 0 4px', lineHeight: 1.6 }}>
                Create a 4-digit PIN. You'll use this every time you sign in.
              </p>
              <input type="password" inputMode="numeric" placeholder="Choose a PIN" maxLength={4}
                value={pin} onChange={e => setPin(e.target.value.replace(/\D/g,''))}
                style={{ ...inputStyle, letterSpacing: '8px', fontSize: 24, textAlign: 'center' }} autoFocus />
              <input type="password" inputMode="numeric" placeholder="Confirm PIN" maxLength={4}
                value={confirmPin} onChange={e => setConfirmPin(e.target.value.replace(/\D/g,''))}
                onKeyDown={e => e.key === 'Enter' && handlePin()}
                style={{ ...inputStyle, letterSpacing: '8px', fontSize: 24, textAlign: 'center' }} />
              {error && <div style={{ color: '#ff6b6b', fontSize: 13 }}>{error}</div>}
              <button onClick={handlePin} disabled={loading} style={btnStyle}>
                {loading ? 'Creating your account…' : 'Create Account →'}
              </button>
            </div>
          )}
        </div>

        {step === 'email' && (
          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>
            No credit card required · 30-day free trial · Cancel anytime
          </p>
        )}
      </div>
    </div>
  )
}

'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Suspense } from 'react'

const NAVY = '#0d2b4b', TEAL = '#4dd6c8', DARK = '#070f1a'
const FONT = "system-ui,-apple-system,'Segoe UI',Roboto,sans-serif"

type Step = 'email' | 'pin' | 'otp' | 'set-pin'

// SHA-256 hex hash — same format as mobile app (contacts.pin_hash)
async function hashPin(pin: string): Promise<string> {
  const enc = new TextEncoder()
  const buf = await crypto.subtle.digest('SHA-256', enc.encode(pin))
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

function saveWebSession(email: string, account: { id?: string; first_name?: string; last_name?: string }) {
  localStorage.setItem('boater_email', email)
  localStorage.setItem('boater_account', JSON.stringify({ email, ...account }))
}

function AuthFlow() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [pin, setPin] = useState('')
  const [otp, setOtp] = useState('')
  const [newPin, setNewPin] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [userId, setUserId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleEmail() {
    if (!email.includes('@')) { setError('Enter a valid email'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/boaters/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'check', email }),
      })
      const data = await res.json()
      if (data.hasPIN) {
        setStep('pin')
      } else {
        const r2 = await fetch('/api/boaters/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'send-otp', email }),
        })
        const d2 = await r2.json()
        if (d2.error) { setError(d2.error); return }
        setStep('otp')
      }
    } catch { setError('Something went wrong') }
    finally { setLoading(false) }
  }

  async function handlePin() {
    if (pin.length < 4) { setError('Enter your PIN'); return }
    setLoading(true); setError('')
    try {
      const pinHash = await hashPin(pin)
      const res = await fetch('/api/boaters/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify-pin', email, pinHash }),
      })
      const data = await res.json()
      if (data.error) { setError('Incorrect PIN'); setPin(''); return }
      saveWebSession(email, data.account ?? {})
      router.push('/boaters/dashboard')
    } catch { setError('Something went wrong') }
    finally { setLoading(false) }
  }

  async function handleOtp() {
    if (otp.length < 6) { setError('Enter your 6-digit code'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/boaters/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify-otp', email, otp }),
      })
      const data = await res.json()
      if (data.error) { setError('Invalid or expired code'); setOtp(''); return }
      setUserId(data.userId)
      setStep('set-pin')
    } catch { setError('Something went wrong') }
    finally { setLoading(false) }
  }

  async function handleSetPin() {
    if (newPin.length < 4) { setError('Choose a 4-digit PIN'); return }
    setLoading(true); setError('')
    try {
      const pinHash = await hashPin(newPin)
      const res = await fetch('/api/boaters/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'set-pin',
          userId,
          pinHash,
          first_name: firstName,
          last_name: lastName,
        }),
      })
      const data = await res.json()
      if (data.error) { setError(data.error); return }
      saveWebSession(email, data.account ?? { first_name: firstName, last_name: lastName })
      router.push('/boaters/dashboard')
    } catch { setError('Something went wrong') }
    finally { setLoading(false) }
  }

  const inputStyle = {
    width: '100%', padding: '14px 16px', background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8,
    color: '#fff', fontSize: 16, fontFamily: FONT, outline: 'none', boxSizing: 'border-box' as const,
  }
  const btnStyle = {
    width: '100%', padding: '14px', background: TEAL, color: NAVY,
    border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 900,
    cursor: loading ? 'not-allowed' : 'pointer', fontFamily: FONT,
    opacity: loading ? 0.7 : 1,
  }

  return (
    <div style={{ minHeight: '100vh', background: DARK, fontFamily: FONT, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <img src="/skipper-avatar.jpg" alt="Skipper" style={{ width: 56, height: 56, borderRadius: '50%', border: `2px solid ${TEAL}`, marginBottom: 12 }} />
          <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: '-0.5px' }}>AyeAyeSkipper</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>Boater Portal</div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '32px 28px' }}>

          {step === 'email' && (
            <>
              <h2 style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.5px', margin: '0 0 8px' }}>Welcome aboard</h2>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: '0 0 28px', lineHeight: 1.6 }}>Enter your email to sign in or create a free account.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <input type="email" placeholder="your@email.com" value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleEmail()}
                  style={inputStyle} autoFocus />
                {error && <div style={{ color: '#ff6b6b', fontSize: 13 }}>{error}</div>}
                <button onClick={handleEmail} disabled={loading} style={btnStyle}>
                  {loading ? 'Checking…' : 'Continue →'}
                </button>
              </div>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', textAlign: 'center', marginTop: 20, lineHeight: 1.6 }}>
                Free for boaters. No credit card. Ever.
              </p>
            </>
          )}

          {step === 'pin' && (
            <>
              <h2 style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.5px', margin: '0 0 8px' }}>Welcome back</h2>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: '0 0 6px' }}>{email}</p>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: '0 0 28px', lineHeight: 1.6 }}>Enter your PIN to sign in.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <input type="password" inputMode="numeric" placeholder="••••" maxLength={6}
                  value={pin} onChange={e => setPin(e.target.value.replace(/\D/g, ''))}
                  onKeyDown={e => e.key === 'Enter' && handlePin()}
                  style={{ ...inputStyle, letterSpacing: '8px', fontSize: 24, textAlign: 'center' }} autoFocus />
                {error && <div style={{ color: '#ff6b6b', fontSize: 13 }}>{error}</div>}
                <button onClick={handlePin} disabled={loading} style={btnStyle}>
                  {loading ? 'Signing in…' : 'Sign In →'}
                </button>
                <button onClick={() => { setStep('email'); setPin(''); setError('') }}
                  style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', fontSize: 12, cursor: 'pointer', fontFamily: FONT, marginTop: 4 }}>
                  ← Use a different email
                </button>
              </div>
            </>
          )}

          {step === 'otp' && (
            <>
              <h2 style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.5px', margin: '0 0 8px' }}>Check your email</h2>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: '0 0 28px', lineHeight: 1.6 }}>
                We sent a 6-digit code to <strong style={{ color: '#fff' }}>{email}</strong>. Enter it below.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <input type="text" inputMode="numeric" placeholder="123456" maxLength={6}
                  value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                  onKeyDown={e => e.key === 'Enter' && handleOtp()}
                  style={{ ...inputStyle, letterSpacing: '8px', fontSize: 24, textAlign: 'center' }} autoFocus />
                {error && <div style={{ color: '#ff6b6b', fontSize: 13 }}>{error}</div>}
                <button onClick={handleOtp} disabled={loading} style={btnStyle}>
                  {loading ? 'Verifying…' : 'Verify Code →'}
                </button>
                <button onClick={() => { setStep('email'); setOtp(''); setError('') }}
                  style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', fontSize: 12, cursor: 'pointer', fontFamily: FONT, marginTop: 4 }}>
                  ← Back
                </button>
              </div>
            </>
          )}

          {step === 'set-pin' && (
            <>
              <h2 style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.5px', margin: '0 0 8px' }}>Set your PIN</h2>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: '0 0 28px', lineHeight: 1.6 }}>
                Create a 4-digit PIN. You&apos;ll use it every time you sign in — no more email codes.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <input type="text" placeholder="First name" value={firstName}
                  onChange={e => setFirstName(e.target.value)} style={inputStyle} />
                <input type="text" placeholder="Last name" value={lastName}
                  onChange={e => setLastName(e.target.value)} style={inputStyle} />
                <input type="password" inputMode="numeric" placeholder="Choose a 4-digit PIN" maxLength={6}
                  value={newPin} onChange={e => setNewPin(e.target.value.replace(/\D/g, ''))}
                  onKeyDown={e => e.key === 'Enter' && handleSetPin()}
                  style={{ ...inputStyle, letterSpacing: '8px', fontSize: 24, textAlign: 'center' }} autoFocus />
                {error && <div style={{ color: '#ff6b6b', fontSize: 13 }}>{error}</div>}
                <button onClick={handleSetPin} disabled={loading} style={btnStyle}>
                  {loading ? 'Creating account…' : 'Create My Account →'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function BoaterAuthPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#070f1a' }} />}>
      <AuthFlow />
    </Suspense>
  )
}

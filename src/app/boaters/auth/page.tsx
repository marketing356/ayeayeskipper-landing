'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

const NAVY = '#0d2b4b'
const TEAL = '#4dd6c8'
const DARK = '#070f1a'
const FONT = "system-ui,-apple-system,'Segoe UI',Roboto,sans-serif"

async function sha256(str: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str))
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

type Step = 'email' | 'otp' | 'set-pin' | 'pin'

export default function BoaterAuth() {
  const router = useRouter()
  const [step, setStep]           = useState<Step>('email')
  const [email, setEmail]         = useState('')
  const [otp, setOtp]             = useState('')
  const [pin, setPin]             = useState('')
  const [pinConfirm, setPinConfirm] = useState('')
  const [userId, setUserId]       = useState('')
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')
  const [resendCount, setResendCount] = useState(0)
  const emailRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Already logged in? Skip to dashboard
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('boater_email')
      if (saved) router.replace('/boaters/dashboard')
    }
    emailRef.current?.focus()
  }, [router])

  async function post(body: object) {
    const res = await fetch('/api/boaters/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    return res.json()
  }

  async function handleEmail() {
    const e = email.toLowerCase().trim()
    if (!e || !e.includes('@')) return setError('Enter a valid email address')
    setLoading(true); setError('')
    const data = await post({ action: 'check', email: e })
    if (data.hasPIN) {
      setStep('pin')
    } else {
      const r = await post({ action: 'send-otp', email: e })
      if (r.error) { setError(r.error); setLoading(false); return }
      setStep('otp')
    }
    setLoading(false)
  }

  async function handleResendOtp() {
    if (resendCount >= 3) return setError('Too many resend attempts — please wait a minute')
    setLoading(true); setError('')
    const r = await post({ action: 'send-otp', email })
    if (r.error) setError(r.error)
    else { setResendCount(c => c + 1); setError('') }
    setLoading(false)
  }

  async function handleOtp() {
    if (!otp.trim()) return setError('Enter the 6-digit code')
    setLoading(true); setError('')
    const data = await post({ action: 'verify-otp', email, otp: otp.trim() })
    if (data.error) { setError(data.error); setLoading(false); return }
    setUserId(data.userId)
    setPin(''); setPinConfirm('')
    setStep('set-pin')
    setLoading(false)
  }

  async function handleSetPin() {
    if (pin.length < 4) return setError('PIN must be at least 4 digits')
    if (!/^\d+$/.test(pin)) return setError('PIN must be digits only')
    if (pin !== pinConfirm) return setError('PINs do not match')
    setLoading(true); setError('')
    const pinHash = await sha256(pin)
    const data = await post({ action: 'set-pin', userId, pinHash })
    if (data.error) { setError(data.error); setLoading(false); return }
    localStorage.setItem('boater_email', email)
    if (data.account) localStorage.setItem('boater_account', JSON.stringify(data.account))
    router.push('/boaters/dashboard')
  }

  async function handlePin() {
    if (!pin.trim()) return setError('Enter your PIN')
    setLoading(true); setError('')
    const pinHash = await sha256(pin)
    const data = await post({ action: 'verify-pin', email, pinHash })
    if (data.error) { setError('Incorrect PIN'); setLoading(false); return }
    localStorage.setItem('boater_email', email)
    localStorage.setItem('boater_access_token', data.access_token || '')
    localStorage.setItem('boater_refresh_token', data.refresh_token || '')
    if (data.account) localStorage.setItem('boater_account', JSON.stringify(data.account))
    router.push('/boaters/dashboard')
  }

  const STEP_LABELS: Record<Step, string> = {
    email:    'Sign in to Skipper',
    otp:      'Check your email',
    'set-pin': 'Create your PIN',
    pin:      'Welcome back',
  }

  const STEP_SUB: Record<Step, string> = {
    email:    'Your boater account — slip info, invoices, messages, and more.',
    otp:      `We sent a 6-digit code to ${email}`,
    'set-pin': "You'll use this PIN every time you sign in.",
    pin:      `Signing in as ${email}`,
  }

  const card: React.CSSProperties = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: '40px 36px',
    maxWidth: 420,
    width: '100%',
  }

  const inp: React.CSSProperties = {
    width: '100%',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 10,
    color: '#fff',
    fontSize: 16,
    fontFamily: FONT,
    padding: '14px 16px',
    outline: 'none',
    boxSizing: 'border-box',
    marginBottom: 12,
  }

  const btn: React.CSSProperties = {
    width: '100%',
    background: TEAL,
    color: NAVY,
    border: 'none',
    borderRadius: 10,
    padding: '15px 24px',
    fontSize: 16,
    fontWeight: 800,
    cursor: loading ? 'not-allowed' : 'pointer',
    opacity: loading ? 0.7 : 1,
    fontFamily: FONT,
    marginTop: 4,
    transition: 'opacity 0.15s',
  }

  return (
    <div style={{ minHeight: '80vh', background: DARK, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', fontFamily: FONT }}>

      <style>{`
        input::placeholder { color: rgba(255,255,255,0.3); }
        input:focus { border-color: rgba(77,214,200,0.5) !important; }
        .auth-link { color: rgba(77,214,200,0.8); background: none; border: none; cursor: pointer; font-family: inherit; font-size: 13px; padding: 0; text-decoration: underline; }
        .auth-link:hover { color: #4dd6c8; }
      `}</style>

      {/* Logo */}
      <div style={{ marginBottom: 32, textAlign: 'center' }}>
        <div style={{ fontSize: 32 }}>⚓</div>
        <div style={{ color: TEAL, fontWeight: 800, fontSize: 18, letterSpacing: '-0.5px', marginTop: 6 }}>AyeAyeSkipper</div>
      </div>

      <div style={card}>
        <h1 style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.8px', margin: '0 0 6px', color: '#fff' }}>
          {STEP_LABELS[step]}
        </h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: '0 0 28px', lineHeight: 1.5 }}>
          {STEP_SUB[step]}
        </p>

        {/* ── EMAIL ── */}
        {step === 'email' && (
          <>
            <input
              ref={emailRef}
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => { setEmail(e.target.value); setError('') }}
              onKeyDown={e => e.key === 'Enter' && handleEmail()}
              style={inp}
              autoComplete="email"
            />
            {error && <div style={{ color: '#f87171', fontSize: 13, marginBottom: 10, marginTop: -6 }}>{error}</div>}
            <button onClick={handleEmail} style={btn} disabled={loading}>
              {loading ? 'Checking…' : 'Continue →'}
            </button>
          </>
        )}

        {/* ── OTP ── */}
        {step === 'otp' && (
          <>
            <div style={{ background: 'rgba(77,214,200,0.08)', border: '1px solid rgba(77,214,200,0.2)', borderRadius: 10, padding: '12px 16px', marginBottom: 16, fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>
              📧 Check your email — the code expires in 10 minutes.
            </div>
            <input
              type="text"
              inputMode="numeric"
              placeholder="6-digit code"
              value={otp}
              onChange={e => { setOtp(e.target.value.replace(/\D/g, '').slice(0, 6)); setError('') }}
              onKeyDown={e => e.key === 'Enter' && handleOtp()}
              style={{ ...inp, letterSpacing: '0.3em', textAlign: 'center', fontSize: 22 }}
              autoComplete="one-time-code"
              maxLength={6}
              autoFocus
            />
            {error && <div style={{ color: '#f87171', fontSize: 13, marginBottom: 10, marginTop: -6 }}>{error}</div>}
            <button onClick={handleOtp} style={btn} disabled={loading || otp.length < 6}>
              {loading ? 'Verifying…' : 'Verify Code →'}
            </button>
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <button className="auth-link" onClick={handleResendOtp} disabled={loading}>Resend code</button>
              <span style={{ color: 'rgba(255,255,255,0.2)', margin: '0 8px' }}>·</span>
              <button className="auth-link" onClick={() => { setStep('email'); setOtp(''); setError('') }}>Change email</button>
            </div>
          </>
        )}

        {/* ── SET PIN ── */}
        {step === 'set-pin' && (
          <>
            <div style={{ background: 'rgba(77,214,200,0.08)', border: '1px solid rgba(77,214,200,0.2)', borderRadius: 10, padding: '12px 16px', marginBottom: 16, fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>
              ✅ Email verified. Create a 4–6 digit PIN to sign in next time — no email required.
            </div>
            <input
              type="password"
              inputMode="numeric"
              placeholder="Create PIN (4–6 digits)"
              value={pin}
              onChange={e => { setPin(e.target.value.replace(/\D/g, '').slice(0, 6)); setError('') }}
              onKeyDown={e => e.key === 'Enter' && handleSetPin()}
              style={{ ...inp, letterSpacing: '0.4em', textAlign: 'center', fontSize: 22 }}
              maxLength={6}
              autoFocus
            />
            <input
              type="password"
              inputMode="numeric"
              placeholder="Confirm PIN"
              value={pinConfirm}
              onChange={e => { setPinConfirm(e.target.value.replace(/\D/g, '').slice(0, 6)); setError('') }}
              onKeyDown={e => e.key === 'Enter' && handleSetPin()}
              style={{ ...inp, letterSpacing: '0.4em', textAlign: 'center', fontSize: 22 }}
              maxLength={6}
            />
            {error && <div style={{ color: '#f87171', fontSize: 13, marginBottom: 10, marginTop: -6 }}>{error}</div>}
            <button onClick={handleSetPin} style={btn} disabled={loading || pin.length < 4}>
              {loading ? 'Saving…' : 'Set PIN & Enter Dashboard →'}
            </button>
          </>
        )}

        {/* ── PIN LOGIN ── */}
        {step === 'pin' && (
          <>
            <input
              type="password"
              inputMode="numeric"
              placeholder="Enter your PIN"
              value={pin}
              onChange={e => { setPin(e.target.value.replace(/\D/g, '').slice(0, 6)); setError('') }}
              onKeyDown={e => e.key === 'Enter' && handlePin()}
              style={{ ...inp, letterSpacing: '0.4em', textAlign: 'center', fontSize: 28 }}
              maxLength={6}
              autoFocus
            />
            {error && <div style={{ color: '#f87171', fontSize: 13, marginBottom: 10, marginTop: -6 }}>{error}</div>}
            <button onClick={handlePin} style={btn} disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In →'}
            </button>
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <button className="auth-link" onClick={async () => {
                setError(''); setLoading(true)
                await post({ action: 'send-otp', email })
                setPin(''); setOtp(''); setStep('otp'); setLoading(false)
              }}>
                Forgot PIN? Resend email code
              </button>
              <br /><br />
              <button className="auth-link" onClick={() => { setStep('email'); setPin(''); setEmail(''); setError('') }}>
                Sign in with a different email
              </button>
            </div>
          </>
        )}
      </div>

      <p style={{ marginTop: 24, fontSize: 12, color: 'rgba(255,255,255,0.2)', textAlign: 'center' }}>
        Free for boaters, always. · <a href="/boaters" style={{ color: 'inherit' }}>Learn more</a>
      </p>
    </div>
  )
}

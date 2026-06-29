'use client'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const NAVY = '#0d2b4b', TEAL = '#4dd6c8', DARK = '#070f1a'
const FONT = "system-ui,-apple-system,'Segoe UI',Roboto,sans-serif"

type Step = 'email' | 'pin'

function LoginFlow() {
  const router = useRouter()
  const params = useSearchParams()
  const [step, setStep]   = useState<Step>('email')
  const [email, setEmail] = useState(params.get('email') || '')
  const [pin, setPin]     = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // If email pre-filled from URL, skip straight to PIN if account exists
  useEffect(() => {
    const preEmail = params.get('email')
    if (preEmail) checkEmail(preEmail)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function checkEmail(e: string) {
    if (!e.includes('@')) return
    setLoading(true)
    try {
      const res = await fetch('/api/marina/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'check', email: e }),
      })
      const data = await res.json()
      if (data.hasPIN) { setEmail(e); setStep('pin') }
    } catch {}
    finally { setLoading(false) }
  }

  async function handleEmail() {
    if (!email.includes('@')) { setError('Enter a valid email'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/marina/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'check', email }),
      })
      const data = await res.json()
      if (!data.hasAccount) {
        router.push(`/signup?email=${encodeURIComponent(email)}`)
        return
      }
      if (data.hasPIN) { setStep('pin') } else { setError('Account found but PIN not set. Contact support.') }
    } catch { setError('Something went wrong') }
    finally { setLoading(false) }
  }

  async function handlePin() {
    if (pin.length < 4) { setError('Enter your PIN'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/marina/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify-pin', email, pin }),
      })
      const data = await res.json()
      if (data.error) { setError('Incorrect PIN'); setPin(''); return }
      localStorage.setItem('marina_session', data.session)
      localStorage.setItem('marina_account', JSON.stringify(data.account))
      router.push('/account')
    } catch { setError('Something went wrong') }
    finally { setLoading(false) }
  }

  const inputStyle = {
    width: '100%', padding: '14px 16px',
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 8, color: '#fff', fontSize: 16,
    fontFamily: FONT, outline: 'none', boxSizing: 'border-box' as const,
  }
  const btnStyle = {
    width: '100%', padding: '14px', background: TEAL, color: NAVY,
    border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 900,
    cursor: loading ? 'not-allowed' as const : 'pointer' as const,
    fontFamily: FONT, opacity: loading ? 0.7 : 1,
  }

  return (
    <div style={{ minHeight: '100vh', background: DARK, fontFamily: FONT, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <img src="/skipper-avatar.jpg" alt="Skipper" style={{ width: 56, height: 56, borderRadius: '50%', border: `2px solid ${TEAL}`, marginBottom: 12 }} />
          <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.5px' }}>Marina sign in</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 6 }}>Access your marina account</div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '32px 28px' }}>

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
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', textAlign: 'center', margin: '8px 0 0' }}>
                No account? <a href="/signup" style={{ color: TEAL, textDecoration: 'none' }}>Create one →</a>
              </p>
            </div>
          )}

          {step === 'pin' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: '0 0 4px' }}>{email}</p>
              <input type="password" inputMode="numeric" placeholder="••••" maxLength={4}
                value={pin} onChange={e => setPin(e.target.value.replace(/\D/g,''))}
                onKeyDown={e => e.key === 'Enter' && handlePin()}
                style={{ ...inputStyle, letterSpacing: '8px', fontSize: 24, textAlign: 'center' }} autoFocus />
              {error && <div style={{ color: '#ff6b6b', fontSize: 13 }}>{error}</div>}
              <button onClick={handlePin} disabled={loading} style={btnStyle}>
                {loading ? 'Signing in…' : 'Sign In →'}
              </button>
              <button onClick={() => { setStep('email'); setPin(''); setError('') }}
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', fontSize: 12, cursor: 'pointer', fontFamily: FONT }}>
                ← Different email
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function MarinaLoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#070f1a' }} />}>
      <LoginFlow />
    </Suspense>
  )
}

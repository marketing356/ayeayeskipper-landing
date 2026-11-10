'use client'
import { useState } from 'react'

const TEAL = '#4dd6c8', NAVY = '#0d2b4b'
const FONT = "system-ui,-apple-system,'Segoe UI',Roboto,sans-serif"

const field: React.CSSProperties = {
  width: '100%', padding: '12px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.18)',
  background: 'rgba(255,255,255,0.06)', color: '#fff', fontSize: 15, fontFamily: FONT, boxSizing: 'border-box',
}
const label: React.CSSProperties = { fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.7)', marginBottom: 6, display: 'block' }

export default function DemoForm() {
  const [f, setF] = useState({ name: '', email: '', phone: '', place: '', kind: 'marina', size: '', message: '', dry: false, website: '' })
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')

  function set(k: string, v: string) { setF(prev => ({ ...prev, [k]: v })) }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setState('sending')
    try {
      const r = await fetch('/api/demo', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(f) })
      setState(r.ok ? 'done' : 'error')
    } catch {
      setState('error')
    }
  }

  if (state === 'done') {
    return (
      <div style={{ background: 'rgba(77,214,200,0.1)', border: '1px solid rgba(77,214,200,0.4)', borderRadius: 14, padding: 32, fontFamily: FONT }}>
        <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 8 }}>Thank you. We have it.</div>
        <p style={{ margin: 0, color: 'rgba(255,255,255,0.75)', lineHeight: 1.7 }}>We will get back to you personally, usually within one business day.</p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="sk-card" style={{ fontFamily: FONT, display: 'grid', gap: 16 }}>
      <div style={{ display: 'flex', gap: 10 }}>
        {[['marina', 'I run a marina'], ['club', 'I run a yacht club']].map(([k, t]) => (
          <button key={k} type="button" onClick={() => set('kind', k)} style={{
            flex: 1, padding: '10px 12px', borderRadius: 8, cursor: 'pointer', fontWeight: 800, fontSize: 14, fontFamily: FONT,
            background: f.kind === k ? TEAL : 'transparent', color: f.kind === k ? NAVY : TEAL, border: '1px solid ' + TEAL,
          }}>{t}</button>
        ))}
      </div>
      <div><label style={label}>Your name</label><input required style={field} value={f.name} onChange={e => set('name', e.target.value)} /></div>
      <div><label style={label}>Email</label><input required type="email" style={field} value={f.email} onChange={e => set('email', e.target.value)} /></div>
      <div><label style={label}>Phone (best for a quick call)</label><input required type="tel" style={field} value={f.phone} onChange={e => set('phone', e.target.value)} /></div>
      <div><label style={label}>{f.kind === 'club' ? 'Club name' : 'Marina name'}</label><input required style={field} value={f.place} onChange={e => set('place', e.target.value)} /></div>
      <div><label style={label}>{f.kind === 'club' ? 'About how many members?' : 'About how many slips and moorings?'}</label><input style={field} value={f.size} onChange={e => set('size', e.target.value)} /></div>
      <label style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 14, color: 'rgba(255,255,255,0.8)', cursor: 'pointer' }}><input type="checkbox" checked={f.dry} onChange={e => setF({ ...f, dry: e.target.checked })} />I run dry stack or a boat yard</label>
      <div><label style={label}>Anything we should know? (optional)</label><textarea rows={3} style={field} value={f.message} onChange={e => set('message', e.target.value)} /></div>
      <input tabIndex={-1} autoComplete="off" value={f.website} onChange={e => set('website', e.target.value)} style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }} aria-hidden="true" />
      <button type="submit" disabled={state === 'sending'} style={{ padding: '14px 20px', borderRadius: 8, border: 'none', background: TEAL, color: NAVY, fontWeight: 900, fontSize: 16, cursor: 'pointer', fontFamily: FONT }}>
        {state === 'sending' ? 'Sending...' : 'Request a demo'}
      </button>
      {state === 'error' && <div style={{ color: '#ff9b9b', fontSize: 14 }}>Something went wrong. Please try again, or email admin@ayeayeskipper.com.</div>}
    </form>
  )
}

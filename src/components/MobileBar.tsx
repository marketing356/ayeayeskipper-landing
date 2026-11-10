'use client'
import { useEffect, useState } from 'react'

export default function MobileBar() {
  const [on, setOn] = useState(false)
  useEffect(() => {
    const f = () => setOn(window.scrollY > 600)
    f(); window.addEventListener('scroll', f, { passive: true })
    return () => window.removeEventListener('scroll', f)
  }, [])
  return (
    <>
      <button aria-label="Back to top" className={'sk-totop' + (on ? ' sk-on' : '')} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>&#8593;</button>
      <div className="sk-callbar">
        <a href="tel:+18006860315" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(77,214,200,0.5)', color: '#4dd6c8' }}>Call 1-800-686-0315</a>
        <a href="/#demo" style={{ background: '#4dd6c8', color: '#0d2b4b' }}>Request a demo</a>
      </div>
    </>
  )
}

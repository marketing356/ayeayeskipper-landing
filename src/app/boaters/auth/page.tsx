'use client'
import { useEffect } from 'react'

export default function BoaterAuthRedirect() {
  useEffect(() => {
    window.location.replace('https://app.ayeayeskipper.com')
  }, [])
  return (
    <div style={{ minHeight: '100vh', background: '#070f1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'system-ui, sans-serif', fontSize: 15 }}>Redirecting to the Skipper app…</div>
    </div>
  )
}

'use client'
import { useEffect } from 'react'

const TEAL = '#4dd6c8'
const DARK = '#070f1a'
const FONT = "system-ui,-apple-system,'Segoe UI',Roboto,sans-serif"

// RETIRED — this was the old (July) boater dashboard, replaced by the real app
// at app.ayeayeskipper.com (single source of truth). Kept as a redirect (not
// deleted) so old links/bookmarks don't break.
export default function BoaterDashboardRetired() {
  useEffect(() => {
    window.location.href = 'https://app.ayeayeskipper.com'
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: DARK, fontFamily: FONT, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <img src="/skipper-avatar.jpg" alt="Skipper" style={{ width: 56, height: 56, borderRadius: '50%', border: `2px solid ${TEAL}`, marginBottom: 12 }} />
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>Taking you to Skipper…</div>
        <a href="https://app.ayeayeskipper.com" style={{ fontSize: 13, color: TEAL }}>Click here if you're not redirected</a>
      </div>
    </div>
  )
}

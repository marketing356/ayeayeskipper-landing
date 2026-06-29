'use client'
import { useEffect } from 'react'

// Boater dashboard has moved to app.ayeayeskipper.com
// This page is a permanent redirect — do not add content here.
export default function BoaterDashboardRedirect() {
  useEffect(() => {
    window.location.replace('https://app.ayeayeskipper.com')
  }, [])
  return <div style={{ minHeight: '100vh', background: '#070f1a' }} />
}

import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: "Welcome to AyeAyeSkipper",
  description: "Your 30-day free trial has started.",
}

const TEAL = '#4dd6c8'
const NAVY = '#0d2b4b'
const DARK = '#070f1a'
const FONT = "system-ui,-apple-system,'Segoe UI',Roboto,sans-serif"

export default function Welcome() {
  return (
    <div style={{ minHeight: '100vh', background: DARK, fontFamily: FONT, color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ textAlign: 'center', maxWidth: 600 }}>
        <div style={{ fontSize: 72, marginBottom: 24 }}>⚓</div>
        <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 900, margin: '0 0 20px', color: TEAL }}>
          You&apos;re on Skipper.
        </h1>
        <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.7)', marginBottom: 12, lineHeight: 1.7 }}>
          Your 30-day free trial has started. No charge until day 31.
        </p>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', marginBottom: 48 }}>
          Our team will reach out within 24 hours to get your marina set up on the Helm.
        </p>
        <div style={{ background: `${NAVY}cc`, border: `1px solid rgba(77,214,200,0.2)`, borderRadius: 16, padding: '32px', marginBottom: 40 }}>
          <div style={{ fontSize: 14, color: TEAL, fontWeight: 700, marginBottom: 20, letterSpacing: 2 }}>WHAT HAPPENS NEXT</div>
          {[
            ['Within 24 hours', 'Our team contacts you to set up your Helm dashboard'],
            ['Day 1', 'Your marina goes live on Helm — slips, contacts, messaging'],
            ['Day 25', 'We remind you — no surprise charges'],
            ['Day 30', 'Trial ends, subscription begins unless you cancel'],
          ].map(([when, what]) => (
            <div key={when} style={{ display: 'flex', gap: 16, marginBottom: 16, textAlign: 'left' }}>
              <span style={{ color: TEAL, fontWeight: 700, minWidth: 100, fontSize: 13 }}>{when}</span>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>{what}</span>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>
          Questions? Email <a href="mailto:hello@ayeayeskipper.com" style={{ color: TEAL }}>hello@ayeayeskipper.com</a>
        </p>
      </div>
    </div>
  )
}

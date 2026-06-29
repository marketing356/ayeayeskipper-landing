'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAVY = '#0d2b4b', TEAL = '#4dd6c8', DARK = '#070f1a'
const FONT = "system-ui,-apple-system,'Segoe UI',Roboto,sans-serif"

const MARINA_LINKS: [string, string][] = [
  ['How It Works', '/#how-it-works'],
  ['Pricing', '/pricing'],
  ['vs. Dockwa', '/vs-dockwa'],
]

const BOATER_LINKS: [string, string][] = [
  ['Find a Marina', '/marinas'],
  ['How It Works', '/boaters#how-it-works'],
]

// Homepage — clean, no clutter
const HOME_LINKS: [string, string][] = []

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [isBoater, setIsBoater] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // Read audience flag set by the homepage decision tree.
    // Only 'boater' flips the nav; everything else stays marina.
    const audience = typeof window !== 'undefined'
      ? sessionStorage.getItem('audience')
      : null
    setIsBoater(audience === 'boater')
  }, [pathname])

  const isHome = pathname === '/'
  const links = isHome ? HOME_LINKS : isBoater ? BOATER_LINKS : MARINA_LINKS
  const cta = (isHome || isBoater)
    ? { label: 'Log In', href: '/login' }
    : { label: 'Book a Demo', href: '/demo' }

  return (
    <nav style={{
      padding: '0 40px', height: 64, display: 'flex', justifyContent: 'space-between',
      alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.07)',
      position: 'sticky', top: 0, background: 'rgba(7,15,26,0.97)',
      backdropFilter: 'blur(12px)', zIndex: 1000, fontFamily: FONT,
    }}>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: '#fff' }}>
        <img src="/skipper-avatar.jpg" alt="Skipper" style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(77,214,200,0.4)' }} />
        <span style={{ fontSize: 18, fontWeight: 900, letterSpacing: '-0.5px' }}>AyeAyeSkipper</span>
        <span style={{ fontSize: 10, color: TEAL, fontWeight: 700, letterSpacing: '1px', background: 'rgba(77,214,200,0.12)', padding: '2px 8px', borderRadius: 20 }}>SLIP LOGIC™</span>
      </Link>

      <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
        {links.map(([label, href]) => (
          <Link key={label} href={href} style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: 13, fontWeight: 500 }}>
            {label}
          </Link>
        ))}

        <Link href={cta.href} style={{
          padding: '8px 22px',
          background: (isHome || isBoater) ? 'rgba(77,214,200,0.15)' : TEAL,
          color: (isHome || isBoater) ? TEAL : NAVY,
          border: (isHome || isBoater) ? `1px solid ${TEAL}` : 'none',
          borderRadius: 6, fontSize: 13, fontWeight: 800,
          cursor: 'pointer', fontFamily: FONT, textDecoration: 'none',
        }}>
          {cta.label}
        </Link>
      </div>
    </nav>
  )
}

'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAVY = '#0d2b4b', TEAL = '#4dd6c8'
const FONT = "system-ui,-apple-system,'Segoe UI',Roboto,sans-serif"

const LINKS: [string, string][] = [
  ['Product', '/#product'],
  ['Modules', '/#modules'],
  ['Autopilot', '/#autopilot'],
  ['Yacht Clubs', '/#clubs'],
  ['Fleet', '/#fleet'],
  ['Pricing', '/#pricing'],
]

export default function Nav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const isAuthPage = ['/login', '/signup', '/account', '/marina-login', '/boaters/auth', '/boaters/dashboard'].some(p => pathname.startsWith(p))

  return (
    <nav style={{
      padding: '0 28px', minHeight: 64, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap',
      borderBottom: '1px solid rgba(255,255,255,0.07)', position: 'sticky', top: 0, background: 'rgba(7,15,26,0.97)',
      backdropFilter: 'blur(12px)', zIndex: 1000, fontFamily: FONT,
    }}>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: '#fff' }}>
        <img src="/skipper-avatar.jpg" alt="Skipper" style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(77,214,200,0.4)' }} />
        <span style={{ fontSize: 20, fontWeight: 900, letterSpacing: '-0.5px' }}>Skipper</span>
      </Link>

      <button onClick={() => setOpen(o => !o)} aria-label="Menu" className="sk-burger" style={{ background: 'none', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: 6, padding: '6px 12px', fontSize: 14, cursor: 'pointer', fontFamily: FONT }}>
        Menu
      </button>

      <div className={'sk-navlinks' + (open ? ' sk-open' : '')} style={{ gap: 22, alignItems: 'center' }}>
        {!isAuthPage && LINKS.map(([label, href]) => (
          <Link key={label} href={href} onClick={() => setOpen(false)} style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>{label}</Link>
        ))}
        <Link href="/marina-login" style={{ color: TEAL, textDecoration: 'none', fontSize: 14, fontWeight: 700 }}>Log in</Link>
        <Link href="/#demo" onClick={() => setOpen(false)} style={{ padding: '9px 20px', background: TEAL, color: NAVY, borderRadius: 6, fontSize: 14, fontWeight: 800, textDecoration: 'none' }}>
          Request a Demo
        </Link>
      </div>
      <style dangerouslySetInnerHTML={{ __html: [
        '.sk-navlinks { display: flex; }',
        '.sk-burger { display: none; }',
        '@media (max-width: 960px) {',
        '  .sk-burger { display: block; }',
        '  .sk-navlinks { display: none; width: 100%; flex-direction: column; align-items: flex-start !important; padding: 12px 0 18px; }',
        '  .sk-navlinks.sk-open { display: flex; }',
        '}',
      ].join('\n') }} />
    </nav>
  )
}

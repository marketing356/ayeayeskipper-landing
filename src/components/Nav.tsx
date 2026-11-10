'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAVY = '#0d2b4b', TEAL = '#4dd6c8'
const FONT = "system-ui,-apple-system,'Segoe UI',Roboto,sans-serif"

const FEATURE_GROUPS: [string, [string, string][]][] = [
  ['Spaces and map', [['Maps', '/#maps'], ['Dry stack', '/#drystack'], ['Yard and storage', '/#track'], ['Boat records', '/#boatrecord']]],
  ['Money', [['Billing and contracts', '/#billing'], ['Fuel dock POS', '/#fuel'], ['Work orders and parts', '/#workorders']]],
  ['Guests and crew', [['Transient and Hot Slip', '/#hotslip'], ['Wait list', '/#waitlist'], ['Messaging', '/#messaging'], ['Boater app', '/#app']]],
]

const LINKS: [string, string][] = [
  ['Skipper AI', '/#skipper-ai'],
  ['Yacht Clubs', '/#clubs'],
  ['Compare', '/#compare'],
  ['Pricing', '/#pricing'],
  ['FAQ', '/#faq'],
]

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [feat, setFeat] = useState(false)
  const pathname = usePathname()
  const isAuthPage = ['/login', '/signup', '/account', '/marina-login', '/boaters/auth', '/boaters/dashboard'].some(p => pathname.startsWith(p))
  const linkStyle = { color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: 14, fontWeight: 600 } as const
  const close = () => { setOpen(false); setFeat(false) }

  return (
    <nav style={{
      padding: '0 28px', minHeight: 64, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap',
      borderBottom: '1px solid rgba(255,255,255,0.07)', position: 'sticky', top: 0, background: 'rgba(7,15,26,0.97)',
      backdropFilter: 'blur(12px)', zIndex: 1000, fontFamily: FONT,
    }}>
      <Link href="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: '#fff' }}>
        <img src="/skipper-avatar.jpg" alt="Skipper" style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(77,214,200,0.4)' }} />
        <span style={{ fontSize: 20, fontWeight: 900, letterSpacing: '-0.5px' }}>Skipper</span>
      </Link>

      <button onClick={() => setOpen(o => !o)} aria-label="Menu" className="sk-burger" style={{ background: 'none', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: 6, padding: '8px 14px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
        Menu
      </button>

      <div className={'sk-navlinks' + (open ? ' sk-open' : '')} style={{ gap: 22, alignItems: 'center' }}>
        {!isAuthPage && (
          <div className="sk-feat" onMouseEnter={() => setFeat(true)} onMouseLeave={() => setFeat(false)}>
            <button onClick={() => setFeat(true)} style={{ ...linkStyle, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: FONT }}>Features &#9662;</button>
            {(
              <div className={'sk-featmenu' + (feat ? ' sk-show' : '')}>
                {FEATURE_GROUPS.map(([g, items]) => (
                  <div key={g} className="sk-featcol">
                    <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '1.5px', color: TEAL, textTransform: 'uppercase', marginBottom: 8 }}>{g}</div>
                    {items.map(([label, href]) => (
                      <Link key={label} href={href} onClick={close} style={{ display: 'block', padding: '5px 0', ...linkStyle, color: 'rgba(255,255,255,0.85)' }}>{label}</Link>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {!isAuthPage && LINKS.map(([label, href]) => (
          <Link key={label} href={href} onClick={close} style={linkStyle}>{label}</Link>
        ))}
        <Link href="/marina-login" style={{ color: TEAL, textDecoration: 'none', fontSize: 14, fontWeight: 700 }}>Log in</Link>
        <Link href="/#demo" onClick={close} style={{ padding: '9px 20px', background: TEAL, color: NAVY, borderRadius: 6, fontSize: 14, fontWeight: 800, textDecoration: 'none' }}>
          Request a Demo
        </Link>
      </div>
      <style dangerouslySetInnerHTML={{ __html: [
        '.sk-navlinks { display: flex; }',
        '.sk-burger { display: none; }',
        '.sk-feat { position: relative; padding: 22px 0; }',
        '.sk-featmenu { display: none; position: absolute; top: 56px; left: -20px; grid-template-columns: repeat(3, 190px); gap: 24px; padding: 20px 24px; background: rgba(7,15,26,0.98); border: 1px solid rgba(77,214,200,0.3); border-radius: 12px; box-shadow: 0 30px 70px rgba(0,0,0,0.6); }',
        '.sk-featmenu.sk-show { display: grid; }',
        '@media (max-width: 960px) {',
        '  .sk-burger { display: block; }',
        '  .sk-navlinks { display: none; width: 100%; flex-direction: column; align-items: flex-start !important; padding: 12px 0 18px; }',
        '  .sk-navlinks.sk-open { display: flex; }',
        '  .sk-feat { padding: 0; }',
        '  .sk-open { max-height: calc(100vh - 80px); overflow-y: auto; padding-bottom: 90px !important; }',
        '  .sk-featmenu, .sk-featmenu.sk-show { display: grid; position: static; grid-template-columns: 1fr; border: none; box-shadow: none; padding: 10px 0 0 4px; background: none; }',
        '}',
      ].join('\n') }} />
    </nav>
  )
}

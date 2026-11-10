import Link from 'next/link'
const TEAL = '#4dd6c8'
const FONT = "system-ui,-apple-system,'Segoe UI',Roboto,sans-serif"

export default function Footer() {
  const a: React.CSSProperties = { color: 'rgba(255,255,255,0.55)', textDecoration: 'none', fontSize: 13 }
  return (
    <footer style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '44px 28px 36px', fontFamily: FONT }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24, marginBottom: 28 }}>
          <div>
            <div style={{ fontWeight: 900, fontSize: 18, color: '#fff', marginBottom: 8 }}>Skipper</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', maxWidth: 320, lineHeight: 1.7 }}>Management software for marinas and yacht clubs.</div>
          </div>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
            <a href="tel:+18006860315" style={{ ...a, color: TEAL, fontWeight: 700 }}>1-800-686-0315</a>
            <Link href="/terms" style={a}>Terms</Link>
            <Link href="/privacy" style={a}>Privacy</Link>
            <Link href="/support" style={a}>Support</Link>
            <Link href="/sms-consent" style={a}>SMS Consent</Link>
            <a href="https://app.ayeayeskipper.com" style={a}>Boater log in</a>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>Skipper (AyeAyeSkipper) is a product of Mariner and Sailor Company, 651 N. Broad St, Middletown, DE 19709</div>
          <div style={{ fontSize: 12, color: TEAL, fontWeight: 700 }}>We run on Skipper.</div>
        </div>
      </div>
    </footer>
  )
}

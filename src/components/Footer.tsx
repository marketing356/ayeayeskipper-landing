import Link from 'next/link'
const TEAL = '#4dd6c8'
const FONT = "system-ui,-apple-system,'Segoe UI',Roboto,sans-serif"

export default function Footer() {
  return (
    <footer style={{ borderTop:'1px solid rgba(255,255,255,0.07)', padding:'60px 40px 40px', fontFamily:FONT }}>
      <div style={{ maxWidth:1100, margin:'0 auto' }}>
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', gap:48, marginBottom:48 }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
              <span style={{ fontSize:20 }}>⚓</span>
              <span style={{ fontWeight:900, fontSize:17, color:'#fff' }}>AyeAyeSkipper</span>
            </div>
            <p style={{ fontSize:13, color:'rgba(255,255,255,0.4)', lineHeight:1.75, maxWidth:260 }}>
              The marina OS built around AI. Powered by Slip Logic™. Built by Mariner and Sailor LLC.
            </p>
            <p style={{ fontSize:12, color:'rgba(255,255,255,0.25)', marginTop:12 }}>© 2026 Next-Gen Marine · Mariner and Sailor LLC</p>
          </div>
          <div>
            <div style={{ fontWeight:700, fontSize:12, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:'1px', marginBottom:16 }}>Product</div>
            {[['Features','/features'],['Pricing','/pricing'],['Hot Slip™','/hot-slip'],['Skipper Gangway™','/skipper-gangway'],['Book a Demo','/demo']].map(([l,h]) => (
              <Link key={l} href={h} style={{ display:'block', color:'rgba(255,255,255,0.55)', textDecoration:'none', fontSize:13, marginBottom:10 }}>{l}</Link>
            ))}
          </div>
          <div>
            <div style={{ fontWeight:700, fontSize:12, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:'1px', marginBottom:16 }}>Compare</div>
            {[['vs. Dockwa','/vs-dockwa'],['vs. Dockmaster','#'],['vs. Marina Controller','#'],['vs. Spreadsheets','#']].map(([l,h]) => (
              <Link key={l} href={h} style={{ display:'block', color:'rgba(255,255,255,0.55)', textDecoration:'none', fontSize:13, marginBottom:10 }}>{l}</Link>
            ))}
          </div>
          <div>
            <div style={{ fontWeight:700, fontSize:12, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:'1px', marginBottom:16 }}>Company</div>
            {[['About','/about'],['Contact','/demo'],['Privacy','#'],['Terms','#']].map(([l,h]) => (
              <Link key={l} href={h} style={{ display:'block', color:'rgba(255,255,255,0.55)', textDecoration:'none', fontSize:13, marginBottom:10 }}>{l}</Link>
            ))}
          </div>
        </div>
        <div style={{ borderTop:'1px solid rgba(255,255,255,0.07)', paddingTop:24, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
          <div style={{ fontSize:12, color:'rgba(255,255,255,0.25)' }}>Powered by Slip Logic™ · Hot Slip™ · Skipper Gangway™ — Proprietary technology of Next-Gen Marine</div>
          <div style={{ fontSize:12, color:TEAL, fontWeight:700 }}>We run on Skipper.</div>
        </div>
      </div>
    </footer>
  )
}

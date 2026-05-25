'use client'
import { useState } from 'react'
import Link from 'next/link'

const NAVY = '#0d2b4b', TEAL = '#4dd6c8', DARK = '#070f1a'
const FONT = "system-ui,-apple-system,'Segoe UI',Roboto,sans-serif"

export default function Nav() {
  const [open, setOpen] = useState(false)
  return (
    <nav style={{ padding:'0 40px', height:64, display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid rgba(255,255,255,0.07)', position:'sticky', top:0, background:'rgba(7,15,26,0.97)', backdropFilter:'blur(12px)', zIndex:1000, fontFamily:FONT }}>
      <Link href="/" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none', color:'#fff' }}>
        <img src="/skipper-avatar.jpg" alt="Skipper" style={{ width:38, height:38, borderRadius:'50%', objectFit:'cover', border:'2px solid rgba(77,214,200,0.4)' }} />
        <span style={{ fontSize:18, fontWeight:900, letterSpacing:'-0.5px' }}>AyeAyeSkipper</span>
        <span style={{ fontSize:10, color:TEAL, fontWeight:700, letterSpacing:'1px', background:'rgba(77,214,200,0.12)', padding:'2px 8px', borderRadius:20 }}>SLIP LOGIC™</span>
      </Link>
      <div style={{ display:'flex', gap:24, alignItems:'center' }}>
        {[['Features','/features'],['How It Works','/#how-it-works'],['Pricing','/pricing'],['vs. Dockwa','/vs-dockwa'],['Join','/join'],['For Boaters','/transient'],['About','/about']].map(([l,h]) => (
          <Link key={l} href={h} style={{ color:'rgba(255,255,255,0.6)', textDecoration:'none', fontSize:13, fontWeight:500 }}>{l}</Link>
        ))}
        <Link href="/demo" style={{ padding:'8px 22px', background:TEAL, color:NAVY, border:'none', borderRadius:6, fontSize:13, fontWeight:800, cursor:'pointer', fontFamily:FONT, textDecoration:'none' }}>Book a Demo</Link>
      </div>
    </nav>
  )
}

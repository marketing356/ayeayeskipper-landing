import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: "Tenant Portal — AyeAyeSkipper",
  description: "The AyeAyeSkipper Tenant Portal gives boaters full visibility into their slip, lease, billing, and Hot Slip™ earnings. Mobile-first, no app download required.",
}

const TEAL = '#4dd6c8', NAVY = '#0d2b4b', FONT = "system-ui,-apple-system,'Segoe UI',Roboto,sans-serif"

const FEATURES = [
  {
    icon: '🏠',
    label: 'MY SLIP',
    name: 'My Slip',
    desc: 'See your slip number, dock, lease details, and renewal date at a glance. Know exactly where you are, what you\'re paying, and when your lease renews — without having to call the office.',
    bullets: [
      'Slip number, dock, and berth details',
      'Lease start/end dates and monthly rate',
      'Renewal reminders 60/30/14 days out',
      'Neighbor slips and marina layout',
    ],
  },
  {
    icon: '💳',
    label: 'BILLING',
    name: 'Billing',
    desc: 'View invoices, payment history, and upcoming dues. See exactly what you owe and when it\'s due. Direct payment from the portal is coming soon.',
    bullets: [
      'All invoices — paid and outstanding',
      'Payment history with dates and amounts',
      'Upcoming dues with due dates',
      'Direct pay from portal (coming soon)',
    ],
  },
  {
    icon: '🔥',
    label: 'HOT SLIP™',
    name: 'Hot Slip™',
    desc: 'List your slip when you\'re away and earn revenue or lease credits automatically. Activate with one tap — Skipper handles the rest. Your slip is always waiting when you return.',
    bullets: [
      'Activate Hot Slip™ with one tap',
      'Set your away dates — Skipper opens your slip',
      'Earn cash back or lease discounts automatically',
      'Full earnings statement when you return',
    ],
  },
  {
    icon: '👤',
    label: 'MY PROFILE',
    name: 'Profile',
    desc: 'Your boat info, registration, insurance status, and marina contact details all in one place. Always accurate, always up to date.',
    bullets: [
      'Boat name, LOA, beam, draft, and registration',
      'Insurance certificate upload and expiry tracking',
      'Emergency contact on file',
      'Marina office contact and hours',
    ],
  },
  {
    icon: '⚓',
    label: 'SKIPPER',
    name: 'Skipper',
    desc: 'Ask Skipper anything about your marina, your slip, your billing, or local conditions. The Skipper Engine™ is available 24/7 — no hold music, no voicemail.',
    bullets: [
      '"When is my lease up?" — instant answer',
      '"What\'s the tide at the marina tomorrow?"',
      '"I need to request a maintenance check"',
      'Available 24/7 — no wait, no voicemail',
    ],
  },
]

export default function TenantPortal() {
  return (
    <div style={{ minHeight:'100vh', background:'#070f1a', fontFamily:FONT, color:'#fff' }}>
      {/* Hero */}
      <div style={{ maxWidth:900, margin:'0 auto', padding:'80px 40px 60px', textAlign:'center' }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(77,214,200,0.1)', border:'1px solid rgba(77,214,200,0.25)', borderRadius:24, padding:'6px 16px', marginBottom:24 }}>
          <span style={{ fontSize:12, color:TEAL, fontWeight:700, letterSpacing:'1px' }}>FOR BOATERS & TENANTS</span>
        </div>
        <h1 style={{ fontSize:'clamp(36px,5vw,62px)', fontWeight:900, letterSpacing:'-2.5px', lineHeight:1.05, margin:'0 0 20px' }}>
          Your marina. In your pocket.
        </h1>
        <p style={{ fontSize:18, color:'rgba(255,255,255,0.65)', maxWidth:560, margin:'0 auto 12px', lineHeight:1.65 }}>
          The Tenant Portal gives you everything about your slip, your boat, and your billing — right from your phone.
        </p>
        <p style={{ fontSize:14, color:TEAL, fontWeight:600, margin:0 }}>
          No app download required — works in any mobile browser.
        </p>
      </div>

      {/* Feature sections */}
      <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 40px 80px' }}>
        {FEATURES.map((f, i) => (
          <div
            key={f.name}
            style={{
              display:'grid',
              gridTemplateColumns:'1fr 1fr',
              gap:60,
              padding:'64px 0',
              borderBottom: i < FEATURES.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none',
              alignItems:'center',
            }}
          >
            <div style={{ order: i % 2 === 0 ? 0 : 1 }}>
              <div style={{ display:'inline-block', fontSize:10, color:TEAL, fontWeight:700, letterSpacing:'2px', background:'rgba(77,214,200,0.1)', border:'1px solid rgba(77,214,200,0.2)', padding:'3px 10px', borderRadius:20, marginBottom:16 }}>{f.label}</div>
              <h2 style={{ fontSize:36, fontWeight:900, letterSpacing:'-1.5px', margin:'0 0 12px' }}>{f.icon} {f.name}</h2>
              <p style={{ fontSize:15, color:'rgba(255,255,255,0.6)', lineHeight:1.75, margin:'0 0 0' }}>{f.desc}</p>
            </div>
            <div style={{ order: i % 2 === 0 ? 1 : 0 }}>
              <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:14, padding:'28px' }}>
                <div style={{ fontSize:12, color:'rgba(255,255,255,0.35)', fontWeight:700, textTransform:'uppercase', letterSpacing:'1px', marginBottom:18 }}>What you get</div>
                {f.bullets.map(b => (
                  <div key={b} style={{ display:'flex', gap:10, alignItems:'flex-start', marginBottom:14, fontSize:14, color:'rgba(255,255,255,0.75)', lineHeight:1.5 }}>
                    <span style={{ color:TEAL, flexShrink:0, marginTop:1 }}>✓</span>{b}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Invite-only section */}
      <div style={{ background:'rgba(255,255,255,0.02)', borderTop:'1px solid rgba(255,255,255,0.07)', borderBottom:'1px solid rgba(255,255,255,0.07)', padding:'80px 40px' }}>
        <div style={{ maxWidth:720, margin:'0 auto', textAlign:'center' }}>
          <div style={{ fontSize:36, marginBottom:16 }}>⚓</div>
          <h2 style={{ fontSize:32, fontWeight:900, letterSpacing:'-1.5px', margin:'0 0 16px' }}>Invite only — your marina sends the invite.</h2>
          <p style={{ fontSize:15, color:'rgba(255,255,255,0.6)', lineHeight:1.75, marginBottom:24, maxWidth:540, margin:'0 auto 24px' }}>
            Tenants get a personal invite link from their marina manager when their marina goes live on AyeAyeSkipper. No app store download required — the Tenant Portal works in any mobile browser on iOS or Android.
          </p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:16, maxWidth:680, margin:'0 auto' }}>
            {[
              ['📧','Marina sends your invite','One email with your personal link. Click to activate.'],
              ['📱','Works in any browser','No App Store. No Play Store. No downloads.'],
              ['🔐','Secured to your account','Only you can access your slip and billing data.'],
              ['🔄','Always up to date','Any change Skipper makes is live in your portal instantly.'],
            ].map(([icon, title, desc]) => (
              <div key={title as string} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:10, padding:'18px', textAlign:'left' }}>
                <div style={{ fontSize:22, marginBottom:8 }}>{icon}</div>
                <div style={{ fontWeight:700, fontSize:14, marginBottom:4 }}>{title as string}</div>
                <div style={{ fontSize:12, color:'rgba(255,255,255,0.45)', lineHeight:1.6 }}>{desc as string}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA — for marina operators */}
      <div style={{ textAlign:'center', padding:'80px 40px' }}>
        <h2 style={{ fontSize:36, fontWeight:900, letterSpacing:'-1.5px', margin:'0 0 14px' }}>Want to give your tenants the portal?</h2>
        <p style={{ color:'rgba(255,255,255,0.45)', fontSize:15, marginBottom:32, maxWidth:460, margin:'0 auto 32px' }}>
          The Tenant Portal is included in every AyeAyeSkipper plan. No add-on. No extra charge. Book a demo and we'll show you exactly what your tenants will see.
        </p>
        <Link href="/join" style={{ display:'inline-block', padding:'18px 44px', background:TEAL, color:NAVY, borderRadius:8, fontSize:16, fontWeight:800, textDecoration:'none', fontFamily:FONT }}>Book a Demo ⚓</Link>
        <p style={{ marginTop:16, fontSize:12, color:'rgba(255,255,255,0.25)' }}>$299/mo (50 slips &amp; under) · $499/mo (50+ slips) · First month free</p>
      </div>
    </div>
  )
}

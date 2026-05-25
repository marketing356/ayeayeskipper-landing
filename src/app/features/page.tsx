import type { Metadata } from 'next'
import Link from 'next/link'
export const metadata: Metadata = { title: "Features", description: "Every feature of AyeAyeSkipper — Slip Logic™, Hot Slip™, Skipper Gangway™, The Briefing Room, live marina map, fuel, storage, contracts, e-sign." }

const TEAL = '#4dd6c8', NAVY = '#0d2b4b', FONT = "system-ui,-apple-system,'Segoe UI',Roboto,sans-serif"

const features = [
  {
    icon: '⚓', tag: 'SLIP LOGIC™', name: 'Slip Management', flagship: true,
    tagline: 'Every slip. Every tenant. Color-coded and live.',
    desc: 'Slip Logic™ is the engine behind AyeAyeSkipper. Your entire marina is mapped in 2D — every slip, dock row, mooring ball, and pedestal labeled and color-coded by payment status. Green means paid. Red means overdue. Yellow means expiring in 30 days. Teal means transient. You see your entire operation the moment you open The Helm.',
    bullets: ['Color-coded live map — payment status at a glance','Slip assignment — drag tenant to slip or tell Skipper','Lease management — start date, end date, monthly rate','Auto-renewal reminders — Skipper flags 60/30/14 days out','Dock row grouping — Dock A, Dock B, organized and sortable','Mooring balls — full Mooring Logic™ tracking alongside slips'],
  },
  {
    icon: '🔥', tag: 'HOT SLIP™', name: 'Hot Slip™', flagship: true,
    tagline: 'Annual tenants earn money when they\'re away. You profit too.',
    desc: 'Hot Slip™ is a feature that doesn\'t exist anywhere else in marina software. When an annual tenant is going away for a week, they mark their slip as "hot." That slip is automatically made available for transient bookings while they\'re gone. The transient revenue gets split — tenant gets a cut, marina gets a cut — and when the tenant returns, their slip is waiting for them. Everyone wins.',
    bullets: ['Tenant marks away dates from their portal or text Skipper','Slip automatically opens for transient bookings','Revenue split configured per marina (e.g. 60/40 or 70/30)','Tenant notified of earnings when they return','Marina gets additional transient income from already-occupied slips','Skipper handles the logistics — no staff involvement needed'],
  },
  {
    icon: '🗂️', tag: 'ASSET LOGIC™', name: 'Asset Logic™', flagship: true,
    tagline: 'Every location. One source of truth.',
    desc: 'Asset Logic™ is the core of AyeAyeSkipper. Every slip, mooring, yard space, rack, and parking spot is an asset — connected to a tenant, a boat, a lease, and a billing record. One map. One database. Zero orphaned data. When something changes anywhere, everything updates everywhere.',
    bullets: ['Slip, mooring, yard, rack, parking — all managed identically','Every asset connected: tenant → boat → lease → invoice','Map is the source of truth — visual and operational in one','Assign, vacate, transfer — Skipper handles it in plain English'],
  },
  {
    icon: '💬', tag: 'SKIPPER ENGINE™', name: 'Just Talk to Skipper',
    tagline: 'No menus. No training. Just say what you need.',
    desc: 'Skipper isn\'t a search bar or a chatbot. It\'s the Skipper Engine™ — it knows your marina specifically: your slips, your tenants, your rates, your history. Staff at the fuel dock can text Skipper from a tablet. The dockmaster can ask who\'s overdue. The manager can tell Skipper to book a slip for an arriving guest. It all works the same way you\'d tell a competent employee.',
    bullets: ['"Who\'s overdue on Dock B?" — instant answer','Book a transient slip in seconds by voice or text','Skipper drafts and sends renewal notices automatically','Ask for anything — Skipper either knows or will find out','Works over web, SMS (with Twilio), or the tenant app','No training. Your dock hands will be fluent in an hour.'],
  },
  {
    icon: '🗺️', tag: 'MARINA MAP', name: 'Live Marina Map',
    tagline: 'Your exact marina. Not a generic template.',
    desc: 'We build your marina in 2D from your layout. Every slip is positioned exactly where it is in real life, labeled with your slip numbers, dock names, and any special designations. The map is live — as Skipper updates records, the colors on the map change. Add pedestal labels, mooring balls, safety stations, storage zones, and dock gates. The entire marina is visible on one screen.',
    bullets: ['Custom-built from your actual marina layout','Color-coded by status — no searching, just look','Pedestal locations labeled (30A, 50A, 100A)','Mooring ball positions and specs','Safety station markers','Toggle layers on/off — slips, moorings, pedestals, safety'],
  },
  {
    icon: '⛽', tag: 'FUEL DOCK', name: 'Fuel Dock Module',
    tagline: 'Every gallon tracked. Skipper handles the paperwork.',
    desc: 'Fuel dock operations are one of the highest-margin activities at any marina — and one of the most annoying to track manually. Skipper manages tank levels, price per gallon, every sale by boat name and slip, and total revenue. When a tank is running low, Skipper flags it before you run out.',
    bullets: ['Log fuel sales by vessel name, gallons, and date','Set prices for gas, diesel, premium — update anytime','Tank level monitoring — Skipper alerts at your threshold','Daily fuel revenue in The Briefing Room','Historical sales by month and vessel','Integration-ready for fuel management hardware'],
  },
  {
    icon: '🏗️', tag: 'STORAGE', name: 'Storage & Asset Tracking',
    tagline: 'Rack storage, trailers, PWCs — all accounted for.',
    desc: 'Rack storage is often an afterthought in marina software. In Skipper, every rack bay has a tenant, every trailer has a tag, and every PWC has a history. Launch calendar lets you manage the spring haul-in crunch. Storage billing ties directly into the tenant\'s account.',
    bullets: ['Rack storage grid — visual bay map, tenant per bay','Trailer and PWC inventory with owner records','Launch/haul-out scheduling calendar','Storage billing tied to tenant account','Search any vessel — find their rack number instantly','Photo attach for documentation'],
  },
  {
    icon: '🛥️', tag: 'TRANSIENTS', name: 'Transient Bookings',
    tagline: 'Guests book with you. Not with Dockwa.',
    desc: 'Transient bookings through AyeAyeSkipper go directly to your marina — your brand, your record, your relationship. When a boater arrives, Skipper assigns the optimal slip based on boat size and availability, calculates the nightly rate, and generates a receipt at checkout. The whole check-in takes under two minutes.',
    bullets: ['Boaters book directly on your marina page or via Skipper','Optimal slip assignment based on LOA and beam','Nightly rates set per slip or dock row','Automatic receipt at checkout','Hot Slip™ integration — available tenant slips included','No Dockwa. No booking commission. You keep 100%.'],
  },
  {
    icon: '📋', tag: 'CONTRACTS', name: 'Contracts + E-Sign',
    tagline: 'Lease sent, signed, and filed — without a printer.',
    desc: 'Skipper generates the lease from your template, populates marina name, tenant name, slip number, dates, and rate, then sends it to the tenant via email or text. The tenant opens a clean signing page on any device, draws their signature, and submits. The signed lease is captured with timestamp and IP, automatically attached to their tenant record, and Skipper notifies you when it\'s done.',
    bullets: ['Your lease template — upload once, Skipper populates forever','Send via email or SMS','Clean mobile-friendly signing page — no app required','Signature + timestamp + IP captured and stored','Auto-attached to tenant profile','Skipper notifies manager when signed — and flags if not signed in 48h'],
  },
  {
    icon: '📊', tag: 'BRIEFING ROOM', name: 'The Briefing Room',
    tagline: 'Every morning, Skipper briefs you before you walk the docks.',
    desc: 'The Briefing Room is your daily operations dashboard. Open it at 7am and know: who\'s arriving today, who\'s departing, who\'s overdue on payment, what the weather is doing at your marina, fuel levels, and any outstanding maintenance items. Skipper highlights the things that need your attention so you\'re never caught off guard.',
    bullets: ['Today\'s arrivals and departures','Overdue accounts — with amounts and days outstanding','Expiring leases in the next 30/60 days','Local weather forecast and tide table','Fuel level status','Open maintenance items and work orders','Weekly and monthly revenue summaries'],
  },
  {
    icon: '👤', tag: 'TENANT PORTAL', name: 'Tenant Portal',
    tagline: 'Your tenants get a Skipper-powered app. For free.',
    desc: 'Every marina that runs on Skipper gets a tenant portal their slip holders can access from any device. Tenants can view their lease, check their balance, activate Hot Slip™, request maintenance, and talk to Skipper about anything marina-related. It\'s a perk that makes your marina more attractive than the one down the street — and it costs you nothing extra.',
    bullets: ['View lease details and slip assignment','See current balance and payment history','Activate Hot Slip™ when traveling','Request maintenance — logged directly as a work order','Talk to Skipper — marina expert available 24/7','Works on any phone — no app download required'],
  },
  {
    icon: '🔌', tag: 'SKIPPER GANGWAY™', name: 'Skipper Gangway™',
    tagline: 'Whatever you\'re running today — we migrate it. Same day.',
    desc: 'Skipper Gangway™ is our custom adaptation engine. Whether you\'re on Dockmaster, Marina Controller, Harbour Assist, Dockwa, or a 15-tab Excel spreadsheet, Skipper Gangway migrates your data automatically. We map your existing data structure to ours, run validation, and import. You don\'t start from zero — you start from exactly where you are.',
    bullets: ['Dockmaster migration — automated','Marina Controller migration — automated','Dockwa export import — slip assignments, tenant records, booking history','CSV / Excel — Skipper Engine™ column mapping','QuickBooks sync — tenant accounts and billing history','Zero data loss guarantee — we validate before you go live'],
  },
  {
    icon: '📅', tag: 'WAIT LIST', name: 'Wait List Intelligence',
    tagline: 'Skipper matches the right boater to every opening.',
    desc: 'When a slip opens, Skipper doesn\'t just notify whoever\'s first on the list. It matches the opening to the right fit — boat length, beam, power requirements, preferred dock row — and notifies the best match first. If they don\'t respond in 24 hours, Skipper moves to the next. No phone tag. No spreadsheet. No missed opportunities.',
    bullets: ['Collect waiting boater details — boat specs, preferences','Automatic matching when a slip opens','Tiered notification — best match first, then cascade','SMS or email notification (with tenant\'s preference)','Skipper tracks responses and follows up','Full waitlist dashboard — positions, boat specs, wait time'],
  },
]

export default function Features() {
  return (
    <div style={{ minHeight:'100vh', background:'#070f1a', fontFamily:FONT, color:'#fff' }}>
      {/* Hero */}
      <div style={{ maxWidth:900, margin:'0 auto', padding:'80px 40px 60px', textAlign:'center' }}>
        <h1 style={{ fontSize:'clamp(36px,5vw,62px)', fontWeight:900, letterSpacing:'-2.5px', lineHeight:1.05, margin:'0 0 20px' }}>Everything Skipper can do<br/>for your marina.</h1>
        <p style={{ fontSize:17, color:'rgba(255,255,255,0.55)', maxWidth:540, margin:'0 auto', lineHeight:1.65 }}>One flat subscription. Every feature included. No add-on fees, no per-seat charges, no surprises.</p>
      </div>

      {/* Feature grid */}
      <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 40px 80px' }}>
        {features.map((f, i) => (
          <div key={f.name} style={{ display:'grid', gridTemplateColumns: i % 2 === 0 ? '1fr 1fr' : '1fr 1fr', gap:60, padding:'64px 0', borderBottom:'1px solid rgba(255,255,255,0.07)', alignItems:'center' }}>
            <div style={{ order: i % 2 === 0 ? 0 : 1 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
                <span style={{ fontSize:10, color:TEAL, fontWeight:700, letterSpacing:'2px', background:'rgba(77,214,200,0.1)', border:'1px solid rgba(77,214,200,0.2)', padding:'3px 10px', borderRadius:20 }}>{f.tag}</span>
                {f.flagship && <span style={{ fontSize:10, color:'rgba(255,200,50,0.9)', fontWeight:700, letterSpacing:'1.5px', background:'rgba(255,200,50,0.08)', border:'1px solid rgba(255,200,50,0.2)', padding:'3px 10px', borderRadius:20 }}>EXCLUSIVE</span>}
              </div>
              <h2 style={{ fontSize:36, fontWeight:900, letterSpacing:'-1.5px', margin:'0 0 10px' }}>{f.icon} {f.name}</h2>
              <p style={{ fontSize:16, color:TEAL, fontStyle:'italic', margin:'0 0 20px', lineHeight:1.5 }}>{f.tagline}</p>
              <p style={{ fontSize:14, color:'rgba(255,255,255,0.6)', lineHeight:1.8, margin:'0 0 24px' }}>{f.desc}</p>
            </div>
            <div style={{ order: i % 2 === 0 ? 1 : 0 }}>
              <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:14, padding:'28px' }}>
                <div style={{ fontSize:12, color:'rgba(255,255,255,0.35)', fontWeight:700, textTransform:'uppercase', letterSpacing:'1px', marginBottom:18 }}>What it does</div>
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

      {/* CTA */}
      <div style={{ textAlign:'center', padding:'80px 40px', borderTop:'1px solid rgba(255,255,255,0.07)' }}>
        <h2 style={{ fontSize:40, fontWeight:900, letterSpacing:'-1.5px', margin:'0 0 16px' }}>See all of this running<br/>on <span style={{ color:TEAL }}>your</span> marina.</h2>
        <p style={{ color:'rgba(255,255,255,0.45)', fontSize:15, marginBottom:36 }}>We build your marina map before the demo. You see Skipper running your actual operation.</p>
        <Link href="/demo" style={{ display:'inline-block', padding:'18px 48px', background:TEAL, color:NAVY, borderRadius:8, fontSize:16, fontWeight:800, textDecoration:'none', fontFamily:FONT }}>Book a Free Demo</Link>
      </div>
    </div>
  )
}

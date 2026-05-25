'use client'
import { useState } from 'react'
export const dynamic = 'force-dynamic'

const TEAL = '#4dd6c8', NAVY = '#0d2b4b', FONT = "system-ui,-apple-system,'Segoe UI',Roboto,sans-serif"

export default function Demo() {
  const [form, setForm] = useState({ name:'', email:'', phone:'', marina:'', slips:'', software:'', message:'' })
  const [submitted, setSubmitted] = useState(false)

  function handle(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  const input = (label: string, key: keyof typeof form, type = 'text', placeholder = '') => (
    <div style={{ marginBottom:20 }}>
      <label style={{ display:'block', fontSize:13, fontWeight:600, color:'rgba(255,255,255,0.7)', marginBottom:6 }}>{label}</label>
      <input type={type} value={form[key]} onChange={e => setForm(f => ({...f,[key]:e.target.value}))} placeholder={placeholder}
        style={{ width:'100%', padding:'12px 14px', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:8, color:'#fff', fontSize:14, fontFamily:FONT, outline:'none', boxSizing:'border-box' }} />
    </div>
  )

  return (
    <div style={{ minHeight:'100vh', background:'#070f1a', fontFamily:FONT, color:'#fff' }}>
      <div style={{ maxWidth:1060, margin:'0 auto', padding:'80px 40px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:80, alignItems:'start' }}>

        {/* Left — pitch */}
        <div>
          <div style={{ fontSize:12, color:TEAL, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', marginBottom:16 }}>FREE DEMO</div>
          <h1 style={{ fontSize:48, fontWeight:900, letterSpacing:'-2.5px', margin:'0 0 20px', lineHeight:1.05 }}>See Skipper running your actual marina.</h1>
          <p style={{ fontSize:16, color:'rgba(255,255,255,0.6)', lineHeight:1.75, marginBottom:36 }}>
            Before the demo, we build your marina in 3D and load it with your data. When you join the call, you're not watching a generic walkthrough — you're seeing Skipper manage <em>your</em> slips, <em>your</em> tenants, <em>your</em> operation.
          </p>
          <div style={{ display:'flex', flexDirection:'column', gap:16, marginBottom:40 }}>
            {[
              ['🗺️','We build your marina map','Send us your layout. We build it before the demo — on us.'],
              ['📦','We pre-load your data','Share a tenant list or we scrape your public info. Skipper knows your marina on day one.'],
              ['💬','Skipper opens the call','No slideshow. Skipper is live, talking about your marina before you say a word.'],
              ['⏱️','30 minutes','That\'s all it takes. Most people are sold in 15.'],
            ].map(([icon, title, desc]) => (
              <div key={title as string} style={{ display:'flex', gap:16, alignItems:'flex-start' }}>
                <span style={{ fontSize:24, flexShrink:0 }}>{icon}</span>
                <div>
                  <div style={{ fontWeight:700, fontSize:15, marginBottom:2 }}>{title as string}</div>
                  <div style={{ fontSize:13, color:'rgba(255,255,255,0.5)' }}>{desc as string}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:12, padding:'20px 22px' }}>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.3)', fontWeight:700, textTransform:'uppercase', letterSpacing:'1px', marginBottom:10 }}>What happens after you submit</div>
            {['We review your marina (usually same day)','We build your 3D map and prep your data','You get a calendar invite for a 30-min demo','Skipper is live and talking about your marina when we connect'].map((s, i) => (
              <div key={i} style={{ display:'flex', gap:10, marginBottom:8, fontSize:13, color:'rgba(255,255,255,0.6)', alignItems:'center' }}>
                <span style={{ width:20, height:20, borderRadius:'50%', background:`${TEAL}20`, border:`1px solid ${TEAL}40`, display:'inline-flex', alignItems:'center', justifyContent:'center', fontSize:10, color:TEAL, fontWeight:700, flexShrink:0 }}>{i+1}</span>
                {s}
              </div>
            ))}
          </div>
        </div>

        {/* Right — form */}
        <div>
          {submitted ? (
            <div style={{ background:`${TEAL}10`, border:`1px solid ${TEAL}30`, borderRadius:16, padding:'48px 36px', textAlign:'center' }}>
              <div style={{ fontSize:48, marginBottom:16 }}>⚓</div>
              <h2 style={{ fontSize:28, fontWeight:900, letterSpacing:'-1px', margin:'0 0 12px' }}>We're on it.</h2>
              <p style={{ fontSize:15, color:'rgba(255,255,255,0.6)', lineHeight:1.7, margin:0 }}>
                We'll review your marina and reach out within a few hours to schedule. We'll have your map built before we talk.
              </p>
              <p style={{ fontSize:14, color:TEAL, marginTop:20, fontWeight:600 }}>We run on Skipper. ⚓</p>
            </div>
          ) : (
            <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding:'36px' }}>
              <div style={{ fontWeight:800, fontSize:20, marginBottom:6 }}>Book your free demo</div>
              <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', marginBottom:28 }}>No commitment. No pressure. Just Skipper running your marina.</div>
              <form onSubmit={handle}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 16px' }}>
                  <div style={{ marginBottom:20 }}>
                    <label style={{ display:'block', fontSize:13, fontWeight:600, color:'rgba(255,255,255,0.7)', marginBottom:6 }}>Your name *</label>
                    <input required value={form.name} onChange={e => setForm(f => ({...f,name:e.target.value}))} placeholder="Harbormaster Jim"
                      style={{ width:'100%', padding:'12px 14px', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:8, color:'#fff', fontSize:14, fontFamily:FONT, outline:'none', boxSizing:'border-box' }} />
                  </div>
                  <div style={{ marginBottom:20 }}>
                    <label style={{ display:'block', fontSize:13, fontWeight:600, color:'rgba(255,255,255,0.7)', marginBottom:6 }}>Phone</label>
                    <input type="tel" value={form.phone} onChange={e => setForm(f => ({...f,phone:e.target.value}))} placeholder="(555) 000-0000"
                      style={{ width:'100%', padding:'12px 14px', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:8, color:'#fff', fontSize:14, fontFamily:FONT, outline:'none', boxSizing:'border-box' }} />
                  </div>
                </div>
                {input('Work email *', 'email', 'email', 'jim@bayviewmarina.com')}
                {input('Marina name *', 'marina', 'text', 'Bayview Marina')}
                <div style={{ marginBottom:20 }}>
                  <label style={{ display:'block', fontSize:13, fontWeight:600, color:'rgba(255,255,255,0.7)', marginBottom:6 }}>How many slips?</label>
                  <select value={form.slips} onChange={e => setForm(f => ({...f,slips:e.target.value}))}
                    style={{ width:'100%', padding:'12px 14px', background:'rgba(20,30,50,1)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:8, color: form.slips ? '#fff' : 'rgba(255,255,255,0.35)', fontSize:14, fontFamily:FONT, outline:'none' }}>
                    <option value="" disabled>Select range</option>
                    {['Under 25','25–50','50–100','100–200','200–500','500+'].map(o => <option key={o} value={o} style={{ background:'#0d2b4b' }}>{o}</option>)}
                  </select>
                </div>
                <div style={{ marginBottom:20 }}>
                  <label style={{ display:'block', fontSize:13, fontWeight:600, color:'rgba(255,255,255,0.7)', marginBottom:6 }}>What are you using now?</label>
                  <select value={form.software} onChange={e => setForm(f => ({...f,software:e.target.value}))}
                    style={{ width:'100%', padding:'12px 14px', background:'rgba(20,30,50,1)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:8, color: form.software ? '#fff' : 'rgba(255,255,255,0.35)', fontSize:14, fontFamily:FONT, outline:'none' }}>
                    <option value="" disabled>Current software</option>
                    {['Dockwa','Dockmaster','Marina Controller','Harbour Assist','Swell','Excel / spreadsheets','Nothing yet','Other'].map(o => <option key={o} value={o} style={{ background:'#0d2b4b' }}>{o}</option>)}
                  </select>
                </div>
                <div style={{ marginBottom:24 }}>
                  <label style={{ display:'block', fontSize:13, fontWeight:600, color:'rgba(255,255,255,0.7)', marginBottom:6 }}>Anything you want us to know?</label>
                  <textarea value={form.message} onChange={e => setForm(f => ({...f,message:e.target.value}))} rows={3} placeholder="Biggest pain points, questions, specific features you're curious about..."
                    style={{ width:'100%', padding:'12px 14px', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:8, color:'#fff', fontSize:14, fontFamily:FONT, outline:'none', resize:'vertical', boxSizing:'border-box' }} />
                </div>
                <button type="submit" style={{ width:'100%', padding:'15px', background:TEAL, color:NAVY, border:'none', borderRadius:8, fontSize:15, fontWeight:800, cursor:'pointer', fontFamily:FONT }}>
                  Book My Free Demo →
                </button>
                <p style={{ textAlign:'center', fontSize:11, color:'rgba(255,255,255,0.25)', marginTop:12, margin:'12px 0 0' }}>No commitment. We build your marina map before the call — at no cost.</p>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

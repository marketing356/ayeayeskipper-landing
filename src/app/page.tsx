import DemoForm from '@/components/DemoForm'

const NAVY = '#0d2b4b', TEAL = '#4dd6c8', DARK = '#070f1a'
const FONT = "system-ui,-apple-system,'Segoe UI',Roboto,sans-serif"

const css = [
  'html { scroll-behavior: smooth; }',
  'section[id] { scroll-margin-top: 80px; }',
  '.sk-wrap { max-width: 1100px; margin: 0 auto; padding: 0 28px; }',
  '.sk-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: center; }',
  '.sk-grid3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }',
  '.sk-grid4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }',
  '.sk-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.09); border-radius: 14px; padding: 24px; }',
  '.sk-btn { display: inline-block; padding: 14px 28px; border-radius: 8px; font-weight: 800; font-size: 15px; text-decoration: none; }',
  '.sk-btn-main { background: ' + TEAL + '; color: ' + NAVY + '; }',
  '.sk-btn-ghost { border: 1px solid ' + TEAL + '; color: ' + TEAL + '; }',
  '.sk-h2 { font-size: 38px; font-weight: 900; letter-spacing: -1px; line-height: 1.15; margin: 0 0 16px; }',
  '.sk-eyebrow { font-size: 12px; color: ' + TEAL + '; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 14px; }',
  '.sk-sub { font-size: 18px; color: rgba(255,255,255,0.65); line-height: 1.65; margin: 0; }',
  '.sk-section { padding: 90px 0; }',
  '.sk-alt { background: rgba(255,255,255,0.025); border-top: 1px solid rgba(255,255,255,0.06); border-bottom: 1px solid rgba(255,255,255,0.06); }',
  '@media (max-width: 860px) {',
  '  .sk-grid2, .sk-grid3, .sk-grid4 { grid-template-columns: 1fr; }',
  '  .sk-h2 { font-size: 30px; }',
  '  .sk-section { padding: 60px 0; }',
  '  .sk-hero-h1 { font-size: 44px !important; }',
  '}',
].join('\n')

const FEATURES: [string, string][] = [
  ['Slips', 'Every slip on your own map, with the boat, the owner, the contract and the balance behind it.'],
  ['Moorings', 'Moorings and anchorages tracked the same way as slips. If you have none, you never see them.'],
  ['Yard and storage', 'Rows, racks and spots for boats and trailers, with hauls and moves logged.'],
  ['Contracts and e-sign', 'Build your own agreements, send them by email or text, and get them signed.'],
  ['Billing and payments', 'Recurring invoices, card on file, deposits and receipts, without chasing anyone.'],
  ['Messaging and channels', 'Office, dock, fuel, service and more. Each has its own inbox and its own staff.'],
  ['Work orders', 'Service requests, maintenance and jobs from request to done, on the same record as the boat.'],
  ['Wait list', 'Requests come in, and the system shows which free space fits which boat.'],
]

const BUILD_STEPS: [string, string, string][] = [
  ['01', 'We find your marina', '/collage/final-1-satellite.jpg'],
  ['02', 'We build it to scale', '/collage/final-2-3dmodel.jpg'],
  ['03', 'Your live Chart Room', '/collage/final-3-chartroom.jpg'],
]

const FAQ: [string, string][] = [
  ['What is Skipper?', 'Skipper is management software for marinas and yacht clubs. It holds your spaces, boats, contracts, billing and messages in one system, and it does the day-to-day work for you.'],
  ['Does it replace the software I use now?', 'Yes. We build your marina or club on Skipper, bring your data across, and keep working with the tools you already use, such as your accounting package and card processor.'],
  ['Is there a setup fee?', 'No. Setup, your map, moving your data and the integrations you need are all inside your monthly subscription.'],
  ['What if I need something Skipper does not do yet?', 'Tell us. We build custom features and integrations for the marinas and clubs we work with, and they are included.'],
  ['Do boaters and members pay Skipper anything?', 'No. Boaters get an app with no extra work for you. Card processors such as Stripe and Clover still charge their normal card fees.'],
  ['Does it work for a yacht club with only moorings?', 'Yes. Skipper shows only the kinds of space you actually have. A club with moorings and no slips sees moorings and no slips.'],
]

export default function Home() {
  return (
    <main style={{ fontFamily: FONT, background: DARK, color: '#fff' }}>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* HERO */}
      <section className="sk-section" style={{ paddingTop: 70, paddingBottom: 70 }}>
        <div className="sk-wrap sk-grid2">
          <div>
            <div className="sk-eyebrow">Skipper for marinas and yacht clubs</div>
            <h1 className="sk-hero-h1" style={{ fontSize: 62, fontWeight: 900, letterSpacing: '-2px', lineHeight: 1.05, margin: '0 0 18px' }}>
              We run on <span style={{ color: TEAL }}>Skipper.</span>
            </h1>
            <p style={{ fontSize: 26, fontWeight: 700, margin: '0 0 16px', color: 'rgba(255,255,255,0.92)' }}>Your marina or club, on autopilot.</p>
            <p className="sk-sub" style={{ marginBottom: 32 }}>
              Slips, moorings, yard, contracts and billing, handled day to day. Approve every action, or set it to one tap and go. Built with AI from the ground up.
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <a href="#marinas" className="sk-btn sk-btn-main">I run a marina</a>
              <a href="#clubs" className="sk-btn sk-btn-ghost">I run a yacht club</a>
            </div>
            <p style={{ marginTop: 18, fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>
              Or <a href="#demo" style={{ color: TEAL, textDecoration: 'none', fontWeight: 700 }}>request a demo</a> and we will walk you through it.
            </p>
          </div>
          <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 30px 80px rgba(0,0,0,0.5)' }}>
            <img src="/collage/hero-chartroom.jpg" alt="Skipper Chart Room map of a marina with slips and moorings" style={{ width: '100%', display: 'block' }} />
          </div>
        </div>
      </section>

      {/* WHAT IT IS + PAIN */}
      <section className="sk-section sk-alt">
        <div className="sk-wrap">
          <div style={{ maxWidth: 760, marginBottom: 40 }}>
            <div className="sk-eyebrow">What it is</div>
            <h2 className="sk-h2">Software that does the work, not just keeps the records.</h2>
            <p className="sk-sub">Skipper is marina and club management software that handles the day-to-day for you, so your people can spend their time on the water and with your members.</p>
          </div>
          <div className="sk-grid4">
            {[
              ['Legacy software had its run', 'Built for a different decade, and it shows every time you click.'],
              ['Stop paying for modules', 'One system with everything in it. No add-on for every feature.'],
              ['Your time is worth more than data entry', 'Enter it once. It shows up everywhere it needs to be.'],
              ['Built for the waterfront', 'Boats, docks and members in one system made for the water.'],
            ].map(([t, d]) => (
              <div key={t} className="sk-card">
                <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 8 }}>{t}</div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCT */}
      <section id="product" className="sk-section">
        <div className="sk-wrap">
          <div style={{ maxWidth: 760, marginBottom: 40 }}>
            <div className="sk-eyebrow">Product</div>
            <h2 className="sk-h2">Every boat and trailer, on one map.</h2>
            <p className="sk-sub">Click a space and see what is in it, who it belongs to, what the contract says and what is owed. Hauls, moves and work orders live on the same record.</p>
          </div>
          <div className="sk-grid4">
            {FEATURES.map(([t, d]) => (
              <div key={t} className="sk-card">
                <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 8, color: TEAL }}>{t}</div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>{d}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 80 }}>
            <div className="sk-eyebrow">How we build your marina</div>
            <h2 className="sk-h2" style={{ maxWidth: 760 }}>We turn your marina into an interactive map.</h2>
            <p className="sk-sub" style={{ maxWidth: 760, marginBottom: 32 }}>You send us your boat and owner lists, your layout and your contracts. We draw every space, load your records and hand you a live map of your marina or club.</p>
            <div className="sk-grid3">
              {BUILD_STEPS.map(([n, label, img]) => (
                <div key={n} className="sk-card" style={{ padding: 0, overflow: 'hidden' }}>
                  <img src={img} alt={label} style={{ width: '100%', height: 190, objectFit: 'cover', display: 'block' }} />
                  <div style={{ padding: '18px 22px' }}>
                    <div style={{ fontSize: 12, color: TEAL, fontWeight: 800, letterSpacing: '1.5px' }}>STEP {n}</div>
                    <div style={{ fontWeight: 800, fontSize: 17, marginTop: 4 }}>{label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MODULES */}
      <section id="modules" className="sk-section sk-alt">
        <div className="sk-wrap">
          <div style={{ maxWidth: 800, marginBottom: 40 }}>
            <div className="sk-eyebrow">Every module included</div>
            <h2 className="sk-h2">Fuel dock, work orders, parts and ship store. All in the price.</h2>
            <p className="sk-sub">Other systems charge for each module. Skipper does not. Every module is switched on for you from day one, with nothing to unlock and no add-on bill.</p>
          </div>
          <div className="sk-grid4">
            {[
              ['Fuel dock', 'Tanks and levels, sales, deliveries and a low-fuel alert, all tied to the boat and the account.'],
              ['Work orders', 'From request to done on the same record as the boat. Contracts can create the work for you.'],
              ['Parts and inventory', 'Your parts and services catalog with quantity on hand and a low-stock warning.'],
              ['Ship store', 'Ring up sales at the counter and charge them to the boat owner, with no second system.'],
            ].map(([t, d]) => (
              <div key={t} className="sk-card">
                <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 8, color: TEAL }}>{t}</div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AUTOPILOT */}
      <section id="autopilot" className="sk-section">
        <div className="sk-wrap">
          <div style={{ maxWidth: 760, marginBottom: 40 }}>
            <div className="sk-eyebrow">Autopilot</div>
            <h2 className="sk-h2">You choose how much it does.</h2>
            <p className="sk-sub">Billing, notices and messages run on a schedule. You decide whether you want to see each one first.</p>
          </div>
          <div className="sk-grid2" style={{ alignItems: 'stretch' }}>
            <div className="sk-card">
              <div style={{ fontSize: 12, color: TEAL, fontWeight: 800, letterSpacing: '1.5px', marginBottom: 10 }}>MODE 1</div>
              <div style={{ fontWeight: 900, fontSize: 24, marginBottom: 10 }}>Approve everything</div>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, margin: 0 }}>Skipper prepares the invoice, the reminder or the reply and waits. You look, tap approve, and it goes out. Nothing leaves without you.</p>
            </div>
            <div className="sk-card">
              <div style={{ fontSize: 12, color: TEAL, fontWeight: 800, letterSpacing: '1.5px', marginBottom: 10 }}>MODE 2</div>
              <div style={{ fontWeight: 900, fontSize: 24, marginBottom: 10 }}>One tap and go</div>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, margin: 0 }}>Once you trust it, switch it on for the jobs you choose. It runs them for you and shows you what it did.</p>
            </div>
          </div>
        </div>
      </section>

      {/* MARINAS */}
      <section id="marinas" className="sk-section">
        <div className="sk-wrap sk-grid2">
          <div>
            <div className="sk-eyebrow">For marinas</div>
            <h2 className="sk-h2">Run the whole marina from one screen.</h2>
            <p className="sk-sub" style={{ marginBottom: 22 }}>Slips, moorings, yard and storage, seasonal and transient, billing and work orders. Your staff, your boaters and your yard all see the same thing.</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 12, fontSize: 16, color: 'rgba(255,255,255,0.8)' }}>
              <li>Seasonal and transient bookings in one calendar</li>
              <li>Contracts built your way and signed online</li>
              <li>Recurring billing and card on file</li>
              <li>Haul, launch and yard moves tracked on the map</li>
              <li>An app for your boaters, with no extra work for you</li>
            </ul>
          </div>
          <div className="sk-card" style={{ padding: 0, overflow: 'hidden' }}>
            <img src="/collage/final-3-chartroom.jpg" alt="Marina map with slips and moorings" style={{ width: '100%', display: 'block' }} />
          </div>
        </div>
      </section>

      {/* CLUBS */}
      <section id="clubs" className="sk-section sk-alt">
        <div className="sk-wrap">
          <div style={{ maxWidth: 800, marginBottom: 40 }}>
            <div className="sk-eyebrow">Yacht clubs</div>
            <h2 className="sk-h2">Built for the waterfront. Not a country club system with a dock bolted on.</h2>
            <p className="sk-sub">Boats, docks and members in one system made for the water. Same map and same billing as a marina, with the club tools your board expects.</p>
          </div>
          <div className="sk-grid4">
            {[
              ['Members', 'A record for every member and membership, with the boats and spaces that go with it.'],
              ['House accounts', 'Club charges tracked per member and billed with the rest.'],
              ['Board and officers', 'Your commodore, officers and committees kept in the system.'],
              ['Moorings and rentals', 'Moorings, slips and rentals on the same map. Only what your club has.'],
            ].map(([t, d]) => (
              <div key={t} className="sk-card">
                <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 8, color: TEAL }}>{t}</div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>{d}</div>
              </div>
            ))}
          </div>
          <p style={{ marginTop: 28, fontSize: 16, color: 'rgba(255,255,255,0.7)', maxWidth: 760, lineHeight: 1.7 }}>
            Your membership agreements go through the same contract builder and e-signature as everything else. Need something your club does that we do not have yet? Tell us. We build it with you, and it is included.
          </p>
        </div>
      </section>

      {/* FLEET + CLUSTERS */}
      <section id="fleet" className="sk-section">
        <div className="sk-wrap">
          <div style={{ maxWidth: 800, marginBottom: 40 }}>
            <div className="sk-eyebrow">Fleet</div>
            <h2 className="sk-h2">Know where your money is, across every marina you own.</h2>
            <p className="sk-sub">One screen for the whole portfolio, with live numbers straight from each marina. Built for owners, operators and funds that hold more than one.</p>
          </div>
          <div className="sk-grid4" style={{ marginBottom: 36 }}>
            {[
              ['Cash in', 'Last hour, today, this week, this month and year to date, per marina and in total.'],
              ['Percent full', 'Slips and moorings occupied and vacant, marina by marina.'],
              ['Vacancies', 'See the empty spaces that are earning nothing, right now.'],
              ['Transient and slip revenue', 'Visitor income and seasonal income, side by side.'],
            ].map(([t, d]) => (
              <div key={t} className="sk-card">
                <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 8, color: TEAL }}>{t}</div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>{d}</div>
              </div>
            ))}
          </div>
          <div className="sk-grid2">
            <div>
              <div className="sk-eyebrow">Clusters</div>
              <h2 className="sk-h2" style={{ fontSize: 30 }}>One boat, two marinas, one record.</h2>
              <p className="sk-sub" style={{ marginBottom: 18 }}>Skipper does not buy or take over marinas. Marinas and clubs in the same area join a cluster on one system. A boat that winters at one and summers at another is a single record, with its trailer and its contract. No re-entry, no phone calls.</p>
            </div>
            <div style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
              <img src="/cluster-diagram.svg" alt="Several marinas and clubs connected as one cluster on Skipper" style={{ width: '100%', display: 'block' }} />
            </div>
          </div>
        </div>
      </section>

      {/* INTEGRATIONS */}
      <section className="sk-section">
        <div className="sk-wrap">
          <div style={{ maxWidth: 760, marginBottom: 36 }}>
            <div className="sk-eyebrow">Integrations</div>
            <h2 className="sk-h2">Works with the tools you already use.</h2>
            <p className="sk-sub">Tell us what you run on. We get the connection built and it is included in your monthly price.</p>
          </div>
          <div className="sk-grid2" style={{ alignItems: 'stretch' }}>
            <div className="sk-card">
              <div style={{ fontWeight: 800, marginBottom: 12 }}>Live today</div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {['Stripe', 'Clover', 'Text messaging'].map(n => (
                  <span key={n} style={{ padding: '8px 16px', borderRadius: 999, background: 'rgba(77,214,200,0.12)', border: '1px solid rgba(77,214,200,0.4)', color: TEAL, fontWeight: 700, fontSize: 14 }}>{n}</span>
                ))}
              </div>
            </div>
            <div className="sk-card">
              <div style={{ fontWeight: 800, marginBottom: 12 }}>Built when you ask</div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {['QuickBooks', 'Xero', 'Square', 'Mailchimp', 'Google Calendar', 'Zapier', 'Your POS'].map(n => (
                  <span key={n} style={{ padding: '8px 16px', borderRadius: 999, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.8)', fontWeight: 600, fontSize: 14 }}>{n}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="sk-section">
        <div className="sk-wrap" style={{ textAlign: 'center' }}>
          <div className="sk-eyebrow">Pricing</div>
          <h2 className="sk-h2" style={{ maxWidth: 780, margin: '0 auto 16px' }}>One monthly price. Everything in it.</h2>
          <p className="sk-sub" style={{ maxWidth: 700, margin: '0 auto 36px' }}>No setup fee. No onboarding fee. No add-on modules. Your map, your data move and your integrations are included. No Skipper fee on transient bookings. Card processors still charge their normal card fees.</p>
          <div className="sk-grid2" style={{ maxWidth: 820, margin: '0 auto 32px', textAlign: 'left', alignItems: 'stretch' }}>
            <div className="sk-card">
              <div style={{ fontWeight: 900, fontSize: 22, marginBottom: 8 }}>Marinas</div>
              <p style={{ margin: 0, fontSize: 15, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7 }}>Priced for the size of your marina. Ask for a quote and we will give you one number, in writing.</p>
            </div>
            <div className="sk-card">
              <div style={{ fontWeight: 900, fontSize: 22, marginBottom: 8 }}>Yacht clubs</div>
              <p style={{ margin: 0, fontSize: 15, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7 }}>Priced for the size of your membership. Ask for a quote and we will give you one number, in writing.</p>
            </div>
          </div>
          <a href="#demo" className="sk-btn sk-btn-main">Get a quote</a>
        </div>
      </section>

      {/* FAQ */}
      <section className="sk-section sk-alt">
        <div className="sk-wrap" style={{ maxWidth: 820 }}>
          <div className="sk-eyebrow">Questions</div>
          <h2 className="sk-h2" style={{ marginBottom: 28 }}>Straight answers.</h2>
          <div style={{ display: 'grid', gap: 12 }}>
            {FAQ.map(([q, a]) => (
              <details key={q} className="sk-card" style={{ padding: '18px 22px' }}>
                <summary style={{ fontWeight: 800, fontSize: 17, cursor: 'pointer' }}>{q}</summary>
                <p style={{ margin: '12px 0 0', fontSize: 15, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7 }}>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* DEMO */}
      <section id="demo" className="sk-section">
        <div className="sk-wrap sk-grid2" style={{ alignItems: 'start' }}>
          <div>
            <div className="sk-eyebrow">Request a demo</div>
            <h2 className="sk-h2">See your marina or club on Skipper.</h2>
            <p className="sk-sub" style={{ marginBottom: 22 }}>Tell us a little about you. We will get back to you personally, show you the product running, and give you a quote.</p>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>Skipper is short for AyeAyeSkipper: aye aye, yes captain, it is done.</p>
          </div>
          <DemoForm />
        </div>
      </section>
    </main>
  )
}

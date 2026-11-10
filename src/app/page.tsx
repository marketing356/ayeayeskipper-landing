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
  '.sk-grid5 { display: grid; grid-template-columns: repeat(5, 1fr); gap: 14px; }',
  '.sk-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.09); border-radius: 14px; padding: 24px; }',
  '.sk-btn { display: inline-block; padding: 14px 28px; border-radius: 8px; font-weight: 800; font-size: 15px; text-decoration: none; }',
  '.sk-btn-main { background: linear-gradient(135deg, #7ff3e6, #4dd6c8 55%, #5fb4ff); color: #04202e; animation: skglow 3s ease-in-out infinite; }',
  '.sk-btn-ghost { border: 1px solid rgba(77,214,200,0.6); color: #eafffc; background: rgba(255,255,255,0.06); backdrop-filter: blur(6px); }',
  '.sk-h2 { font-size: 38px; font-weight: 900; letter-spacing: -1px; line-height: 1.15; margin: 0 0 16px; }',
  '.sk-eyebrow { font-size: 12px; color: ' + TEAL + '; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 14px; }',
  '.sk-sub { font-size: 18px; color: rgba(255,255,255,0.65); line-height: 1.65; margin: 0; }',
  '.sk-section { padding: 90px 0; }',
  '.sk-alt { background: rgba(255,255,255,0.025); border-top: 1px solid rgba(255,255,255,0.06); border-bottom: 1px solid rgba(255,255,255,0.06); }',
  '.sk-main { position: relative; overflow-x: hidden; background: radial-gradient(1200px 700px at 50% -10%, rgba(77,214,200,0.20), transparent 60%), radial-gradient(900px 600px at 90% 8%, rgba(124,92,255,0.18), transparent 60%), radial-gradient(900px 700px at 5% 30%, rgba(40,120,255,0.12), transparent 60%), #070f1a; }',
  '.sk-main::before { content: ""; position: absolute; inset: 0; pointer-events: none; background-image: linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px); background-size: 64px 64px; -webkit-mask-image: linear-gradient(to bottom, #000 0, transparent 1400px); mask-image: linear-gradient(to bottom, #000 0, transparent 1400px); }',
  '.sk-main > * { position: relative; }',
  '.sk-orb { position: absolute; border-radius: 50%; filter: blur(70px); pointer-events: none; animation: skdrift 14s ease-in-out infinite alternate; }',
  '.sk-ring { position: absolute; left: 50%; top: 120px; width: 1500px; height: 520px; margin-left: -750px; border: 1px solid rgba(77,214,200,0.18); border-radius: 50%; pointer-events: none; transform: rotate(-6deg); }',
  '.sk-ring2 { top: 170px; width: 1250px; height: 420px; margin-left: -625px; border-color: rgba(124,92,255,0.20); transform: rotate(5deg); }',
  '@keyframes skdrift { from { transform: translate(0,0) scale(1); } to { transform: translate(40px,30px) scale(1.12); } }',
  '@keyframes skfloat { from { transform: translateY(0); } to { transform: translateY(-10px); } }',
  '@keyframes skrise { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: none; } }',
  '@keyframes skglow { 0%,100% { box-shadow: 0 0 24px rgba(77,214,200,0.45), 0 8px 30px rgba(77,214,200,0.25); } 50% { box-shadow: 0 0 40px rgba(77,214,200,0.75), 0 8px 40px rgba(77,214,200,0.4); } }',
  '.sk-rise { animation: skrise 0.9s cubic-bezier(.2,.7,.2,1) both; }',
  '.sk-rise2 { animation-delay: 0.12s; } .sk-rise3 { animation-delay: 0.24s; } .sk-rise4 { animation-delay: 0.36s; }',
  '.sk-pill { display: inline-block; padding: 7px 16px; border-radius: 999px; background: rgba(77,214,200,0.10); border: 1px solid rgba(77,214,200,0.35); color: ' + TEAL + '; font-size: 12px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 22px; box-shadow: 0 0 22px rgba(77,214,200,0.15); }',
  '.sk-grad { background: linear-gradient(100deg, #7ff3e6 0%, #4dd6c8 35%, #6aa8ff 70%, #a78bfa 100%); -webkit-background-clip: text; background-clip: text; color: transparent; -webkit-text-fill-color: transparent; filter: drop-shadow(0 0 28px rgba(77,214,200,0.35)); }',
  '.sk-chip { display: inline-flex; align-items: center; gap: 8px; padding: 8px 14px; border-radius: 999px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.8); backdrop-filter: blur(6px); }',
  '.sk-chip i { width: 8px; height: 8px; border-radius: 50%; background: ' + TEAL + '; box-shadow: 0 0 10px ' + TEAL + '; display: inline-block; }',
  '.sk-hero-frame { position: relative; margin-top: 56px; }',
  '.sk-hero-frame::before { content: ""; position: absolute; inset: -2px; border-radius: 18px; background: linear-gradient(120deg, rgba(77,214,200,0.9), rgba(106,168,255,0.5), rgba(167,139,250,0.9)); filter: blur(22px); opacity: 0.45; z-index: 0; }',
  '.sk-hero-frame > div { position: relative; z-index: 1; animation: skfloat 6s ease-in-out infinite alternate; }',
  '.sk-card { background: linear-gradient(160deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02)); backdrop-filter: blur(8px); transition: transform .25s ease, border-color .25s ease, box-shadow .25s ease; }',
  '.sk-card:hover { transform: translateY(-4px); border-color: rgba(77,214,200,0.5); box-shadow: 0 14px 40px rgba(0,0,0,0.4), 0 0 28px rgba(77,214,200,0.18); }',
  '.sk-h2 { background: linear-gradient(180deg, #ffffff 30%, #b9ccdd 100%); -webkit-background-clip: text; background-clip: text; color: transparent; -webkit-text-fill-color: transparent; }',
  '.sk-eyebrow { text-shadow: 0 0 18px rgba(77,214,200,0.5); }',
  '.sk-alt { background: linear-gradient(180deg, rgba(77,214,200,0.045), rgba(124,92,255,0.035)); }',
  '.sk-btn { transition: transform .2s ease, box-shadow .2s ease; padding: 16px 32px; font-size: 16px; border-radius: 10px; }',
  '.sk-btn:hover { transform: translateY(-2px); }',
  '.sk-ba { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin-top: 8px; }',
  '.sk-ba figure { margin: 0; position: relative; border-radius: 14px; overflow: hidden; border: 1px solid rgba(255,255,255,0.16); box-shadow: 0 24px 60px rgba(0,0,0,0.5); background: #0b1626; }',
  '.sk-ba img { width: 100%; aspect-ratio: 16 / 10; object-fit: cover; display: block; }',
  '.sk-ba figcaption { position: absolute; left: 12px; top: 12px; padding: 6px 12px; border-radius: 999px; background: rgba(7,15,26,0.78); border: 1px solid rgba(77,214,200,0.45); color: #eafffc; font-size: 12px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; backdrop-filter: blur(6px); }',
  '.sk-ba figure.before figcaption { border-color: rgba(255,255,255,0.4); color: #fff; }',
  '.sk-hero-grid { display: grid; grid-template-columns: 1.15fr 0.85fr; gap: 48px; align-items: center; margin-bottom: 56px; }',
  '.sk-hero-skipper { position: relative; border-radius: 22px; overflow: hidden; border: 1px solid rgba(77,214,200,0.35); box-shadow: 0 0 80px rgba(77,214,200,0.25), 0 40px 100px rgba(0,0,0,0.6); }',
  '.sk-hero-skipper img { width: 100%; aspect-ratio: 1 / 1; object-fit: cover; display: block; }',
  '.sk-hero-tag { position: absolute; left: 14px; right: 14px; bottom: 14px; padding: 10px 14px; border-radius: 12px; background: rgba(7,15,26,0.78); border: 1px solid rgba(77,214,200,0.45); color: #eafffc; font-size: 13px; font-weight: 800; text-align: center; }',
  '.sk-banner { border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,255,255,0.14); box-shadow: 0 24px 60px rgba(0,0,0,0.5); margin-bottom: 36px; }',
  '.sk-banner img { width: 100%; aspect-ratio: 21 / 9; object-fit: cover; object-position: 50% 30%; display: block; }',
  '@media (max-width: 860px) {',
  '  .sk-grid2, .sk-grid3, .sk-grid4, .sk-grid5 { grid-template-columns: 1fr; }',
  '  .sk-h2 { font-size: 30px; }',
  '  .sk-section { padding: 60px 0; }',
  '  .sk-hero-h1 { font-size: 46px !important; letter-spacing: -1.5px !important; }',
  '  .sk-hero-grid { grid-template-columns: 1fr; gap: 28px; text-align: center; }',
  '  .sk-hero-actions { justify-content: center; }',
  '  .sk-banner img { aspect-ratio: 4 / 3; }',
  '  .sk-ring { display: none; }',
  '  .sk-ba { grid-template-columns: 1fr; gap: 14px; }',
  '  .sk-btn { width: 100%; text-align: center; }',
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

const COMPARE: string[][] = [
  ['Every module in one price', 'Yes. One monthly price, every module on', 'No. 8 separately priced products', 'No. Marina side priced per space; service, fuel, store and integrations are extra modules', 'Not published'],
  ['Marina base price', '$99 to $799 a month by size', 'Per module, from $169 a month', '$42 per slip or mooring per year, about $3.50 a month (May 2026 proposal)', 'Not listed'],
  ['Fuel dock', 'Included', 'Extra module: $199 a month', 'Extra module, about $499 a month (told on a May 2026 sales call)', 'Listed, price not published'],
  ['Ship store and point of sale', 'Included', 'Extra module: $249 a month', 'Extra module', 'Point of sale listed'],
  ['Work orders, parts and inventory', 'Included', 'Not listed on the pricing page', 'Extra service module, charged by work-order load: about $1,000 a month for a 15-person yard, per the rep', 'Listed'],
  ['Integrations and custom builds', 'Included in the price', 'Extra module: $84 a month', 'Extra module', 'Partner list, price not published'],
  ['Setup or implementation fee', 'None', 'Not stated', '$1,000 one time (list $2,950)', 'Not stated'],
  ['Your own card processor', 'Stripe or Clover, your account', 'Not stated', 'Stripe only; own processor "typically no"', 'Not stated'],
  ['AI that does the day-to-day work', 'Yes, the Autopilot', 'Not listed', 'Not listed', 'AI-assisted service scheduling'],
  ['Yacht club tools: members, house accounts, board', 'Yes', 'Not listed', 'Boat club rentals CRM', 'Not listed'],
  ['Live money and occupancy across all your marinas', 'Yes, the Fleet view', 'Portfolio pricing, contact us', 'Consolidated reporting listed', 'Not listed'],
  ['One boat record, with its work orders, invoices and seasons', 'Yes, and shared across sister marinas', 'Not listed', 'Vessels linked to customers; service history not shown', 'Not listed'],
]

const MARINA_TIERS: [string, string][] = [
  ['Up to 20 slips and moorings', '$99'],
  ['21 to 50', '$199'],
  ['51 to 100', '$299'],
  ['101 to 250', '$499'],
  ['Over 250, or several marinas', '$799'],
]

const CLUB_TIERS: [string, string][] = [
  ['Up to 100 members', '$99'],
  ['101 to 250 members', '$199'],
  ['251 to 500 members', '$299'],
  ['501 to 1,000 members', '$499'],
  ['Over 1,000 members', '$799'],
]

const FAQ: [string, string][] = [
  ['What is Skipper?', 'Skipper is management software for marinas and yacht clubs. It holds your spaces, boats, contracts, billing and messages in one system, and it does the day-to-day work for you.'],
  ['Does it replace the software I use now?', 'Yes. We build your marina or club on Skipper, bring your data across, and keep working with the tools you already use, such as your accounting package and card processor.'],
  ['Is there a setup fee?', 'No. Setup, your map, moving your data and the integrations you need are all inside your monthly subscription.'],
  ['What if I need something Skipper does not do yet?', 'Tell us. We build custom features and integrations for the marinas and clubs we work with, and they are included.'],
  ['Do boaters and members pay Skipper anything?', 'No. Boaters get an app with no extra work for you. Card processors such as Stripe and Clover still charge their normal card fees.'],
  ['Does it work for a yacht club with only moorings?', 'Yes. Skipper shows only the kinds of space you actually have. A club with moorings and no slips sees moorings and no slips.'],
]


type Shot = { src: string; alt: string; phone?: boolean }
type Show = { id: string; eyebrow: string; title: string; sub: string; points: [string, string][]; shots: Shot[]; note?: string }

const SHOWS: Show[] = [
  {
    id: 'maps', eyebrow: 'Maps', title: 'A map that is right, and a boater can read it.',
    sub: 'Your marina is drawn to scale from satellite, with every slip and mooring labelled. A boater with a reservation opens the app and their space lights up on the map, so nobody circles the mooring field fifty times in the dark.',
    points: [
      ['Customers find their own space', 'Their slip or mooring is marked on their phone, with a button that zooms straight to it.'],
      ['Open slips on show', 'Available slips are lit up on the map for anyone choosing where to stay, and can be published for prospective slip holders.'],
      ['Mooring fields, labelled', 'Marinas with heavy transient traffic get every mooring mapped and named.'],
      ['Only what you have', 'A marina with slips only sees slips. A club with moorings only sees moorings.'],
    ],
    shots: [{ src: '/collage/app-map.jpg', alt: 'Skipper boater app showing available slips lit up on the marina map', phone: true }],
    note: 'Sample marina, demo data.',
  },
  {
    id: 'boatrecord', eyebrow: 'The boat record', title: 'Every boat gets one permanent record. Every job lands on it.',
    sub: 'Add a boat once, with its real dimensions, and Skipper does the rest. The size decides where the boat can go. Every work order, invoice, haul-out and season is filed against the hull, so anyone on your team can open a boat and see everything that has ever been done to it. One marina or a whole group, it is the same record.',
    points: [
      ['Dimensions that make the decision', 'Length, beam, draft, air draft and weight sit on the boat. Skipper checks them against the limits on each slip and mooring, so a boat that does not fit is never offered the space. Transient bookings and the wait list use the same check.'],
      ['One boat, one history', 'Work orders, labor, parts, invoices and payments are filed under the boat, not only under the customer. Open the boat and see all of it, newest first.'],
      ['The service log writes itself', 'Finish a work order and it goes into the boat service log with the date and who did the work. The invoice is drafted from the same work order. Nothing is typed twice.'],
      ['Haul-outs and launches included', 'When the yard completes a haul-out or a launch, it appears in the boat history on its own.'],
      ['Every season on file', 'Each past slip, mooring and storage season stays on the boat, with the space, the dates and the contract type. Winter storage never erases last summer.'],
      ['Engines and documents on the same record', 'Engines, insurance and registration live with the boat, and owners can upload their own documents from the app.'],
      ['The owner keeps a log too', 'In the app, owners keep a ship log of trips with engine hours, fuel, distance and weather, and add their own service entries. It sits next to what your yard did.'],
      ['Built for a group', 'Boats that live at one location and sit at another keep a single record, and Skipper tracks both the home marina and where the boat is. Run a portfolio view across every location from one login.'],
    ],
    shots: [
      { src: '/collage/boat-orders.jpg', alt: 'Skipper vessel record, Orders tab: every work order done on this boat with dates and cost' },
      { src: '/collage/boat-service.jpg', alt: 'Skipper vessel record, Service History tab: work orders, launches and haul-outs on one boat' },
      { src: '/collage/boat-seasons.jpg', alt: 'Skipper vessel record, Past Slips tab: every season this boat has had a space' },
    ],
    note: 'Sample marina, demo data.',
  },
  {
    id: 'app', eyebrow: 'The boater app', title: 'Put every customer in the app.',
    sub: 'Skipper comes with an app for your boaters. They look after their own account instead of walking into your office, so there are fewer visits, fewer calls and less typing for your staff.',
    points: [
      ['It knows the boat', 'The app knows the boat size and offers only the slips that fit it, ready to book.'],
      ['Balance and payments', 'Customers see what they owe and pay invoices from their phone.'],
      ['Messages in one place', 'Receipts, check-in notices and replies from your team, in the app.'],
      ['Boat details and documents', 'Insurance and registration uploaded by the owner, not chased by you.'],
      ['Ship log and service history', 'Owners log trips and keep their own service record, tied to the boat.'],
      ['Wait list requests', 'Customers ask for a slip or join the wait list without a phone call.'],
    ],
    shots: [
      { src: '/collage/app-home.jpg', alt: 'Skipper boater app home screen', phone: true },
      { src: '/collage/app-book.jpg', alt: 'Skipper boater app booking only slips that fit the boat', phone: true },
      { src: '/collage/app-messages.jpg', alt: 'Skipper boater app messages with the marina team', phone: true },
    ],
    note: 'Sample marina, demo data.',
  },
  {
    id: 'hotslip', eyebrow: 'Transient and Hot Slip', title: 'Turn empty slips into income.',
    sub: 'Tenants list the dates they will be away. Those nights go on your transient calendar, you earn the revenue, and you decide how much goes back to the slip holder. Moorings work the same way.',
    points: [
      ['Away dates on slips and moorings', 'Active and scheduled stays show on the grid, so you know what is free to sell.'],
      ['You choose the payout', 'Revenue share with the holder, a discount on their lease, or the marina keeps it all. You set the split.'],
      ['Points toward the monthly bill', 'Optionally credit slip holders a share of each stay against their monthly slip fee.'],
      ['See the numbers first', 'The calculator shows 20 nights at $150: $3,000 in all, split $2,400 and $600 in the example.'],
      ['No Skipper fee', 'There is no Skipper fee on transient bookings.'],
    ],
    shots: [
      { src: '/collage/photo-transient.jpg', alt: 'A dock attendant shows arriving boaters their slip on the Skipper map' },
      { src: '/collage/acme-hotslip.jpg', alt: 'Skipper slips grid with Hot Slip spaces marked' },
      { src: '/collage/helm-hotslip.jpg', alt: 'Skipper Hot Slip Payout settings with payout calculator' },
    ],
    note: 'Example only, not a promise: a 200-slip marina whose holders are away a good part of the season can sell those nights and earn like a bigger marina. Sample data.',
  },
  {
    id: 'track', eyebrow: 'Stop losing track', title: 'No more free rent.',
    sub: 'A trailer sits in the yard for three years. The owner finally takes it away and you never knew it was there. Skipper gives every boat, trailer and vehicle a space and a record, so it is always on the books.',
    points: [
      ['Every boat has a space', 'Slip, mooring, yard or rack, with the owner, the contract and the balance behind it.'],
      ['Trailers on the record', 'A trailer is linked to its boat, one trailer to a space, and every move is logged.'],
      ['Parking with contracts', 'Lots and spaces for cars, SUVs and RVs, vehicle contracts and a monthly invoice.'],
      ['No contract, flagged', 'In dry stack, a boat in a slot with no contract is marked so it cannot slip by.'],
    ],
    shots: [
      { src: '/collage/photo-yard.jpg', alt: 'A yard worker checks boats on stands against the Skipper yard map' },
      { src: '/collage/acme-yard.jpg', alt: 'Skipper yard storage with every space, boat and owner on record' },
      { src: '/collage/acme-parking.jpg', alt: 'Skipper parking lots with occupied and available spaces' },
    ],
  },
  {
    id: 'drystack', eyebrow: 'Dry stack', title: 'Dry stack, the whole program.',
    sub: 'Every rack slot on one grid, with who is in it and what state the contract is in. Then the forklift schedule on top.',
    points: [
      ['Rack grid', 'Rows and levels, with search by slot, tenant or boat and filters for available, occupied, reserved, overdue and abandoned.'],
      ['Paid, day-use, no contract, hold', 'A colour for each state, so a problem slot stands out at a glance.'],
      ['Rack contracts', 'Day-use, seasonal, annual and short-term, each with its monthly rate and dates.'],
      ['Rack Launch', 'A forklift schedule for launches and returns, today and this week, with who is out on a trip.'],
    ],
    shots: [
      { src: '/collage/acme-rack.jpg', alt: 'Skipper dry stack rack grid by row and level' },
      { src: '/collage/acme-racklaunch.jpg', alt: 'Skipper rack launch queue for the forklift' },
    ],
  },
  {
    id: 'workorders', eyebrow: 'Work orders and parts', title: 'Work orders that build the invoice.',
    sub: 'Your parts and services catalog feeds the work order. When the job is done, the invoice is already built and waiting for you to review and send.',
    points: [
      ['Parts and services catalog', 'Part and manufacturer numbers, quantity on hand, a low-stock alert, cost and sell price, supplier and taxable or not.'],
      ['Line items from the catalog', 'Find the boat, the owner fills in, pick the items, add a discount or apply a deposit.'],
      ['Done means invoiced', 'Completing a work order drafts the invoice with tax and held deposits applied. You review it and send it.'],
      ['Contracts can start the work', 'A signed contract can create the work order for you.'],
    ],
    shots: [
      { src: '/collage/acme-workorders.jpg', alt: 'Skipper work orders list' },
      { src: '/collage/acme-parts.jpg', alt: 'Skipper parts and services catalog with low stock alert' },
    ],
  },
  {
    id: 'fuel', eyebrow: 'Fuel dock', title: 'A fuel dock with a point of sale, in the price.',
    sub: 'Tank levels, prices and sales in one screen. Other systems charge extra for the point of sale and extra again for fuel.',
    points: [
      ['Tanks at a glance', 'Capacity, current level, price per gallon and a low-level alert for each tank.'],
      ['Record a sale', 'Diesel or gasoline, to a registered vessel, a tenant or a walk-up, with gallons, slip, staff member and payment method.'],
      ['Today at the dock', 'Sales and transactions for the day, and a recent transactions list.'],
    ],
    shots: [
      { src: '/collage/photo-fuel.jpg', alt: 'A fuel dock attendant waves a boat in to the fuel dock with an iPad in hand' },
      { src: '/collage/acme-fuel.jpg', alt: 'Skipper fuel dock with tank levels and recent sales' },
      { src: '/collage/fuel-tanks.jpg', alt: 'Skipper fuel tank settings: capacity, price per gallon, level bar and low-level alert for each tank' },
    ],
    note: 'Sample data.',
  },
  {
    id: 'safety', eyebrow: 'Electric and safety', title: 'Shore power and safety, on the record.',
    sub: 'Pedestals and safety stations are tracked like everything else, with an inspection log and a compliance report you can export when someone asks.',
    points: [
      ['Pedestals, NEC 555', 'Amperage, the slips each pedestal serves, status from current to overdue, an inspection log and an exportable compliance report.'],
      ['Meter readings', 'Meter start and current, kWh used, your rate and the billing cycle.'],
      ['Safety stations, NFPA 10 and 303', 'Fire extinguishers, AEDs, life rings, first aid and fuel suppression, with condition and an inspection log.'],
      ['Power monitoring on request', 'Want live monitoring? We connect your monitor, and it is included.'],
    ],
    shots: [
      { src: '/collage/acme-pedestals.jpg', alt: 'Skipper pedestals NEC 555 compliance' },
      { src: '/collage/acme-safety.jpg', alt: 'Skipper safety stations NFPA 10 and 303' },
    ],
    note: 'Sample data.',
  },
  {
    id: 'messaging', eyebrow: 'Messaging', title: 'One inbox. Customers, crew and the whole marina.',
    sub: 'Reply to a customer by app message or by text from the same thread. Send a broadcast to everyone in slips, on moorings or in the yard. Keep your dock crew in their own group chats.',
    points: [
      ['App or text, per thread', 'A switch on every conversation: send it as an app message or as a text.'],
      ['Broadcast', 'Reach groups such as slips, moorings, yard and transient by app and text. An emergency mode texts everyone.'],
      ['Channels', 'Office, Dock Ops, Fuel, Store, Service, Security and Launch Service, each with its own staff.'],
      ['Crew group chats', 'Dock hands and mechanics get group windows, so everyone sees who is handling what.'],
    ],
    shots: [
      { src: '/collage/acme-messages.jpg', alt: 'Skipper messages inbox with unread conversations' },
    ],
  },
  {
    id: 'waitlist', eyebrow: 'Wait list', title: 'A wait list that knows what fits.',
    sub: 'Every empty slip and mooring is listed with the person to offer it to. Skipper checks who fits and who has waited longest. You make the call.',
    points: [
      ['Fit comes first', 'Length, beam, draft, air draft and weight are checked against the space before anyone is offered it.'],
      ['Then first come, first served', 'Among boats that fit, the one that joined first is next. Nobody who does not fit loses their place.'],
      ['Unknown sizes flagged', 'A boat with missing sizes is offered after confirmed fits, marked confirm it fits.'],
      ['Open spaces, with a name next to each', 'The Available Spaces tab lists every empty slip and mooring today, with the best fit to offer it to. Tick one box to show only spaces someone fits.'],
    ],
    shots: [
      { src: '/collage/acme-waitlist.jpg', alt: 'Skipper wait list Available Spaces tab showing who fits each open slip' },
    ],
  },
  {
    id: 'billing', eyebrow: 'Billing and contracts', title: 'Billing on autopilot. Contracts that price themselves.',
    sub: 'Build the contract from blocks, send it as a link and they sign on their phone. The second they sign, the invoice and the work order can go out automatically.',
    points: [
      ['Reminders that make sense', 'One statement lists every unpaid invoice, by app message and by text.'],
      ['Late fees, handled', 'Charged automatically after the days you choose, capped at your state limit. Each late fee is its own invoice, untaxed.'],
      ['Card on file', 'Saved cards are charged automatically, with retries. The system runs these rules itself every few hours.'],
      ['Rates that calculate', 'Per foot rates multiply by the boat length on file. Flat rates stay flat. Tax is set per line.'],
      ['Your accountant', 'Invoices and payments export for your accountant.'],
    ],
    shots: [
      { src: '/collage/helm-billing.jpg', alt: 'Skipper billing automation settings' },
      { src: '/collage/helm-contract-services.jpg', alt: 'Skipper contract builder with auto-priced included services' },
    ],
    note: 'Sample data.',
  },
]

const PHOTO_FIT: Record<string, { ratio: string; pos: string }> = {
  '/collage/photo-yard.jpg': { ratio: '3 / 2', pos: '50% 100%' },
  '/collage/photo-transient.jpg': { ratio: '16 / 9', pos: '50% 40%' },
  '/collage/photo-fuel.jpg': { ratio: '3 / 2', pos: '50% 90%' },
}

function ShowSection({ s: s0, alt }: { s: Show; alt: boolean }) {
  const photo = s0.shots[0] && s0.shots[0].src.indexOf('/photo-') >= 0 ? s0.shots[0] : null
  const s: Show = photo ? { ...s0, shots: s0.shots.slice(1) } : s0
  const phones = s.shots.length > 0 && s.shots.every(x => x.phone)
  const head = (
    <div>
      <div className="sk-eyebrow">{s.eyebrow}</div>
      <h2 className="sk-h2">{s.title}</h2>
      <p className="sk-sub" style={{ marginBottom: s.shots.length ? 22 : 0 }}>{s.sub}</p>
    </div>
  )
  return (
    <section id={s.id} className={'sk-section' + (alt ? ' sk-alt' : '')}>
      <div className="sk-wrap">
        {photo && <div className="sk-banner"><img src={photo.src} alt={photo.alt} style={{ aspectRatio: PHOTO_FIT[photo.src]?.ratio ?? '16 / 9', objectPosition: PHOTO_FIT[photo.src]?.pos ?? '50% 40%' }} /></div>}
        {s.shots.length === 0 ? (
          <>
            <div style={{ maxWidth: 800, marginBottom: 36 }}>{head}</div>
            <div className="sk-grid4">
              {s.points.map(([t, d]) => (
                <div key={t} className="sk-card">
                  <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 8, color: TEAL }}>{t}</div>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>{d}</div>
                </div>
              ))}
            </div>
            {s.note && <p style={{ marginTop: 14, fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{s.note}</p>}
          </>
        ) : photo && !phones ? (
          <>
            <div className="sk-grid2" style={{ alignItems: 'start', marginBottom: 28 }}>
              {head}
              <div style={{ display: 'grid', gap: 14, paddingTop: 34 }}>
                {s.points.map(([t, d]) => (
                  <div key={t} style={{ fontSize: 15, lineHeight: 1.6, color: 'rgba(255,255,255,0.7)' }}>
                    <strong style={{ color: '#fff' }}>{t}.</strong> {d}
                  </div>
                ))}
              </div>
            </div>
            <div className="sk-grid2" style={{ alignItems: 'center', gap: 20 }}>
              {s.shots.map(x => (
                <div key={x.src} style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 20px 50px rgba(0,0,0,0.45)' }}>
                  <img src={x.src} alt={x.alt} style={{ width: '100%', display: 'block' }} />
                </div>
              ))}
            </div>
            {s.note && <p style={{ marginTop: 10, textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{s.note}</p>}
          </>
        ) : (
          <div className="sk-grid2" style={{ alignItems: 'center' }}>
            <div>
              {head}
              <div style={{ display: 'grid', gap: 14 }}>
                {s.points.map(([t, d]) => (
                  <div key={t} style={{ fontSize: 15, lineHeight: 1.6, color: 'rgba(255,255,255,0.7)' }}>
                    <strong style={{ color: '#fff' }}>{t}.</strong> {d}
                  </div>
                ))}
              </div>
            </div>
            <div>
              {phones ? (
                <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
                  {s.shots.map(x => (
                    <img key={x.src} src={x.src} alt={x.alt} style={{ width: s.shots.length === 1 ? 270 : '32%', maxWidth: 270, borderRadius: 22, border: '1px solid rgba(255,255,255,0.15)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', display: 'block' }} />
                  ))}
                </div>
              ) : (
                <div style={{ display: 'grid', gap: 16 }}>
                  {s.shots.map(x => (
                    <div key={x.src} style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 20px 50px rgba(0,0,0,0.45)' }}>
                      <img src={x.src} alt={x.alt} style={{ width: '100%', display: 'block' }} />
                    </div>
                  ))}
                </div>
              )}
              {s.note && <p style={{ marginTop: 10, textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{s.note}</p>}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}


export default function Home() {
  return (
    <main className="sk-main" style={{ fontFamily: FONT, color: '#fff' }}>
      <div className="sk-ring" /><div className="sk-ring sk-ring2" />
      <div className="sk-orb" style={{ width: 420, height: 420, left: '-8%', top: 160, background: 'rgba(77,214,200,0.22)' }} />
      <div className="sk-orb" style={{ width: 380, height: 380, right: '-6%', top: 60, background: 'rgba(124,92,255,0.25)', animationDelay: '-6s' }} />
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* HERO */}
      <section className="sk-section" style={{ paddingTop: 70, paddingBottom: 60 }}>
        <div className="sk-wrap">
          <div className="sk-hero-grid">
            <div className="sk-hero-text">
              <div className="sk-pill sk-rise">Marina and yacht club SaaS</div>
              <h1 className="sk-hero-h1 sk-rise sk-rise2" style={{ fontSize: 76, fontWeight: 900, letterSpacing: '-3px', lineHeight: 1.02, margin: '0 0 20px' }}>
                We run on <span className="sk-grad">Skipper.</span>
              </h1>
              <p className="sk-rise sk-rise3" style={{ fontSize: 26, fontWeight: 700, margin: '0 0 16px', color: 'rgba(255,255,255,0.95)' }}>Your marina or yacht club, on autopilot.</p>
              <p className="sk-sub sk-rise sk-rise3" style={{ marginBottom: 28 }}>
                Slips, moorings, yard, contracts and billing, handled day to day. Approve every action, or set it to one tap and go. Every module included, in one published price.
              </p>
              <div className="sk-rise sk-rise4 sk-hero-actions" style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <a href="#marinas" className="sk-btn sk-btn-main">I run a marina</a>
              <a href="#clubs" className="sk-btn sk-btn-ghost">I run a yacht club</a>
              </div>
              <div className="sk-rise sk-rise4 sk-hero-actions" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 24 }}>
                <span className="sk-chip"><i />Every module included</span>
                <span className="sk-chip"><i />One published price</span>
                <span className="sk-chip"><i />Live at working marinas</span>
              </div>
              <p style={{ marginTop: 18, fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>
                Or <a href="#demo" style={{ color: TEAL, textDecoration: 'none', fontWeight: 700 }}>request a demo</a> and we will walk you through it.
              </p>
            </div>
            <div className="sk-hero-skipper sk-rise sk-rise3">
              <img src="/collage/skipper-hero.jpg" alt="Skipper, the AI that runs the marina, standing on a dock with a tablet" />
              <div className="sk-hero-tag">Meet Skipper, the AI that runs your marina</div>
            </div>
          </div>
          <div className="sk-hero-frame"><div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.18)', boxShadow: '0 40px 100px rgba(0,0,0,0.6)' }}>
            <img src="/collage/chartroom-3d-full.jpg" alt="Skipper Chart Room: a 3D map of a marina with every slip, boat and module in the menu" style={{ width: '100%', display: 'block' }} />
          </div></div>
          <p style={{ marginTop: 14, textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Sample marina, demo data.</p>
        </div>
      </section>

      {/* WORDS FROM OPERATORS (Dave Schmitt gave free license to quote, relayed by Mike 2026-11-10) */}
      <section className="sk-section" style={{ paddingTop: 30, paddingBottom: 70 }}>
        <div className="sk-wrap">
          <div style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 40px' }}>
            <div className="sk-eyebrow">From the people running it</div>
            <h2 className="sk-h2">Don't take our word. Take theirs.</h2>
          </div>
          <div className="sk-grid2" style={{ alignItems: 'stretch' }}>
            <div className="sk-card" style={{ padding: 34, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 60, lineHeight: 0.6, color: TEAL, fontWeight: 900, marginBottom: 10 }}>&ldquo;</div>
                <p style={{ fontSize: 22, lineHeight: 1.5, fontWeight: 600, margin: '0 0 22px', color: 'rgba(255,255,255,0.95)' }}>
                  Before Skipper we were in the dark ages. We put it in at our first marina in the Bronx and it was light years ahead of anything anybody else is using.
                </p>
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 16 }}>Dave Schmitt</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>Runs five marinas</div>
              </div>
            </div>
            <div style={{ display: 'grid', gap: 20 }}>
              <div className="sk-card" style={{ padding: 28 }}>
                <div className="sk-grad" style={{ fontSize: 46, fontWeight: 900, letterSpacing: '-1px', lineHeight: 1.1 }}>Almost $1,100 a month</div>
                <p style={{ fontSize: 16, lineHeight: 1.55, color: 'rgba(255,255,255,0.8)', margin: '10px 0 0' }}>
                  saved at his new Brooklyn marina when it switched from DockMaster to Skipper. &ldquo;The thing was so incredibly expensive.&rdquo;
                </p>
              </div>
              <div className="sk-card" style={{ padding: 28 }}>
                <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 8 }}>Stop leaving money on the table.</div>
                <p style={{ fontSize: 15, lineHeight: 1.55, color: 'rgba(255,255,255,0.75)', margin: 0 }}>
                  Unaccounted-for leases, trailer boats, and boats that have sat derelict in the yard. Now they are on the record, and the liens go on.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MORE OPERATOR QUOTES: DRAFTS pending approval from each person. Do NOT ship to production until approved. See /root/proof/testimonial-drafts-2026-11-10.md */}
      <section className="sk-section" style={{ paddingTop: 0, paddingBottom: 70 }}>
        <div className="sk-wrap">
          <div className="sk-grid3">
            {[
              ['We couldn’t work out a maintenance schedule for our pedestals, or how to tie each pedestal to its dock. Skipper organized all of it, and it saved us real money.', 'Chris Bouquet', 'Marina manager'],
              ['The Chart Room is amazing. I can filter and see everything happening with every boat, from a bird’s-eye view of the whole marina.', 'Colleen Polito', 'Operations manager, marina portfolio'],
              ['We needed a special module built. It was up and running, bug free, in less than a day.', 'Chris Bouquet', 'Marina manager'],
              ['Onboarding was fast and efficient, and there were no fees. Lease renewals are handled too.', 'Chris Bouquet', 'Marina manager'],
              ['We were running on QuickBooks Lite. The accounting in Skipper is just as good as QuickBooks.', 'Colleen Polito', 'Operations manager, marina portfolio'],
              ['Transient, slip logic, the yard, work orders, safety, parking. I like everything about it.', 'Colleen Polito', 'Operations manager, marina portfolio'],
            ].map(([q, n, t]) => (
              <div key={q} className="sk-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <p style={{ fontSize: 17, lineHeight: 1.55, fontWeight: 600, margin: '0 0 20px', color: 'rgba(255,255,255,0.92)' }}>&ldquo;{q}&rdquo;</p>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 15 }}>{n}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>{t}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CHART ROOM LIVE FILTERS + AI BRAIN (Mike 2026-11-10). Facts checked in code: realtime = useSkipperRealtime (Supabase Broadcast per marina); assistant = Claude models via Anthropic API (engine routes/chat.py). */}
      <section className="sk-section">
        <div className="sk-wrap">
          <div className="sk-grid2" style={{ marginBottom: 36 }}>
            <div>
              <div className="sk-eyebrow">The Chart Room</div>
              <h2 className="sk-h2">Your whole marina, filtered live.</h2>
              <p className="sk-sub">Tap a filter and the map answers. Overdue, vacant, transient, reserved, under repair, no contract. Every boat, every slip, every yard spot, in one bird&rsquo;s-eye view that stays current while you look at it.</p>
            </div>
            <div>
              <div style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 20px 50px rgba(0,0,0,0.45)' }}>
                <img src="/collage/photo-dockmaster-map.jpg" alt="A dockmaster checks the Chart Room map on his tablet at the end of the dock" style={{ width: '100%', display: 'block', aspectRatio: '4 / 3', objectFit: 'cover', objectPosition: '50% 25%' }} />
              </div>
              <p style={{ marginTop: 10, textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Illustrative photo.</p>
            </div>
          </div>
          <div className="***"><div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.18)', boxShadow: '0 40px 100px rgba(0,0,0,0.6)' }}>
            <img src="/collage/chartroom-filters.jpg" alt="The Chart Room with the Overdue filter on: every overdue boat in the marina lit up in red on the live map" style={{ width: '100%', display: 'block' }} />
          </div></div>
          <p style={{ marginTop: 14, textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>The Overdue filter on a working marina map.</p>
          <div className="sk-grid3" style={{ marginTop: 44 }}>
            {[
              ['Live, not refreshed', 'When a boat checks in, a payment lands or a slip changes status, the map changes with it. No reload, no yesterday’s report.'],
              ['One rule everywhere', 'Overdue on the map is the same overdue as on your Helm screens and your reports. The numbers always agree.'],
              ['Find anything in seconds', 'Search a boat or an owner, or filter by status, and the answer lights up on the map.'],
            ].map(([t, d]) => (
              <div key={t} className="sk-card">
                <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 8 }}>{t}</div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BEFORE / AFTER: Mike 2026-11-10; imagery use confirmed by Mike (Google gave permission), real Bronx Marina */}
      <section className="sk-section">
        <div className="sk-wrap">
          <div style={{ textAlign: 'center', maxWidth: 820, margin: '0 auto 32px' }}>
            <div className="sk-eyebrow">Before and after</div>
            <h2 className="sk-h2">Same marina. Transformed.</h2>
            <p className="sk-sub">Bronx Marina, from the aerial photo we started with to the 3D Chart Room, the live 2D map, and the Docks and Slips list.</p>
          </div>
          <div className="sk-ba">
            <figure className="before"><img src="/collage/ba-sat.jpg" alt="Bronx Marina from the air, before" /><figcaption>Before: the aerial photo</figcaption></figure>
            <figure><img src="/collage/ba-3d.jpg" alt="Bronx Marina built in 3D in the Chart Room" /><figcaption>After: 3D Chart Room</figcaption></figure>
            <figure><img src="/collage/ba-2d.jpg" alt="Bronx Marina live 2D map with the Overdue filter on" /><figcaption>After: live 2D map</figcaption></figure>
            <figure><img src="/collage/ba-slips.jpg" alt="Bronx Marina Docks and Slips list" /><figcaption>After: Docks and Slips</figcaption></figure>
          </div>
        </div>
      </section>

      <section className="sk-section sk-alt">
        <div className="sk-wrap" style={{ textAlign: 'center', maxWidth: 820 }}>
          <div className="sk-eyebrow">The brain</div>
          <h2 className="sk-h2">Skipper thinks with Claude.</h2>
          <p className="sk-sub" style={{ marginBottom: 22 }}>Skipper, the assistant your staff and your boaters talk to, is powered by Claude, the AI from Anthropic. It reads your marina&rsquo;s real records, answers in plain English, and does the work you approve.</p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
            <span className="sk-chip"><i />Works from your own data</span>
            <span className="sk-chip"><i />You approve what it does</span>
            <span className="sk-chip"><i />Built on Anthropic&rsquo;s Claude</span>
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
            <div className="sk-eyebrow">The Helm</div>
            <h2 className="sk-h2" style={{ maxWidth: 760 }}>Your whole day, on one screen.</h2>
            <p className="sk-sub" style={{ maxWidth: 760, marginBottom: 28 }}>Who is arriving and leaving, what is overdue, what came in this month, open work orders, and the weather and tides for the dock. Every number opens the record behind it.</p>
            <div className="sk-card" style={{ padding: 0, overflow: 'hidden' }}>
              <img src="/collage/helm-home.jpg" alt="The Helm home screen: occupancy, arrivals, overdue accounts, money collected, quick actions, and the weather and tide conditions" style={{ width: '100%', display: 'block' }} />
            </div>
            <div style={{ marginTop: 10, fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>Sample marina, demo data.</div>
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

      {/* COMPARE */}
      <section id="compare" className="sk-section">
        <div className="sk-wrap">
          <div style={{ maxWidth: 800, marginBottom: 36 }}>
            <div className="sk-eyebrow">Compare</div>
            <h2 className="sk-h2">Don&apos;t die by a thousand modules.</h2>
            <p className="sk-sub">Most marina software prices every feature on its own line. Skipper puts all of it in one published price. Here is how we stack up, side by side, using what each company says on its own website.</p>
          </div>
          <div style={{ overflowX: 'auto', borderRadius: 14, border: '1px solid rgba(255,255,255,0.1)' }}>
            <table style={{ width: '100%', minWidth: 760, borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <th style={{ textAlign: 'left', padding: '14px 16px', color: 'rgba(255,255,255,0.6)', fontWeight: 700 }}>What you get</th>
                  <th style={{ textAlign: 'left', padding: '14px 16px', color: NAVY, background: TEAL, fontWeight: 900 }}>Skipper</th>
                  {['Dockwa', 'Storable (Molo)', 'DockMaster'].map(n => (
                    <th key={n} style={{ textAlign: 'left', padding: '14px 16px', fontWeight: 800 }}>{n}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE.map(([row, sk, ...others]) => (
                  <tr key={row} style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                    <td style={{ padding: '13px 16px', fontWeight: 700, verticalAlign: 'top' }}>{row}</td>
                    <td style={{ padding: '13px 16px', background: 'rgba(77,214,200,0.1)', color: TEAL, fontWeight: 800, verticalAlign: 'top' }}>{sk}</td>
                    {others.map((o, i) => (
                      <td key={i} style={{ padding: '13px 16px', color: 'rgba(255,255,255,0.6)', verticalAlign: 'top' }}>{o}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ marginTop: 22, fontSize: 17, color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, maxWidth: 820 }}>
            <strong style={{ color: TEAL }}>The low entry price is not the price.</strong> Add up Dockwa&apos;s own price list and its eight priced products come to <strong style={{ color: TEAL }}>$1,299 a month</strong> (their &quot;starting at&quot; prices, billed annually, before tax). Storable quoted a marina with 85 slips <strong style={{ color: TEAL }}>$3,570 a year</strong> for marina management, then put work orders, fuel and the store on separate modules. Skipper has one price, with every module switched on.
          </p>
          <p style={{ marginTop: 14, fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, maxWidth: 860 }}>
            Dockwa and DockMaster: each company&apos;s public website on 9 November 2026 (Dockwa&apos;s main site blocked automated reading, so its column uses its published pricing page only). Storable: a sales proposal and call for an 85-slip, 22-mooring marina in May 2026, and the rep&apos;s spoken estimates, which are not written quotes; prices change. &quot;Not listed&quot; means we did not find it on the pages we read, not that it is impossible. Spot a mistake? Email admin@ayeayeskipper.com and we will correct it.
          </p>
        </div>
      </section>

      {/* DEEP DIVES */}
      {SHOWS.map((x, i) => <ShowSection key={x.id} s={x} alt={i % 2 === 1} />)}

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
            <div className="sk-eyebrow">Fleet and portfolio</div>
            <h2 className="sk-h2">One screen for every marina you own. Real numbers, not a monthly report.</h2>
            <p className="sk-sub">Two marinas or a whole portfolio, the owner opens one page and sees what came in, what is owed, what is empty and where every boat is. It reads the same live data each marina runs on, so there is nothing to export and nothing to reconcile by hand. Built for owners, operators and the funds that back them.</p>
          </div>
          <div style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', marginBottom: 12, maxWidth: 1000 }}>
            <img src="/collage/fleet-portfolio.jpg" alt="Skipper Portfolio screen: money in today, this week and this month, what tenants owe, occupancy, vessels without a lease and boats with no known location, marina by marina" style={{ width: '100%', display: 'block' }} />
          </div>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginBottom: 36 }}>Sample portfolio, demo data.</p>
          <div className="sk-grid4" style={{ marginBottom: 36 }}>
            {[
              ['Money in', 'Today, this week and this month for the whole portfolio, and today for each marina, from real payments.'],
              ['What is owed', 'What tenants owe you and what you owe vendors, in total and marina by marina.'],
              ['Percent full', 'Slips and moorings occupied and vacant, per marina and for the group. See the empty spaces that earn nothing.'],
              ['Every boat accounted for', 'Boats and trailers on site, boats with no paying lease, and boats with no known location. The gap is a number, not a guess.'],
              ['Drill into any marina', 'One click from the portfolio opens that marina in full, with the same books, map and contracts its staff use.'],
              ['Live, and always current', 'The screen refreshes itself every minute. No spreadsheet to build and no month-end wait.'],
              ['Access you control', 'Each owner login sees only the marinas it is assigned to. A partner sees theirs and nothing else.'],
              ['Your own address', 'The portfolio lives on its own web address and sign-in, separate from the marina logins.'],
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
        <div className="sk-wrap">
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div className="sk-eyebrow">Pricing</div>
            <h2 className="sk-h2" style={{ maxWidth: 780, margin: '0 auto 16px' }}>One price. Everything included. Right here.</h2>
            <p className="sk-sub" style={{ maxWidth: 720, margin: '0 auto' }}>Your price depends only on the size of your marina or club. Every module is in every plan. No setup fee, no onboarding fee, no add-ons. No Skipper fee on transient bookings. Card processors still charge their normal card fees.</p>
          </div>

          <div style={{ fontWeight: 900, fontSize: 20, marginBottom: 14 }}>Marinas</div>
          <div className="sk-grid5" style={{ marginBottom: 40 }}>
            {MARINA_TIERS.map(([size, price]) => (
              <div key={size} className="sk-card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', marginBottom: 10 }}>{size}</div>
                <div style={{ fontSize: 38, fontWeight: 900, color: TEAL }}>{price}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>per month</div>
              </div>
            ))}
          </div>

          <div style={{ fontWeight: 900, fontSize: 20, marginBottom: 14 }}>Yacht clubs</div>
          <div className="sk-grid5" style={{ marginBottom: 40 }}>
            {CLUB_TIERS.map(([size, price]) => (
              <div key={size} className="sk-card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', marginBottom: 10 }}>{size}</div>
                <div style={{ fontSize: 38, fontWeight: 900, color: TEAL }}>{price}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>per month</div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <p style={{ margin: '0 0 22px', fontSize: 15, color: 'rgba(255,255,255,0.65)' }}>Every plan includes: slips, moorings, yard, contracts and e-sign, billing, fuel dock, work orders, parts and inventory, ship store, messaging, wait list, the Autopilot, your map, your data move, and the integrations you need.</p>
            <a href="#demo" className="sk-btn sk-btn-main">Request a demo</a>
          </div>
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

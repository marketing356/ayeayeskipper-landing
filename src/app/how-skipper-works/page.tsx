import type { Metadata } from 'next'
import Link from 'next/link'
export const metadata: Metadata = { title: 'How Skipper works', description: 'Everything Skipper does for marinas and yacht clubs in plain words: boat-first records, switching, contracts, billing automation, work orders, the AI assistant, integrations, pricing and a full question and answer list.', alternates: { canonical: '/how-skipper-works' } }
const TEAL = '#4dd6c8', FONT = "system-ui,-apple-system,'Segoe UI',Roboto,sans-serif"
const SECTIONS: [string, string[]][] = [
 [
  "What Skipper is",
  [
   "Skipper (AyeAyeSkipper) is management software for marinas and yacht clubs. It holds spaces, boats, owners, contracts, billing, work orders and messages in one system, with a live map of the property and an AI assistant that does day-to-day work.",
   "Skipper was founded by Express Docks, with more than 20 years in marine services. It is a product of Mariner and Sailor Company.",
   "The AI assistant is powered by Claude from Anthropic. One switch turns the AI off for the whole marina, and the marina keeps running on the same records, contracts, billing and map."
  ]
 ],
 [
  "Built around the boat",
  [
   "A marina manages boats that sit in spaces. In Skipper the boat is the central record and people attach to it. One owner can have many boats, and one boat can have several contacts.",
   "The lease, invoices, work orders and history sit on the boat record, so staff open a boat and see everything about it in one place.",
   "When tenants are imported without a boat, Skipper creates a placeholder boat so the tenant and the space are not lost."
  ]
 ],
 [
  "Switching from other marina software",
  [
   "Send your boat and owner lists, your layout and your contracts. Skipper draws every space, loads your records and hands you a live map. You do not build it yourself, and moving your data is included in the monthly price.",
   "One marina that switched from DockMaster exported its data and had a basic Skipper running within hours.",
   "Active leases come across as holdover leases with the balance and the expiry date. When a lease comes up for renewal, Skipper can send a new lease for e-signature. Once it is signed, the invoices and work orders are created automatically, and payment links can go out with them if auto-send is on.",
   "A marina too busy to rebuild every contract on day one can bring tenants across as invoices attached to each boat, with the lease expiry kept on the boat, and make the new contracts when it has time."
  ]
 ],
 [
  "Contracts and e-signature",
  [
   "The contract builder sets the contract type (slips, parking, yard storage, dry rack and more) and the term (seasonal, annual and others).",
   "Included services are mandatory and billed to every customer. Optional services are chosen by the customer after signing, and each one becomes its own work order item.",
   "Contracts can carry labels, blank fields, dropdowns, dates, merge fields, automatically priced rates and customer notes.",
   "The marina uploads its own fine print and attaches it to the contract types it applies to. Lease Logic then sends the right contract for each situation.",
   "Every automation has an on switch and a choice: send automatically, or have a person review first."
  ]
 ],
 [
  "Billing automation",
  [
   "One set of rules covers every invoice, whether it is for a slip, a mooring, yard storage or parking. Every switch starts OFF. Nothing is sent to a customer until the marina turns it on and saves.",
   "Monthly invoices are created from each customer's monthly contract on a day the marina chooses (1 to 28), or held for review.",
   "Payment reminders can go before the due date, on it, and after it is overdue, repeating on a schedule and stopping after a set number. A customer with several unpaid invoices can get one statement. Text and in-app messages are optional.",
   "Late fees are optional and configurable: days after due, percent per month, a highest percent, a minimum, and whether to charge a fee on a late fee. Each late fee is its own invoice and is never charged on tax. The marina is responsible for its state's late fee limits.",
   "Saved cards can be charged when an invoice comes due, with a set number of retries and days between tries."
  ]
 ],
 [
  "Work orders",
  [
   "A work order starts from the boat: find the boat and the owner fills in. A job with no customer, such as marina infrastructure, is also supported.",
   "Line items come from the marina's catalog, with discounts. Statuses are Estimate, Open, In progress, Pending parts and Completed.",
   "Held deposits apply automatically as a credit when the work order is completed. On completion the invoice is created for review and the work is logged on the boat record."
  ]
 ],
 [
  "Money and accounting",
  [
   "Skipper includes accounts receivable, purchase orders, accounts payable, banking, security deposits and reports.",
   "Skipper runs the marina's operations and customer billing. It is not a replacement for a full accounting package, and invoices and payments export for your accountant."
  ]
 ],
 [
  "The AI assistant",
  [
   "Skipper reads the marina's own records, answers in plain English and does the work the marina approves. The marina can approve each action, or set it to one tap and go.",
   "With the AI switched off, nothing is answered, sent or done by AI."
  ]
 ],
 [
  "Integrations",
  [
   "Live today: Stripe, Clover and text messaging.",
   "Available on request, built for the marina and included in the price: QuickBooks, Xero, Square, Mailchimp, Google Calendar, Zapier and a marina's own point of sale."
  ]
 ],
 [
  "Pricing",
  [
   "One price by size of the marina or yacht club, with every module in every plan: $99 a month up to 20 slips and moorings, $199 for 21 to 50, $299 for 51 to 100, $499 for 101 to 250, and $799 for over 250 or several marinas. Yacht clubs use the same prices by member count.",
   "No setup fee, no onboarding fee and no add-ons. No Skipper fee on transient bookings. Card processors charge their normal card fees."
  ]
 ],
 [
  "Compared with other marina software",
  [
   "Most legacy marina software prices its modules separately. Skipper puts all of it in one published price. See the side-by-side comparison with Dockwa, Storable (Molo) and DockMaster at https://ayeayeskipper.com/#compare and https://ayeayeskipper.com/vs-dockwa."
  ]
 ]
]
const QA: [string, string][] = [
 [
  "What is Skipper?",
  "Management software for marinas and yacht clubs: spaces, boats, owners, contracts, billing, work orders and messages in one system, with a live map and an AI assistant."
 ],
 [
  "Who makes Skipper?",
  "Skipper was founded by Express Docks, with more than 20 years in marine services. It is a product of Mariner and Sailor Company."
 ],
 [
  "Who is Skipper for?",
  "Marinas and yacht clubs: slips, moorings, yard and storage, with fuel dock, ship store and messaging in the same system."
 ],
 [
  "How is Skipper different from legacy marina software?",
  "The boat is the central record, every module is included in one published price, contracts, billing and work orders are connected, automations are off until you turn them on, and switching over is simple."
 ],
 [
  "What does Skipper run on?",
  "Skipper runs in a web browser. Boaters get a free iPhone app."
 ],
 [
  "How much does Skipper cost?",
  "$99 a month up to 20 slips and moorings, $199 for 21 to 50, $299 for 51 to 100, $499 for 101 to 250, $799 for over 250 or several marinas."
 ],
 [
  "Are there setup fees?",
  "No. There is no setup fee and no onboarding fee. Moving your data is included."
 ],
 [
  "Are modules priced separately?",
  "No. Every module is in every plan: billing, contracts, fuel dock, ship store, work orders, inventory, mapping, the AI assistant and the boater app."
 ],
 [
  "Does Skipper charge a fee on transient bookings?",
  "No. Card processors charge their normal card fees."
 ],
 [
  "How are yacht clubs priced?",
  "The same prices, by member count. A club with only moorings sees only moorings."
 ],
 [
  "How hard is it to switch from my current software?",
  "Send your boat and owner lists, your layout and your contracts. Skipper draws every space, loads your records and hands you a live map."
 ],
 [
  "How long does switching take?",
  "One marina that switched from DockMaster exported its data and had a basic Skipper running within hours."
 ],
 [
  "What data moves over?",
  "Boat and owner lists, your layout and your contracts. Active leases come across with their balance and expiry date."
 ],
 [
  "What happens to leases that are still active?",
  "They come across as holdover leases with the balance and expiry date. At renewal Skipper can send a new lease for e-signature."
 ],
 [
  "What happens to tenants who have no boat on record?",
  "Skipper creates a placeholder boat so the tenant and the space are not lost."
 ],
 [
  "Do I have to rebuild all my contracts before I start?",
  "No. Tenants can come across as invoices attached to each boat, with the lease expiry kept on the boat, and you make new contracts when you have time."
 ],
 [
  "Does Skipper track boats or customers?",
  "Boats are the central record, and people attach to them."
 ],
 [
  "Can one owner have several boats?",
  "Yes."
 ],
 [
  "Can one boat have several contacts?",
  "Yes."
 ],
 [
  "Can I use my own contract and fine print?",
  "Yes. You upload your fine print and attach it to the contract types it applies to."
 ],
 [
  "What contract types are supported?",
  "Slips, parking, yard storage, dry rack and more, with seasonal, annual and other terms."
 ],
 [
  "What are mandatory and optional services on a contract?",
  "Mandatory services are billed to every customer. Optional services are chosen after signing, and each becomes its own work order item."
 ],
 [
  "Does Skipper support e-signature?",
  "Yes. Contracts are signed electronically."
 ],
 [
  "Can contracts send automatically?",
  "Every automation has an on switch and a choice to send automatically or have a person review first."
 ],
 [
  "Does billing run automatically?",
  "Only if you turn it on. Every billing switch starts OFF. Monthly invoices, reminders, late fees and saved-card charges are each configurable."
 ],
 [
  "Can Skipper send payment reminders?",
  "Yes: before the due date, on it, and after it is overdue, repeating and stopping after a number you set. A customer with several unpaid invoices can get one statement."
 ],
 [
  "Can Skipper charge late fees?",
  "Yes, if you turn it on. You set the days, the percent per month, a highest percent and a minimum. Each late fee is its own invoice and is never charged on tax."
 ],
 [
  "Can Skipper charge saved cards?",
  "Yes. It can charge a saved card when an invoice comes due, with a set number of retries."
 ],
 [
  "Will importing my data send messages or charges to my customers?",
  "No. Automations start OFF and nothing is sent until you turn it on and save."
 ],
 [
  "How do work orders work?",
  "You start from the boat and the owner fills in. Line items come from your catalog. Statuses are Estimate, Open, In progress, Pending parts and Completed."
 ],
 [
  "How do deposits work with work orders?",
  "Held deposits apply automatically as a credit when the work order is completed."
 ],
 [
  "What happens when a work order is completed?",
  "The invoice is created for review and the work is logged on the boat record."
 ],
 [
  "Is Skipper an accounting system?",
  "No. It runs operations and customer billing and includes receivables, payables, deposits and reports. It is not a replacement for a full accounting package, and invoices and payments export for your accountant."
 ],
 [
  "Which integrations are live?",
  "Stripe, Clover and text messaging."
 ],
 [
  "Can Skipper connect to QuickBooks, Xero or Square?",
  "Those, plus Mailchimp, Google Calendar, Zapier and a marina's own point of sale, are built when a marina asks, and are included in the price."
 ],
 [
  "What AI does Skipper use?",
  "Claude, from Anthropic."
 ],
 [
  "Does the AI act without asking?",
  "By default staff approve each action. A marina can set it to one tap and go."
 ],
 [
  "Can I turn the AI off?",
  "Yes. One switch turns it off for the whole marina, and everything else keeps running."
 ],
 [
  "Where do card numbers go?",
  "Card payments are handled by Stripe or Clover."
 ],
 [
  "Is my data encrypted?",
  "Data is encrypted in transit. Skipper does not sell personal information."
 ],
 [
  "Can I export my data?",
  "Invoices and payments, pedestal readings and safety inspections export today."
 ],
 [
  "What does the boater app do?",
  "It is a free iPhone app. A boater with a reservation opens it and their space lights up on the map."
 ],
 [
  "What is the Chart Room?",
  "The live map of the marina, drawn to scale from satellite, in 2D and 3D, showing the boat, owner, contract and balance behind each space."
 ],
 [
  "What is Hot Slip?",
  "A program where permanent tenants lend their slip while they are away so it can be booked as a transient."
 ],
 [
  "Does Skipper have a wait list?",
  "Yes. Requests come in and the system shows which free space fits which boat."
 ],
 [
  "Does Skipper support fuel dock and ship store sales?",
  "Yes. Fuel dock, parts and inventory, and the ship store are included."
 ],
 [
  "Can I run more than one marina?",
  "Yes. A fleet view covers several marinas on one account, priced in the top plan."
 ],
 [
  "What if I need something Skipper does not do yet?",
  "Tell us. Custom features and integrations for the marinas and yacht clubs we work with are included."
 ],
 [
  "Can I see it before I decide?",
  "Yes. Request a demo at https://ayeayeskipper.com/#demo."
 ]
]
export default function HowSkipperWorks() {
 return (
  <main style={{ minHeight: '100vh', background: '#070f1a', color: '#fff', fontFamily: FONT }}>
   <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: QA.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) }).replace(/</g, '\\u003c') }} />
   <div style={{ maxWidth: 820, margin: '0 auto', padding: '70px 28px 90px' }}>
    <div style={{ fontSize: 12, color: TEAL, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 14 }}>Skipper in plain words</div>
    <h1 style={{ fontSize: 'clamp(34px, 5vw, 56px)', fontWeight: 900, letterSpacing: -2, lineHeight: 1.05, margin: '0 0 18px' }}>How Skipper works</h1>
    <p style={{ fontSize: 18, lineHeight: 1.7, color: 'rgba(255,255,255,0.7)', margin: '0 0 36px' }}>Marina and yacht club management software with every module in one published price. This page is the plain-text version of what it does and how it differs, followed by a full question and answer list.</p>
    {SECTIONS.map(([h, ps]) => (
     <section key={h} style={{ marginBottom: 34 }}>
      <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.5, margin: '0 0 12px', color: TEAL }}>{h}</h2>
      {ps.map((p, i) => <p key={i} style={{ fontSize: 16, lineHeight: 1.75, color: 'rgba(255,255,255,0.82)', margin: '0 0 12px' }}>{p}</p>)}
     </section>
    ))}
    <h2 style={{ fontSize: 30, fontWeight: 900, letterSpacing: -1, margin: '46px 0 18px', color: TEAL }}>Questions and answers</h2>
    {QA.map(([q, a]) => (
     <div key={q} style={{ marginBottom: 18 }}>
      <h3 style={{ fontSize: 17, fontWeight: 800, margin: '0 0 4px' }}>{q}</h3>
      <p style={{ fontSize: 16, lineHeight: 1.7, color: 'rgba(255,255,255,0.8)', margin: 0 }}>{a}</p>
     </div>
    ))}
    <p style={{ marginTop: 28 }}><Link href="/#demo" style={{ color: TEAL, fontWeight: 800, textDecoration: 'none' }}>Request a demo</Link></p>
   </div>
  </main>
 )
}

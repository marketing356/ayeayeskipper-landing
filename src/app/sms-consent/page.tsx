import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SMS Consent — AyeAyeSkipper',
  description: 'Opt in to receive SMS notifications from your marina via AyeAyeSkipper.',
}

const NAVY = '#0d2b4b'
const TEAL = '#4dd6c8'
const DARK = '#070f1a'
const FONT = "system-ui,-apple-system,'Segoe UI',Roboto,sans-serif"

export default function SMSConsentPage() {
  return (
    <div style={{ minHeight: '100vh', background: DARK, fontFamily: FONT, color: '#fff' }}>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '80px 24px 100px' }}>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(77,214,200,0.1)', border: '1px solid rgba(77,214,200,0.25)', borderRadius: 24, padding: '6px 16px', marginBottom: 20 }}>
            <span style={{ fontSize: 12, color: TEAL, fontWeight: 700, letterSpacing: '1px' }}>SMS NOTIFICATIONS</span>
          </div>
          <h1 style={{ fontSize: 'clamp(28px,5vw,42px)', fontWeight: 900, letterSpacing: '-1.5px', margin: '0 0 16px', lineHeight: 1.1 }}>
            Text Message Consent
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', margin: 0, lineHeight: 1.6 }}>
            Marina operators use AyeAyeSkipper to send important updates to their tenants and guests via SMS.
            Your consent is required before any messages are sent.
          </p>
        </div>

        {/* What you'll receive */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '28px 32px', marginBottom: 28 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 16px', color: '#fff' }}>What messages will I receive?</h2>
          <ul style={{ margin: 0, padding: '0 0 0 20px', color: 'rgba(255,255,255,0.7)', lineHeight: 2, fontSize: 14 }}>
            <li>Invoice and payment reminders from your marina</li>
            <li>Lease renewal notices</li>
            <li>Dock and slip assignment changes</li>
            <li>Storm and weather alerts from your marina</li>
            <li>General marina announcements and operational updates</li>
          </ul>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 16, marginBottom: 0 }}>
            Messages are sent by your marina operator through AyeAyeSkipper,
            operated by Mariner and Sailor Company, 651 N. Broad St, Middletown, DE 19709.
          </p>
        </div>

        {/* Consent Checkbox */}
        <div style={{ background: 'rgba(77,214,200,0.06)', border: '1px solid rgba(77,214,200,0.3)', borderRadius: 16, padding: '32px', marginBottom: 28 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 20px', color: '#fff' }}>Opt-In Consent</h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', margin: '0 0 20px', lineHeight: 1.6 }}>
            During lease signing or marina registration, tenants are shown the following consent checkbox before any messages are sent:
          </p>

          {/* Checkbox display */}
          <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, padding: '20px 24px', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
            <div style={{
              width: 22, height: 22, minWidth: 22, borderRadius: 5,
              background: TEAL, display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginTop: 1
            }}>
              <svg width="13" height="10" viewBox="0 0 13 10" fill="none">
                <path d="M1 5L5 9L12 1" stroke="#0d2b4b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7, color: 'rgba(255,255,255,0.9)' }}>
              I agree to receive automated text messages from my marina via{' '}
              <strong>AyeAyeSkipper</strong> (operated by{' '}
              <strong>Mariner and Sailor Company</strong>). Message frequency
              varies. Message &amp; data rates may apply. Reply{' '}
              <strong>STOP</strong> to unsubscribe. Reply{' '}
              <strong>HELP</strong> for help.
            </p>
          </div>

          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: '16px 0 0', lineHeight: 1.6 }}>
            This checkbox must be checked before a lease or reservation is confirmed.
            No SMS messages are sent to any contact who has not explicitly checked this box.
          </p>
        </div>

        {/* Program details */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '20px 24px', marginBottom: 32 }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 12px' }}>Program Details</h3>
          <ul style={{ margin: 0, padding: '0 0 0 16px', fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 2 }}>
            <li>Program: AyeAyeSkipper Marina Notifications</li>
            <li>Operator: Mariner and Sailor Company · admin@ayeayeskipper.com</li>
            <li>Message frequency: varies by marina activity</li>
            <li>Msg &amp; data rates may apply</li>
            <li>To stop: reply <strong style={{ color: 'rgba(255,255,255,0.75)' }}>STOP</strong></li>
            <li>For help: reply <strong style={{ color: 'rgba(255,255,255,0.75)' }}>HELP</strong> or email <a href="mailto:admin@ayeayeskipper.com" style={{ color: TEAL, textDecoration: 'none' }}>admin@ayeayeskipper.com</a></li>
          </ul>
        </div>

        {/* Links */}
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <a href="/terms" style={{ fontSize: 13, color: TEAL, textDecoration: 'none' }}>Terms of Service</a>
          <a href="/privacy" style={{ fontSize: 13, color: TEAL, textDecoration: 'none' }}>Privacy Policy</a>
          <a href="/" style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>← Back to AyeAyeSkipper</a>
        </div>

      </div>
    </div>
  )
}

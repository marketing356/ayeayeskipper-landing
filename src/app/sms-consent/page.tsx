export default function SmsConsent() {
  return (
    <main style={{ maxWidth: 760, margin: '0 auto', padding: '80px 40px', fontFamily: "system-ui,-apple-system,'Segoe UI',Roboto,sans-serif", color: '#fff' }}>
      <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 8 }}>SMS Messaging Consent</h1>
      <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 40 }}>Last updated: August 2026 · MARINER AND SAILOR COMPANY</p>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#4dd6c8', marginBottom: 12 }}>Who Sends Messages</h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8 }}>
          SMS messages are sent on behalf of marina operators using AyeAyeSkipper, a marina management platform
          operated by MARINER AND SAILOR COMPANY, 651 N. Broad St, Middletown, DE 19709.
        </p>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#4dd6c8', marginBottom: 12 }}>How You Opt In</h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8 }}>
          Marina tenants and guests provide their mobile phone number when signing a slip lease, storage agreement,
          or transient reservation through their marina's AyeAyeSkipper system. During this process, tenants check
          a clearly labeled consent checkbox confirming they agree to receive SMS notifications from their marina
          via AyeAyeSkipper. No messages are sent without this explicit consent.
        </p>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#4dd6c8', marginBottom: 12 }}>Types of Messages</h2>
        <ul style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 2, paddingLeft: 20 }}>
          <li>Slip assignment and dock assignment notifications</li>
          <li>Invoice and payment reminders</li>
          <li>Lease renewal notices</li>
          <li>Marina announcements and operational updates</li>
          <li>Haul-out and launch scheduling confirmations</li>
        </ul>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#4dd6c8', marginBottom: 12 }}>How to Opt Out</h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8 }}>
          Reply <strong>STOP</strong> to any message to unsubscribe immediately. You will receive one final
          confirmation message and no further messages will be sent. Reply <strong>HELP</strong> for assistance.
          Message and data rates may apply.
        </p>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#4dd6c8', marginBottom: 12 }}>Message Frequency</h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8 }}>
          Message frequency varies based on marina activity. Most tenants receive 2–6 messages per month.
        </p>
      </section>

      <section>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#4dd6c8', marginBottom: 12 }}>Contact</h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8 }}>
          Questions? Email <a href="mailto:admin@ayeayeskipper.com" style={{ color: '#4dd6c8' }}>admin@ayeayeskipper.com</a> or
          visit <a href="https://ayeayeskipper.com" style={{ color: '#4dd6c8' }}>ayeayeskipper.com</a>.
        </p>
      </section>
    </main>
  )
}

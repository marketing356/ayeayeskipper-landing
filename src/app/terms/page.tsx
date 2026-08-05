export default function Terms() {
  return (
    <main style={{ maxWidth: 760, margin: '0 auto', padding: '80px 40px', fontFamily: "system-ui,-apple-system,'Segoe UI',Roboto,sans-serif", color: '#fff' }}>
      <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 8 }}>Terms of Service</h1>
      <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 40 }}>Last updated: August 2026 · MARINER AND SAILOR COMPANY</p>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#4dd6c8', marginBottom: 12 }}>About AyeAyeSkipper</h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8 }}>
          AyeAyeSkipper is a marina management platform operated by MARINER AND SAILOR COMPANY,
          651 N. Broad St, Middletown, DE 19709, EIN 88-3901860. By using AyeAyeSkipper you agree to these terms.
        </p>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#4dd6c8', marginBottom: 12 }}>Use of the Platform</h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8 }}>
          AyeAyeSkipper provides marina management tools for marina operators and their tenants.
          Users must provide accurate information and use the platform lawfully.
        </p>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#4dd6c8', marginBottom: 12 }}>SMS Communications</h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8 }}>
          By providing your phone number and checking the consent box, you agree to receive SMS notifications
          from your marina via AyeAyeSkipper. Message and data rates may apply. Reply STOP to opt out at any time.
          See our <a href="/sms-consent" style={{ color: '#4dd6c8' }}>SMS Consent page</a> for full details.
        </p>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#4dd6c8', marginBottom: 12 }}>Limitation of Liability</h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8 }}>
          MARINER AND SAILOR COMPANY provides AyeAyeSkipper on an as-is basis. We are not liable for
          damages arising from use of the platform beyond the fees paid in the prior 30 days.
        </p>
      </section>

      <section>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#4dd6c8', marginBottom: 12 }}>Contact</h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8 }}>
          Questions? Email <a href="mailto:admin@ayeayeskipper.com" style={{ color: '#4dd6c8' }}>admin@ayeayeskipper.com</a>.
        </p>
      </section>
    </main>
  )
}

export default function Privacy() {
  return (
    <main style={{ maxWidth: 760, margin: '0 auto', padding: '80px 40px', fontFamily: "system-ui,-apple-system,'Segoe UI',Roboto,sans-serif", color: '#fff' }}>
      <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 8 }}>Privacy Policy</h1>
      <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 40 }}>Last updated: August 2026 · MARINER AND SAILOR COMPANY</p>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#4dd6c8', marginBottom: 12 }}>Who We Are</h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8 }}>
          AyeAyeSkipper is a marina management platform operated by MARINER AND SAILOR COMPANY,
          651 N. Broad St, Middletown, DE 19709. Contact us at admin@ayeayeskipper.com.
        </p>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#4dd6c8', marginBottom: 12 }}>Information We Collect</h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8 }}>
          We collect information provided by marina operators and their tenants including name, email address,
          phone number, vessel information, and billing details. This information is used to operate the
          AyeAyeSkipper platform and facilitate marina management.
        </p>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#4dd6c8', marginBottom: 12 }}>SMS Messaging</h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8 }}>
          We send SMS messages only to users who have explicitly consented. See our <a href="/sms-consent" style={{ color: '#4dd6c8' }}>SMS Consent page</a> for
          full details on how we collect consent and how to opt out. Reply STOP to any message to unsubscribe.
        </p>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#4dd6c8', marginBottom: 12 }}>How We Use Your Information</h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8 }}>
          Information is used to provide marina management services, send operational notifications,
          process payments, and improve the platform. We do not sell personal information to third parties.
        </p>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#4dd6c8', marginBottom: 12 }}>Data Security</h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8 }}>
          Data is stored securely and encrypted in transit. We use industry-standard security practices
          to protect your information.
        </p>
      </section>

      <section>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#4dd6c8', marginBottom: 12 }}>Contact</h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8 }}>
          Questions about this policy? Email <a href="mailto:admin@ayeayeskipper.com" style={{ color: '#4dd6c8' }}>admin@ayeayeskipper.com</a>.
        </p>
      </section>
    </main>
  )
}

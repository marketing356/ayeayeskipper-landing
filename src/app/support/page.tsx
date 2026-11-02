export const metadata = { title: 'Support | AyeAyeSkipper' };

const h2 = { fontSize: 20, fontWeight: 700, color: '#4dd6c8', marginBottom: 12 } as const;
const p = { color: 'rgba(255,255,255,0.7)', lineHeight: 1.8 } as const;

export default function Support() {
  return (
    <main style={{ maxWidth: 760, margin: '0 auto', padding: '80px 40px', fontFamily: "system-ui,-apple-system,'Segoe UI',Roboto,sans-serif", color: '#fff' }}>
      <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 8 }}>AyeAyeSkipper Support</h1>
      <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 40 }}>MARINER AND SAILOR COMPANY</p>

      <section style={{ marginBottom: 40 }}>
        <h2 style={h2}>Boaters and slip holders</h2>
        <p style={p}>
          Questions about an invoice, a payment, your contract, or your slip? Please contact your marina first.
          Your marina manages your account, charges and payment history, and can help you fastest.
        </p>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2 style={h2}>Marinas</h2>
        <p style={p}>
          Need help with AyeAyeSkipper or your Clover payment connection? Email{' '}
          <a href="mailto:admin@ayeayeskipper.com" style={{ color: '#4dd6c8' }}>admin@ayeayeskipper.com</a>{' '}
          or leave a voicemail at <a href="tel:+18006860315" style={{ color: '#4dd6c8' }}>1-800-686-0315</a>.
          We will get back to you as soon as we can. Please include your marina name.
        </p>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2 style={h2}>Legal</h2>
        <p style={p}>
          <a href="/terms" style={{ color: '#4dd6c8' }}>Terms of Service</a> · <a href="/privacy" style={{ color: '#4dd6c8' }}>Privacy Policy</a>
        </p>
      </section>
    </main>
  );
}

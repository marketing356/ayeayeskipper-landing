export default function PaymentSuccess() {
  return (
    <main style={{ fontFamily: 'sans-serif', background: '#f0f4f8', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px' }}>
      <div style={{ maxWidth: '480px', background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', textAlign: 'center' }}>
        <div style={{ background: '#0d2b4b', padding: '36px 32px' }}>
          <div style={{ color: '#4dd6c8', fontSize: '48px', marginBottom: '12px' }}>✓</div>
          <div style={{ color: '#fff', fontSize: '24px', fontWeight: 800 }}>Payment Received</div>
          <div style={{ color: '#94a3b8', fontSize: '14px', marginTop: '8px' }}>Thank you — your payment has been processed.</div>
        </div>
        <div style={{ padding: '36px 32px' }}>
          <p style={{ color: '#334155', fontSize: '15px', lineHeight: '1.6' }}>
            Your marina will receive confirmation and update your account shortly.
          </p>
          <p style={{ color: '#64748b', fontSize: '13px', marginTop: '16px' }}>
            Questions? Contact your marina directly.
          </p>
        </div>
      </div>
    </main>
  )
}

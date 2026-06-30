'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'

const NAVY = '#0d2b4b'
const TEAL = '#4dd6c8'
const DARK = '#070f1a'
const FONT = "system-ui,-apple-system,'Segoe UI',Roboto,sans-serif"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

const TIER_LABELS: Record<string, string> = { mate: 'Mate', captain: 'Captain', admiral: 'Admiral' }
const TIER_PRICES: Record<string, number>  = { mate: 299, captain: 499, admiral: 799 }
const TIER_SLIPS:  Record<string, string>  = { mate: '≤30 slips', captain: '31–99 slips', admiral: '100+ slips' }

type BillingData = {
  marina: {
    id: string
    name: string
    planTier: string
    planPriceMonthly: number
    billingStatus: string
    trialStartsAt: string | null
    trialEndsAt: string | null
    daysLeft: number | null
    hasPaymentMethod: boolean
    cardLast4: string | null
    cardBrand: string | null
    cardExpiry: string | null
  }
  invoices: Array<{
    id: string
    amount_cents: number
    plan_tier: string
    period_start: string
    period_end: string
    status: string
    paid_at: string | null
    created_at: string
  }>
}

// ── Card setup form (inside Stripe Elements) ─────────────────────────────────
function CardSetupForm({ marinaId, email, name, onSuccess }: {
  marinaId: string
  email: string
  name: string
  onSuccess: () => void
}) {
  const stripe   = useStripe()
  const elements = useElements()
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!stripe || !elements) return
    setSaving(true); setError('')

    try {
      // Get setup intent
      const intentRes = await fetch('/api/marina/billing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create-setup', marinaId, email, name }),
      })
      const { clientSecret, error: intentErr } = await intentRes.json()
      if (intentErr) { setError(intentErr); setSaving(false); return }

      // Confirm card setup
      const cardEl = elements.getElement(CardElement)
      if (!cardEl) return

      const { setupIntent, error: stripeErr } = await stripe.confirmCardSetup(clientSecret, {
        payment_method: { card: cardEl, billing_details: { name, email } },
      })

      if (stripeErr) { setError(stripeErr.message || 'Card declined'); setSaving(false); return }
      if (!setupIntent?.payment_method) { setError('Setup incomplete'); setSaving(false); return }

      // Save PM to marina
      const saveRes = await fetch('/api/marina/billing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save-method',
          marinaId,
          paymentMethodId: setupIntent.payment_method,
        }),
      })
      const saveData = await saveRes.json()
      if (saveData.error) { setError(saveData.error); setSaving(false); return }

      onSuccess()
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    }
    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: 10, padding: '16px 18px',
        background: 'rgba(255,255,255,0.04)',
        marginBottom: 14,
      }}>
        <CardElement options={{
          style: {
            base: {
              color: '#fff',
              fontFamily: FONT,
              fontSize: '15px',
              '::placeholder': { color: 'rgba(255,255,255,0.3)' },
            },
          },
        }} />
      </div>
      {error && (
        <div style={{ color: '#ff8080', fontSize: 13, marginBottom: 12 }}>{error}</div>
      )}
      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', margin: '0 0 14px', lineHeight: 1.6 }}>
        Your card will not be charged during the free trial. Billing begins when your trial ends.
      </p>
      <button type="submit" disabled={saving || !stripe} style={{
        width: '100%', padding: '14px', background: TEAL, color: NAVY,
        border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 900,
        cursor: saving ? 'not-allowed' as const : 'pointer' as const,
        fontFamily: FONT, opacity: saving ? 0.7 : 1,
      }}>
        {saving ? 'Saving…' : 'Save payment method'}
      </button>
    </form>
  )
}

// ── Main billing page ────────────────────────────────────────────────────────
export default function BillingPage() {
  const router = useRouter()
  const [account, setAccount] = useState<{ email: string; firstName: string; lastName: string | null; marinaId: string; marinaName: string } | null>(null)
  const [billing, setBilling] = useState<BillingData | null>(null)
  const [loading, setLoading] = useState(true)
  const [cardAdded, setCardAdded] = useState(false)

  async function loadBilling(marinaId: string) {
    try {
      const res = await fetch('/api/marina/billing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get-status', marinaId }),
      })
      const data = await res.json()
      if (data.marina) setBilling(data)
    } catch {}
  }

  useEffect(() => {
    const acctStr = localStorage.getItem('marina_account')
    if (!acctStr) { router.replace('/marina-login'); return }
    try {
      const acct = JSON.parse(acctStr)
      setAccount(acct)
      loadBilling(acct.marinaId).then(() => setLoading(false))
    } catch { router.replace('/marina-login') }
  }, [router])

  function handleCardSuccess() {
    setCardAdded(true)
    if (account) {
      // Update cached account
      const acctStr = localStorage.getItem('marina_account')
      if (acctStr) {
        try {
          const acct = JSON.parse(acctStr)
          acct.hasPaymentMethod = true
          localStorage.setItem('marina_account', JSON.stringify(acct))
        } catch {}
      }
      loadBilling(account.marinaId)
    }
  }

  if (loading || !account) return <div style={{ minHeight: '100vh', background: DARK }} />

  const marina  = billing?.marina
  const invoices = billing?.invoices ?? []
  const tier    = marina?.planTier ?? 'mate'
  const price   = marina?.planPriceMonthly ?? TIER_PRICES[tier]
  const daysLeft = marina?.daysLeft
  const isTrialing = marina?.billingStatus === 'trialing'
  const trialUrgent = daysLeft !== null && daysLeft !== undefined && daysLeft <= 5

  function fmt(dateStr: string | null) {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div style={{ minHeight: '100vh', background: DARK, fontFamily: FONT, color: '#fff' }}>

      {/* Header */}
      <div style={{ background: NAVY, padding: '28px 40px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'space-between', flexWrap: 'wrap' as const }}>
          <div>
            <a href="/account" style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, textDecoration: 'none' }}>← Back to account</a>
            <h1 style={{ fontSize: 24, fontWeight: 900, margin: '6px 0 0', letterSpacing: '-0.6px' }}>Billing</h1>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: '2px 0 0' }}>{account.marinaName}</p>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '36px 40px', display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>

        {/* ── Left column ── */}
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 20 }}>

          {/* Current plan */}
          <div style={{
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 14, padding: 28,
          }}>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' as const, marginBottom: 14 }}>
              Current Plan
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' as const, gap: 12 }}>
              <div>
                <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-1px' }}>
                  {TIER_LABELS[tier] ?? tier}
                </div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>
                  {TIER_SLIPS[tier]} · ${price}/month
                </div>
              </div>
              <div style={{ textAlign: 'right' as const }}>
                {isTrialing ? (
                  <div>
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      background: daysLeft !== null && daysLeft !== undefined && daysLeft <= 5 ? 'rgba(255,80,80,0.1)' : 'rgba(77,214,200,0.1)',
                      border: `1px solid ${daysLeft !== null && daysLeft !== undefined && daysLeft <= 5 ? 'rgba(255,80,80,0.3)' : 'rgba(77,214,200,0.3)'}`,
                      borderRadius: 20, padding: '4px 12px', fontSize: 12,
                      color: daysLeft !== null && daysLeft !== undefined && daysLeft <= 5 ? '#ff8080' : TEAL, fontWeight: 700,
                    }}>
                      Free Trial
                    </div>
                    {daysLeft !== null && daysLeft !== undefined && (
                      <div style={{ fontSize: 13, color: trialUrgent ? '#ff8080' : 'rgba(255,255,255,0.45)', marginTop: 6, fontWeight: trialUrgent ? 700 : 400 }}>
                        {daysLeft === 0 ? 'Ends today' : `${daysLeft} day${daysLeft === 1 ? '' : 's'} remaining`}
                      </div>
                    )}
                    {marina?.trialEndsAt && (
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>
                        Trial ends {fmt(marina.trialEndsAt)}
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    background: 'rgba(77,214,200,0.1)', border: '1px solid rgba(77,214,200,0.3)',
                    borderRadius: 20, padding: '4px 12px', fontSize: 12, color: TEAL, fontWeight: 700,
                  }}>
                    Active
                  </div>
                )}
              </div>
            </div>

            {/* All tiers */}
            <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column' as const, gap: 8 }}>
              {(['mate', 'captain', 'admiral'] as const).map(t => (
                <div key={t} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '10px 14px', borderRadius: 8,
                  background: t === tier ? 'rgba(77,214,200,0.07)' : 'rgba(255,255,255,0.02)',
                  border: t === tier ? '1px solid rgba(77,214,200,0.2)' : '1px solid rgba(255,255,255,0.04)',
                }}>
                  <div>
                    <span style={{ fontWeight: t === tier ? 800 : 500, fontSize: 13 }}>{TIER_LABELS[t]}</span>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginLeft: 8 }}>{TIER_SLIPS[t]}</span>
                    {t === tier && <span style={{ fontSize: 11, color: TEAL, marginLeft: 8, fontWeight: 700 }}>YOUR PLAN</span>}
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 700, color: t === tier ? TEAL : 'rgba(255,255,255,0.5)' }}>
                    ${TIER_PRICES[t]}/mo
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Invoice history */}
          <div style={{
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 14, padding: 28,
          }}>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' as const, marginBottom: 16 }}>
              Invoice History
            </div>
            {invoices.length === 0 ? (
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', margin: 0 }}>
                No invoices yet. Your first invoice generates at the end of your trial.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 2 }}>
                {invoices.map(inv => (
                  <div key={inv.id} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)',
                  }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>
                        {fmt(inv.period_start)} – {fmt(inv.period_end)}
                      </div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>
                        {TIER_LABELS[inv.plan_tier] ?? inv.plan_tier}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' as const }}>
                      <div style={{ fontSize: 14, fontWeight: 700 }}>${(inv.amount_cents / 100).toFixed(2)}</div>
                      <div style={{
                        fontSize: 11, marginTop: 3, fontWeight: 700,
                        color: inv.status === 'paid' ? TEAL : inv.status === 'failed' ? '#ff8080' : 'rgba(255,255,255,0.35)',
                      }}>
                        {inv.status.toUpperCase()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Right column: payment method ── */}
        <div style={{
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 14, padding: 28, position: 'sticky' as const, top: 24,
        }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' as const, marginBottom: 16 }}>
            Payment Method
          </div>

          {cardAdded || marina?.hasPaymentMethod ? (
            <div>
              <div style={{
                background: 'rgba(77,214,200,0.07)', border: '1px solid rgba(77,214,200,0.2)',
                borderRadius: 10, padding: '14px 16px', marginBottom: 16,
              }}>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>
                  {marina?.cardBrand ? marina.cardBrand.charAt(0).toUpperCase() + marina.cardBrand.slice(1) : 'Card'} ending in {marina?.cardLast4 ?? '••••'}
                </div>
                {marina?.cardExpiry && (
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Expires {marina.cardExpiry}</div>
                )}
              </div>
              <div style={{
                background: 'rgba(77,214,200,0.06)', border: '1px solid rgba(77,214,200,0.2)',
                borderRadius: 8, padding: '10px 14px', fontSize: 12, color: TEAL, fontWeight: 600,
              }}>
                ✓ Card on file. You won't be charged until your trial ends.
              </div>
            </div>
          ) : (
            <div>
              {isTrialing && daysLeft !== null && daysLeft !== undefined && (
                <div style={{
                  background: trialUrgent ? 'rgba(255,80,80,0.08)' : 'rgba(77,214,200,0.06)',
                  border: `1px solid ${trialUrgent ? 'rgba(255,80,80,0.2)' : 'rgba(77,214,200,0.15)'}`,
                  borderRadius: 8, padding: '10px 14px', fontSize: 12,
                  color: trialUrgent ? '#ff8080' : 'rgba(255,255,255,0.5)',
                  marginBottom: 18, lineHeight: 1.6,
                }}>
                  {trialUrgent
                    ? `⚠️ Trial ends in ${daysLeft} day${daysLeft === 1 ? '' : 's'}. Add a card to keep access.`
                    : `Free trial — ${daysLeft} day${daysLeft === 1 ? '' : 's'} remaining. Add a card anytime.`
                  }
                </div>
              )}
              <Elements stripe={stripePromise}>
                <CardSetupForm
                  marinaId={account.marinaId}
                  email={account.email}
                  name={`${account.firstName} ${account.lastName ?? ''}`.trim()}
                  onSuccess={handleCardSuccess}
                />
              </Elements>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

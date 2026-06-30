/**
 * POST /api/marina/billing
 * Marina platform billing: Stripe setup intent, billing status, invoice history.
 *
 * Actions:
 *   get-status        { marinaId }                  → billing info + invoices
 *   create-setup      { marinaId, email, name }      → Stripe SetupIntent clientSecret
 *   save-method       { marinaId, paymentMethodId }  → save PM + create Stripe customer
 *   get-network       {}                             → all marinas in network
 */
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY!
const STRIPE_KEY   = process.env.STRIPE_SECRET_KEY!

const stripe = new Stripe(STRIPE_KEY, { apiVersion: '2026-06-24.dahlia' as any })
const sbHeaders = {
  apikey: SERVICE_KEY,
  Authorization: `Bearer ${SERVICE_KEY}`,
  'Content-Type': 'application/json',
}

const TIER_PRICES: Record<string, number> = {
  mate:    299,
  captain: 499,
  admiral: 799,
}

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { action } = body

  // ── GET BILLING STATUS ─────────────────────────────────────────────────────
  if (action === 'get-status') {
    const { marinaId } = body
    if (!marinaId) return NextResponse.json({ error: 'marinaId required' }, { status: 400 })

    const [mRes, invRes] = await Promise.all([
      fetch(
        `${SUPABASE_URL}/rest/v1/marinas?id=eq.${marinaId}&select=id,name,slug,total_slips,plan_tier,billing_status,trial_starts_at,trial_ends_at,stripe_customer_id,stripe_payment_method_id,billing_email&limit=1`,
        { headers: sbHeaders }
      ),
      fetch(
        `${SUPABASE_URL}/rest/v1/platform_invoices?marina_id=eq.${marinaId}&deleted_at=is.null&order=created_at.desc&limit=12`,
        { headers: sbHeaders }
      ),
    ])

    const [marinas, invoices] = await Promise.all([mRes.json(), invRes.json()])
    if (!Array.isArray(marinas) || marinas.length === 0) {
      return NextResponse.json({ error: 'Marina not found' }, { status: 404 })
    }

    const marina = marinas[0]
    const trialEnd = marina.trial_ends_at ? new Date(marina.trial_ends_at) : null
    const daysLeft = trialEnd
      ? Math.max(0, Math.ceil((trialEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
      : null

    // Get last4 from Stripe if payment method exists
    let cardLast4: string | null = null
    let cardBrand: string | null = null
    let cardExpiry: string | null = null
    if (marina.stripe_payment_method_id) {
      try {
        const pm = await stripe.paymentMethods.retrieve(marina.stripe_payment_method_id)
        if (pm.card) {
          cardLast4  = pm.card.last4
          cardBrand  = pm.card.brand
          cardExpiry = `${pm.card.exp_month}/${String(pm.card.exp_year).slice(-2)}`
        }
      } catch {}
    }

    return NextResponse.json({
      marina: {
        id:              marina.id,
        name:            marina.name,
        slug:            marina.slug,
        totalSlips:      marina.total_slips,
        planTier:        marina.plan_tier,
        planPriceMonthly: TIER_PRICES[marina.plan_tier] ?? 299,
        billingStatus:   marina.billing_status,
        trialStartsAt:   marina.trial_starts_at,
        trialEndsAt:     marina.trial_ends_at,
        daysLeft,
        hasPaymentMethod: !!marina.stripe_payment_method_id,
        cardLast4,
        cardBrand,
        cardExpiry,
      },
      invoices: Array.isArray(invoices) ? invoices : [],
    })
  }

  // ── CREATE STRIPE SETUP INTENT ─────────────────────────────────────────────
  if (action === 'create-setup') {
    const { marinaId, email, name } = body
    if (!marinaId) return NextResponse.json({ error: 'marinaId required' }, { status: 400 })

    // Load marina
    const mRes = await fetch(
      `${SUPABASE_URL}/rest/v1/marinas?id=eq.${marinaId}&select=id,name,stripe_customer_id,billing_email&limit=1`,
      { headers: sbHeaders }
    )
    const marinas = await mRes.json()
    if (!Array.isArray(marinas) || marinas.length === 0) {
      return NextResponse.json({ error: 'Marina not found' }, { status: 404 })
    }
    const marina = marinas[0]

    // Create Stripe customer if needed
    let customerId = marina.stripe_customer_id
    if (!customerId) {
      const customer = await stripe.customers.create({
        email:    email || marina.billing_email || undefined,
        name:     name  || marina.name,
        metadata: { marina_id: marinaId, platform: 'ayeayeskipper' },
      })
      customerId = customer.id

      // Save customer ID to marina
      await fetch(`${SUPABASE_URL}/rest/v1/marinas?id=eq.${marinaId}`, {
        method:  'PATCH',
        headers: { ...sbHeaders, Prefer: 'return=minimal' },
        body: JSON.stringify({
          stripe_customer_id: customerId,
          billing_email: email || undefined,
          updated_at: new Date().toISOString(),
        }),
      })
    }

    // Create SetupIntent (save card, no charge now)
    const setupIntent = await stripe.setupIntents.create({
      customer:             customerId,
      payment_method_types: ['card'],
      usage:                'off_session',
      metadata:             { marina_id: marinaId },
    })

    return NextResponse.json({ clientSecret: setupIntent.client_secret })
  }

  // ── SAVE PAYMENT METHOD ────────────────────────────────────────────────────
  if (action === 'save-method') {
    const { marinaId, paymentMethodId } = body
    if (!marinaId || !paymentMethodId) {
      return NextResponse.json({ error: 'marinaId and paymentMethodId required' }, { status: 400 })
    }

    // Load marina for customer id
    const mRes = await fetch(
      `${SUPABASE_URL}/rest/v1/marinas?id=eq.${marinaId}&select=id,stripe_customer_id,billing_status&limit=1`,
      { headers: sbHeaders }
    )
    const marinas = await mRes.json()
    if (!Array.isArray(marinas) || marinas.length === 0) {
      return NextResponse.json({ error: 'Marina not found' }, { status: 404 })
    }
    const marina = marinas[0]

    // Attach PM to customer
    if (marina.stripe_customer_id) {
      try {
        await stripe.paymentMethods.attach(paymentMethodId, { customer: marina.stripe_customer_id })
        await stripe.customers.update(marina.stripe_customer_id, {
          invoice_settings: { default_payment_method: paymentMethodId },
        })
      } catch (e: any) {
        // Already attached is fine
        if (!e?.message?.includes('already been attached')) throw e
      }
    }

    // Update marina: save PM, mark active (trial continues, card on file)
    await fetch(`${SUPABASE_URL}/rest/v1/marinas?id=eq.${marinaId}`, {
      method:  'PATCH',
      headers: { ...sbHeaders, Prefer: 'return=minimal' },
      body: JSON.stringify({
        stripe_payment_method_id: paymentMethodId,
        billing_status: marina.billing_status === 'trialing' ? 'trialing' : 'active',
        updated_at: new Date().toISOString(),
      }),
    })

    return NextResponse.json({ ok: true })
  }

  // ── GET NETWORK (all marinas) ──────────────────────────────────────────────
  if (action === 'get-network') {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/marinas?select=id,name,city,state,total_slips,slug,billing_status&order=name.asc`,
      { headers: sbHeaders }
    )
    const marinas = await res.json()
    return NextResponse.json({ marinas: Array.isArray(marinas) ? marinas : [] })
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}

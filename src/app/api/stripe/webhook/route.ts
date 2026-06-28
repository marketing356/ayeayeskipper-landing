import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-06-24.dahlia' as never })
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!
const RESEND_KEY = process.env.RESEND_API_KEY!
const NOTIFY_EMAIL = 'mike@expressdocks.com'
const FROM_EMAIL = 'noreply@ayeayeskipper.com'

async function notify(subject: string, html: string) {
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: FROM_EMAIL, to: [NOTIFY_EMAIL], subject, html }),
    })
  } catch (e) {
    console.error('Resend notify error:', e)
  }
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature') || ''

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, WEBHOOK_SECRET)
  } catch (err) {
    console.error('Webhook signature error:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const marinaName = session.metadata?.marina_name || 'Unknown'
      const tier = session.metadata?.tier || 'unknown'
      const email = session.customer_email || ''

      // Update lead status in Supabase
      if (email) {
        await supabase
          .from('marina_leads')
          .update({ status: 'subscribed' })
          .eq('email', email)
      }

      await notify(
        `🎉 New Skipper subscription: ${marinaName} (${tier.toUpperCase()})`,
        `<h2>New Marina Subscription!</h2>
        <p><strong>Marina:</strong> ${marinaName}</p>
        <p><strong>Tier:</strong> ${tier.toUpperCase()}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Trial ends:</strong> 30 days from today</p>
        <p><strong>Action needed:</strong> Provision their Helm at [slug].ayeayeskipper.com</p>
        <p>Stripe session: ${session.id}</p>`
      )
      break
    }

    case 'customer.subscription.trial_will_end': {
      const sub = event.data.object as Stripe.Subscription
      const marinaName = sub.metadata?.marina_name || 'Unknown marina'
      const tier = sub.metadata?.tier || 'unknown'
      await notify(
        `⚠️ Trial ending in 3 days: ${marinaName}`,
        `<h2>Trial Ending Soon</h2>
        <p><strong>Marina:</strong> ${marinaName}</p>
        <p><strong>Tier:</strong> ${tier.toUpperCase()}</p>
        <p>Their trial ends in 3 days. Stripe will auto-charge if card is on file.</p>`
      )
      break
    }

    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice
      if (invoice.billing_reason === 'subscription_cycle') {
        const amount = ((invoice.amount_paid || 0) / 100).toFixed(2)
        await notify(
          `💳 Payment received: $${amount}`,
          `<h2>Subscription Payment</h2>
          <p><strong>Amount:</strong> $${amount}</p>
          <p><strong>Customer:</strong> ${invoice.customer_email || 'Unknown'}</p>
          <p>Invoice: ${invoice.id}</p>`
        )
      }
      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      await notify(
        `🔴 Payment FAILED: ${invoice.customer_email}`,
        `<h2>Payment Failed</h2>
        <p><strong>Customer:</strong> ${invoice.customer_email || 'Unknown'}</p>
        <p><strong>Amount:</strong> $${((invoice.amount_due || 0) / 100).toFixed(2)}</p>
        <p>Stripe will retry automatically. Invoice: ${invoice.id}</p>`
      )
      break
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      const marinaName = sub.metadata?.marina_name || 'Unknown marina'
      await notify(
        `❌ Subscription cancelled: ${marinaName}`,
        `<h2>Subscription Cancelled</h2>
        <p><strong>Marina:</strong> ${marinaName}</p>
        <p>Their Helm access should be downgraded to read-only.</p>
        <p>Subscription ID: ${sub.id}</p>`
      )
      break
    }

    default:
      break
  }

  return NextResponse.json({ received: true })
}

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-06-24.dahlia' as never })

const PRICE_IDS: Record<string, string> = {
  mate:    'price_1TnJiRJGcpviHQTsppJAsy4U',
  captain: 'price_1TnJiRJGcpviHQTs2UZT7UyX',
  admiral: 'price_1TnJiRJGcpviHQTswP3PVXGz',
}

export async function POST(req: NextRequest) {
  try {
    const { tier, marinaName, email } = await req.json()

    const priceId = PRICE_IDS[tier?.toLowerCase()]
    if (!priceId) {
      return NextResponse.json({ error: 'Invalid tier' }, { status: 400 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ayeayeskipper.com'

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: {
        trial_period_days: 30,
        metadata: {
          marina_name: marinaName || '',
          tier: tier || '',
        },
      },
      customer_email: email || undefined,
      metadata: {
        marina_name: marinaName || '',
        tier: tier || '',
      },
      success_url: `${baseUrl}/welcome?session_id={CHECKOUT_SESSION_ID}&tier=${tier}`,
      cancel_url: `${baseUrl}/pricing`,
      allow_promotion_codes: true,
    })

    return NextResponse.json({ url: session.url })
  } catch (err: unknown) {
    console.error('Stripe checkout error:', err)
    const message = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

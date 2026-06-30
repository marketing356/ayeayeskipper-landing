/**
 * POST /api/marina/auth
 * Marina owner authentication against contacts table (Helm auth doctrine §23).
 * Replaces marina_owner_accounts entirely.
 *
 * Actions:
 *   check        { email }        → { hasPIN, hasAccount }
 *   verify-pin   { email, pin }   → { session, account } or error
 */
import { NextRequest, NextResponse } from 'next/server'
import { createHmac, createHash } from 'crypto'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY!
const SESSION_SECRET = 'skipper-marina-portal-2026'

const sbHeaders = {
  apikey: SERVICE_KEY,
  Authorization: `Bearer ${SERVICE_KEY}`,
  'Content-Type': 'application/json',
}

/** SHA-256 hex of raw PIN digits — matches Helm's contacts.pin_hash format */
function hashPin(pin: string): string {
  return createHash('sha256').update(pin).digest('hex')
}

/** Signed session token: base64(payload).hmac */
function makeSessionToken(data: object): string {
  const payload = Buffer.from(JSON.stringify(data)).toString('base64')
  const sig = createHmac('sha256', SESSION_SECRET).update(payload).digest('hex')
  return `${payload}.${sig}`
}

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { action } = body

  // ── CHECK ──────────────────────────────────────────────────────────────────
  if (action === 'check') {
    const email = (body.email || '').toLowerCase().trim()
    if (!email) return NextResponse.json({ hasPIN: false, hasAccount: false })

    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/contacts?email=eq.${encodeURIComponent(email)}&not.helm_role=is.null&not.marina_id=is.null&deleted_at=is.null&select=id,pin_hash&limit=1`,
      { headers: sbHeaders }
    )
    const rows = await res.json()
    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ hasPIN: false, hasAccount: false })
    }
    return NextResponse.json({
      hasPIN:     !!rows[0].pin_hash,
      hasAccount: true,
    })
  }

  // ── VERIFY PIN ─────────────────────────────────────────────────────────────
  if (action === 'verify-pin') {
    const email = (body.email || '').toLowerCase().trim()
    const pin   = (body.pin || '').replace(/\D/g, '')
    if (!email || pin.length < 4) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 })
    }

    // Load contact (owner-level: has helm_role + marina_id)
    const cRes = await fetch(
      `${SUPABASE_URL}/rest/v1/contacts?email=eq.${encodeURIComponent(email)}&not.helm_role=is.null&not.marina_id=is.null&deleted_at=is.null&select=id,email,first_name,last_name,marina_id,helm_role,pin_hash&limit=1`,
      { headers: sbHeaders }
    )
    const contacts = await cRes.json()
    if (!Array.isArray(contacts) || contacts.length === 0) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 })
    }

    const contact = contacts[0]
    if (!contact.pin_hash) {
      return NextResponse.json({ error: 'PIN not set. Log in through Helm to set your PIN.' }, { status: 403 })
    }

    if (contact.pin_hash !== hashPin(pin)) {
      return NextResponse.json({ error: 'Incorrect PIN' }, { status: 401 })
    }

    // Load marina (name, slug, plan_tier, billing_status, trial_ends_at)
    const mRes = await fetch(
      `${SUPABASE_URL}/rest/v1/marinas?id=eq.${contact.marina_id}&select=id,name,slug,total_slips,plan_tier,billing_status,trial_starts_at,trial_ends_at,stripe_payment_method_id&limit=1`,
      { headers: sbHeaders }
    )
    const marinas = await mRes.json()
    if (!Array.isArray(marinas) || marinas.length === 0) {
      return NextResponse.json({ error: 'Marina not found' }, { status: 404 })
    }
    const marina = marinas[0]

    const sessionToken = makeSessionToken({
      contactId: contact.id,
      marinaId:  marina.id,
      email:     contact.email,
      role:      contact.helm_role,
      exp:       Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    })

    return NextResponse.json({
      ok: true,
      session: sessionToken,
      account: {
        email:              contact.email,
        firstName:          contact.first_name,
        lastName:           contact.last_name,
        contactId:          contact.id,
        marinaId:           marina.id,
        marinaName:         marina.name,
        marinaSlug:         marina.slug,
        totalSlips:         marina.total_slips,
        planTier:           marina.plan_tier,
        billingStatus:      marina.billing_status,
        trialStartsAt:      marina.trial_starts_at,
        trialEndsAt:        marina.trial_ends_at,
        hasPaymentMethod:   !!marina.stripe_payment_method_id,
      },
    })
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}

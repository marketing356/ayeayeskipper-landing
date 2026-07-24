import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

// Auth lookup only — exempt from §37 (surface-specific auth)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

const ENGINE_URL = process.env.SKIPPER_ENGINE_URL || 'https://skipper-engine-production.up.railway.app'
const ENGINE_KEY = process.env.SKIPPER_DATA_API_KEY || ''

// ── GET /api/boaters/messages?email=...&marina_id=... ─────────────────────────
// §37: auth lookup stays local (exempt), then proxies to Railway for message data
export async function GET(req: NextRequest) {
  const email    = req.nextUrl.searchParams.get('email')?.toLowerCase().trim()
  const marinaId = req.nextUrl.searchParams.get('marina_id')
  if (!email || !marinaId) return NextResponse.json({ error: 'email and marina_id required' }, { status: 400 })

  // Auth lookup (surface-specific — exempt from §37)
  const { data: contact } = await supabase
    .from('contacts')
    .select('auth_user_id')
    .eq('email', email)
    .eq('marina_id', marinaId)
    .maybeSingle()

  if (!contact?.auth_user_id) return NextResponse.json({ messages: [] })

  // §37 proxy: fetch messages from Railway
  const res = await fetch(`${ENGINE_URL}/api/v1/boater/messages`, {
    headers: {
      'Content-Type': 'application/json',
      'x-skipper-api-key': ENGINE_KEY,
      'X-Boater-Auth': contact.auth_user_id,
    },
  })
  const data = await res.json()
  return NextResponse.json({ messages: data.messages ?? [] }, { status: res.status })
}

// ── POST /api/boaters/messages ────────────────────────────────────────────────
// Sends a boater message to the Skipper engine (already calls Railway /chat)
export async function POST(req: NextRequest) {
  const { email, marina_id, body, history = [] } = await req.json()
  if (!email || !marina_id || !body) {
    return NextResponse.json({ error: 'email, marina_id, and body required' }, { status: 400 })
  }

  const normalEmail = email.toLowerCase().trim()

  const { data: contact } = await supabase
    .from('contacts')
    .select('id, auth_user_id, first_name, last_name')
    .eq('email', normalEmail)
    .eq('marina_id', marina_id)
    .maybeSingle()

  if (!contact?.auth_user_id) {
    return NextResponse.json({ error: 'No marina connection found for this email' }, { status: 404 })
  }

  const engineBody = {
    message: body,
    conversation_history: history,
    session: {
      marina_id,
      tenant_id:   contact.auth_user_id,
      boater_id:   contact.auth_user_id,
      access_type: 'tenant',
    },
    identity: {
      auth_user_id: contact.auth_user_id,
      contact_id:   contact.id,
      first_name:   contact.first_name ?? null,
      last_name:    contact.last_name  ?? null,
      email:        normalEmail,
    },
  }

  try {
    const engineRes = await fetch(`${ENGINE_URL}/chat`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(engineBody),
      signal:  AbortSignal.timeout(20000),
    })
    if (!engineRes.ok) return NextResponse.json({ error: 'Engine error' }, { status: 502 })
    const { reply } = await engineRes.json()
    return NextResponse.json({ reply: reply ?? '' })
  } catch {
    return NextResponse.json({ error: 'Engine unavailable' }, { status: 503 })
  }
}

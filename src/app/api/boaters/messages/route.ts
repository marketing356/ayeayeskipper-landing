import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

const ENGINE_URL = process.env.SKIPPER_ENGINE_URL

// ── GET /api/boaters/messages?email=...&marina_id=... ─────────────────────────
// Fetches the message thread between this boater and the marina.
// Messages are written by the Skipper engine (log_conversation) — we only read here.
export async function GET(req: NextRequest) {
  const email    = req.nextUrl.searchParams.get('email')?.toLowerCase().trim()
  const marinaId = req.nextUrl.searchParams.get('marina_id')
  if (!email || !marinaId) return NextResponse.json({ error: 'email and marina_id required' }, { status: 400 })

  const { data: contact } = await supabase
    .from('contacts')
    .select('auth_user_id')
    .eq('email', email)
    .eq('marina_id', marinaId)
    .maybeSingle()

  if (!contact?.auth_user_id) return NextResponse.json({ messages: [] })

  const { data: messages } = await supabase
    .from('messages')
    .select('id, direction, sender_type, sender_name, body, created_at, channel')
    .eq('marina_id', marinaId)
    .eq('tenant_id', contact.auth_user_id)
    .order('created_at', { ascending: true })
    .limit(100)

  return NextResponse.json({ messages: messages ?? [] })
}

// ── POST /api/boaters/messages ────────────────────────────────────────────────
// Sends a boater message to the Skipper engine.
// Engine handles: AI response + writing BOTH messages (inbound + reply) to messages table.
// Helm inbox reads from messages table — so this shows up on Helm automatically.
//
// Body: { email, marina_id, body, history? }
export async function POST(req: NextRequest) {
  const { email, marina_id, body, history = [] } = await req.json()
  if (!email || !marina_id || !body) {
    return NextResponse.json({ error: 'email, marina_id, and body required' }, { status: 400 })
  }

  const normalEmail = email.toLowerCase().trim()

  // Look up the boater's contacts row for this marina
  const { data: contact } = await supabase
    .from('contacts')
    .select('id, auth_user_id, first_name, last_name')
    .eq('email', normalEmail)
    .eq('marina_id', marina_id)
    .maybeSingle()

  if (!contact?.auth_user_id) {
    return NextResponse.json({ error: 'No marina connection found for this email' }, { status: 404 })
  }

  if (!ENGINE_URL) {
    // No engine configured — write directly and return a placeholder reply
    const senderName = [contact.first_name, contact.last_name].filter(Boolean).join(' ') || normalEmail.split('@')[0]
    await supabase.from('messages').insert({
      marina_id,
      tenant_id:   contact.auth_user_id,
      direction:   'inbound',
      sender_type: 'boater',
      channel:     'web',
      sender_name: senderName,
      body,
    })
    return NextResponse.json({ reply: "Message received. The marina team will respond shortly." })
  }

  // Call the Skipper engine with full boater session context
  // Engine will: process the message, generate a reply, and write both messages to DB
  const engineBody = {
    message: body,
    conversation_history: history,
    session: {
      marina_id,
      tenant_id:   contact.auth_user_id,   // used by engine for Helm inbox logging
      boater_id:   contact.auth_user_id,   // used by engine for tool access (vessels, logs, etc.)
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

    if (!engineRes.ok) {
      const err = await engineRes.text()
      console.error('[boaters/messages] engine error:', err)
      return NextResponse.json({ error: 'Engine error' }, { status: 502 })
    }

    const { reply } = await engineRes.json()
    return NextResponse.json({ reply: reply ?? '' })

  } catch (err) {
    console.error('[boaters/messages] engine fetch error:', err)
    return NextResponse.json({ error: 'Engine unavailable' }, { status: 503 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

// GET /api/boaters/messages?email=...&marina_id=...
// Returns the message thread between this boater and the marina.
export async function GET(req: NextRequest) {
  const email    = req.nextUrl.searchParams.get('email')?.toLowerCase().trim()
  const marinaId = req.nextUrl.searchParams.get('marina_id')
  if (!email || !marinaId) return NextResponse.json({ error: 'email and marina_id required' }, { status: 400 })

  // Get this boater's contacts row for this marina (to get auth_user_id = tenant_id)
  const { data: contact } = await supabase
    .from('contacts')
    .select('auth_user_id')
    .eq('email', email)
    .eq('marina_id', marinaId)
    .maybeSingle()

  if (!contact?.auth_user_id) {
    return NextResponse.json({ messages: [] })
  }

  const { data: messages } = await supabase
    .from('messages')
    .select('id, direction, sender_type, sender_name, body, created_at, channel')
    .eq('marina_id', marinaId)
    .eq('tenant_id', contact.auth_user_id)
    .order('created_at', { ascending: true })
    .limit(100)

  return NextResponse.json({ messages: messages ?? [] })
}

// POST /api/boaters/messages
// Body: { email, marina_id, body }
// Inserts an inbound message from the boater → shows in Helm inbox.
// Also forwards to the Skipper engine for an AI response if engine URL is set.
export async function POST(req: NextRequest) {
  const { email, marina_id, body } = await req.json()
  if (!email || !marina_id || !body) {
    return NextResponse.json({ error: 'email, marina_id, and body required' }, { status: 400 })
  }

  const normalEmail = email.toLowerCase().trim()

  // Get boater's contact row for this marina
  const { data: contact } = await supabase
    .from('contacts')
    .select('id, auth_user_id, first_name, last_name')
    .eq('email', normalEmail)
    .eq('marina_id', marina_id)
    .maybeSingle()

  if (!contact?.auth_user_id) {
    return NextResponse.json({ error: 'No marina connection found for this email' }, { status: 404 })
  }

  const senderName = [contact.first_name, contact.last_name].filter(Boolean).join(' ') || normalEmail.split('@')[0]

  // Insert inbound message (boater → marina)
  const { data: msg, error } = await supabase
    .from('messages')
    .insert({
      marina_id,
      tenant_id:   contact.auth_user_id,
      direction:   'inbound',
      sender_type: 'boater',
      channel:     'web',
      sender_name: senderName,
      body,
    })
    .select('id, created_at')
    .single()

  if (error) {
    console.error('[boaters/messages POST] insert error:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }

  // Forward to Skipper engine for AI reply (non-blocking)
  const engineUrl = process.env.SKIPPER_ENGINE_URL
  if (engineUrl) {
    // Get marina name for context
    const { data: marina } = await supabase
      .from('marinas')
      .select('name')
      .eq('id', marina_id)
      .maybeSingle()

    fetch(`${engineUrl}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        marina_id,
        tenant_id: contact.auth_user_id,
        message: body,
        channel: 'web',
        sender_name: senderName,
        marina_name: marina?.name ?? 'Marina',
        mode: 'boater',
      }),
    }).catch(() => {})
  }

  return NextResponse.json({ ok: true, message_id: msg.id })
}

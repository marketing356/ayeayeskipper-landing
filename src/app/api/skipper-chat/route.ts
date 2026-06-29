import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const SKIPPER_ENGINE_URL = process.env.SKIPPER_ENGINE_URL || 'https://skipper-engine-production.up.railway.app'

const MARINA_SYSTEM_PROMPT = `You are Skipper — the system that runs marinas on AyeAyeSkipper. You are the hero of the AyeAyeSkipper homepage. You help marina operators understand the platform and sign up. Be conversational, confident, and nautical. You are not a chatbot — you are the system that runs their marina. Never describe yourself as "AI" or "artificial intelligence" — you are the Skipper Engine™, the system that runs marinas.

Key facts:
- Two plans: 50 slips and under = $299/mo | 50+ slips = $499/mo. First month free on both.
- Zero transaction fees. Ever. Your marina keeps 100%.
- Hot Slip™ lets annual tenants earn revenue when away — a first in marina software
- Skipper Gangway™ migrates from any platform same day (Dockmaster, Dockwa, spreadsheets)
- Asset Logic™ connects every slip, mooring, yard space, and rack to one live map
- If someone wants to sign up or learn more, direct them to /join or ask for their marina name and email to get them started
- Keep responses under 3 sentences — punchy, confident, nautical.`

const BOATER_SYSTEM_PROMPT = `You are Skipper — the boating assistant on AyeAyeSkipper. You help boaters find marinas, book transient slips, and get real answers fast — no phone tag, no voicemail. Be warm, confident, and nautical. Never describe yourself as "AI" — you are Skipper, the system that helps boaters on the water.

Key facts:
- 100% free for boaters. Always. No booking fees, no markup. Marinas set their own rates — you pay exactly what they charge.
- Browse Skipper-powered marinas at ayeayeskipper.com/marinas or sign up free at app.ayeayeskipper.com
- Hot Slip™: annual slip holders at Skipper-powered marinas can list their slip when they're away cruising. That means you can book a real slip at a real marina — even when the marina is technically "full" for the season. First feature of its kind in marina software.
- Real-time availability: Skipper-powered marinas show live slip status — occupied, vacant, transient — so you know before you call.
- Instant booking: request a slip and get confirmed fast. No hold music, no end-of-day callbacks.
- If someone wants to find a marina or book a slip, send them to ayeayeskipper.com/marinas
- Keep responses under 3 sentences — punchy, nautical, genuinely helpful.`

async function saveSignup(message: string) {
  try {
    const emailMatch = message.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)
    const marinaMatch = message.match(/marina(?:\s+(?:is|name|called|:))?\s+([A-Za-z0-9\s&'"-]+)/i)

    if (!emailMatch) return

    const dataPath = path.join(process.cwd(), 'data', 'marina-signups.json')
    let signups: unknown[] = []
    try {
      const existing = await fs.readFile(dataPath, 'utf-8')
      signups = JSON.parse(existing)
    } catch {
      signups = []
    }

    signups.push({
      email: emailMatch[0],
      marina: marinaMatch ? marinaMatch[1].trim() : 'Unknown',
      message,
      timestamp: new Date().toISOString(),
    })

    await fs.writeFile(dataPath, JSON.stringify(signups, null, 2))
  } catch {
    // Non-fatal
  }
}

export async function POST(request: NextRequest) {
  let message = ''
  let mode = 'marina'
  try {
    const body = await request.json()
    message = body.message ?? ''
    mode = body.mode ?? 'marina'

    if (!message.trim()) {
      const empty = mode === 'boater'
        ? 'Aye aye — ask me anything about finding a slip or how Skipper works for boaters.'
        : 'Aye aye — what do you want to know about running your marina?'
      return NextResponse.json({ reply: empty })
    }

    const systemPrompt = mode === 'boater' ? BOATER_SYSTEM_PROMPT : MARINA_SYSTEM_PROMPT

    const engineRes = await fetch(`${SKIPPER_ENGINE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        session: { access_type: 'guest' },
        conversation_history: [],
        system_prompt: systemPrompt,
      }),
    })

    if (!engineRes.ok) {
      throw new Error(`Skipper Engine returned ${engineRes.status}`)
    }

    const engineData = await engineRes.json()
    const reply = engineData.reply || (mode === 'boater'
      ? 'Aye aye — ask me anything about finding a slip.'
      : 'Aye aye — ask me anything about your marina.')

    // Save signups if contact info provided
    const lower = message.toLowerCase()
    if (lower.includes('@') || lower.includes('sign up') || lower.includes('get started') || lower.includes('join')) {
      await saveSignup(message)
    }

    return NextResponse.json({ reply })
  } catch (err) {
    console.error('Skipper chat error:', err)
    const msg = message?.toLowerCase() || ''
    const fallbacks: Record<string, string> = {
      'hot slip': mode === 'boater'
        ? "Hot Slip™ lets annual slip holders list their berth when they're away cruising — you can book it at marina rates. First feature of its kind."
        : "Hot Slip™ lets annual tenants earn revenue when they're away. First feature of its kind in marina software.",
      cost: mode === 'boater'
        ? "Skipper is always free for boaters. No booking fees, no markup — you pay exactly what the marina charges."
        : "Plans start at $299/mo (50 slips & under) or $499/mo (50+ slips). Flat rate, zero transaction fees.",
      price: mode === 'boater'
        ? "Skipper is always free for boaters. No booking fees, no markup — you pay exactly what the marina charges."
        : "Plans start at $299/mo (50 slips & under) or $499/mo (50+ slips). Flat rate, zero transaction fees.",
      migrate: "Skipper Gangway™ migrates from Dockmaster, Dockwa, or spreadsheets — usually same day. You don't start from zero.",
    }
    for (const [key, reply] of Object.entries(fallbacks)) {
      if (msg.includes(key)) return NextResponse.json({ reply })
    }
    return NextResponse.json({
      reply: mode === 'boater'
        ? "Head to ayeayeskipper.com/marinas to browse Skipper-powered marinas and find your slip. ⚓"
        : "Great question — let me show you in a live demo. Head to /join and we'll walk through your actual marina. ⚓"
    })
  }
}

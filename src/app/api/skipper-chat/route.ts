import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import fs from 'fs/promises'
import path from 'path'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM_PROMPT = `You are Skipper — the system that runs marinas on AyeAyeSkipper. You are the hero of the AyeAyeSkipper homepage. You help marina operators understand the platform and sign up. Be conversational, confident, and nautical. You are not a chatbot — you are the system that runs their marina. Never describe yourself as "AI" or "artificial intelligence" — you are the Skipper Engine™, the system that runs marinas.

Key facts:
- Two plans: 50 slips and under = $299/mo | 50+ slips = $499/mo. First month free on both.
- Zero transaction fees. Ever. Your marina keeps 100%.
- Hot Slip™ lets annual tenants earn revenue when away — a first in marina software
- Skipper Gangway™ migrates from any platform same day (Dockmaster, Dockwa, spreadsheets)
- Asset Logic™ connects every slip, mooring, yard space, and rack to one live map
- If someone wants to sign up or learn more, direct them to /join or ask for their marina name and email to get them started
- Keep responses under 3 sentences — punchy, confident, nautical.`

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
  try {
    const { message } = await request.json()
    
    if (!message?.trim()) {
      return NextResponse.json({ reply: 'Aye aye — what do you want to know about running your marina?' })
    }

    const response = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 300,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: message }],
    })

    const reply = response.content[0].type === 'text' ? response.content[0].text : 'Aye aye — ask me anything about your marina.'

    // Save to signups if they provided contact info
    const lower = message.toLowerCase()
    if (lower.includes('@') || lower.includes('sign up') || lower.includes('get started') || lower.includes('join')) {
      await saveSignup(message)
    }

    return NextResponse.json({ reply })
  } catch (err) {
    console.error('Skipper chat error:', err)
    // Fallback replies for when API is unavailable
    const msg = (await request.text().catch(() => '')).toLowerCase()
    const fallbacks: Record<string, string> = {
      cost: "Plans start at $99/mo — flat rate, zero transaction fees. You keep 100% of what your marina earns.",
      price: "Plans start at $99/mo — flat rate, zero transaction fees. You keep 100% of what your marina earns.",
      migrate: "Skipper Gangway™ migrates from Dockmaster, Dockwa, or spreadsheets — usually same day. You don't start from zero.",
      'hot slip': "Hot Slip™ lets annual tenants earn revenue when they're away. First feature of its kind in marina software.",
    }
    for (const [key, reply] of Object.entries(fallbacks)) {
      if (msg.includes(key)) return NextResponse.json({ reply })
    }
    return NextResponse.json({ reply: "Great question — let me show you in a live demo. Head to /join and we'll walk through your actual marina. ⚓" })
  }
}

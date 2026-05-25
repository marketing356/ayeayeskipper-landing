import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const SIGNUPS_FILE = path.join(DATA_DIR, 'marina-signups.json')

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Ensure data directory exists
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }

    const entry = {
      ...body,
      timestamp: new Date().toISOString(),
    }

    // Append as JSON line
    fs.appendFileSync(SIGNUPS_FILE, JSON.stringify(entry) + '\n', 'utf8')

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Error saving marina signup:', err)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

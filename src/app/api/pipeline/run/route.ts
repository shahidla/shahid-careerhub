import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://shahid-careerhub.vercel.app'
const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID

async function run() {
  const fetchRes = await fetch(`${BASE_URL}/api/fetch-jobs`, { method: 'GET' })
  if (!fetchRes.ok) return { error: 'fetch-jobs failed' }
  const fetchData = await fetchRes.json()
  const fetched: number = fetchData.totalNew ?? 0

  let scored = 0
  while (true) {
    const scoreRes = await fetch(`${BASE_URL}/api/score-batch`, { method: 'POST' })
    if (!scoreRes.ok) break
    const scoreData = await scoreRes.json()
    scored += scoreData.scored ?? 0
    if ((scoreData.remaining ?? 0) <= 0) break
  }

  return { fetched, scored }
}

async function notifyTelegram(fetched: number, scored: number) {
  if (!TELEGRAM_TOKEN || !TELEGRAM_CHAT_ID) return
  await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: `🤖 *Daily pipeline complete*\nFetched: ${fetched} · Scored: ${scored}\nUse /top to see high\\-match jobs`,
      parse_mode: 'Markdown',
    }),
  }).catch(() => {})
}

// POST — called from dashboard FetchButton
export async function POST() {
  const result = await run()
  if ('error' in result) return NextResponse.json(result, { status: 500 })
  return NextResponse.json(result)
}

// GET — called from Vercel cron (crons only support GET)
export async function GET() {
  const result = await run()
  if ('error' in result) return NextResponse.json(result, { status: 500 })
  await notifyTelegram(result.fetched, result.scored)
  return NextResponse.json(result)
}

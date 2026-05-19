import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://shahid-careerhub.vercel.app'
const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

type Job = {
  title: string
  company: string
  location: string
  url: string
  match_score: number | null
  match_reasoning: string | null
  source: string
}

async function getTopJobs(): Promise<Job[]> {
  if (!SUPABASE_URL || !SUPABASE_KEY) return []
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/jobs?select=title,company,location,url,match_score,match_reasoning,source&match_score=gte.60&status=eq.new&order=match_score.desc&limit=10`,
    { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
  )
  if (!res.ok) return []
  return res.json()
}

async function run() {
  const fetchRes = await fetch(`${BASE_URL}/api/fetch-jobs`, { method: 'GET' })
  if (!fetchRes.ok) return { error: 'fetch-jobs failed' }
  const fetchData = await fetchRes.json()
  const fetched: number = fetchData.totalNew ?? 0

  let scored = 0
  let scoreError = ''
  let model = ''
  let patchErrors = 0
  while (true) {
    const scoreRes = await fetch(`${BASE_URL}/api/score-batch`, { method: 'POST' })
    if (!scoreRes.ok) {
      const errBody = await scoreRes.text().catch(() => 'unknown error')
      scoreError = errBody
      break
    }
    const scoreData = await scoreRes.json()
    scored += scoreData.scored ?? 0
    patchErrors += scoreData.patchErrors ?? 0
    if (scoreData.model) model = scoreData.model
    if ((scoreData.remaining ?? 0) <= 0) break
  }

  return { fetched, scored, model, scoreError: scoreError || undefined, patchErrors: patchErrors || undefined }
}

async function notifyTelegram(fetched: number, scored: number) {
  if (!TELEGRAM_TOKEN || !TELEGRAM_CHAT_ID) return

  const jobs = await getTopJobs()

  let text = `🤖 *Daily pipeline complete*\nFetched: ${fetched} · Scored: ${scored}\n`

  if (jobs.length === 0) {
    text += `\nNo high\\-match jobs today \\(score ≥ 60\\)\\.`
  } else {
    text += `\n*Top ${jobs.length} high\\-match jobs:*\n`
    jobs.forEach((job, i) => {
      const score = job.match_score ?? 0
      const company = (job.company ?? '').replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&')
      const title = (job.title ?? '').replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&')
      const reasoning = job.match_reasoning
        ? `\n   _${job.match_reasoning.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&').slice(0, 120)}_`
        : ''
      text += `\n${i + 1}\\. [${title}](${job.url}) — *${score}*\n   ${company}${reasoning}\n`
    })
    text += `\n[View dashboard](https://shahid\\-careerhub\\.vercel\\.app/dashboard)`
  }

  await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text,
      parse_mode: 'MarkdownV2',
      disable_web_page_preview: true,
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

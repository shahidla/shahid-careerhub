import { NextRequest, NextResponse } from 'next/server'
import { getInternalAuthHeaders } from '@/lib/access'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const TOKEN = process.env.TELEGRAM_BOT_TOKEN!
const CHAT_ID = process.env.TELEGRAM_CHAT_ID!
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://shahid-careerhub.vercel.app'
const WEBHOOK_SECRET = process.env.TELEGRAM_WEBHOOK_SECRET

async function sendMessage(text: string) {
  const res = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ chat_id: CHAT_ID, text }),
  })

  if (!res.ok) {
    console.error('Telegram sendMessage failed:', await res.text())
  }
}

async function getCount(table: string, filter = ''): Promise<number> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${filter}&select=id`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      Prefer: 'count=exact',
      Range: '0-0',
    },
  })

  return parseInt(res.headers.get('content-range')?.split('/')[1] ?? '0', 10)
}

async function handleRun(): Promise<string> {
  const res = await fetch(`${BASE_URL}/api/pipeline/run`, {
    method: 'POST',
    headers: getInternalAuthHeaders(),
  })

  if (!res.ok) {
    const errText = await res.text().catch(() => 'unknown')
    return `Pipeline failed (HTTP ${res.status})\n${errText.slice(0, 300)}`
  }

  const data = await res.json()
  if ('error' in data) {
    return `Pipeline failed: ${String(data.error).slice(0, 300)}`
  }

  const lines = [
    'Pipeline complete',
    `Fetched: ${data.fetched ?? 0}`,
    `Scored: ${data.scored ?? 0}`,
  ]

  if (data.model) lines.push(`Model: ${data.model}`)
  if (data.scoreError) lines.push(`Score error: ${String(data.scoreError).slice(0, 200)}`)
  if (data.patchErrors) lines.push(`Patch failures: ${data.patchErrors}`)

  const topRes = await fetch(
    `${SUPABASE_URL}/rest/v1/jobs?match_score=gte.60&status=eq.new&select=title,company,match_score,url&order=match_score.desc&limit=5`,
    { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } },
  )
  if (!topRes.ok) return lines.join('\n')

  const topJobs = await topRes.json()
  if (topJobs.length === 0) {
    return `${lines.join('\n')}\n\nNo jobs scoring >= 60`
  }

  const jobLines = topJobs.map(
    (job: { title: string; company: string; match_score: number; url: string }, index: number) =>
      `${index + 1}. ${job.title} - ${job.company}\n   Score: ${job.match_score}\n   ${job.url}`,
  )

  return `${lines.join('\n')}\n\nTop Jobs\n\n${jobLines.join('\n\n')}`
}

async function handleStats(): Promise<string> {
  const [total, newJobs, saved, applied, ignored, unscored, high, medium, low, chunks] =
    await Promise.all([
      getCount('jobs'),
      getCount('jobs', 'status=eq.new'),
      getCount('jobs', 'status=eq.saved'),
      getCount('jobs', 'status=eq.applied'),
      getCount('jobs', 'status=eq.ignored'),
      getCount('jobs', 'match_score=is.null'),
      getCount('jobs', 'match_score=gte.75'),
      getCount('jobs', 'match_score=gte.50&match_score=lt.75'),
      getCount('jobs', 'match_score=lt.50&match_score=not.is.null'),
      getCount('resume_chunks'),
    ])

  return [
    'Job Stats',
    `Total: ${total} | Scored: ${total - unscored} | Unscored: ${unscored}`,
    '',
    `By Status: New ${newJobs} | Saved ${saved} | Applied ${applied} | Ignored ${ignored}`,
    `Scores: High ${high} | Medium ${medium} | Low ${low}`,
    `Resume chunks: ${chunks}`,
  ].join('\n')
}

async function handleTop(): Promise<string> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/jobs?match_score=gte.75&status=eq.new&select=title,company,location,match_score,url&order=match_score.desc&limit=5`,
    { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } },
  )
  if (!res.ok) return 'Failed to fetch top jobs'

  const jobs = await res.json()
  if (jobs.length === 0) return 'No high-match new jobs right now'

  const lines = jobs.map(
    (job: { title: string; company: string; location: string; match_score: number; url: string }, index: number) =>
      `${index + 1}. ${job.title} - ${job.company}${job.location ? ` - ${job.location}` : ''}\n   Score: ${job.match_score}\n   ${job.url}`,
  )

  return `Top Jobs (score >= 75)\n\n${lines.join('\n\n')}`
}

async function handleJobs(limit: number, title: string): Promise<string> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/jobs?select=title,company,match_score,status,fetched_at&order=fetched_at.desc&limit=${limit}`,
    { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } },
  )
  if (!res.ok) return 'Failed to fetch jobs'

  const jobs = await res.json()
  if (jobs.length === 0) return 'No jobs in database'

  const lines = jobs.map(
    (job: { title: string; company: string; match_score: number | null; status: string }, index: number) =>
      `${index + 1}. ${job.title} - ${job.company}\n   Score: ${job.match_score ?? '-'} | ${job.status}`,
  )

  return `${title}\n\n${lines.join('\n\n')}`
}

async function handleRescore(): Promise<string> {
  const res = await fetch(`${BASE_URL}/api/rescore-jobs`, {
    method: 'POST',
    headers: getInternalAuthHeaders(),
  })
  if (!res.ok) return 'Rescore failed'

  const data = await res.json()
  return `Reset ${data.reset ?? 0} job scores. Run /run to score them again.`
}

const HELP = [
  'AI Career Hub Bot',
  '',
  '/run - fetch new jobs and score them',
  '/stats - job pipeline stats',
  '/top - top 5 high-match jobs',
  '/jobs - last 10 fetched jobs',
  '/all - latest 25 jobs by date',
  '/rescore - reset all scores',
  '/help - this message',
].join('\n')

export async function POST(request: NextRequest) {
  if (WEBHOOK_SECRET) {
    const secretHeader = request.headers.get('x-telegram-bot-api-secret-token')
    if (secretHeader !== WEBHOOK_SECRET) {
      return NextResponse.json({ ok: false }, { status: 401 })
    }
  }

  const update = await request.json()
  const message = update?.message
  if (!message) return NextResponse.json({ ok: true })

  if (String(message.chat?.id) !== CHAT_ID) {
    return NextResponse.json({ ok: true })
  }

  const text: string = message.text ?? ''
  const command = text.split(' ')[0].toLowerCase()

  let reply: string
  switch (command) {
    case '/run':
      reply = await handleRun()
      break
    case '/stats':
      reply = await handleStats()
      break
    case '/top':
      reply = await handleTop()
      break
    case '/jobs':
      reply = await handleJobs(10, 'Recent Jobs')
      break
    case '/all':
      reply = await handleJobs(25, 'All Jobs')
      break
    case '/rescore':
      reply = await handleRescore()
      break
    case '/help':
    default:
      reply = HELP
      break
  }

  await sendMessage(reply)
  return NextResponse.json({ ok: true })
}

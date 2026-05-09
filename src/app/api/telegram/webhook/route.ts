import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const TOKEN = process.env.TELEGRAM_BOT_TOKEN!
const CHAT_ID = process.env.TELEGRAM_CHAT_ID!
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://shahid-careerhub.vercel.app'

async function sendMessage(text: string) {
  const res = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: 'Markdown' }),
  })
  if (!res.ok) console.error('Telegram sendMessage failed:', await res.text())
}

function esc(s: string): string {
  return s.replace(/[_*`[]/g, '\\$&')
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
  return parseInt(res.headers.get('content-range')?.split('/')[1] ?? '0')
}

async function handleRun(): Promise<string> {
  const res = await fetch(`${BASE_URL}/api/pipeline/run`, { method: 'POST' })
  if (!res.ok) return '❌ Pipeline failed'
  const data = await res.json()
  const modelLine = data.model ? `\nModel: ${data.model}` : ''
  const errorLine = data.scoreError ? `\n⚠️ Score error: ${String(data.scoreError).slice(0, 200)}` : ''
  return `✅ *Pipeline complete*\nFetched: ${data.fetched ?? 0}\nScored: ${data.scored ?? 0}${modelLine}${errorLine}`
}

async function handleStats(): Promise<string> {
  const [total, newJ, saved, applied, ignored, unscored, high, med, low, chunks] = await Promise.all([
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
  return `📊 *Job Stats*
Total: ${total} | Scored: ${total - unscored} | Unscored: ${unscored}

*By Status*
New: ${newJ} · Saved: ${saved} · Applied: ${applied} · Ignored: ${ignored}

*Score Distribution*
High ≥75: ${high} · Medium 50–74: ${med} · Low <50: ${low}

*Resume chunks:* ${chunks}`
}

async function handleTop(): Promise<string> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/jobs?match_score=gte.75&status=eq.new&select=title,company,location,match_score,url&order=match_score.desc&limit=5`,
    { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
  )
  if (!res.ok) return '❌ Failed to fetch top jobs'
  const jobs = await res.json()
  if (jobs.length === 0) return '📭 No high-match new jobs right now'
  const lines = jobs.map((j: { title: string; company: string; location: string; match_score: number; url: string }, i: number) =>
    `${i + 1}. *${esc(j.title)}* — ${esc(j.company)}${j.location ? ` · ${esc(j.location)}` : ''}\n   Score: ${j.match_score} | [View](${j.url})`
  )
  return `🏆 *Top Jobs (score ≥ 75)*\n\n${lines.join('\n\n')}`
}

async function handleJobs(): Promise<string> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/jobs?select=title,company,match_score,status,fetched_at&order=fetched_at.desc&limit=10`,
    { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
  )
  if (!res.ok) return '❌ Failed to fetch jobs'
  const jobs = await res.json()
  if (jobs.length === 0) return '📭 No jobs in database'
  const lines = jobs.map((j: { title: string; company: string; match_score: number | null; status: string }, i: number) =>
    `${i + 1}. *${esc(j.title)}* — ${esc(j.company)}\n   Score: ${j.match_score ?? '—'} | ${j.status}`
  )
  return `📋 *Recent Jobs*\n\n${lines.join('\n\n')}`
}

async function handleRescore(): Promise<string> {
  const res = await fetch(`${BASE_URL}/api/rescore-jobs`, { method: 'POST' })
  if (!res.ok) return '❌ Rescore failed'
  const data = await res.json()
  return `🔄 Reset ${data.reset ?? 0} job scores — run /run to rescore`
}

const HELP = `*AI Career Hub Bot*

/run — fetch new jobs + score them
/stats — job pipeline stats
/top — top 5 high-match jobs (score ≥ 75)
/jobs — last 10 fetched jobs
/rescore — reset all scores (then use /run)
/help — this message`

export async function POST(req: NextRequest) {
  const update = await req.json()
  const msg = update?.message
  if (!msg) return NextResponse.json({ ok: true })

  // Only respond to your own chat
  if (String(msg.chat?.id) !== CHAT_ID) return NextResponse.json({ ok: true })

  const text: string = msg.text ?? ''
  const command = text.split(' ')[0].toLowerCase()

  let reply: string
  switch (command) {
    case '/run':    reply = await handleRun(); break
    case '/stats':  reply = await handleStats(); break
    case '/top':    reply = await handleTop(); break
    case '/jobs':   reply = await handleJobs(); break
    case '/rescore': reply = await handleRescore(); break
    case '/help':
    default:        reply = HELP
  }

  await sendMessage(reply)
  return NextResponse.json({ ok: true })
}

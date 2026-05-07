import { NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY
const OPENAI_KEY = process.env.OPENAI_API_KEY

type RawJob = {
  source: string
  source_id: string
  title: string
  company: string
  location: string
  description: string
  url: string
  posted_at: string | null
  tags: string[]
}

// ─── RSS Sources ──────────────────────────────────────────────────────────────

const RSS_SOURCES = [
  {
    name: 'remotive',
    url: 'https://remotive.com/remote-jobs/feed',
  },
  {
    name: 'sapcontractors',
    url: 'https://www.sapcontractors.com/rss',
  },
]

// ─── XML parser (no dependencies) ────────────────────────────────────────────

function extractTag(xml: string, tag: string): string {
  const cdataMatch = xml.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[(.*?)\\]\\]><\\/${tag}>`, 's'))
  if (cdataMatch) return cdataMatch[1].trim()
  const match = xml.match(new RegExp(`<${tag}[^>]*>(.*?)<\\/${tag}>`, 's'))
  return match ? match[1].replace(/<[^>]+>/g, '').trim() : ''
}

function extractAttr(xml: string, tag: string, attr: string): string {
  const match = xml.match(new RegExp(`<${tag}[^>]*${attr}="([^"]*)"`, 'i'))
  return match ? match[1].trim() : ''
}

function parseItems(xml: string): string[] {
  const items: string[] = []
  const regex = /<item>([\s\S]*?)<\/item>/g
  let m
  while ((m = regex.exec(xml)) !== null) items.push(m[1])
  return items
}

function parseGuid(item: string): string {
  const cdataMatch = item.match(/<guid[^>]*><!\[CDATA\[([\s\S]*?)\]\]><\/guid>/)
  if (cdataMatch) return cdataMatch[1].trim()
  const match = item.match(/<guid[^>]*>([\s\S]*?)<\/guid>/)
  return match ? match[1].trim() : ''
}

function parseDate(raw: string): string | null {
  if (!raw) return null
  try {
    return new Date(raw).toISOString()
  } catch {
    return null
  }
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

// ─── Fetch + parse one RSS feed ───────────────────────────────────────────────

async function fetchRSS(source: { name: string; url: string }): Promise<RawJob[]> {
  const res = await fetch(source.url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; JobBot/1.0)' },
    signal: AbortSignal.timeout(10000),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const xml = await res.text()
  const items = parseItems(xml)

  return items.map((item) => {
    const title = extractTag(item, 'title')
    const url = extractTag(item, 'link') || extractAttr(item, 'link', 'href')
    const description = stripHtml(extractTag(item, 'description') || extractTag(item, 'content:encoded'))
    const pubDate = parseDate(extractTag(item, 'pubDate') || extractTag(item, 'dc:date'))
    const guid = parseGuid(item) || url

    // Extract location hints from title/description
    const locationMatch = (title + ' ' + description).match(/\b(Australia|Sydney|Melbourne|Brisbane|Perth|Remote|AU)\b/i)
    const location = locationMatch ? locationMatch[0] : ''

    // Extract tags from categories
    const categoryRegex = /<category[^>]*>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/category>/gi
    const tags: string[] = []
    let catMatch
    while ((catMatch = categoryRegex.exec(item)) !== null) {
      const tag = catMatch[1].trim()
      if (tag) tags.push(tag)
    }

    return {
      source: source.name,
      source_id: guid.slice(0, 500),
      title: title.slice(0, 500),
      company: extractTag(item, 'author') || extractTag(item, 'dc:creator') || '',
      location,
      description: description.slice(0, 5000),
      url: url.slice(0, 1000),
      posted_at: pubDate,
      tags,
    }
  })
}

// ─── Upsert jobs to Supabase ──────────────────────────────────────────────────

async function upsertJobs(jobs: RawJob[]): Promise<{ attempted: number; inserted: number }> {
  if (jobs.length === 0) return { attempted: 0, inserted: 0 }

  // Fetch existing descriptions for these source_ids to detect changes
  const sourceIds = jobs.map((j) => j.source_id).filter(Boolean)
  const existingRes = await fetch(
    `${SUPABASE_URL}/rest/v1/jobs?select=source,source_id,description&source_id=in.(${sourceIds.map((id) => `"${id}"`).join(',')})`,
    { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
  )
  const existing: { source: string; source_id: string; description: string }[] = existingRes.ok ? await existingRes.json() : []
  const existingMap = new Map(existing.map((e) => [`${e.source}:${e.source_id}`, e.description]))

  // Upsert all jobs (merge so description/title stay current)
  const upsertRes = await fetch(`${SUPABASE_URL}/rest/v1/jobs?on_conflict=source,source_id`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'content-type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=representation',
    },
    body: JSON.stringify(jobs),
  })
  if (!upsertRes.ok) throw new Error(`Supabase upsert failed: ${await upsertRes.text()}`)
  const upserted: { id: string; source: string; source_id: string }[] = await upsertRes.json()

  // Count genuinely new rows (weren't in existingMap before)
  const inserted = upserted.filter((r) => !existingMap.has(`${r.source}:${r.source_id}`)).length

  // Reset score for rows whose description changed
  const changedIds = jobs
    .filter((j) => {
      const prev = existingMap.get(`${j.source}:${j.source_id}`)
      return prev !== undefined && prev !== j.description
    })
    .map((j) => upserted.find((r) => r.source === j.source && r.source_id === j.source_id)?.id)
    .filter((id): id is string => !!id)

  if (changedIds.length > 0) {
    await fetch(`${SUPABASE_URL}/rest/v1/jobs?id=in.(${changedIds.join(',')})`, {
      method: 'PATCH',
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, 'content-type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify({ match_score: null, match_reasoning: null }),
    })
  }

  return { attempted: jobs.length, inserted }
}

// ─── Adzuna API ───────────────────────────────────────────────────────────────

const ADZUNA_APP_ID = process.env.ADZUNA_APP_ID
const ADZUNA_API_KEY = process.env.ADZUNA_API_KEY

async function fetchAdzuna(): Promise<RawJob[]> {
  if (!ADZUNA_APP_ID || !ADZUNA_API_KEY) return []

  const params = new URLSearchParams({
    app_id: ADZUNA_APP_ID,
    app_key: ADZUNA_API_KEY,
    what: 'SAP',
    results_per_page: '50',
    'content-type': 'application/json',
  })

  const res = await fetch(
    `https://api.adzuna.com/v1/api/jobs/au/search/1?${params}`,
    { signal: AbortSignal.timeout(10000) }
  )
  if (!res.ok) throw new Error(`Adzuna HTTP ${res.status}`)

  const data = await res.json()
  const results: {
    id: string
    title: string
    company?: { display_name: string }
    location?: { display_name: string }
    description: string
    redirect_url: string
    salary_min?: number
    salary_max?: number
    contract_time?: string
    created: string
    category?: { label: string }
  }[] = data.results ?? []

  return results.map((r) => {
    const salary =
      r.salary_min != null
        ? r.salary_max != null
          ? `$${Math.round(r.salary_min / 1000)}k–$${Math.round(r.salary_max / 1000)}k`
          : `from $${Math.round(r.salary_min / 1000)}k`
        : null

    return {
      source: 'adzuna_au',
      source_id: r.id,
      title: (r.title ?? '').slice(0, 500),
      company: r.company?.display_name ?? '',
      location: r.location?.display_name ?? '',
      description: (r.description ?? '').slice(0, 5000),
      url: (r.redirect_url ?? '').slice(0, 1000),
      posted_at: r.created ? new Date(r.created).toISOString() : null,
      tags: r.category?.label ? [r.category.label] : [],
      salary,
      job_type: r.contract_time ?? null,
    }
  })
}

// ─── AI Job Scoring ───────────────────────────────────────────────────────────

type UnscoredJob = { id: string; title: string; description: string; tags: string[]; location: string; company: string }

async function fetchAllResumeChunks(): Promise<string> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/resume_chunks?select=content&order=id.asc`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
  })
  if (!res.ok) return ''
  const rows: { content: string }[] = await res.json()
  return rows.map((r) => r.content).join('\n\n')
}

async function batchScoreJobs(resume: string, jobs: UnscoredJob[]): Promise<{ id: string; score: number; reasoning: string }[]> {
  const jobList = jobs.map((j, i) =>
    `[${i}] id:${j.id} | title:${j.title} | company:${j.company} | location:${j.location} | tags:${j.tags?.join(',')} | description:${j.description.slice(0, 800)}`
  ).join('\n\n')

  const prompt = `You are a strict recruiter evaluating job postings against a candidate's resume. Score each job 0-100.

Scoring rules:
- Score HIGH (70-100) only if the job directly matches the candidate's SAP/ABAP/BTP/Fiori technical background
- Score MEDIUM (40-69) if there is partial overlap — e.g. SAP adjacent, or requires some but not all of the candidate's skills
- Score LOW (0-39) if the role is non-technical, managerial without hands-on SAP, or outside the candidate's experience
- A "Chief Data Officer" or "Head of" role with no hands-on SAP technical requirement should score below 40
- Be strict — most jobs should score between 40-75, reserve 80+ for near-perfect matches

Return a JSON array only — no markdown, no explanation outside the array. Each element must have:
- "id": the job id string (copy exactly from input)
- "score": integer 0-100
- "reasoning": one sentence explaining the score, mentioning specific matching skills or gaps

Candidate Resume:
${resume.slice(0, 6000)}

Jobs to score:
${jobList}`

  async function callLLM(apiKey: string, provider: 'anthropic' | 'openai'): Promise<string> {
    if (provider === 'anthropic') {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
        body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 2048, messages: [{ role: 'user', content: prompt }] }),
      })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      return data.content[0].text.trim()
    } else {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' },
        body: JSON.stringify({ model: 'gpt-4o-mini', max_tokens: 2048, messages: [{ role: 'user', content: prompt }], response_format: { type: 'json_object' } }),
      })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      return data.choices[0].message.content.trim()
    }
  }

  let raw = ''
  if (ANTHROPIC_KEY) {
    try { raw = await callLLM(ANTHROPIC_KEY, 'anthropic') } catch { console.error('Anthropic batch score failed, falling back to OpenAI') }
  }
  if (!raw && OPENAI_KEY) {
    raw = await callLLM(OPENAI_KEY, 'openai')
  }
  if (!raw) throw new Error('No LLM API key configured')

  const parsed = JSON.parse(raw)
  return Array.isArray(parsed) ? parsed : parsed.results ?? parsed.scores ?? []
}

async function scoreUnscoredJobs(): Promise<{ scored: number; failed: number }> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/jobs?match_score=is.null&select=id,title,description,tags,location,company&limit=50`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
  })
  if (!res.ok) return { scored: 0, failed: 0 }
  const jobs: UnscoredJob[] = await res.json()
  if (jobs.length === 0) return { scored: 0, failed: 0 }

  const resume = await fetchAllResumeChunks()
  const scores = await batchScoreJobs(resume, jobs)

  let scored = 0, failed = 0
  await Promise.all(scores.map(async ({ id, score, reasoning }) => {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/jobs?id=eq.${id}`, {
        method: 'PATCH',
        headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, 'content-type': 'application/json', Prefer: 'return=minimal' },
        body: JSON.stringify({ match_score: score, match_reasoning: reasoning }),
      })
      if (!res.ok) throw new Error(await res.text())
      scored++
    } catch { failed++ }
  }))

  return { scored, failed }
}

// ─── Route handler ────────────────────────────────────────────────────────────

const SAP_KEYWORDS = ['sap', 'abap', 's/4hana', 's4hana', 'fiori', 'btp', 'hana', 'sapui5']

function isSapRelevant(job: RawJob): boolean {
  const text = `${job.title} ${job.description} ${job.tags.join(' ')}`.toLowerCase()
  return SAP_KEYWORDS.some((kw: string) => text.includes(kw))
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function GET() {
  const results: { source: string; fetched: number; new: number; error?: string }[] = []

  for (const source of RSS_SOURCES) {
    try {
      const jobs = await fetchRSS(source)
      const sapJobs = jobs.filter(isSapRelevant)
      const { attempted, inserted } = await upsertJobs(sapJobs)
      results.push({ source: source.name, fetched: attempted, new: inserted })
    } catch (err) {
      results.push({ source: source.name, fetched: 0, new: 0, error: String(err) })
    }
  }

  try {
    const jobs = await fetchAdzuna()
    const { attempted, inserted } = await upsertJobs(jobs)
    results.push({ source: 'adzuna_au', fetched: attempted, new: inserted })
  } catch (err) {
    results.push({ source: 'adzuna_au', fetched: 0, new: 0, error: String(err) })
  }

  const totalNew = results.reduce((sum, r) => sum + (r.new ?? 0), 0)
  const scoring = await scoreUnscoredJobs()

  return NextResponse.json({ totalNew, results, scoring })
}

// Allow Vercel Cron to call this
export const maxDuration = 30

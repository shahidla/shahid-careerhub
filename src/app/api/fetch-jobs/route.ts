import { NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

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

async function upsertJobs(jobs: RawJob[]): Promise<number> {
  if (jobs.length === 0) return 0
  const res = await fetch(`${SUPABASE_URL}/rest/v1/jobs`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'content-type': 'application/json',
      Prefer: 'resolution=ignore-duplicates,return=minimal',
    },
    body: JSON.stringify(jobs),
  })
  if (!res.ok) throw new Error(`Supabase upsert failed: ${await res.text()}`)
  return jobs.length
}

// ─── Route handler ────────────────────────────────────────────────────────────

const SAP_KEYWORDS = ['sap', 'abap', 's/4hana', 's4hana', 'fiori', 'btp', 'hana', 'sapui5']

function isSapRelevant(job: RawJob): boolean {
  const text = `${job.title} ${job.description} ${job.tags.join(' ')}`.toLowerCase()
  return SAP_KEYWORDS.some((kw) => text.includes(kw))
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function GET() {
  const results: { source: string; fetched: number; filtered: number; error?: string }[] = []

  for (const source of RSS_SOURCES) {
    try {
      const jobs = await fetchRSS(source)
      const sapJobs = jobs.filter(isSapRelevant)
      const count = await upsertJobs(sapJobs)
      results.push({ source: source.name, fetched: jobs.length, filtered: count })
    } catch (err) {
      results.push({ source: source.name, fetched: 0, filtered: 0, error: String(err) })
    }
  }

  const total = results.reduce((sum, r) => sum + (r.filtered ?? 0), 0)
  return NextResponse.json({ total, results })
}

// Allow Vercel Cron to call this
export const maxDuration = 30

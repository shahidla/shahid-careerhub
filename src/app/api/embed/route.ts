import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const OPENAI_KEY = process.env.OPENAI_API_KEY!

// ─── Supabase fetch ───────────────────────────────────────────────────────────

async function dbQuery(table: string, params = '') {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${params}`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
  })
  if (!res.ok) throw new Error(`Failed to fetch ${table}: ${await res.text()}`)
  return res.json()
}

// ─── Format rows into text chunks ────────────────────────────────────────────

type Chunk = { source_table: string; source_id: string; content: string }

function chunksFromProfile(p: Record<string, any>): Chunk[] {
  return [{
    source_table: 'profile',
    source_id: p.id,
    content: [
      `Name: ${p.name}`,
      `Headline: ${p.headline}`,
      `Years of experience: ${p.years_experience}`,
      `Areas of expertise: ${p.positioning.join(', ')}`,
      `Key achievements: ${p.proof_points.join('. ')}`,
      `Education: ${p.education.join('. ')}`,
      `Contact: ${p.contact.email} | LinkedIn: ${p.contact.linkedin} | GitHub: ${p.contact.github}`,
    ].join('\n'),
  }]
}

function chunksFromExperience(rows: Record<string, any>[]): Chunk[] {
  return rows.map(e => ({
    source_table: 'experience',
    source_id: e.id,
    content: [
      `Company: ${e.company}${e.client ? ` | Client: ${e.client}` : ''}`,
      `Role: ${e.role} | Location: ${e.location} | Period: ${e.start_date} – ${e.end_date}`,
      `Description: ${e.description}`,
      `Technologies: ${e.technologies.join(', ')}`,
    ].join('\n'),
  }))
}

function chunksFromProjects(rows: Record<string, any>[]): Chunk[] {
  return rows.map(p => ({
    source_table: 'projects',
    source_id: p.id,
    content: [
      `Project: ${p.name} | Client: ${p.client}${p.is_ai ? ' | AI project' : ''}`,
      `Impact: ${p.impact}`,
      `Description: ${p.description}`,
      `Technologies: ${p.technologies.join(', ')}`,
    ].join('\n'),
  }))
}

function chunksFromCertifications(rows: Record<string, any>[]): Chunk[] {
  return rows.map(c => ({
    source_table: 'certifications',
    source_id: c.id,
    content: `Certification: ${c.title}${c.issuer ? ` | Issuer: ${c.issuer}` : ''}${c.year ? ` | Year: ${c.year}` : ''}`,
  }))
}

function chunksFromSkills(rows: Record<string, any>[]): Chunk[] {
  return rows.map(s => ({
    source_table: 'skills',
    source_id: s.id,
    content: `Skills - ${s.category}: ${s.items.join(', ')}`,
  }))
}

function chunksFromBlogs(rows: Record<string, any>[]): Chunk[] {
  return rows.map(b => ({
    source_table: 'blogs',
    source_id: b.id,
    content: `Blog post: ${b.title} | Tags: ${b.tags.join(', ')} | URL: ${b.url}`,
  }))
}

function chunksFromAchievements(rows: Record<string, any>[]): Chunk[] {
  return rows.map(a => ({
    source_table: 'achievements',
    source_id: a.id,
    content: `Achievement: ${a.title}${a.year ? ` (${a.year})` : ''} — ${a.description}`,
  }))
}

// ─── OpenAI embedding ─────────────────────────────────────────────────────────

async function embed(text: string): Promise<number[]> {
  const res = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENAI_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ model: 'text-embedding-3-small', input: text }),
  })
  if (!res.ok) throw new Error(`OpenAI embeddings failed: ${await res.text()}`)
  const data = await res.json()
  return data.data[0].embedding
}

// ─── Store chunk in Supabase ──────────────────────────────────────────────────

async function storeChunk(chunk: Chunk, embedding: number[]) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/resume_chunks`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'content-type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({ ...chunk, embedding: `[${embedding.join(',')}]` }),
  })
  if (!res.ok) throw new Error(`Failed to store chunk: ${await res.text()}`)
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function GET() {
  try {
    const [profile, experience, projects, certifications, skills, blogs, achievements] =
      await Promise.all([
        dbQuery('profile', 'limit=1'),
        dbQuery('experience', 'order=sort_order.asc'),
        dbQuery('projects', 'order=sort_order.asc'),
        dbQuery('certifications', 'order=sort_order.asc'),
        dbQuery('skills', 'order=sort_order.asc'),
        dbQuery('blogs', 'order=sort_order.asc'),
        dbQuery('achievements', 'order=sort_order.asc'),
      ])

    const chunks: Chunk[] = [
      ...chunksFromProfile(profile[0]),
      ...chunksFromExperience(experience),
      ...chunksFromProjects(projects),
      ...chunksFromCertifications(certifications),
      ...chunksFromSkills(skills),
      ...chunksFromBlogs(blogs),
      ...chunksFromAchievements(achievements),
    ]

    // Clear existing chunks
    const del = await fetch(
      `${SUPABASE_URL}/rest/v1/resume_chunks?id=neq.00000000-0000-0000-0000-000000000000`,
      { method: 'DELETE', headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } },
    )
    if (!del.ok) throw new Error(`Failed to clear resume_chunks: ${await del.text()}`)

    // Embed and store each chunk
    const results: string[] = []
    for (const chunk of chunks) {
      const embedding = await embed(chunk.content)
      await storeChunk(chunk, embedding)
      results.push(`${chunk.source_table}: ${chunk.content.slice(0, 60).replace(/\n/g, ' ')}...`)
    }

    return NextResponse.json({
      ok: true,
      chunks: chunks.length,
      stored: results,
    })
  } catch (err) {
    console.error('Embed route error:', err)
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 },
    )
  }
}

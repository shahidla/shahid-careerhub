/**
 * Embedding pipeline — run once to populate resume_chunks.
 *
 * Steps:
 *   1. Read every table from Supabase
 *   2. Format each row into a readable text chunk
 *   3. Send each chunk to OpenAI embeddings API
 *   4. Store chunk text + embedding in resume_chunks
 *
 * Run:
 *   npx ts-node --project tsconfig.scripts.json scripts/embed-resume.ts
 */

import * as fs from 'fs'
import * as path from 'path'

// Load .env.local manually (no dotenv dependency needed)
const envPath = path.join(__dirname, '..', '.env.local')
const envLines = fs.readFileSync(envPath, 'utf-8').split('\n')
for (const line of envLines) {
  const match = line.match(/^([^#=]+)=(.*)$/)
  if (match) process.env[match[1].trim()] = match[2].trim()
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const OPENAI_KEY = process.env.OPENAI_API_KEY!

if (!SUPABASE_URL || !SUPABASE_KEY || !OPENAI_KEY) {
  console.error('Missing env vars. Check .env.local for NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, OPENAI_API_KEY')
  process.exit(1)
}

// ─── Supabase fetch helper ────────────────────────────────────────────────────

async function dbQuery<T>(table: string, params = ''): Promise<T[]> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${params}`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
  })
  if (!res.ok) throw new Error(`Failed to fetch ${table}: ${await res.text()}`)
  return res.json()
}

// ─── Types ────────────────────────────────────────────────────────────────────

type Profile = {
  id: string; name: string; headline: string; years_experience: number
  positioning: string[]; education: string[]
  contact: { email: string; phone: string; linkedin: string; github: string; sapCommunity: string }
  proof_points: string[]
}
type Experience = {
  id: string; company: string; client: string; role: string; location: string
  start_date: string; end_date: string; description: string; technologies: string[]
}
type Project = {
  id: string; name: string; client: string; impact: string; description: string
  technologies: string[]; is_ai: boolean
}
type Certification = { id: string; title: string; issuer: string; year: string }
type Skill = { id: string; category: string; items: string[] }
type Blog = { id: string; title: string; url: string; tags: string[] }
type Achievement = { id: string; title: string; description: string; year: string }

type Chunk = { content: string; source_table: string; source_id: string }

// ─── Format rows into readable text chunks ────────────────────────────────────

function chunksFromProfile(p: Profile): Chunk[] {
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

function chunksFromExperience(rows: Experience[]): Chunk[] {
  return rows.map((e) => ({
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

function chunksFromProjects(rows: Project[]): Chunk[] {
  return rows.map((p) => ({
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

function chunksFromCertifications(rows: Certification[]): Chunk[] {
  return rows.map((c) => ({
    source_table: 'certifications',
    source_id: c.id,
    content: `Certification: ${c.title}${c.issuer ? ` | Issuer: ${c.issuer}` : ''}${c.year ? ` | Year: ${c.year}` : ''}`,
  }))
}

function chunksFromSkills(rows: Skill[]): Chunk[] {
  return rows.map((s) => ({
    source_table: 'skills',
    source_id: s.id,
    content: `Skills - ${s.category}: ${s.items.join(', ')}`,
  }))
}

function chunksFromBlogs(rows: Blog[]): Chunk[] {
  return rows.map((b) => ({
    source_table: 'blogs',
    source_id: b.id,
    content: `Blog post: ${b.title} | Tags: ${b.tags.join(', ')} | URL: ${b.url}`,
  }))
}

function chunksFromAchievements(rows: Achievement[]): Chunk[] {
  return rows.map((a) => ({
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

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('Reading Supabase tables...')
  const [profile, experience, projects, certifications, skills, blogs, achievements] =
    await Promise.all([
      dbQuery<Profile>('profile', 'limit=1'),
      dbQuery<Experience>('experience', 'order=sort_order.asc'),
      dbQuery<Project>('projects', 'order=sort_order.asc'),
      dbQuery<Certification>('certifications', 'order=sort_order.asc'),
      dbQuery<Skill>('skills', 'order=sort_order.asc'),
      dbQuery<Blog>('blogs', 'order=sort_order.asc'),
      dbQuery<Achievement>('achievements', 'order=sort_order.asc'),
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

  console.log(`Created ${chunks.length} chunks. Clearing old data...`)

  // Clear existing chunks before re-embedding
  const del = await fetch(`${SUPABASE_URL}/rest/v1/resume_chunks?id=neq.00000000-0000-0000-0000-000000000000`, {
    method: 'DELETE',
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
  })
  if (!del.ok) throw new Error(`Failed to clear resume_chunks: ${await del.text()}`)

  console.log(`Embedding and storing ${chunks.length} chunks...`)
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i]
    process.stdout.write(`  [${i + 1}/${chunks.length}] ${chunk.source_table} ... `)
    const embedding = await embed(chunk.content)
    await storeChunk(chunk, embedding)
    console.log('done')
  }

  console.log('\nAll chunks embedded and stored. resume_chunks is ready.')
}

main().catch((err) => { console.error(err); process.exit(1) })

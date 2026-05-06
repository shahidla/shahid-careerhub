/**
 * Embedding pipeline — run once to populate resume_chunks.
 *
 * Run:  node scripts/embed-resume.mjs
 *
 * Steps:
 *   1. Read every table from Supabase
 *   2. Format each row into a readable text chunk
 *   3. Send each chunk to OpenAI embeddings API → get back 1536 numbers
 *   4. Store chunk text + embedding in resume_chunks table
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Load .env.local manually
const envPath = path.join(__dirname, '..', '.env.local')
for (const line of fs.readFileSync(envPath, 'utf-8').split('\n')) {
  const match = line.match(/^([^#=]+)=(.*)$/)
  if (match) process.env[match[1].trim()] = match[2].trim()
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const OPENAI_KEY   = process.env.OPENAI_API_KEY

if (!SUPABASE_URL || !SUPABASE_KEY || !OPENAI_KEY) {
  console.error('Missing env vars. Check .env.local for:\n  NEXT_PUBLIC_SUPABASE_URL\n  SUPABASE_SERVICE_ROLE_KEY\n  OPENAI_API_KEY')
  process.exit(1)
}

// ─── Supabase fetch ───────────────────────────────────────────────────────────

async function dbQuery(table, params = '') {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${params}`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
  })
  if (!res.ok) throw new Error(`Failed to fetch ${table}: ${await res.text()}`)
  return res.json()
}

// ─── Format rows into readable text chunks ────────────────────────────────────

function chunksFromProfile(p) {
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

function chunksFromExperience(rows) {
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

function chunksFromProjects(rows) {
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

function chunksFromCertifications(rows) {
  return rows.map(c => ({
    source_table: 'certifications',
    source_id: c.id,
    content: `Certification: ${c.title}${c.issuer ? ` | Issuer: ${c.issuer}` : ''}${c.year ? ` | Year: ${c.year}` : ''}`,
  }))
}

function chunksFromSkills(rows) {
  return rows.map(s => ({
    source_table: 'skills',
    source_id: s.id,
    content: `Skills - ${s.category}: ${s.items.join(', ')}`,
  }))
}

function chunksFromBlogs(rows) {
  return rows.map(b => ({
    source_table: 'blogs',
    source_id: b.id,
    content: `Blog post: ${b.title} | Tags: ${b.tags.join(', ')} | URL: ${b.url}`,
  }))
}

function chunksFromAchievements(rows) {
  return rows.map(a => ({
    source_table: 'achievements',
    source_id: a.id,
    content: `Achievement: ${a.title}${a.year ? ` (${a.year})` : ''} — ${a.description}`,
  }))
}

// ─── OpenAI embedding ─────────────────────────────────────────────────────────

async function embed(text) {
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

async function storeChunk(chunk, embedding) {
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
      dbQuery('profile', 'limit=1'),
      dbQuery('experience', 'order=sort_order.asc'),
      dbQuery('projects', 'order=sort_order.asc'),
      dbQuery('certifications', 'order=sort_order.asc'),
      dbQuery('skills', 'order=sort_order.asc'),
      dbQuery('blogs', 'order=sort_order.asc'),
      dbQuery('achievements', 'order=sort_order.asc'),
    ])

  const chunks = [
    ...chunksFromProfile(profile[0]),
    ...chunksFromExperience(experience),
    ...chunksFromProjects(projects),
    ...chunksFromCertifications(certifications),
    ...chunksFromSkills(skills),
    ...chunksFromBlogs(blogs),
    ...chunksFromAchievements(achievements),
  ]

  console.log(`Created ${chunks.length} chunks. Clearing old data...`)

  const del = await fetch(
    `${SUPABASE_URL}/rest/v1/resume_chunks?id=neq.00000000-0000-0000-0000-000000000000`,
    { method: 'DELETE', headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
  )
  if (!del.ok) throw new Error(`Failed to clear resume_chunks: ${await del.text()}`)

  console.log(`Embedding and storing ${chunks.length} chunks...\n`)
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i]
    process.stdout.write(`  [${i + 1}/${chunks.length}] ${chunk.source_table.padEnd(16)} ${chunk.content.slice(0, 60).replace(/\n/g, ' ')}...\n`)
    const embedding = await embed(chunk.content)
    await storeChunk(chunk, embedding)
  }

  console.log('\nDone. resume_chunks is populated and ready for RAG.')
}

main().catch(err => { console.error(err); process.exit(1) })

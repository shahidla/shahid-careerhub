const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

async function query<T>(table: string, params = ''): Promise<T[]> {
  const res = await fetch(`${URL}/rest/v1/${table}?${params}`, {
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
    next: { revalidate: 0 },
  })
  if (!res.ok) throw new Error(`Failed to fetch ${table}: ${await res.text()}`)
  return res.json()
}

export type Profile = {
  name: string
  headline: string
  years_experience: number
  positioning: string[]
  education: string[]
  contact: { email: string; phone: string; linkedin: string; github: string; sapCommunity: string }
  proof_points: string[]
}

export type Experience = {
  id: string
  company: string
  client: string
  role: string
  location: string
  start_date: string
  end_date: string
  description: string
  technologies: string[]
  sort_order: number
}

export type Project = {
  id: string
  name: string
  type: string
  client: string
  impact: string
  description: string
  ai_summary: string | null
  technologies: string[]
  tags: string[]
  url: string
  is_ai: boolean
  sort_order: number
}

export type Certification = {
  id: string
  title: string
  code: string
  issuer: string
  year: string
  credential_url: string
  is_ai: boolean
  sort_order: number
}

export type Skill = {
  id: string
  category: string
  items: string[]
  is_ai: boolean
  sort_order: number
}

export type Blog = {
  id: string
  title: string
  url: string
  tags: string[]
  is_ai: boolean
  sort_order: number
}

export type Achievement = {
  id: string
  title: string
  description: string
  year: string
  sort_order: number
}

export type Job = {
  id: string
  title: string
  company: string
  location: string
  description: string
  url: string
  source: string
  source_id: string
  tags: string[]
  salary: string | null
  job_type: string | null
  match_score: number | null
  match_reasoning: string | null
  status: string
  posted_at: string | null
  fetched_at: string
}

export async function getJobs(limit = 50) {
  return query<Job>('jobs', `order=match_score.desc.nullslast,fetched_at.desc&limit=${limit}`)
}

export async function getProfile() {
  const rows = await query<Profile>('profile', 'limit=1')
  return rows[0]
}

export async function getExperience() {
  return query<Experience>('experience', 'order=sort_order.asc')
}

export async function getProjects(aiOnly = false) {
  const filter = aiOnly ? 'is_ai=eq.true&' : ''
  return query<Project>('projects', `${filter}order=sort_order.asc`)
}

export async function getCertifications(aiOnly = false) {
  const filter = aiOnly ? 'is_ai=eq.true&' : ''
  return query<Certification>('certifications', `${filter}order=sort_order.asc`)
}

export async function getSkills(aiOnly = false) {
  const filter = aiOnly ? 'is_ai=eq.true&' : ''
  return query<Skill>('skills', `${filter}order=sort_order.asc`)
}

export async function getBlogs(aiOnly = false) {
  const filter = aiOnly ? 'is_ai=eq.true&' : ''
  return query<Blog>('blogs', `${filter}order=sort_order.asc`)
}

export async function getAchievements() {
  return query<Achievement>('achievements', 'order=sort_order.asc')
}

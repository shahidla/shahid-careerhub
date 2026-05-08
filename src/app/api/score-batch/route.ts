import { NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY
const OPENAI_KEY = process.env.OPENAI_API_KEY
const LANGFUSE_HOST = process.env.LANGFUSE_HOST ?? 'https://us.cloud.langfuse.com'
const LANGFUSE_PK = process.env.LANGFUSE_PUBLIC_KEY
const LANGFUSE_SK = process.env.LANGFUSE_SECRET_KEY

// Provider switches — set ENABLE_ANTHROPIC=false or ENABLE_OPENAI=false in Vercel to disable without redeploying
const ANTHROPIC_ENABLED = process.env.ENABLE_ANTHROPIC !== 'false'
const OPENAI_ENABLED = process.env.ENABLE_OPENAI !== 'false'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

function langfuseAuth() {
  return 'Basic ' + Buffer.from(`${LANGFUSE_PK}:${LANGFUSE_SK}`).toString('base64')
}

async function logGeneration(opts: {
  name: string; model: string; input: string; output: string
  startTime: string; endTime: string; jobCount: number
}) {
  if (!LANGFUSE_PK || !LANGFUSE_SK) return
  const traceId = crypto.randomUUID()
  await fetch(`${LANGFUSE_HOST}/api/public/traces`, {
    method: 'POST',
    headers: { Authorization: langfuseAuth(), 'content-type': 'application/json' },
    body: JSON.stringify({ id: traceId, name: opts.name, metadata: { jobCount: opts.jobCount } }),
  }).catch(() => {})
  await fetch(`${LANGFUSE_HOST}/api/public/generations`, {
    method: 'POST',
    headers: { Authorization: langfuseAuth(), 'content-type': 'application/json' },
    body: JSON.stringify({
      traceId, name: opts.name, model: opts.model,
      input: opts.input, output: opts.output,
      startTime: opts.startTime, endTime: opts.endTime,
    }),
  }).catch(() => {})
}

type UnscoredJob = { id: string; title: string; description: string; tags: string[]; location: string; company: string }

async function fetchAllResumeChunks(): Promise<string> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/resume_chunks?select=content&order=id.asc`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
  })
  if (!res.ok) return ''
  const rows: { content: string }[] = await res.json()
  return rows.map((r) => r.content).join('\n\n')
}

async function scoreBatch(resume: string, jobs: UnscoredJob[]): Promise<{ id: string; score: number; reasoning: string }[]> {
  const jobList = jobs.map((j) =>
    `id:${j.id} | title:${j.title} | company:${j.company} | location:${j.location} | tags:${j.tags?.join(',')} | description:${j.description.slice(0, 600)}`
  ).join('\n\n---\n\n')

  const prompt = `You are a strict technical recruiter evaluating job postings against a candidate's resume. Score each job 0-100.

The candidate is a TECHNICAL SAP developer (ABAP, BTP, Fiori, S/4HANA). They write code and build technical solutions. They are NOT a functional consultant, project manager, or business analyst.

Scoring rules:
- Score HIGH (70-100) only if the role requires hands-on technical SAP development: ABAP programming, BTP development, Fiori/UI5, S/4HANA technical implementation, SAP integration development
- Score MEDIUM (40-69) if there is partial technical overlap — e.g. SAP technical adjacent, cloud/integration development, or requires some but not all of the candidate's technical skills
- Score LOW (0-39) for ANY of these: functional consultant roles, project manager, business analyst, solution architect without hands-on coding, "Head of", "Chief", "Director", or "Lead" roles focused on management not development, non-SAP roles, roles outside the candidate's technical experience
- A role with "SAP" in the title but no hands-on technical/coding requirement should score below 40
- Reserve 80+ for near-perfect matches: ABAP developer, BTP developer, Fiori developer, SAP integration developer

Return a JSON object with key "scores" containing an array. Each element must have:
- "id": the job id string (copy exactly from input)
- "score": integer 0-100
- "reasoning": one sentence mentioning specific technical skills matched or why the role is not a technical fit

Candidate Resume:
${resume.slice(0, 4000)}

Jobs to score:
${jobList}`

  async function callLLM(apiKey: string, provider: 'anthropic' | 'openai'): Promise<string> {
    if (provider === 'anthropic') {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
        body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 4096, messages: [{ role: 'user', content: prompt }] }),
      })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      return data.content[0].text.trim()
    } else {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' },
        body: JSON.stringify({ model: 'gpt-4o-mini', max_tokens: 4096, messages: [{ role: 'user', content: prompt }], response_format: { type: 'json_object' } }),
      })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      return data.choices[0].message.content.trim()
    }
  }

  let raw = ''
  let usedModel = ''
  const startTime = new Date().toISOString()
  if (ANTHROPIC_ENABLED && ANTHROPIC_KEY) {
    try { raw = await callLLM(ANTHROPIC_KEY, 'anthropic'); usedModel = 'claude-haiku-4-5-20251001' } catch { console.error('Anthropic failed, falling back to OpenAI') }
  }
  if (!raw && OPENAI_ENABLED && OPENAI_KEY) {
    raw = await callLLM(OPENAI_KEY, 'openai'); usedModel = 'gpt-4o-mini'
  }
  if (!raw) throw new Error('No LLM API key configured or all providers disabled')

  logGeneration({ name: 'score-batch', model: usedModel, input: prompt, output: raw, startTime, endTime: new Date().toISOString(), jobCount: jobs.length })

  const parsed = JSON.parse(raw)
  return Array.isArray(parsed) ? parsed : parsed.scores ?? parsed.results ?? []
}

export async function POST() {
  // Fetch next batch of unscored jobs
  const res = await fetch(`${SUPABASE_URL}/rest/v1/jobs?match_score=is.null&select=id,title,description,tags,location,company&limit=10`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
  })
  if (!res.ok) return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 })
  const jobs: UnscoredJob[] = await res.json()

  // Count remaining after this batch
  const countRes = await fetch(`${SUPABASE_URL}/rest/v1/jobs?match_score=is.null&select=id`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, Prefer: 'count=exact', Range: '0-0' },
  })
  const remaining = parseInt(countRes.headers.get('content-range')?.split('/')[1] ?? '0') - jobs.length

  if (jobs.length === 0) return NextResponse.json({ scored: 0, remaining: 0 })

  const resume = await fetchAllResumeChunks()
  if (!resume) return NextResponse.json({ error: 'resume_chunks empty — run /api/embed first' }, { status: 500 })

  const scores = await scoreBatch(resume, jobs)

  let scored = 0
  await Promise.all(scores.map(async ({ id, score, reasoning }) => {
    await fetch(`${SUPABASE_URL}/rest/v1/jobs?id=eq.${id}`, {
      method: 'PATCH',
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, 'content-type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify({ match_score: score, match_reasoning: reasoning }),
    })
    scored++
  }))

  return NextResponse.json({ scored, remaining })
}

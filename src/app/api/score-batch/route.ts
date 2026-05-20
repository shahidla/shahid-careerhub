import { NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY
const OPENAI_KEY = process.env.OPENAI_API_KEY
const LANGFUSE_HOST = process.env.LANGFUSE_HOST ?? 'https://us.cloud.langfuse.com'
const LANGFUSE_PK = process.env.LANGFUSE_PUBLIC_KEY
const LANGFUSE_SK = process.env.LANGFUSE_SECRET_KEY

const ANTHROPIC_ENABLED = process.env.ENABLE_ANTHROPIC !== 'false'
const OPENAI_ENABLED = process.env.ENABLE_OPENAI !== 'false'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

type UnscoredJob = {
  id: string
  title: string
  description: string
  tags: string[]
  location: string
  company: string
}

type JobSignals = {
  text: string
  hasSap: boolean
  hasAi: boolean
  hasCoding: boolean
  hasIntegration: boolean
  hasFunctionalBias: boolean
  hasManagementBias: boolean
}

const SAP_TERMS = ['sap', 'abap', 'btp', 'fiori', 'ui5', 'sapui5', 's/4hana', 's4hana', 'hana', 'cap']
const AI_TERMS = ['ai', 'ml', 'machine learning', 'generative ai', 'genai', 'llm', 'rag', 'agentic', 'prompt engineering']
const CODING_TERMS = ['developer', 'development', 'engineer', 'engineering', 'programming', 'coding', 'hands-on', 'build', 'implement', 'integration']
const INTEGRATION_TERMS = ['integration', 'api', 'odata', 'microservices', 'event-driven', 'middleware', 'cloud', 'automation']
const FUNCTIONAL_TERMS = ['functional consultant', 'business analyst', 'process analyst', 'configurator', 'customizing', 'customising', 'solution design only']
const MANAGEMENT_TERMS = ['project manager', 'program manager', 'delivery manager', 'director', 'head of', 'chief', 'vp', 'vice president']

function langfuseAuth() {
  return 'Basic ' + Buffer.from(`${LANGFUSE_PK}:${LANGFUSE_SK}`).toString('base64')
}

async function logGeneration(opts: {
  name: string
  model: string
  input: string
  output: string
  startTime: string
  endTime: string
  jobCount: number
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
      traceId,
      name: opts.name,
      model: opts.model,
      input: opts.input,
      output: opts.output,
      startTime: opts.startTime,
      endTime: opts.endTime,
    }),
  }).catch(() => {})
}

function includesAny(text: string, terms: string[]): boolean {
  return terms.some((term) => text.includes(term))
}

function analyseJob(job: UnscoredJob): JobSignals {
  const text = `${job.title} ${job.description} ${job.tags?.join(' ')}`.toLowerCase()
  return {
    text,
    hasSap: includesAny(text, SAP_TERMS),
    hasAi: includesAny(text, AI_TERMS),
    hasCoding: includesAny(text, CODING_TERMS),
    hasIntegration: includesAny(text, INTEGRATION_TERMS),
    hasFunctionalBias: includesAny(text, FUNCTIONAL_TERMS),
    hasManagementBias: includesAny(text, MANAGEMENT_TERMS),
  }
}

function buildSignalSummary(signals: JobSignals): string {
  const parts: string[] = []
  if (signals.hasSap) parts.push('SAP')
  if (signals.hasAi) parts.push('AI')
  if (signals.hasCoding) parts.push('coding')
  if (signals.hasIntegration) parts.push('integration')
  if (signals.hasFunctionalBias) parts.push('functional-bias')
  if (signals.hasManagementBias) parts.push('management-bias')
  return parts.join(', ') || 'none'
}

function calibrateScore(score: number, signals: JobSignals): { score: number; note?: string } {
  let calibrated = score
  let note = ''

  if ((signals.hasFunctionalBias || signals.hasManagementBias) && !signals.hasCoding) {
    calibrated = Math.min(calibrated, 35)
    note = 'capped for non-hands-on functional or managerial fit'
  } else if (signals.hasSap && signals.hasAi && signals.hasCoding) {
    calibrated = Math.max(calibrated, 85)
    note = 'boosted for strong SAP + AI hands-on fit'
  } else if (signals.hasSap && signals.hasCoding) {
    calibrated = Math.max(calibrated, 72)
    note = 'boosted for hands-on SAP technical fit'
  } else if (signals.hasAi && signals.hasCoding && signals.hasIntegration) {
    calibrated = Math.max(calibrated, 58)
    note = 'boosted for technical AI and integration overlap'
  }

  return {
    score: Math.max(0, Math.min(100, calibrated)),
    note: note || undefined,
  }
}

async function fetchAllResumeChunks(): Promise<string> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/resume_chunks?select=content&order=id.asc`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
  })
  if (!res.ok) return ''
  const rows: { content: string }[] = await res.json()
  return rows.map((row) => row.content).join('\n\n')
}

async function scoreBatch(resume: string, jobs: UnscoredJob[]): Promise<{ scores: { id: string; score: number; reasoning: string }[]; model: string }> {
  const analysedJobs = jobs.map((job) => ({ job, signals: analyseJob(job) }))

  const jobList = analysedJobs.map(({ job, signals }) =>
    `id:${job.id} | title:${job.title} | company:${job.company} | location:${job.location} | tags:${job.tags?.join(',')} | signals:${buildSignalSummary(signals)} | description:${job.description.slice(0, 600)}`
  ).join('\n\n---\n\n')

  const systemPrompt = `You are a strict technical recruiter evaluating job postings against a candidate's resume. Score each job 0-100.

The candidate is a TECHNICAL SAP developer (ABAP, BTP, Fiori, S/4HANA) who is also an AI/ML engineer. They build AI-powered SAP solutions, write ABAP code, build on BTP, and implement Generative AI integrations. They are NOT a functional consultant, project manager, or business analyst.

Scoring rules:
- Score VERY HIGH (85-100) for roles that match hands-on technical SAP development and/or AI engineering: ABAP developer, BTP developer, Fiori/UI5 developer, SAP integration developer, SAP AI Developer, SAP BTP AI engineer, Generative AI + SAP roles, LLM/RAG engineer with SAP context
- Score HIGH (70-84) for strong technical overlap in one dimension: pure ABAP/Fiori/BTP roles (even without AI), or AI/ML engineer roles that mention SAP, BTP, or enterprise integration
- Score MEDIUM (40-69) if there is partial technical overlap, for example AI/ML engineering without SAP, cloud-native development with integration patterns, or SAP technical-adjacent roles requiring some coding
- Score LOW (0-39) for any of these: functional consultant roles, project manager, business analyst, solution architect without hands-on coding, "Head of", "Chief", "Director", or "Lead" roles focused on management not development, non-SAP and non-AI roles, roles with no coding requirement
- A role with "SAP" in the title but no hands-on technical or coding requirement should score below 40
- A role combining SAP + AI/GenAI/LLM with hands-on development should score 85+
- Treat the provided "signals" field as a hint, not the final answer. If signals include SAP + AI + coding, that role should almost never land below 85 unless the description clearly contradicts it.
- If signals include functional-bias or management-bias and there is no coding signal, the role should almost never exceed 35.
- Prefer false negatives over false positives for non-coding SAP roles, but prefer false positives over false negatives for clearly hands-on SAP + AI engineering roles.

Return a JSON object with key "scores" containing an array. Each element must have:
- "id": the job id string (copy exactly from input)
- "score": integer 0-100
- "reasoning": one sentence mentioning specific technical skills matched or why the role is not a technical fit

Candidate Resume:
${resume.slice(0, 4000)}`

  const userPrompt = `Jobs to score:\n${jobList}`

  async function callLLM(apiKey: string, provider: 'anthropic' | 'openai'): Promise<string> {
    if (provider === 'anthropic') {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-beta': 'prompt-caching-2024-07-31',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 4096,
          system: [{ type: 'text', text: systemPrompt, cache_control: { type: 'ephemeral' } }],
          messages: [{ role: 'user', content: userPrompt }],
        }),
      })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      return data.content[0].text.trim()
    }

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        max_tokens: 4096,
        messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }],
        response_format: { type: 'json_object' },
      }),
    })
    if (!res.ok) throw new Error(await res.text())
    const data = await res.json()
    return data.choices[0].message.content.trim()
  }

  let raw = ''
  let usedModel = ''
  const startTime = new Date().toISOString()

  if (ANTHROPIC_ENABLED && ANTHROPIC_KEY) {
    try {
      raw = await callLLM(ANTHROPIC_KEY, 'anthropic')
      usedModel = 'claude-haiku-4-5-20251001'
    } catch {
      console.error('Anthropic failed, falling back to OpenAI')
    }
  }

  if (!raw && OPENAI_ENABLED && OPENAI_KEY) {
    raw = await callLLM(OPENAI_KEY, 'openai')
    usedModel = 'gpt-4o-mini'
  }

  if (!raw) throw new Error('No LLM API key configured or all providers disabled')

  logGeneration({
    name: 'score-batch',
    model: usedModel,
    input: userPrompt,
    output: raw,
    startTime,
    endTime: new Date().toISOString(),
    jobCount: jobs.length,
  })

  const parsed = JSON.parse(raw)
  const scores = Array.isArray(parsed) ? parsed : parsed.scores ?? parsed.results ?? []
  const signalMap = new Map(analysedJobs.map(({ job, signals }) => [job.id, signals]))

  const calibratedScores = scores.map((item: { id: string; score: number; reasoning: string }) => {
    const signals = signalMap.get(item.id)
    if (!signals) return item

    const calibrated = calibrateScore(item.score, signals)
    return {
      ...item,
      score: calibrated.score,
      reasoning: calibrated.note ? `${item.reasoning} (${calibrated.note})` : item.reasoning,
    }
  })

  return { scores: calibratedScores, model: usedModel }
}

export async function POST() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/jobs?match_score=is.null&select=id,title,description,tags,location,company&limit=10`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
  })
  if (!res.ok) return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 })

  const jobs: UnscoredJob[] = await res.json()
  const countRes = await fetch(`${SUPABASE_URL}/rest/v1/jobs?match_score=is.null&select=id`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, Prefer: 'count=exact', Range: '0-0' },
  })
  const remaining = parseInt(countRes.headers.get('content-range')?.split('/')[1] ?? '0', 10) - jobs.length

  if (jobs.length === 0) return NextResponse.json({ scored: 0, remaining: 0 })

  const resume = await fetchAllResumeChunks()
  if (!resume) return NextResponse.json({ error: 'resume_chunks empty - run /api/embed first' }, { status: 500 })

  const { scores, model } = await scoreBatch(resume, jobs)

  let scored = 0
  let patchErrors = 0
  await Promise.all(scores.map(async ({ id, score, reasoning }) => {
    const patchRes = await fetch(`${SUPABASE_URL}/rest/v1/jobs?id=eq.${id}`, {
      method: 'PATCH',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'content-type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({ match_score: score, match_reasoning: reasoning }),
    })

    if (patchRes.ok) scored++
    else {
      patchErrors++
      console.error(`PATCH failed for job ${id}:`, patchRes.status, await patchRes.text())
    }
  }))

  return NextResponse.json({ scored, remaining, model, patchErrors: patchErrors || undefined })
}

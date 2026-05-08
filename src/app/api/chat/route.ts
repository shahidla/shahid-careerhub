import { NextRequest, NextResponse } from 'next/server'

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY
const OPENAI_KEY = process.env.OPENAI_API_KEY
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const COHERE_KEY = process.env.COHERE_API_KEY

// Provider switches — set ENABLE_ANTHROPIC=false or ENABLE_OPENAI=false in Vercel to disable without redeploying
const ANTHROPIC_ENABLED = process.env.ENABLE_ANTHROPIC !== 'false'
const OPENAI_ENABLED = process.env.ENABLE_OPENAI !== 'false'
const LANGFUSE_HOST = process.env.LANGFUSE_HOST ?? 'https://us.cloud.langfuse.com'
const LANGFUSE_PK = process.env.LANGFUSE_PUBLIC_KEY
const LANGFUSE_SK = process.env.LANGFUSE_SECRET_KEY

// ─── Langfuse tracing ─────────────────────────────────────────────────────────

function langfuseAuth() {
  return 'Basic ' + Buffer.from(`${LANGFUSE_PK}:${LANGFUSE_SK}`).toString('base64')
}

async function createTrace(name: string, input: unknown): Promise<string> {
  const traceId = crypto.randomUUID()
  if (!LANGFUSE_PK || !LANGFUSE_SK) return traceId
  await fetch(`${LANGFUSE_HOST}/api/public/traces`, {
    method: 'POST',
    headers: { Authorization: langfuseAuth(), 'content-type': 'application/json' },
    body: JSON.stringify({ id: traceId, name, input }),
  }).catch(() => {})
  return traceId
}

async function createGeneration(opts: {
  traceId: string; name: string; model: string
  input: unknown; output: string; startTime: string; endTime: string
  promptTokens?: number; completionTokens?: number; metadata?: Record<string, unknown>
}) {
  if (!LANGFUSE_PK || !LANGFUSE_SK) return
  await fetch(`${LANGFUSE_HOST}/api/public/generations`, {
    method: 'POST',
    headers: { Authorization: langfuseAuth(), 'content-type': 'application/json' },
    body: JSON.stringify({
      traceId: opts.traceId,
      name: opts.name,
      model: opts.model,
      input: opts.input,
      output: opts.output,
      startTime: opts.startTime,
      endTime: opts.endTime,
      usage: { input: opts.promptTokens, output: opts.completionTokens },
      metadata: opts.metadata,
    }),
  }).catch(() => {})
}

// ─── RAG: embed question + vector search ─────────────────────────────────────

async function embedQuestion(text: string): Promise<number[]> {
  const res = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENAI_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ model: 'text-embedding-3-small', input: text }),
  })
  if (!res.ok) throw new Error(`Embedding failed: ${await res.text()}`)
  const data = await res.json()
  return data.data[0].embedding
}

async function searchChunks(embedding: number[]): Promise<string[]> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/match_resume_chunks`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ query_embedding: embedding, match_count: 10 }),
  })
  if (!res.ok) throw new Error(`Vector search failed: ${await res.text()}`)
  const rows = await res.json()
  return rows.map((r: { content: string }) => r.content)
}

async function rerankChunks(query: string, chunks: string[]): Promise<string[]> {
  if (!COHERE_KEY || chunks.length === 0) return chunks.slice(0, 5)
  const res = await fetch('https://api.cohere.com/v1/rerank', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${COHERE_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'rerank-v3.5',
      query,
      documents: chunks,
      top_n: 5,
    }),
  })
  if (!res.ok) throw new Error(`Rerank failed: ${await res.text()}`)
  const data = await res.json()
  return data.results.map((r: { index: number }) => chunks[r.index])
}

// ─── Rate limiter ─────────────────────────────────────────────────────────────

const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 20
const RATE_WINDOW_MS = 10 * 60 * 1000

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS })
    return false
  }
  if (entry.count >= RATE_LIMIT) return true
  entry.count++
  return false
}

// ─── System prompt ────────────────────────────────────────────────────────────

const SYSTEM_PROMPT_BASE = `You are an AI assistant representing Shahid M Syed's professional profile, speaking to recruiters, hiring managers, and visitors.

Be direct and concise. Lead with what matters: availability, key strengths, and fit for the role.

IMPORTANT: Only answer questions about Shahid M Syed — his experience, availability, skills, blogs, projects, certifications, and fit for roles. Use the resume data provided below to answer. Do not say you cannot answer if the information is in the resume data.

When a user pastes a job description, provide:
1. Match score (0–100%)
2. Top 3 strengths aligned to the role
3. Any gaps to be aware of
4. One-sentence hiring recommendation

End every response with: "Get in touch → shahid.la@gmail.com"`

function buildSystemPrompt(chunks: string[]): string {
  if (chunks.length === 0) return SYSTEM_PROMPT_BASE
  return `${SYSTEM_PROMPT_BASE}

## Shahid's Resume Data (use this to answer the question)

${chunks.map((c, i) => `[${i + 1}] ${c}`).join('\n\n')}`
}

type Message = { role: string; content: string }

// ─── Streaming helpers ────────────────────────────────────────────────────────

function makeStream(producer: (push: (text: string) => void, done: () => void) => void): Response {
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    start(controller) {
      producer(
        (text) => controller.enqueue(encoder.encode(text)),
        () => controller.close(),
      )
    },
  })
  return new Response(stream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}

async function streamAnthropic(messages: Message[], systemPrompt: string, traceId: string): Promise<Response> {
  const startTime = new Date().toISOString()
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': ANTHROPIC_KEY!,
      'anthropic-version': '2023-06-01',
      'anthropic-beta': 'prompt-caching-2024-07-31',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      stream: true,
      // system as array enables cache_control — the full prompt is cached since it contains
      // the static base + resume chunks (changes per question but Claude caches the prefix for 5 min)
      system: [{ type: 'text', text: systemPrompt, cache_control: { type: 'ephemeral' } }],
      messages,
    }),
  })
  if (!res.ok) throw new Error(await res.text())

  const reader = res.body!.getReader()
  const decoder = new TextDecoder()

  return makeStream(async (push, done) => {
    let buffer = ''
    let fullOutput = ''
    let inputTokens = 0
    let outputTokens = 0
    let cacheReadTokens = 0
    let cacheCreateTokens = 0
    while (true) {
      const { value, done: streamDone } = await reader.read()
      if (streamDone) break
      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() ?? ''
      for (const line of lines) {
        if (!line.startsWith('data: ')) continue
        const json = line.slice(6).trim()
        if (!json || json === '[DONE]') continue
        try {
          const evt = JSON.parse(json)
          if (evt.type === 'content_block_delta' && evt.delta?.type === 'text_delta') {
            push(evt.delta.text)
            fullOutput += evt.delta.text
          }
          if (evt.type === 'message_start') {
            inputTokens = evt.message?.usage?.input_tokens ?? 0
            cacheReadTokens = evt.message?.usage?.cache_read_input_tokens ?? 0
            cacheCreateTokens = evt.message?.usage?.cache_creation_input_tokens ?? 0
          }
          if (evt.type === 'message_delta') {
            outputTokens = evt.usage?.output_tokens ?? 0
          }
        } catch { /* skip malformed lines */ }
      }
    }
    push('\n\n_via Claude_')
    createGeneration({
      traceId, name: 'chat', model: 'claude-haiku-4-5-20251001',
      input: messages, output: fullOutput,
      startTime, endTime: new Date().toISOString(),
      promptTokens: inputTokens, completionTokens: outputTokens,
      metadata: { cacheReadTokens, cacheCreateTokens },
    })
    done()
  })
}

async function streamOpenAI(messages: Message[], systemPrompt: string, traceId: string): Promise<Response> {
  const startTime = new Date().toISOString()
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENAI_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      max_tokens: 1024,
      stream: true,
      stream_options: { include_usage: true },
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
    }),
  })
  if (!res.ok) throw new Error(await res.text())

  const reader = res.body!.getReader()
  const decoder = new TextDecoder()

  return makeStream(async (push, done) => {
    let buffer = ''
    let fullOutput = ''
    let inputTokens = 0
    let outputTokens = 0
    while (true) {
      const { value, done: streamDone } = await reader.read()
      if (streamDone) break
      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() ?? ''
      for (const line of lines) {
        if (!line.startsWith('data: ')) continue
        const json = line.slice(6).trim()
        if (!json || json === '[DONE]') continue
        try {
          const evt = JSON.parse(json)
          const token = evt.choices?.[0]?.delta?.content
          if (token) { push(token); fullOutput += token }
          if (evt.usage) {
            inputTokens = evt.usage.prompt_tokens ?? 0
            outputTokens = evt.usage.completion_tokens ?? 0
          }
        } catch { /* skip malformed lines */ }
      }
    }
    push('\n\n_via GPT-4o mini_')
    createGeneration({
      traceId, name: 'chat', model: 'gpt-4o-mini',
      input: messages, output: fullOutput,
      startTime, endTime: new Date().toISOString(),
      promptTokens: inputTokens, completionTokens: outputTokens,
    })
    done()
  })
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { content: 'Too many requests. Please wait a few minutes before trying again.' },
      { status: 429 },
    )
  }

  const { messages } = await req.json()

  if (!ANTHROPIC_KEY && !OPENAI_KEY) {
    return NextResponse.json(
      { content: 'Chat is not configured yet. No API keys found.' },
      { status: 200 },
    )
  }

  const lastUserMessage = [...messages].reverse().find((m: Message) => m.role === 'user')?.content ?? ''
  const traceId = await createTrace('chat', { question: lastUserMessage })

  // RAG: embed the latest user question and find relevant chunks
  let systemPrompt = SYSTEM_PROMPT_BASE
  try {
    const embedding = await embedQuestion(lastUserMessage)
    const chunks = await searchChunks(embedding)
    const reranked = await rerankChunks(lastUserMessage, chunks)
    systemPrompt = buildSystemPrompt(reranked)
  } catch (err) {
    console.error('RAG failed, falling back to base prompt:', err)
  }

  try {
    if (ANTHROPIC_ENABLED && ANTHROPIC_KEY) {
      return await streamAnthropic(messages, systemPrompt, traceId)
    }
    if (!OPENAI_ENABLED || !OPENAI_KEY) throw new Error('No enabled provider')
    return await streamOpenAI(messages, systemPrompt, traceId)
  } catch (err) {
    console.error('Primary provider failed, falling back to OpenAI:', err)
    if (!OPENAI_ENABLED || !OPENAI_KEY) {
      return NextResponse.json(
        { content: 'Something went wrong. Please try again.' },
        { status: 200 },
      )
    }
    try {
      return await streamOpenAI(messages, systemPrompt, traceId)
    } catch (err2) {
      console.error('OpenAI also failed:', err2)
      return NextResponse.json(
        { content: 'Something went wrong. Please try again.' },
        { status: 200 },
      )
    }
  }
}

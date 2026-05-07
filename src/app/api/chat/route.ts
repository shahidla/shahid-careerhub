import { NextRequest, NextResponse } from 'next/server'

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY
const OPENAI_KEY = process.env.OPENAI_API_KEY
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const COHERE_KEY = process.env.COHERE_API_KEY

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

IMPORTANT: Only answer questions about Shahid M Syed — his experience, availability, skills, and fit for roles. If a question is not about Shahid or evaluating a role against his profile, politely decline.

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

async function streamAnthropic(messages: Message[], systemPrompt: string): Promise<Response> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': ANTHROPIC_KEY!,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      stream: true,
      system: systemPrompt,
      messages,
    }),
  })
  if (!res.ok) throw new Error(await res.text())

  const reader = res.body!.getReader()
  const decoder = new TextDecoder()

  return makeStream(async (push, done) => {
    let buffer = ''
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
          }
        } catch { /* skip malformed lines */ }
      }
    }
    push('\n\n_via Claude_')
    done()
  })
}

async function streamOpenAI(messages: Message[], systemPrompt: string): Promise<Response> {
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
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
    }),
  })
  if (!res.ok) throw new Error(await res.text())

  const reader = res.body!.getReader()
  const decoder = new TextDecoder()

  return makeStream(async (push, done) => {
    let buffer = ''
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
          if (token) push(token)
        } catch { /* skip malformed lines */ }
      }
    }
    push('\n\n_via GPT-4o mini_')
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

  // RAG: embed the latest user question and find relevant chunks
  const lastUserMessage = [...messages].reverse().find((m: Message) => m.role === 'user')?.content ?? ''
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
    if (ANTHROPIC_KEY) {
      return await streamAnthropic(messages, systemPrompt)
    }
    throw new Error('No Anthropic key')
  } catch (err) {
    console.error('Anthropic failed, falling back to OpenAI:', err)
    if (!OPENAI_KEY) {
      return NextResponse.json(
        { content: 'Something went wrong. Please try again.' },
        { status: 200 },
      )
    }
    try {
      return await streamOpenAI(messages, systemPrompt)
    } catch (err2) {
      console.error('OpenAI also failed:', err2)
      return NextResponse.json(
        { content: 'Something went wrong. Please try again.' },
        { status: 200 },
      )
    }
  }
}

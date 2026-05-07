import { NextRequest, NextResponse } from 'next/server'

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY
const OPENAI_KEY = process.env.OPENAI_API_KEY
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

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
    body: JSON.stringify({ query_embedding: embedding, match_count: 5 }),
  })
  if (!res.ok) throw new Error(`Vector search failed: ${await res.text()}`)
  const rows = await res.json()
  return rows.map((r: { content: string }) => r.content)
}

// ─── Rate limiter ─────────────────────────────────────────────────────────────

// Simple in-memory rate limiter: 20 requests per IP per 10 minutes
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

const SYSTEM_PROMPT_BASE = `You are an AI assistant representing Shahid M Syed's resume and professional profile.
You help recruiters and hiring managers understand Shahid's experience, skills, and fit for roles.

IMPORTANT: You ONLY answer questions about Shahid M Syed — his experience, skills, projects, certifications, and fit for specific roles. If the question is not about Shahid or evaluating a job description against his profile, politely decline and redirect the user to ask about Shahid. Do not answer general questions, write code, explain technologies in general terms, or discuss unrelated topics.

When a user pastes a job description, analyse it and provide:
1. A match score (0–100%)
2. Key strengths aligned to the role
3. Potential gaps or areas to address
4. A one-paragraph summary of fit

Be direct, helpful, and honest. Keep responses concise unless the user asks for detail.`

function buildSystemPrompt(chunks: string[]): string {
  if (chunks.length === 0) return SYSTEM_PROMPT_BASE
  return `${SYSTEM_PROMPT_BASE}

## Shahid's Resume Data (use this to answer the question)

${chunks.map((c, i) => `[${i + 1}] ${c}`).join('\n\n')}`
}

type Message = { role: string; content: string }

async function callAnthropic(messages: Message[], systemPrompt: string): Promise<string> {
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
      system: systemPrompt,
      messages,
    }),
  })
  if (!res.ok) throw new Error(await res.text())
  const data = await res.json()
  return (data.content?.[0]?.text ?? 'No response.') + '\n\n_via Claude_'
}

async function callOpenAI(messages: Message[], systemPrompt: string): Promise<string> {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENAI_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      max_tokens: 1024,
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
    }),
  })
  if (!res.ok) throw new Error(await res.text())
  const data = await res.json()
  return (data.choices?.[0]?.message?.content ?? 'No response.') + '\n\n_via GPT-4o mini_'
}

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
    systemPrompt = buildSystemPrompt(chunks)
  } catch (err) {
    console.error('RAG failed, falling back to base prompt:', err)
  }

  try {
    if (ANTHROPIC_KEY) {
      const content = await callAnthropic(messages, systemPrompt)
      return NextResponse.json({ content })
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
      const content = await callOpenAI(messages, systemPrompt)
      return NextResponse.json({ content })
    } catch (err2) {
      console.error('OpenAI also failed:', err2)
      return NextResponse.json(
        { content: 'Something went wrong. Please try again.' },
        { status: 200 },
      )
    }
  }
}

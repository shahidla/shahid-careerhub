import { NextRequest, NextResponse } from 'next/server'

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY
const OPENAI_KEY = process.env.OPENAI_API_KEY

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

const SYSTEM_PROMPT = `You are an AI assistant representing Shahid M Syed's resume and professional profile.
You help recruiters and hiring managers understand Shahid's experience, skills, and fit for roles.

IMPORTANT: You ONLY answer questions about Shahid M Syed — his experience, skills, projects, certifications, and fit for specific roles. If the question is not about Shahid or evaluating a job description against his profile, politely decline and redirect the user to ask about Shahid. Do not answer general questions, write code, explain technologies in general terms, or discuss unrelated topics.

About Shahid:
- SAP Development Architect with 19 years of enterprise SAP experience
- Deep expertise in S/4HANA modernisation, ABAP on HANA, BTP, RAP, CDS, AMDP
- AI engineering work: built MCP server for AI-assisted SAP execution (Commonwealth Bank), ML models at SAP Labs (PAL/APL/R), anomaly detection in financial processing (Services Australia)
- Currently building AI Career Hub — RAG chatbot, pgvector embeddings, Claude API, Next.js 14
- Patent holder: US10304013B2 (Real-Time Speech and Predictive Analytics for accessibility)
- 7 published AI blogs on SAP Community
- Winner Google TensorFlow IoT Challenge (SAP Labs, 2017)
- Based in Australia

When a user pastes a job description, analyse it and provide:
1. A match score (0–100%)
2. Key strengths aligned to the role
3. Potential gaps or areas to address
4. A one-paragraph summary of fit

Be direct, helpful, and honest. Keep responses concise unless the user asks for detail.`

type Message = { role: string; content: string }

async function callAnthropic(messages: Message[]): Promise<string> {
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
      system: SYSTEM_PROMPT,
      messages,
    }),
  })
  if (!res.ok) throw new Error(await res.text())
  const data = await res.json()
  return (data.content?.[0]?.text ?? 'No response.') + '\n\n_via Claude_'
}

async function callOpenAI(messages: Message[]): Promise<string> {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENAI_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      max_tokens: 1024,
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
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

  try {
    if (ANTHROPIC_KEY) {
      const content = await callAnthropic(messages)
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
      const content = await callOpenAI(messages)
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

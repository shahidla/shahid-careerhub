import { NextResponse } from 'next/server'

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY
const OPENAI_KEY = process.env.OPENAI_API_KEY
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

type Project = {
  id: string
  name: string
  client: string
  description: string
  impact: string
  technologies: string[]
  is_ai: boolean
}

async function generateSummary(project: Project): Promise<string> {
  const prompt = `Write a 2-3 sentence executive summary for this project, written for a recruiter or hiring manager. Be specific about what was built, the business impact, and the key technologies. Do not start with "I". Do not use bullet points.

Project name: ${project.name}
Client: ${project.client}
Description: ${project.description}
Impact: ${project.impact}
Technologies: ${project.technologies.join(', ')}
AI project: ${project.is_ai ? 'Yes' : 'No'}`

  if (ANTHROPIC_KEY) {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 256,
        messages: [{ role: 'user', content: prompt }],
      }),
    })
    if (res.ok) {
      const data = await res.json()
      return data.content[0].text.trim()
    }
    console.error('Anthropic failed, falling back to OpenAI:', await res.text())
  }

  if (OPENAI_KEY) {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENAI_KEY}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        max_tokens: 256,
        messages: [{ role: 'user', content: prompt }],
      }),
    })
    if (!res.ok) throw new Error(`OpenAI failed: ${await res.text()}`)
    const data = await res.json()
    return data.choices[0].message.content.trim()
  }

  throw new Error('No LLM API key configured')
}

async function saveSummary(id: string, summary: string): Promise<void> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/projects?id=eq.${id}`, {
    method: 'PATCH',
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'content-type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({ ai_summary: summary }),
  })
  if (!res.ok) throw new Error(`Supabase PATCH failed: ${await res.text()}`)
}

export async function GET() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/projects?order=sort_order.asc`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
  })
  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
  const projects: Project[] = await res.json()

  const results: { id: string; name: string; status: string; summary?: string; error?: string }[] = []

  for (const project of projects) {
    try {
      const summary = await generateSummary(project)
      await saveSummary(project.id, summary)
      results.push({ id: project.id, name: project.name, status: 'ok', summary })
    } catch (err) {
      results.push({ id: project.id, name: project.name, status: 'error', error: String(err) })
    }
  }

  const succeeded = results.filter((r) => r.status === 'ok').length
  const failed = results.filter((r) => r.status === 'error').length

  return NextResponse.json({ succeeded, failed, results })
}

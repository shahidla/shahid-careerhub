import { NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/jobs?select=id`, {
    method: 'GET',
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
  })
  if (!res.ok) return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 })
  const jobs: { id: string }[] = await res.json()
  if (jobs.length === 0) return NextResponse.json({ reset: 0 })

  const ids = jobs.map((j) => j.id).join(',')
  const patch = await fetch(`${SUPABASE_URL}/rest/v1/jobs?id=in.(${ids})`, {
    method: 'PATCH',
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, 'content-type': 'application/json', Prefer: 'return=minimal' },
    body: JSON.stringify({ match_score: null, match_reasoning: null }),
  })
  if (!patch.ok) return NextResponse.json({ error: await patch.text() }, { status: 500 })

  return NextResponse.json({ reset: jobs.length })
}

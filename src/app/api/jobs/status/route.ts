import { NextRequest, NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

const VALID_STATUSES = ['new', 'saved', 'applied', 'interviewing', 'ignored', 'closed']

export async function PATCH(req: NextRequest) {
  const { id, status } = await req.json()
  if (!id || !VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: 'Invalid id or status' }, { status: 400 })
  }

  const res = await fetch(`${SUPABASE_URL}/rest/v1/jobs?id=eq.${id}`, {
    method: 'PATCH',
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'content-type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({ status, updated_at: new Date().toISOString() }),
  })

  if (!res.ok) {
    return NextResponse.json({ error: await res.text() }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}

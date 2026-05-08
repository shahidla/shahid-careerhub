import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://shahid-careerhub.vercel.app'

export async function POST() {
  // Step 1: Fetch new jobs
  const fetchRes = await fetch(`${BASE_URL}/api/fetch-jobs`, { method: 'GET' })
  if (!fetchRes.ok) return NextResponse.json({ error: 'fetch-jobs failed' }, { status: 500 })
  const fetchData = await fetchRes.json()
  const fetched: number = fetchData.totalNew ?? 0

  // Step 2: Score all unscored jobs (loop until none remain)
  let scored = 0
  if (fetched > 0) {
    while (true) {
      const scoreRes = await fetch(`${BASE_URL}/api/score-batch`, { method: 'POST' })
      if (!scoreRes.ok) break
      const scoreData = await scoreRes.json()
      scored += scoreData.scored ?? 0
      if ((scoreData.remaining ?? 0) <= 0) break
    }
  }

  return NextResponse.json({ fetched, scored })
}

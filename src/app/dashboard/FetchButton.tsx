'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function FetchButton() {
  const [loading, setLoading] = useState(false)
  const [rescoring, setRescoring] = useState(false)
  const [status, setStatus] = useState<string | null>(null)
  const router = useRouter()

  async function runScoring(label: string) {
    let total = 0
    while (true) {
      const res = await fetch('/api/score-batch', { method: 'POST' })
      if (!res.ok) { setStatus(`${label} — scoring error`); break }
      const data = await res.json()
      total += data.scored ?? 0
      setStatus(`${label} — scored ${total}…`)
      if ((data.remaining ?? 0) <= 0) break
    }
    setStatus(`${label} — ${total} scored`)
    router.refresh()
  }

  async function handleFetch() {
    setLoading(true)
    setStatus(null)
    try {
      const res = await fetch('/api/fetch-jobs')
      const data = await res.json()
      const totalNew = data.totalNew ?? 0
      setStatus(`${totalNew} new jobs`)
      if (totalNew > 0) await runScoring(`${totalNew} new`)
      else { setStatus('0 new jobs'); router.refresh() }
    } catch {
      setStatus('Error fetching jobs')
    } finally {
      setLoading(false)
    }
  }

  async function handleRescore() {
    setRescoring(true)
    setStatus(null)
    try {
      // Null all scores first
      await fetch('/api/rescore-jobs', { method: 'POST' })
      await runScoring('Re-scoring')
    } catch {
      setStatus('Error re-scoring')
    } finally {
      setRescoring(false)
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex gap-2">
        <button
          onClick={handleRescore}
          disabled={loading || rescoring}
          className="text-sm bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-gray-600 font-medium px-4 py-2 rounded-lg transition-colors"
        >
          {rescoring ? 'Re-scoring…' : 'Re-score all'}
        </button>
        <button
          onClick={handleFetch}
          disabled={loading || rescoring}
          className="text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium px-4 py-2 rounded-lg transition-colors"
        >
          {loading ? 'Fetching…' : 'Fetch now'}
        </button>
      </div>
      {status && <span className="text-xs text-gray-500">{status}</span>}
    </div>
  )
}

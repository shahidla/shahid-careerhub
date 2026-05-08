'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function FetchButton() {
  const [loading, setLoading] = useState(false)
  const [rescoring, setRescoring] = useState(false)
  const [status, setStatus] = useState<string | null>(null)
  const router = useRouter()

  async function handleFetch() {
    setLoading(true)
    setStatus(null)
    try {
      const res = await fetch('/api/pipeline/run', { method: 'POST' })
      if (!res.ok) { setStatus('Pipeline error'); return }
      const data = await res.json()
      setStatus(`${data.fetched ?? 0} fetched · ${data.scored ?? 0} scored`)
      router.refresh()
    } catch {
      setStatus('Error running pipeline')
    } finally {
      setLoading(false)
    }
  }

  async function handleRescore() {
    setRescoring(true)
    setStatus(null)
    let errored = false
    try {
      const resetRes = await fetch('/api/rescore-jobs', { method: 'POST' })
      if (!resetRes.ok) { setStatus('Reset failed'); return }
      let total = 0
      while (true) {
        const res = await fetch('/api/score-batch', { method: 'POST' })
        if (!res.ok) { setStatus(`Scoring error after ${total} scored`); errored = true; break }
        const data = await res.json()
        total += data.scored ?? 0
        setStatus(`Re-scoring — scored ${total}…`)
        if ((data.remaining ?? 0) <= 0) break
      }
      if (!errored) { setStatus(`Re-scored ${total} jobs`); router.refresh() }
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

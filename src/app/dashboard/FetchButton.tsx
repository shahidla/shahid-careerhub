'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function FetchButton() {
  const [loading, setLoading] = useState(false)
  const [rescoring, setRescoring] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const router = useRouter()

  async function handleFetch() {
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/fetch-jobs')
      const data = await res.json()
      const totalNew = data.totalNew ?? 0
      const scored = data.scoring?.scored ?? 0
      setResult(`${totalNew} new · ${scored} scored`)
      router.refresh()
    } catch {
      setResult('Error fetching jobs')
    } finally {
      setLoading(false)
    }
  }

  async function handleRescore() {
    setRescoring(true)
    setResult(null)
    try {
      // Reset all scores
      await fetch('/api/rescore-jobs', { method: 'POST' })
      // Re-run scoring via fetch-jobs (scoring picks up match_score=null)
      const res = await fetch('/api/fetch-jobs')
      const data = await res.json()
      const scored = data.scoring?.scored ?? 0
      setResult(`Re-scored ${scored} jobs`)
      router.refresh()
    } catch {
      setResult('Error re-scoring')
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
      {result && <span className="text-xs text-gray-500">{result}</span>}
    </div>
  )
}

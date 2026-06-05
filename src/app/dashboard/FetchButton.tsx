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
      const response = await fetch('/api/pipeline/run', { method: 'POST' })
      if (!response.ok) {
        setStatus('Pipeline error')
        return
      }

      const data = await response.json()
      setStatus(`${data.fetched ?? 0} fetched | ${data.scored ?? 0} scored`)
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
      const resetResponse = await fetch('/api/rescore-jobs', { method: 'POST' })
      if (!resetResponse.ok) {
        setStatus('Reset failed')
        return
      }

      let total = 0
      while (true) {
        const response = await fetch('/api/score-batch', { method: 'POST' })
        if (!response.ok) {
          setStatus(`Scoring error after ${total} scored`)
          errored = true
          break
        }

        const data = await response.json()
        total += data.scored ?? 0
        setStatus(`Re-scoring... scored ${total}`)

        if ((data.remaining ?? 0) <= 0) break
      }

      if (!errored) {
        setStatus(`Re-scored ${total} jobs`)
        router.refresh()
      }
    } catch {
      setStatus('Error re-scoring')
    } finally {
      setRescoring(false)
    }
  }

  return (
    <div className="flex flex-col items-end gap-1.5">
      <div className="flex gap-2">
        <button
          onClick={handleRescore}
          disabled={loading || rescoring}
          className="text-sm bg-surface-200 hover:bg-surface-300 disabled:opacity-50 text-gray-300 border border-surface-300/50 font-medium px-4 py-2 rounded-lg transition-colors"
        >
          {rescoring ? 'Re-scoring...' : 'Re-score all'}
        </button>
        <button
          onClick={handleFetch}
          disabled={loading || rescoring}
          className="text-sm bg-accent-blue hover:bg-blue-500 disabled:bg-surface-300 text-white font-medium px-4 py-2 rounded-lg transition-colors"
        >
          {loading ? 'Fetching...' : 'Fetch now'}
        </button>
      </div>
      {status && <span className="text-xs text-gray-500">{status}</span>}
    </div>
  )
}

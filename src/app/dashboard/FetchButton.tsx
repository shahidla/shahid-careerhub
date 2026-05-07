'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function FetchButton() {
  const [loading, setLoading] = useState(false)
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

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleFetch}
        disabled={loading}
        className="text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium px-4 py-2 rounded-lg transition-colors"
      >
        {loading ? 'Fetching…' : 'Fetch now'}
      </button>
      {result && <span className="text-xs text-gray-500">{result}</span>}
    </div>
  )
}

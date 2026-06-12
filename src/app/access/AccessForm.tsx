'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AccessForm({ nextPath }: { nextPath: string }) {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, next: nextPath }),
      })

      const data = await response.json()
      if (!response.ok) {
        setError(data.error ?? 'Access failed.')
        return
      }

      router.replace(data.redirectTo ?? '/chat')
      router.refresh()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="password"
        value={password}
        onChange={(event) => {
          setPassword(event.target.value)
          setError(null)
        }}
        placeholder="Access password"
        className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue ${
          error ? 'border-red-300' : 'border-gray-200'
        }`}
        autoFocus
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={!password || loading}
        className="w-full bg-accent-blue hover:bg-accent-blue/80 disabled:bg-surface-300 text-white text-sm font-medium px-4 py-3 rounded-xl transition-colors"
      >
        {loading ? 'Checking...' : 'Continue'}
      </button>
    </form>
  )
}

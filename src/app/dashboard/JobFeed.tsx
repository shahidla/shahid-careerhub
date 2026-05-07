'use client'

import { useState } from 'react'
import type { Job } from '@/lib/db'

const SOURCE_LABELS: Record<string, string> = {
  freelancermap: 'FreelancerMap',
  freelancermap_au: 'FreelancerMap AU',
  eursap: 'EurSAP',
  remotive: 'Remotive',
  sapcontractors: 'SAP Contractors',
  adzuna_au: 'Adzuna AU',
  manual: 'Manual',
}

const STATUS_COLOURS: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  saved: 'bg-purple-100 text-purple-700',
  applied: 'bg-green-100 text-green-700',
  interviewing: 'bg-yellow-100 text-yellow-700',
  ignored: 'bg-gray-100 text-gray-400',
  closed: 'bg-red-50 text-red-400',
}

function timeAgo(date: string | null): string {
  if (!date) return ''
  const diff = Date.now() - new Date(date).getTime()
  const h = Math.floor(diff / 3600000)
  if (h < 1) return 'just now'
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  return `${d}d ago`
}

function JobCard({ job, index }: { job: Job; index: number }) {
  const [status, setStatus] = useState(job.status)
  const [saving, setSaving] = useState(false)
  const [showReasoning, setShowReasoning] = useState(false)

  async function updateStatus(newStatus: string) {
    setSaving(true)
    await fetch('/api/jobs/status', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: job.id, status: newStatus }),
    })
    setStatus(newStatus)
    setSaving(false)
  }

  return (
    <div className={`bg-white border rounded-xl p-5 transition-colors ${status === 'ignored' || status === 'closed' ? 'opacity-50' : 'border-gray-200 hover:border-gray-300'}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-300 font-mono shrink-0">#{index}</span>
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-gray-900 hover:text-blue-700 hover:underline text-sm leading-snug"
            >
              {job.title}
            </a>
            {job.match_score != null && (
              <button
                onClick={() => setShowReasoning(!showReasoning)}
                className={`text-xs font-semibold px-2 py-0.5 rounded-full cursor-pointer hover:opacity-80 ${
                  job.match_score >= 75 ? 'bg-green-100 text-green-700' :
                  job.match_score >= 50 ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-500'
                }`}
              >
                {job.match_score}% match
              </button>
            )}
          </div>
          {showReasoning && job.match_reasoning && (
            <p className="mt-1 text-xs text-gray-500 italic">{job.match_reasoning}</p>
          )}
          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 flex-wrap">
            {job.company && <span>{job.company}</span>}
            {job.company && job.location && <span>·</span>}
            {job.location && <span>{job.location}</span>}
            {job.salary && <><span>·</span><span className="text-green-700 font-medium">{job.salary}</span></>}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLOURS[status] ?? STATUS_COLOURS.new}`}>
            {status}
          </span>
          <span className="text-xs text-gray-400 whitespace-nowrap">
            {SOURCE_LABELS[job.source] ?? job.source}
          </span>
        </div>
      </div>

      {job.description && (
        <p className="mt-2 text-xs text-gray-600 leading-relaxed line-clamp-2">
          {job.description}
        </p>
      )}

      {job.tags && job.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {job.tags.slice(0, 6).map((t) => (
            <span key={t} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
              {t}
            </span>
          ))}
        </div>
      )}

      {/* Action buttons */}
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-gray-400">{timeAgo(job.posted_at ?? job.fetched_at)}</span>
        <div className="flex gap-1.5">
          {status === 'new' && (
            <>
              <button onClick={() => updateStatus('saved')} disabled={saving}
                className="text-xs px-2.5 py-1 rounded-lg border border-purple-200 text-purple-700 hover:bg-purple-50 transition-colors disabled:opacity-50">
                Save
              </button>
              <button onClick={() => updateStatus('ignored')} disabled={saving}
                className="text-xs px-2.5 py-1 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-50">
                Ignore
              </button>
            </>
          )}
          {status === 'saved' && (
            <>
              <button onClick={() => updateStatus('applied')} disabled={saving}
                className="text-xs px-2.5 py-1 rounded-lg border border-green-200 text-green-700 hover:bg-green-50 transition-colors disabled:opacity-50">
                Mark Applied
              </button>
              <button onClick={() => updateStatus('ignored')} disabled={saving}
                className="text-xs px-2.5 py-1 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-50">
                Ignore
              </button>
            </>
          )}
          {status === 'applied' && (
            <button onClick={() => updateStatus('interviewing')} disabled={saving}
              className="text-xs px-2.5 py-1 rounded-lg border border-yellow-200 text-yellow-700 hover:bg-yellow-50 transition-colors disabled:opacity-50">
              Interviewing
            </button>
          )}
          {(status === 'ignored' || status === 'closed') && (
            <button onClick={() => updateStatus('new')} disabled={saving}
              className="text-xs px-2.5 py-1 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-50">
              Restore
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function JobFeed({ jobs }: { jobs: Job[] }) {
  const [showIgnored, setShowIgnored] = useState(false)

  const visible = showIgnored ? jobs : jobs.filter((j) => j.status !== 'ignored' && j.status !== 'closed')
  const hiddenCount = jobs.length - visible.length

  if (jobs.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        <p className="text-lg font-medium mb-2">No jobs yet</p>
        <p className="text-sm">Click &ldquo;Fetch now&rdquo; to pull the latest SAP jobs.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="space-y-3">
        {visible.map((job, i) => (
          <JobCard key={job.id} job={job} index={i + 1} />
        ))}
      </div>
      {hiddenCount > 0 && (
        <button
          onClick={() => setShowIgnored(!showIgnored)}
          className="mt-4 text-xs text-gray-400 hover:text-gray-600 underline"
        >
          {showIgnored ? 'Hide' : `Show ${hiddenCount} ignored/closed`}
        </button>
      )}
    </div>
  )
}

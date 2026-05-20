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

const LOW_SIGNAL_THRESHOLD = 45
const STALE_DAYS = 21

function timeAgo(date: string | null): string {
  if (!date) return ''
  const diff = Date.now() - new Date(date).getTime()
  const hours = Math.floor(diff / 3600000)
  if (hours < 1) return 'just now'
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

function getJobDate(job: Job): string | null {
  return job.posted_at ?? job.fetched_at ?? null
}

function ageInDays(date: string | null): number | null {
  if (!date) return null
  const diff = Date.now() - new Date(date).getTime()
  return Math.floor(diff / 86400000)
}

function isLowSignal(job: Job): boolean {
  return job.status === 'new' && job.match_score != null && job.match_score < LOW_SIGNAL_THRESHOLD
}

function isStale(job: Job): boolean {
  const days = ageInDays(getJobDate(job))
  return job.status === 'new' && days != null && days > STALE_DAYS
}

function isArchived(job: Job): boolean {
  return job.status === 'ignored' || job.status === 'closed'
}

function JobCard({ job, index }: { job: Job; index: number }) {
  const [status, setStatus] = useState(job.status)
  const [saving, setSaving] = useState(false)
  const [showReasoning, setShowReasoning] = useState(false)
  const stale = isStale(job)
  const lowSignal = isLowSignal(job)

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
            {lowSignal && <span className="text-xs rounded-full bg-amber-50 px-2 py-0.5 font-medium text-amber-700">Low signal</span>}
            {stale && <span className="text-xs rounded-full bg-gray-100 px-2 py-0.5 font-medium text-gray-500">Older than 3 weeks</span>}
          </div>
          {showReasoning && job.match_reasoning && (
            <p className="mt-1 text-xs text-gray-500 italic">{job.match_reasoning}</p>
          )}
          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 flex-wrap">
            {job.company && <span>{job.company}</span>}
            {job.company && job.location && <span>|</span>}
            {job.location && <span>{job.location}</span>}
            {job.salary && <><span>|</span><span className="text-green-700 font-medium">{job.salary}</span></>}
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
          {job.tags.slice(0, 6).map((tag) => (
            <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-gray-400">{timeAgo(getJobDate(job))}</span>
        <div className="flex gap-1.5">
          {status === 'new' && (
            <>
              <button onClick={() => updateStatus('saved')} disabled={saving} className="text-xs px-2.5 py-1 rounded-lg border border-purple-200 text-purple-700 hover:bg-purple-50 transition-colors disabled:opacity-50">
                Save
              </button>
              <button onClick={() => updateStatus('ignored')} disabled={saving} className="text-xs px-2.5 py-1 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-50">
                Ignore
              </button>
            </>
          )}
          {status === 'saved' && (
            <>
              <button onClick={() => updateStatus('applied')} disabled={saving} className="text-xs px-2.5 py-1 rounded-lg border border-green-200 text-green-700 hover:bg-green-50 transition-colors disabled:opacity-50">
                Mark Applied
              </button>
              <button onClick={() => updateStatus('ignored')} disabled={saving} className="text-xs px-2.5 py-1 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-50">
                Ignore
              </button>
            </>
          )}
          {status === 'applied' && (
            <button onClick={() => updateStatus('interviewing')} disabled={saving} className="text-xs px-2.5 py-1 rounded-lg border border-yellow-200 text-yellow-700 hover:bg-yellow-50 transition-colors disabled:opacity-50">
              Interviewing
            </button>
          )}
          {(status === 'ignored' || status === 'closed') && (
            <button onClick={() => updateStatus('new')} disabled={saving} className="text-xs px-2.5 py-1 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-50">
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
  const [showLowPriority, setShowLowPriority] = useState(false)

  const hiddenArchivedCount = jobs.filter(isArchived).length
  const hiddenLowPriorityCount = jobs.filter((job) => !isArchived(job) && (isLowSignal(job) || isStale(job))).length
  const visibleJobs = jobs.filter((job) => {
    if (!showIgnored && isArchived(job)) return false
    if (!showLowPriority && !isArchived(job) && (isLowSignal(job) || isStale(job))) return false
    return true
  })

  if (jobs.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        <p className="text-lg font-medium mb-2">No jobs yet</p>
        <p className="text-sm">Click &quot;Fetch now&quot; to pull the latest SAP jobs.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2 text-xs">
        <button
          onClick={() => setShowLowPriority(!showLowPriority)}
          className="rounded-full border border-gray-200 px-3 py-1 text-gray-600 transition-colors hover:bg-gray-100"
        >
          {showLowPriority ? 'Hide' : `Show ${hiddenLowPriorityCount}`} low-priority / stale
        </button>
        {hiddenArchivedCount > 0 && (
          <button
            onClick={() => setShowIgnored(!showIgnored)}
            className="rounded-full border border-gray-200 px-3 py-1 text-gray-600 transition-colors hover:bg-gray-100"
          >
            {showIgnored ? 'Hide' : `Show ${hiddenArchivedCount}`} ignored / closed
          </button>
        )}
      </div>

      <div className="space-y-3">
        {visibleJobs.map((job, index) => (
          <JobCard key={job.id} job={job} index={index + 1} />
        ))}
      </div>
    </div>
  )
}

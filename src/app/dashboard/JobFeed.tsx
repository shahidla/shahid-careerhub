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
  new: 'bg-accent-blue/15 text-accent-blue border border-accent-blue/20',
  saved: 'bg-accent-purple/15 text-accent-purple border border-accent-purple/20',
  applied: 'bg-accent-emerald/15 text-accent-emerald border border-accent-emerald/20',
  interviewing: 'bg-yellow-500/15 text-yellow-500 border border-yellow-500/20',
  ignored: 'bg-surface-200 text-gray-500 border border-surface-300/40',
  closed: 'bg-red-500/15 text-red-400 border border-red-500/20',
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
    <div className={`glass-card p-5 border ${status === 'ignored' || status === 'closed' ? 'opacity-40 border-surface-300/20' : 'border-surface-300/40 hover:border-surface-400'}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-600 font-mono shrink-0">#{index}</span>
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-gray-100 hover:text-accent-blue hover:underline text-sm leading-snug transition-colors"
            >
              {job.title}
            </a>
            {job.match_score != null && (
              <button
                onClick={() => setShowReasoning(!showReasoning)}
                className={`text-xs font-semibold px-2 py-0.5 rounded-full border cursor-pointer hover:opacity-85 transition-opacity ${
                  job.match_score >= 75 ? 'bg-accent-emerald/15 text-accent-emerald border-accent-emerald/20' :
                  job.match_score >= 50 ? 'bg-yellow-500/15 text-yellow-500 border-yellow-500/20' :
                  'bg-surface-200 text-gray-400 border-surface-300/40'
                }`}
              >
                {job.match_score}% match
              </button>
            )}
            {lowSignal && <span className="text-xs rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/20 px-2 py-0.5 font-medium">Low signal</span>}
            {stale && <span className="text-xs rounded-full bg-surface-200 text-gray-400 border border-surface-300/40 px-2 py-0.5 font-medium">Older than 3 weeks</span>}
          </div>
          {showReasoning && job.match_reasoning && (
            <p className="mt-2 text-xs text-gray-400 italic bg-surface-200/50 p-2.5 rounded-lg border border-surface-300/30">{job.match_reasoning}</p>
          )}
          <div className="flex items-center gap-2 mt-2 text-xs text-gray-400 flex-wrap">
            {job.company && <span>{job.company}</span>}
            {job.company && job.location && <span>|</span>}
            {job.location && <span>{job.location}</span>}
            {job.salary && <><span>|</span><span className="text-accent-emerald font-medium">{job.salary}</span></>}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLOURS[status] ?? STATUS_COLOURS.new}`}>
            {status}
          </span>
          <span className="text-xs text-gray-500 whitespace-nowrap">
            {SOURCE_LABELS[job.source] ?? job.source}
          </span>
        </div>
      </div>

      {job.description && (
        <p className="mt-3 text-xs text-gray-400 leading-relaxed line-clamp-2">
          {job.description}
        </p>
      )}

      {job.tags && job.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {job.tags.slice(0, 6).map((tag) => (
            <span key={tag} className="tag-sm">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between border-t border-surface-300/20 pt-3">
        <span className="text-xs text-gray-500">{timeAgo(getJobDate(job))}</span>
        <div className="flex gap-1.5">
          {status === 'new' && (
            <>
              <button onClick={() => updateStatus('saved')} disabled={saving} className="text-xs px-2.5 py-1 rounded-lg border border-accent-purple/40 text-accent-purple hover:bg-accent-purple/10 transition-colors disabled:opacity-50 font-medium">
                Save
              </button>
              <button onClick={() => updateStatus('ignored')} disabled={saving} className="text-xs px-2.5 py-1 rounded-lg border border-surface-300/50 text-gray-400 hover:bg-surface-200 transition-colors disabled:opacity-50 font-medium">
                Ignore
              </button>
            </>
          )}
          {status === 'saved' && (
            <>
              <button onClick={() => updateStatus('applied')} disabled={saving} className="text-xs px-2.5 py-1 rounded-lg border border-accent-emerald/40 text-accent-emerald hover:bg-accent-emerald/10 transition-colors disabled:opacity-50 font-medium">
                Mark Applied
              </button>
              <button onClick={() => updateStatus('ignored')} disabled={saving} className="text-xs px-2.5 py-1 rounded-lg border border-surface-300/50 text-gray-400 hover:bg-surface-200 transition-colors disabled:opacity-50 font-medium">
                Ignore
              </button>
            </>
          )}
          {status === 'applied' && (
            <button onClick={() => updateStatus('interviewing')} disabled={saving} className="text-xs px-2.5 py-1 rounded-lg border border-yellow-500/40 text-yellow-500 hover:bg-yellow-500/10 transition-colors disabled:opacity-50 font-medium">
              Interviewing
            </button>
          )}
          {(status === 'ignored' || status === 'closed') && (
            <button onClick={() => updateStatus('new')} disabled={saving} className="text-xs px-2.5 py-1 rounded-lg border border-surface-300/50 text-gray-400 hover:bg-surface-200 transition-colors disabled:opacity-50 font-medium">
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
      <div className="text-center py-20 text-gray-500">
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
          className="rounded-full border border-surface-300/50 bg-surface-100 px-3 py-1 text-gray-300 transition-colors hover:bg-surface-200 font-medium"
        >
          {showLowPriority ? 'Hide' : `Show ${hiddenLowPriorityCount}`} low-priority / stale
        </button>
        {hiddenArchivedCount > 0 && (
          <button
            onClick={() => setShowIgnored(!showIgnored)}
            className="rounded-full border border-surface-300/50 bg-surface-100 px-3 py-1 text-gray-300 transition-colors hover:bg-surface-200 font-medium"
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

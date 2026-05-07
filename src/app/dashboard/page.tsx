import { getJobs } from '@/lib/db'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Dashboard — Job Feed',
}

const SOURCE_LABELS: Record<string, string> = {
  freelancermap: 'FreelancerMap',
  eursap: 'EurSAP',
  remotive: 'Remotive',
  manual: 'Manual',
}

const STATUS_COLOURS: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  applied: 'bg-green-100 text-green-700',
  ignored: 'bg-gray-100 text-gray-500',
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

export default async function DashboardPage() {
  const jobs = await getJobs(100)

  const newCount = jobs.filter((j) => j.status === 'new').length

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="border-b border-gray-200 px-6 py-3 flex items-center gap-4 text-sm bg-white sticky top-0 z-20">
        <a href="/" className="text-gray-400 hover:text-gray-700">Home</a>
        <a href="/resume" className="text-gray-500 hover:text-gray-900">Resume</a>
        <a href="/ai" className="text-purple-600 hover:text-purple-800">AI Portfolio</a>
        <span className="ml-auto text-gray-900 font-medium">Dashboard</span>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Title row */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Job Feed</h1>
            <p className="text-sm text-gray-500 mt-1">
              {jobs.length} jobs fetched · {newCount} new
            </p>
          </div>
          <a
            href="/api/fetch-jobs"
            className="text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Fetch now
          </a>
        </div>

        {/* Job list */}
        {jobs.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg font-medium mb-2">No jobs yet</p>
            <p className="text-sm">Click &ldquo;Fetch now&rdquo; to pull the latest SAP jobs from all sources.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <a
                        href={job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-gray-900 hover:text-blue-700 hover:underline text-sm leading-snug"
                      >
                        {job.title}
                      </a>
                      {job.match_score != null && (
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          job.match_score >= 75 ? 'bg-green-100 text-green-700' :
                          job.match_score >= 50 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-500'
                        }`}>
                          {job.match_score}% match
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 flex-wrap">
                      {job.company && <span>{job.company}</span>}
                      {job.company && job.location && <span>·</span>}
                      {job.location && <span>{job.location}</span>}
                      {job.salary && <><span>·</span><span className="text-green-700 font-medium">{job.salary}</span></>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLOURS[job.status] ?? STATUS_COLOURS.new}`}>
                      {job.status}
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

                <div className="mt-2 text-xs text-gray-400">
                  {timeAgo(job.posted_at ?? job.fetched_at)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

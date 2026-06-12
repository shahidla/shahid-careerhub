export const dynamic = 'force-dynamic'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

async function dbFetch(path: string, headers: Record<string, string> = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, ...headers },
  })
  if (!res.ok) return null
  return res.json()
}

async function getCount(table: string, filter = ''): Promise<number> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/${table}?${filter}&select=id`,
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Prefer: 'count=exact',
        Range: '0-0',
      },
    }
  )
  return parseInt(res.headers.get('content-range')?.split('/')[1] ?? '0')
}

export default async function AdminPage() {
  const [
    totalJobs, newJobs, savedJobs, appliedJobs, ignoredJobs, unscoredJobs,
    highJobs, medJobs, lowJobs, chunkCount,
    recentJobs,
  ] = await Promise.all([
    getCount('jobs'),
    getCount('jobs', 'status=eq.new'),
    getCount('jobs', 'status=eq.saved'),
    getCount('jobs', 'status=eq.applied'),
    getCount('jobs', 'status=eq.ignored'),
    getCount('jobs', 'match_score=is.null'),
    getCount('jobs', 'match_score=gte.75'),
    getCount('jobs', 'match_score=gte.50&match_score=lt.75'),
    getCount('jobs', 'match_score=lt.50&match_score=not.is.null'),
    getCount('resume_chunks'),
    dbFetch('jobs?select=title,company,source,match_score,status,fetched_at&order=fetched_at.desc&limit=10'),
  ])

  const scoredJobs = totalJobs - unscoredJobs

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-text mb-1">Admin</h1>
        <p className="text-sm text-text-subtle mb-8">Pipeline health · job stats · observability</p>

        {/* Job pipeline stats */}
        <section className="mb-8">
          <h2 className="text-xs font-semibold text-text-subtle uppercase tracking-wider mb-3">Job Pipeline</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Total jobs', value: totalJobs },
              { label: 'Scored', value: scoredJobs },
              { label: 'Unscored', value: unscoredJobs, alert: unscoredJobs > 0 },
              { label: 'Resume chunks', value: chunkCount, alert: chunkCount === 0 },
            ].map(({ label, value, alert }) => (
              <div key={label} className={`bg-surface-50 rounded-lg border p-4 ${alert ? 'border-yellow-300' : 'border-surface-300/50'}`}>
                <div className={`text-2xl font-bold ${alert ? 'text-yellow-600' : 'text-text'}`}>{value}</div>
                <div className="text-xs text-text-subtle mt-1">{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Status breakdown */}
        <section className="mb-8">
          <h2 className="text-xs font-semibold text-text-subtle uppercase tracking-wider mb-3">By Status</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'New', value: newJobs, color: 'text-blue-600' },
              { label: 'Saved', value: savedJobs, color: 'text-green-600' },
              { label: 'Applied', value: appliedJobs, color: 'text-purple-600' },
              { label: 'Ignored', value: ignoredJobs, color: 'text-text-subtle' },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-surface-50 rounded-lg border border-surface-300/50 p-4">
                <div className={`text-2xl font-bold ${color}`}>{value}</div>
                <div className="text-xs text-text-subtle mt-1">{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Score distribution */}
        <section className="mb-8">
          <h2 className="text-xs font-semibold text-text-subtle uppercase tracking-wider mb-3">Score Distribution</h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'High match (≥75)', value: highJobs, color: 'text-green-600', bg: 'bg-green-50' },
              { label: 'Medium (50–74)', value: medJobs, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Low (<50)', value: lowJobs, color: 'text-text-subtle', bg: 'bg-surface-50' },
            ].map(({ label, value, color, bg }) => (
              <div key={label} className={`rounded-lg border border-surface-300/50 p-4 ${bg}`}>
                <div className={`text-2xl font-bold ${color}`}>{value}</div>
                <div className="text-xs text-text-subtle mt-1">{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Observability links */}
        <section className="mb-8">
          <h2 className="text-xs font-semibold text-text-subtle uppercase tracking-wider mb-3">Observability</h2>
          <div className="bg-surface-50 rounded-lg border border-surface-300/50 divide-y divide-surface-300/50">
            {[
              { label: 'Langfuse traces', desc: 'LLM calls, token counts, latency, cache hits', href: 'https://us.cloud.langfuse.com' },
              { label: 'Vercel deployments', desc: 'Build history, function logs, cron runs', href: 'https://vercel.com/shahidmsyed-projects/shahid-careerhub/deployments' },
              { label: 'Supabase dashboard', desc: 'Tables, SQL editor, realtime logs', href: 'https://supabase.com/dashboard/project/nlklhnptshxtywojmsed' },
              { label: 'Resend emails', desc: 'Email delivery history and logs', href: 'https://resend.com/emails' },
            ].map(({ label, desc, href }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-between px-4 py-3 hover:bg-surface-50 transition-colors">
                <div>
                  <div className="text-sm font-medium text-text">{label}</div>
                  <div className="text-xs text-text-subtle">{desc}</div>
                </div>
                <svg className="w-4 h-4 text-text-subtle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            ))}
          </div>
        </section>

        {/* Recent jobs */}
        <section>
          <h2 className="text-xs font-semibold text-text-subtle uppercase tracking-wider mb-3">Recently Fetched</h2>
          <div className="bg-surface-50 rounded-lg border border-surface-300/50 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-surface-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs text-text-subtle font-medium">Job</th>
                  <th className="px-4 py-2 text-left text-xs text-text-subtle font-medium">Source</th>
                  <th className="px-4 py-2 text-center text-xs text-text-subtle font-medium">Score</th>
                  <th className="px-4 py-2 text-left text-xs text-text-subtle font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-300/50">
                {(recentJobs ?? []).map((job: { title: string; company: string; source: string; match_score: number | null; status: string }, i: number) => (
                  <tr key={i} className="hover:bg-surface-50">
                    <td className="px-4 py-2">
                      <div className="font-medium text-text truncate max-w-xs">{job.title}</div>
                      <div className="text-xs text-text-subtle">{job.company}</div>
                    </td>
                    <td className="px-4 py-2 text-xs text-text-subtle">{job.source}</td>
                    <td className="px-4 py-2 text-center">
                      {job.match_score != null ? (
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${job.match_score >= 75 ? 'bg-green-100 text-green-700' : job.match_score >= 50 ? 'bg-blue-100 text-blue-700' : 'bg-surface-100 text-text-subtle'}`}>
                          {job.match_score}
                        </span>
                      ) : <span className="text-xs text-text-subtle">—</span>}
                    </td>
                    <td className="px-4 py-2 text-xs text-text-subtle">{job.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}

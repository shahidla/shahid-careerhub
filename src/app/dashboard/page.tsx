import { getJobs } from '@/lib/db'
import JobFeed from './JobFeed'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Dashboard — Job Feed',
}

export default async function DashboardPage() {
  const jobs = await getJobs(100)

  const newCount = jobs.filter((j) => j.status === 'new').length
  const savedCount = jobs.filter((j) => j.status === 'saved').length
  const appliedCount = jobs.filter((j) => j.status === 'applied').length

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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Job Feed</h1>
            <div className="flex gap-4 mt-1 text-sm text-gray-500">
              <span>{newCount} new</span>
              {savedCount > 0 && <span>{savedCount} saved</span>}
              {appliedCount > 0 && <span>{appliedCount} applied</span>}
            </div>
          </div>
          <a
            href="/api/fetch-jobs"
            className="text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Fetch now
          </a>
        </div>

        <JobFeed jobs={jobs} />
      </div>
    </div>
  )
}

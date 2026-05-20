import { getJobs } from '@/lib/db'
import JobFeed from './JobFeed'
import FetchButton from './FetchButton'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Dashboard Demo - Job Feed',
  description: 'A live prototype showing AI-assisted job matching, scoring, and review workflows for SAP + AI roles.',
}

export default async function DashboardPage() {
  const jobs = await getJobs(100)

  const newCount = jobs.filter((job) => job.status === 'new').length
  const savedCount = jobs.filter((job) => job.status === 'saved').length
  const appliedCount = jobs.filter((job) => job.status === 'applied').length
  const interviewingCount = jobs.filter((job) => job.status === 'interviewing').length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8 border border-blue-200 bg-blue-50 rounded-xl p-5">
          <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-1">Live Prototype</p>
          <h1 className="text-xl font-bold text-gray-900">AI Job Dashboard Demo</h1>
          <p className="mt-2 text-sm text-gray-600 max-w-2xl">
            This is a live prototype showing how job feeds, AI-assisted scoring, and match
            reasoning can be used to identify relevant SAP + AI opportunities.
          </p>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Job Feed</h2>
            <div className="flex gap-4 mt-1 text-sm text-gray-500">
              <span>{jobs.length} jobs found</span>
              {newCount > 0 && <span>{newCount} new to review</span>}
              {savedCount > 0 && <span>{savedCount} saved</span>}
              {appliedCount > 0 && <span>{appliedCount} applied</span>}
              {interviewingCount > 0 && <span>{interviewingCount} interviewing</span>}
            </div>
          </div>
          <FetchButton />
        </div>

        <JobFeed jobs={jobs} />
      </div>
    </div>
  )
}

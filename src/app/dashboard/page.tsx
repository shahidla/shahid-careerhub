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
    <div className="min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-8 glass-card border-accent-blue/20 bg-accent-blue/[0.02] p-6 animate-fade-in">
          <p className="text-xs font-semibold text-accent-blue uppercase tracking-widest mb-1.5">Live Prototype</p>
          <h1 className="text-xl font-display font-bold text-gray-100">AI Job Dashboard Demo</h1>
          <p className="mt-2 text-sm text-gray-400 max-w-2xl leading-relaxed">
            This is a live prototype showing how job feeds, AI-assisted scoring, and match
            reasoning can be used to identify relevant SAP + AI opportunities.
          </p>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-display font-bold text-gray-100">Job Feed</h2>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-gray-500">
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

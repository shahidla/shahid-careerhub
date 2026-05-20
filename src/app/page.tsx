import { getAllBlogs } from '@/lib/blogs'
import { getProfile } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const blogs = getAllBlogs()
  const profile = await getProfile().catch(() => ({
    contact: { email: 'shahid.la@gmail.com' },
  }))

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <section className="mb-14">
        <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-3">Portfolio</p>
        <h1 className="text-4xl font-bold tracking-tight leading-snug">Shahid M Syed</h1>
        <p className="mt-3 text-xl text-gray-600 max-w-2xl">
          SAP Development Architect with 19 years experience - now building AI systems with RAG,
          agents, MCP servers, and LLM integration on BTP.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="/ai"
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            AI Portfolio -&gt;
          </a>
          <a
            href="/resume"
            className="inline-block bg-gray-900 hover:bg-gray-700 text-white font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            SAP Resume -&gt;
          </a>
          <a
            href="/chat"
            className="inline-block border border-blue-200 text-blue-700 hover:bg-blue-50 font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            Chat with my resume
          </a>
        </div>
      </section>

      <section className="grid sm:grid-cols-3 gap-5 mb-14">
        <a href="/resume" className="group block border border-gray-200 rounded-xl p-6 bg-white hover:border-blue-300 hover:shadow-sm transition-all">
          <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-2">SAP Experience</p>
          <h2 className="text-base font-semibold text-gray-900 group-hover:text-blue-700">19 Years | Architect</h2>
          <p className="mt-2 text-sm text-gray-500">S/4HANA, ABAP, BTP, Fiori, Kyma - full development lifecycle.</p>
        </a>
        <a href="/ai" className="group block border border-purple-200 rounded-xl p-6 bg-white hover:border-purple-400 hover:shadow-sm transition-all">
          <p className="text-xs font-semibold text-purple-500 uppercase tracking-widest mb-2">AI Engineering</p>
          <h2 className="text-base font-semibold text-gray-900 group-hover:text-purple-700">RAG | Agents | MCP</h2>
          <p className="mt-2 text-sm text-gray-500">Hands-on AI systems - embeddings, pipelines, LLM integration on SAP BTP.</p>
        </a>
        <a href="/blogs" className="group block border border-gray-200 rounded-xl p-6 bg-white hover:border-gray-400 hover:shadow-sm transition-all">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Technical Writing</p>
          <h2 className="text-base font-semibold text-gray-900 group-hover:text-gray-700">{blogs.length} SAP Community Posts</h2>
          <p className="mt-2 text-sm text-gray-500">Event-driven architecture, AI workflows, BTP, HANA - published on SAP Community.</p>
        </a>
      </section>

      <section className="border-t border-gray-100 pt-10">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">More</h2>
        <div className="flex flex-wrap gap-4 text-sm">
          <a href="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard Demo -&gt;</a>
          <a href="/learning" className="text-gray-600 hover:text-gray-900">Learning &amp; Courses -&gt;</a>
          <a href="https://www.linkedin.com/in/shahidmsyed/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900">LinkedIn -&gt;</a>
          <a href="https://github.com/shahidla" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900">GitHub -&gt;</a>
          <a href={`mailto:${profile.contact.email}`} className="text-gray-600 hover:text-gray-900">Email -&gt;</a>
        </div>
      </section>
    </main>
  )
}

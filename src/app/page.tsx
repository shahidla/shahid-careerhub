import { getAllBlogs } from '@/lib/blogs'
import { getProfile } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const blogs = getAllBlogs()
  const profile = await getProfile().catch(() => ({
    contact: { email: 'shahid.la@gmail.com' },
  }))

  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      {/* ─── Hero Section ─── */}
      <section className="relative mb-20 pt-8">
        {/* Background mesh glow */}
        <div className="absolute inset-0 -z-10 mesh-gradient opacity-60" />

        <p className="text-sm font-semibold text-accent-purple uppercase tracking-[0.2em] mb-4 animate-fade-in">
          Portfolio
        </p>
        <h1 className="text-5xl md:text-6xl font-display font-extrabold tracking-tight leading-[1.1] animate-fade-in-up">
          <span className="gradient-text">Shahid M Syed</span>
        </h1>
        <p className="mt-5 text-xl text-gray-400 max-w-2xl leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
          SAP Development Architect with 19 years experience — now building
          AI systems with <span className="text-accent-purple">RAG</span>,{' '}
          <span className="text-accent-blue">agents</span>,{' '}
          <span className="text-accent-cyan">MCP servers</span>, and{' '}
          <span className="text-accent-emerald">LLM integration</span> on BTP.
        </p>

        <div className="mt-10 flex flex-wrap gap-4 stagger-children">
          <a href="/ai" className="btn-primary">
            AI Portfolio
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
          <a href="/resume" className="btn-secondary">
            SAP Resume
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
          <a href="/chat" className="btn-outline">
            Chat with my resume
          </a>
        </div>
      </section>

      {/* ─── Feature Cards ─── */}
      <section className="grid sm:grid-cols-3 gap-5 mb-20 stagger-children">
        <a href="/resume" className="group glass-card-glow p-6 block">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-accent-blue/10 border border-accent-blue/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <p className="text-xs font-semibold text-accent-blue uppercase tracking-widest">SAP Experience</p>
          </div>
          <h2 className="text-base font-bold text-gray-100 group-hover:text-accent-blue transition-colors">
            19 Years · Architect
          </h2>
          <p className="mt-2 text-sm text-gray-400 leading-relaxed">
            S/4HANA, ABAP, BTP, Fiori, Kyma — full development lifecycle.
          </p>
        </a>

        <a href="/ai" className="group glass-card-glow p-6 block">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-accent-purple/10 border border-accent-purple/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-accent-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-xs font-semibold text-accent-purple uppercase tracking-widest">AI Engineering</p>
          </div>
          <h2 className="text-base font-bold text-gray-100 group-hover:text-accent-purple transition-colors">
            RAG · Agents · MCP
          </h2>
          <p className="mt-2 text-sm text-gray-400 leading-relaxed">
            Hands-on AI systems — embeddings, pipelines, LLM integration on SAP BTP.
          </p>
        </a>

        <a href="/blogs" className="group glass-card-glow p-6 block">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-accent-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <p className="text-xs font-semibold text-accent-cyan uppercase tracking-widest">Technical Writing</p>
          </div>
          <h2 className="text-base font-bold text-gray-100 group-hover:text-accent-cyan transition-colors">
            {blogs.length} SAP Community Posts
          </h2>
          <p className="mt-2 text-sm text-gray-400 leading-relaxed">
            Event-driven architecture, AI workflows, BTP, HANA — published on SAP Community.
          </p>
        </a>
      </section>

      {/* ─── Quick Links ─── */}
      <section className="border-t border-surface-300/30 pt-10 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-blue/20 to-transparent" />
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-[0.2em] mb-5">Explore</h2>
        <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
          <a href="/dashboard" className="text-gray-400 hover:text-accent-purple transition-colors duration-200 group">
            Dashboard Demo <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
          </a>
          <a href="/learning" className="text-gray-400 hover:text-accent-blue transition-colors duration-200 group">
            Learning &amp; Courses <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
          </a>
          <a href="https://www.linkedin.com/in/shahidmsyed/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-accent-cyan transition-colors duration-200 group">
            LinkedIn <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
          </a>
          <a href="https://github.com/shahidla" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-accent-emerald transition-colors duration-200 group">
            GitHub <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
          </a>
          <a href={`mailto:${profile.contact.email}`} className="text-gray-400 hover:text-gray-200 transition-colors duration-200 group">
            Email <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
          </a>
        </div>
      </section>
    </main>
  )
}

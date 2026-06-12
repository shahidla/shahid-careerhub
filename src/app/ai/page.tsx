import {
  getProfile,
  getProjects,
  getCertifications,
  getSkills,
  getBlogs,
} from '@/lib/db'
import { getCanonicalToSlugMap } from '@/lib/blogs'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Shahid M Syed - AI Engineering Portfolio',
  description:
    'SAP Development Architect building AI systems with RAG, agents, embeddings, MCP, and LLM integration on SAP BTP.',
}

const AI_BUILT = [
  { concept: 'RAG Pipeline', detail: 'Resume data chunked -> pgvector -> Cohere rerank -> Claude', done: true },
  { concept: 'Embeddings', detail: 'OpenAI text-embedding-3-small, 49 chunks, Supabase pgvector', done: true },
  { concept: 'Streaming', detail: 'Claude and OpenAI responses streamed token-by-token to UI', done: true },
  { concept: 'Prompt Caching', detail: 'System prompt cached with major cost reduction on repeated calls', done: true },
  { concept: 'LLM Fallback', detail: 'Claude primary, OpenAI GPT-4o mini fallback, env-flag switchable', done: true },
  { concept: 'Reranking', detail: 'Cohere Rerank improves chunk ordering before LLM injection', done: true },
  { concept: 'LLM-as-Judge', detail: 'Claude scores job-to-profile match with structured reasoning', done: true },
  { concept: 'ETL Pipeline', detail: 'Fetch -> normalize -> deduplicate across Remotive, Adzuna, and SAP Contractors', done: true },
  { concept: 'Observability', detail: 'Langfuse tracing with input, output, cache tokens, and cost tracking', done: true },
  { concept: 'MCP Server', detail: 'Node.js MCP server exposing SAP RAP OData services', done: true },
  { concept: 'Agentic Workflow', detail: 'Telegram bot + Vercel cron -> daily fetch -> score -> notify loop', done: true },
  { concept: 'Short-term Memory', detail: 'Job status tracking in Supabase for Save, Apply, Ignore, and Interviewing', done: true },
  { concept: 'Tool Use', detail: 'Agent tools such as search_jobs, score_job, and send_notification', done: false },
  { concept: 'Multi-agent', detail: 'LangGraph orchestration of Fetcher, Scorer, and Email agents', done: false },
  { concept: 'Long-term Memory', detail: 'Mem0 or Zep to learn from accepted and rejected jobs over time', done: false },
  { concept: 'Hybrid Search', detail: 'BM25 + vector combined retrieval for /chat', done: false },
]

export default async function AiPage() {
  const [profile, projects, certifications, skills, blogs] = await Promise.all([
    getProfile(),
    getProjects(true),
    getCertifications(true),
    getSkills(true),
    getBlogs(true),
  ])

  const doneCount = AI_BUILT.filter((r) => r.done).length
  const totalCount = AI_BUILT.length
  const canonicalToSlug = getCanonicalToSlugMap()

  return (
    <main className="max-w-4xl mx-auto px-6 py-12 space-y-14">
      {/* On-page nav */}
      <nav aria-label="On this page" className="flex flex-wrap gap-2 text-xs glass-card px-4 py-3">
        <span className="text-gray-500 font-semibold uppercase tracking-widest mr-2 self-center">On this page</span>
        {[
          { href: '#building', label: 'Currently Building' },
          { href: '#projects', label: 'AI Projects' },
          { href: '#skills', label: 'Skills' },
          { href: '#certs', label: 'Certifications' },
          { href: '#writing', label: 'Writing' },
          { href: '#built', label: 'AI Concepts Built' },
        ].map(({ href, label }) => (
          <a key={href} href={href} className="text-accent-purple hover:text-accent-purple/80 hover:underline px-1 transition-colors">{label}</a>
        ))}
      </nav>

      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0 -z-10 mesh-gradient opacity-60" />
        <p className="text-sm font-semibold text-accent-purple uppercase tracking-[0.2em] mb-2 animate-fade-in">AI Engineering Portfolio</p>
        <h1 className="text-4xl font-display font-bold tracking-tight animate-fade-in-up">
          <span className="gradient-text">{profile.name}</span>
        </h1>
        <p className="mt-3 text-lg text-gray-400 max-w-2xl leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          SAP Development Architect — now building AI systems hands-on.
          RAG pipelines, agentic workflows, MCP servers, embeddings, and LLM integration.
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
          <a href={`mailto:${profile.contact.email}`} className="hover:text-accent-blue transition-colors">{profile.contact.email}</a>
          <a href={profile.contact.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-accent-blue transition-colors">LinkedIn</a>
          <a href={profile.contact.github} target="_blank" rel="noopener noreferrer" className="hover:text-accent-blue transition-colors">GitHub</a>
        </div>
      </section>

      {/* Currently Building */}
      <section id="building">
        <h2 className="section-heading">Currently Building</h2>
        <div className="mt-4 glass-card p-6 border-accent-purple/20 animate-glow-pulse">
          <div className="flex flex-wrap justify-between gap-2">
            <div>
              <h3 className="font-bold text-gray-100 text-lg">AI Career Hub</h3>
              <p className="text-sm text-gray-400 mt-0.5">Next.js 14 · Supabase pgvector · Claude API · Vercel</p>
            </div>
            <a href="https://github.com/shahidla/shahid-careerhub" target="_blank" rel="noopener noreferrer" className="text-sm text-accent-purple hover:underline font-medium self-start">
              GitHub →
            </a>
          </div>
          <p className="mt-3 text-sm text-gray-400 leading-relaxed">
            A live AI engineering prototype: job search aggregator, resume RAG chatbot,
            AI resume tooling, multi-agent orchestration, and MCP integration.
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {['RAG', 'Embeddings', 'pgvector', 'Agents', 'MCP', 'Tool use', 'LangGraph', 'Prompt caching', 'Langfuse', 'Claude API'].map((tag) => (
              <span key={tag} className="tag-sm !bg-accent-purple/10 !text-accent-purple !border-accent-purple/20">{tag}</span>
            ))}
          </div>
        </div>
      </section>

      {/* AI Projects */}
      <section id="projects">
        <h2 className="section-heading">AI Projects</h2>
        <div className="mt-4 space-y-6">
          {projects.map((project) => (
            <div key={project.id} className="border-l-2 border-accent-purple/30 pl-4 hover:border-accent-purple/60 transition-colors duration-300">
              <div className="flex flex-wrap justify-between gap-1">
                <div>
                  {project.url ? (
                    <a
                      href={project.url.startsWith('http') ? project.url : `/${project.url}`}
                      target={project.url.startsWith('http') ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      className="font-semibold text-accent-purple hover:underline"
                    >
                      {project.name}
                    </a>
                  ) : (
                    <span className="font-semibold text-gray-100">{project.name}</span>
                  )}
                  <span className="text-gray-500 text-sm"> · {project.client}</span>
                </div>
              </div>
              <p className="mt-1 text-sm font-medium text-accent-purple/80">{project.impact}</p>
              <p className="mt-1 text-sm text-gray-400 leading-relaxed">{project.description}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {project.technologies.map((tech) => (
                  <span key={tech} className="tag-sm !bg-accent-purple/10 !text-accent-purple !border-accent-purple/20">{tech}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AI Skills */}
      <section id="skills">
        <h2 className="section-heading">AI Skills</h2>
        <div className="mt-4 space-y-4">
          {skills.map((skill) => (
            <div key={skill.id}>
              <h3 className="text-sm font-semibold text-gray-300 mb-1.5">{skill.category}</h3>
              <div className="flex flex-wrap gap-2">
                {skill.items.map((item) => (
                  <span key={item} className="tag !bg-accent-purple/5 !text-accent-purple !border-accent-purple/20">{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AI Certifications */}
      <section id="certs">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="section-heading">AI Certifications</h2>
          <a href="/certifications?track=ai" className="text-sm font-medium text-accent-purple hover:underline">
            View full credential index →
          </a>
        </div>
        <div className="mt-4 grid sm:grid-cols-2 gap-3">
          {certifications.map((cert) => (
            <div key={cert.id} className="glass-card p-3 border-accent-purple/15">
              {cert.credential_url ? (
                <a href={cert.credential_url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-accent-purple hover:underline leading-snug block">
                  {cert.title}
                </a>
              ) : (
                <span className="text-sm font-medium text-gray-200 leading-snug block">{cert.title}</span>
              )}
              <span className="text-xs text-gray-500">
                {cert.issuer}
                {cert.code ? ` · ${cert.code}` : ''}
                {cert.year ? ` · ${cert.year}` : ''}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* AI Writing */}
      <section id="writing">
        <h2 className="section-heading">AI Writing — SAP Community</h2>
        <ul className="mt-4 space-y-3">
          {blogs.map((blog) => {
            const slug = canonicalToSlug[blog.url]
            return (
              <li key={blog.id} className="flex gap-3 items-start">
                <span className="text-accent-purple mt-1 shrink-0">▸</span>
                <div>
                  <a
                    href={slug ? `/blogs/${slug}` : blog.url}
                    target={slug ? undefined : '_blank'}
                    rel={slug ? undefined : 'noopener noreferrer'}
                    className="text-sm text-accent-purple hover:text-accent-purple/80 transition-colors font-medium"
                  >
                    {blog.title}
                  </a>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {blog.tags.map((tag) => (
                      <span key={tag} className="tag-sm !bg-accent-purple/10 !text-accent-purple !border-accent-purple/20">{tag}</span>
                    ))}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </section>

      {/* AI Concepts Built */}
      <section id="built">
        <h2 className="section-heading">AI Concepts Built</h2>
        <p className="mt-2 text-sm text-gray-500">Implemented hands-on in the AI Career Hub — each concept shipped, not just planned.</p>

        {/* Progress bar */}
        <div className="mt-4 mb-6">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span>{doneCount} of {totalCount} concepts shipped</span>
            <span className="text-accent-emerald font-medium">{Math.round((doneCount / totalCount) * 100)}%</span>
          </div>
          <div className="h-1.5 bg-surface-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent-purple to-accent-cyan rounded-full transition-all duration-700"
              style={{ width: `${(doneCount / totalCount) * 100}%` }}
            />
          </div>
        </div>

        <div className="space-y-2">
          {AI_BUILT.map((row) => (
            <div key={row.concept} className="flex gap-3 items-start text-sm group">
              <span className={`shrink-0 mt-0.5 text-xs font-bold px-2 py-0.5 rounded-full ${
                row.done
                  ? 'bg-accent-emerald/10 text-accent-emerald border border-accent-emerald/20'
                  : 'bg-surface-200 text-gray-500 border border-surface-300/50'
              }`}>
                {row.done ? '✓' : '○'}
              </span>
              <div>
                <span className={`font-semibold ${row.done ? 'text-gray-200' : 'text-gray-500'}`}>{row.concept}</span>
                <span className={`ml-2 ${row.done ? 'text-gray-400' : 'text-gray-600'}`}>— {row.detail}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Connect */}
      <section>
        <h2 className="section-heading">Connect</h2>
        <div className="mt-4 flex flex-wrap gap-5 text-sm">
          <a href={`mailto:${profile.contact.email}`} className="text-accent-purple hover:underline">{profile.contact.email}</a>
          <a href={profile.contact.linkedin} target="_blank" rel="noopener noreferrer" className="text-accent-purple hover:underline">LinkedIn</a>
          <a href={profile.contact.github} target="_blank" rel="noopener noreferrer" className="text-accent-purple hover:underline">GitHub</a>
          <a href={profile.contact.sapCommunity} target="_blank" rel="noopener noreferrer" className="text-accent-purple hover:underline">SAP Community</a>
        </div>
      </section>
    </main>
  )
}

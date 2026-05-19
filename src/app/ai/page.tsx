import {
  getProfile,
  getProjects,
  getCertifications,
  getSkills,
  getBlogs,
} from '@/lib/db'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Shahid M Syed — AI Engineering Portfolio',
  description:
    'SAP Development Architect building AI systems — RAG, agents, embeddings, MCP, and LLM integration on SAP BTP.',
}

const AI_BUILT = [
  { concept: 'RAG Pipeline',        detail: 'Resume data chunked → pgvector → Cohere rerank → Claude',           done: true },
  { concept: 'Embeddings',          detail: 'OpenAI text-embedding-3-small, 49 chunks, Supabase pgvector',        done: true },
  { concept: 'Streaming',           detail: 'Claude + OpenAI responses streamed token-by-token to UI',            done: true },
  { concept: 'Prompt Caching',      detail: 'System prompt cached — 90% cost reduction on repeated calls',        done: true },
  { concept: 'LLM Fallback',        detail: 'Claude primary, OpenAI GPT-4o mini fallback, env-flag switchable',   done: true },
  { concept: 'Reranking',           detail: 'Cohere Rerank improves chunk ordering before LLM injection',          done: true },
  { concept: 'LLM-as-Judge',        detail: 'Claude scores job-to-profile match with structured reasoning',        done: true },
  { concept: 'ETL Pipeline',        detail: 'Fetch → normalise → deduplicate across Remotive, Adzuna, SAP Contractors', done: true },
  { concept: 'Observability',       detail: 'Langfuse tracing — input/output/cache tokens per call, cost tracking', done: true },
  { concept: 'MCP Server',          detail: 'Node.js MCP server exposing SAP RAP OData services (CommBank, live)', done: true },
  { concept: 'Agentic Workflow',    detail: 'Telegram bot + Vercel cron — daily fetch → score → notify loop',     done: true },
  { concept: 'Short-term Memory',   detail: 'Job status tracking: Save / Apply / Ignore / Interviewing in Supabase', done: true },
  { concept: 'Tool Use',            detail: 'Agent tools: search_jobs, score_job, send_notification',              done: false },
  { concept: 'Multi-agent',         detail: 'LangGraph orchestration of Fetcher + Scorer + Email agents',         done: false },
  { concept: 'Long-term Memory',    detail: 'Mem0/Zep — learn from accepted/rejected jobs over time',             done: false },
  { concept: 'Hybrid Search',       detail: 'BM25 + vector combined retrieval for /chat',                         done: false },
]

export default async function AiPage() {
  const [profile, projects, certifications, skills, blogs] = await Promise.all([
    getProfile(),
    getProjects(true),
    getCertifications(true),
    getSkills(true),
    getBlogs(true),
  ])

  return (
    <main className="max-w-4xl mx-auto px-6 py-12 space-y-14">

      {/* On this page */}
      <nav aria-label="On this page" className="flex flex-wrap gap-2 text-xs border border-gray-200 rounded-lg px-4 py-3 bg-white">
        <span className="text-gray-400 font-semibold uppercase tracking-widest mr-2 self-center">On this page</span>
        {[
          { href: '#building',  label: 'Currently Building' },
          { href: '#projects',  label: 'AI Projects' },
          { href: '#skills',    label: 'Skills' },
          { href: '#certs',     label: 'Certifications' },
          { href: '#writing',   label: 'Writing' },
          { href: '#built',     label: 'AI Concepts Built' },
        ].map(({ href, label }) => (
          <a key={href} href={href} className="text-purple-600 hover:text-purple-800 hover:underline px-1">{label}</a>
        ))}
      </nav>

      {/* Hero */}
      <section>
        <p className="text-sm font-semibold text-purple-600 uppercase tracking-widest mb-2">AI Engineering Portfolio</p>
        <h1 className="text-4xl font-bold tracking-tight">{profile.name}</h1>
        <p className="mt-3 text-lg text-gray-600 max-w-2xl">
          SAP Development Architect — now building AI systems hands-on.
          RAG pipelines, agentic workflows, MCP servers, embeddings, and LLM integration.
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
          <a href={`mailto:${profile.contact.email}`} className="hover:text-gray-900">{profile.contact.email}</a>
          <a href={profile.contact.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-gray-900">LinkedIn</a>
          <a href={profile.contact.github} target="_blank" rel="noopener noreferrer" className="hover:text-gray-900">GitHub</a>
        </div>
      </section>

      {/* Currently Building */}
      <section id="building">
        <h2 className="section-heading">Currently Building</h2>
        <div className="mt-4 border border-purple-200 rounded-xl p-5 bg-purple-50">
          <div className="flex flex-wrap justify-between gap-2">
            <div>
              <h3 className="font-semibold text-gray-900">AI Career Hub</h3>
              <p className="text-sm text-gray-600 mt-0.5">Next.js 14 · Supabase pgvector · Claude API · Vercel</p>
            </div>
            <a href="https://github.com/shahidla/shahid-careerhub" target="_blank" rel="noopener noreferrer"
              className="text-sm text-purple-700 hover:underline font-medium self-start">
              GitHub →
            </a>
          </div>
          <p className="mt-3 text-sm text-gray-700 leading-relaxed">
            A live AI engineering prototype — job search aggregator, RAG chatbot over resume data,
            AI resume editor, multi-agent orchestration, and MCP server. Built to touch every major
            AI engineering concept hands-on.
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {['RAG','Embeddings','pgvector','Agents','MCP','Tool use','LangGraph','Prompt caching','Langfuse','Claude API'].map((t) => (
              <span key={t} className="tag-sm bg-purple-100 text-purple-700">{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* AI Projects */}
      <section id="projects">
        <h2 className="section-heading">AI Projects</h2>
        <div className="mt-4 space-y-6">
          {projects.map((p) => (
            <div key={p.id} className="border-l-2 border-purple-200 pl-4">
              <div className="flex flex-wrap justify-between gap-1">
                <div>
                  {p.url ? (
                    <a
                      href={p.url.startsWith('http') ? p.url : `/${p.url}`}
                      target={p.url.startsWith('http') ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      className="font-semibold text-purple-700 hover:underline"
                    >
                      {p.name}
                    </a>
                  ) : (
                    <span className="font-semibold text-gray-900">{p.name}</span>
                  )}
                  <span className="text-gray-500 text-sm"> · {p.client}</span>
                </div>
              </div>
              <p className="mt-1 text-sm font-medium text-purple-800">{p.impact}</p>
              <p className="mt-1 text-sm text-gray-700 leading-relaxed">{p.description}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {p.technologies.map((t) => (
                  <span key={t} className="tag-sm bg-purple-100 text-purple-700">{t}</span>
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
          {skills.map((s) => (
            <div key={s.id}>
              <h3 className="text-sm font-semibold text-gray-800 mb-1">{s.category}</h3>
              <div className="flex flex-wrap gap-2">
                {s.items.map((item) => (
                  <span key={item} className="tag bg-purple-50 text-purple-700">{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AI Certifications */}
      <section id="certs">
        <h2 className="section-heading">AI Certifications</h2>
        <div className="mt-4 grid sm:grid-cols-2 gap-3">
          {certifications.map((c) => (
            <div key={c.id} className="border border-purple-200 rounded-lg p-3 bg-purple-50">
              {c.credential_url ? (
                <a href={c.credential_url} target="_blank" rel="noopener noreferrer"
                  className="text-sm font-medium text-purple-700 hover:underline leading-snug block">
                  {c.title}
                </a>
              ) : (
                <span className="text-sm font-medium text-gray-900 leading-snug block">{c.title}</span>
              )}
              <span className="text-xs text-gray-500">{c.issuer}{c.code ? ` · ${c.code}` : ''}{c.year ? ` · ${c.year}` : ''}</span>
            </div>
          ))}
        </div>
      </section>

      {/* AI Blogs */}
      <section id="writing">
        <h2 className="section-heading">AI Writing — SAP Community</h2>
        <ul className="mt-4 space-y-3">
          {blogs.map((b) => (
            <li key={b.id} className="flex gap-3 items-start">
              <span className="text-purple-500 mt-1 shrink-0">▸</span>
              <div>
                <a href={b.url} target="_blank" rel="noopener noreferrer"
                  className="text-sm text-purple-700 hover:underline font-medium">
                  {b.title}
                </a>
                <div className="flex flex-wrap gap-1 mt-1">
                  {b.tags.map((t) => (
                    <span key={t} className="tag-sm bg-purple-100 text-purple-700">{t}</span>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* AI Concepts Built */}
      <section id="built">
        <h2 className="section-heading">AI Concepts Built</h2>
        <p className="mt-2 text-sm text-gray-500">Implemented hands-on in the AI Career Hub — each concept shipped, not planned.</p>
        <div className="mt-4 space-y-2">
          {AI_BUILT.map((r) => (
            <div key={r.concept} className="flex gap-3 items-start text-sm">
              <span className={`shrink-0 mt-0.5 font-bold ${r.done ? 'text-green-500' : 'text-gray-300'}`}>
                {r.done ? '✓' : '○'}
              </span>
              <div>
                <span className={`font-semibold ${r.done ? 'text-gray-900' : 'text-gray-400'}`}>{r.concept}</span>
                <span className={`ml-2 ${r.done ? 'text-gray-600' : 'text-gray-400'}`}>— {r.detail}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Connect */}
      <section>
        <h2 className="section-heading">Connect</h2>
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <a href={`mailto:${profile.contact.email}`} className="text-purple-700 hover:underline">{profile.contact.email}</a>
          <a href={profile.contact.linkedin} target="_blank" rel="noopener noreferrer" className="text-purple-700 hover:underline">LinkedIn</a>
          <a href={profile.contact.github} target="_blank" rel="noopener noreferrer" className="text-purple-700 hover:underline">GitHub</a>
          <a href={profile.contact.sapCommunity} target="_blank" rel="noopener noreferrer" className="text-purple-700 hover:underline">SAP Community</a>
        </div>
      </section>

    </main>
  )
}

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
    '19 years of enterprise SAP engineering, now building AI systems — RAG, agents, embeddings, MCP, and LLM integration.',
}

const LEARNING_ROADMAP = [
  { phase: '1', label: 'Data Foundation', items: ['ETL pipeline', 'Chunking strategy', 'Data normalisation'] },
  { phase: '2', label: 'Embeddings & Vector Search', items: ['text-embedding-3-small', 'Supabase pgvector', 'Hybrid search + reranking'] },
  { phase: '3', label: 'LLM & Prompting', items: ['RAG pipeline', 'Structured output', 'Prompt caching'] },
  { phase: '4', label: 'Agents', items: ['ReAct pattern', 'Tool use / function calling', 'MCP server', 'Multi-agent orchestration'] },
  { phase: '5', label: 'Memory', items: ['Short-term + long-term memory', 'Delta search', 'Semantic caching'] },
  { phase: '6', label: 'Observability & Evals', items: ['Langfuse tracing', 'Token + cost tracking', 'LLM-as-judge evals'] },
  { phase: '7', label: 'Advanced', items: ['GraphRAG', 'Fine-tuning', 'Guardrails', 'LLM routing'] },
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

      {/* Nav */}
      <nav className="flex gap-4 text-sm border-b border-purple-200 pb-4">
        <a href="/" className="text-gray-500 hover:text-gray-900">Home</a>
        <a href="/resume" className="text-blue-600 hover:text-blue-800">SAP Profile →</a>
        <span className="text-purple-700 font-medium">AI Portfolio</span>
        <a href="/blogs" className="text-gray-500 hover:text-gray-900 ml-auto">Blog →</a>
      </nav>

      {/* Hero */}
      <section>
        <p className="text-sm font-semibold text-purple-600 uppercase tracking-widest mb-2">AI Engineering Portfolio</p>
        <h1 className="text-4xl font-bold tracking-tight">{profile.name}</h1>
        <p className="mt-3 text-lg text-gray-600 max-w-2xl">
          19 years of enterprise SAP engineering — now building AI systems.
          RAG pipelines, agentic workflows, MCP servers, embeddings, and LLM integration.
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
          <a href={`mailto:${profile.contact.email}`} className="hover:text-gray-900">{profile.contact.email}</a>
          <a href={profile.contact.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-gray-900">LinkedIn</a>
          <a href={profile.contact.github} target="_blank" rel="noopener noreferrer" className="hover:text-gray-900">GitHub</a>
        </div>
      </section>

      {/* Currently Building */}
      <section>
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
      <section>
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
      <section>
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
      <section>
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
      <section>
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

      {/* Learning Roadmap */}
      <section>
        <h2 className="section-heading">AI Engineering Learning Roadmap</h2>
        <p className="mt-2 text-sm text-gray-500">Structured progression — each phase being implemented in the AI Career Hub.</p>
        <div className="mt-4 space-y-3">
          {LEARNING_ROADMAP.map((r) => (
            <div key={r.phase} className="flex gap-4 items-start">
              <span className="shrink-0 w-6 h-6 rounded-full bg-purple-100 text-purple-700 text-xs font-bold flex items-center justify-center mt-0.5">
                {r.phase}
              </span>
              <div>
                <span className="text-sm font-semibold text-gray-900">{r.label}</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {r.items.map((item) => (
                    <span key={item} className="tag-sm">{item}</span>
                  ))}
                </div>
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

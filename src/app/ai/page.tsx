import {
  getProfile,
  getProjects,
  getCertifications,
  getSkills,
  getBlogs,
} from '@/lib/db'

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

  return (
    <main className="max-w-4xl mx-auto px-6 py-12 space-y-14">
      <nav aria-label="On this page" className="flex flex-wrap gap-2 text-xs border border-gray-200 rounded-lg px-4 py-3 bg-white">
        <span className="text-gray-400 font-semibold uppercase tracking-widest mr-2 self-center">On this page</span>
        {[
          { href: '#building', label: 'Currently Building' },
          { href: '#projects', label: 'AI Projects' },
          { href: '#skills', label: 'Skills' },
          { href: '#certs', label: 'Certifications' },
          { href: '#writing', label: 'Writing' },
          { href: '#built', label: 'AI Concepts Built' },
        ].map(({ href, label }) => (
          <a key={href} href={href} className="text-purple-600 hover:text-purple-800 hover:underline px-1">{label}</a>
        ))}
      </nav>

      <section>
        <p className="text-sm font-semibold text-purple-600 uppercase tracking-widest mb-2">AI Engineering Portfolio</p>
        <h1 className="text-4xl font-bold tracking-tight">{profile.name}</h1>
        <p className="mt-3 text-lg text-gray-600 max-w-2xl">
          SAP Development Architect - now building AI systems hands-on.
          RAG pipelines, agentic workflows, MCP servers, embeddings, and LLM integration.
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
          <a href={`mailto:${profile.contact.email}`} className="hover:text-gray-900">{profile.contact.email}</a>
          <a href={profile.contact.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-gray-900">LinkedIn</a>
          <a href={profile.contact.github} target="_blank" rel="noopener noreferrer" className="hover:text-gray-900">GitHub</a>
        </div>
      </section>

      <section id="building">
        <h2 className="section-heading">Currently Building</h2>
        <div className="mt-4 border border-purple-200 rounded-xl p-5 bg-purple-50">
          <div className="flex flex-wrap justify-between gap-2">
            <div>
              <h3 className="font-semibold text-gray-900">AI Career Hub</h3>
              <p className="text-sm text-gray-600 mt-0.5">Next.js 14 | Supabase pgvector | Claude API | Vercel</p>
            </div>
            <a href="https://github.com/shahidla/shahid-careerhub" target="_blank" rel="noopener noreferrer" className="text-sm text-purple-700 hover:underline font-medium self-start">
              GitHub -&gt;
            </a>
          </div>
          <p className="mt-3 text-sm text-gray-700 leading-relaxed">
            A live AI engineering prototype: job search aggregator, resume RAG chatbot,
            AI resume tooling, multi-agent orchestration, and MCP integration.
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {['RAG', 'Embeddings', 'pgvector', 'Agents', 'MCP', 'Tool use', 'LangGraph', 'Prompt caching', 'Langfuse', 'Claude API'].map((tag) => (
              <span key={tag} className="tag-sm bg-purple-100 text-purple-700">{tag}</span>
            ))}
          </div>
        </div>
      </section>

      <section id="projects">
        <h2 className="section-heading">AI Projects</h2>
        <div className="mt-4 space-y-6">
          {projects.map((project) => (
            <div key={project.id} className="border-l-2 border-purple-200 pl-4">
              <div className="flex flex-wrap justify-between gap-1">
                <div>
                  {project.url ? (
                    <a
                      href={project.url.startsWith('http') ? project.url : `/${project.url}`}
                      target={project.url.startsWith('http') ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      className="font-semibold text-purple-700 hover:underline"
                    >
                      {project.name}
                    </a>
                  ) : (
                    <span className="font-semibold text-gray-900">{project.name}</span>
                  )}
                  <span className="text-gray-500 text-sm"> | {project.client}</span>
                </div>
              </div>
              <p className="mt-1 text-sm font-medium text-purple-800">{project.impact}</p>
              <p className="mt-1 text-sm text-gray-700 leading-relaxed">{project.description}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {project.technologies.map((tech) => (
                  <span key={tech} className="tag-sm bg-purple-100 text-purple-700">{tech}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="skills">
        <h2 className="section-heading">AI Skills</h2>
        <div className="mt-4 space-y-4">
          {skills.map((skill) => (
            <div key={skill.id}>
              <h3 className="text-sm font-semibold text-gray-800 mb-1">{skill.category}</h3>
              <div className="flex flex-wrap gap-2">
                {skill.items.map((item) => (
                  <span key={item} className="tag bg-purple-50 text-purple-700">{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="certs">
        <h2 className="section-heading">AI Certifications</h2>
        <div className="mt-4 grid sm:grid-cols-2 gap-3">
          {certifications.map((cert) => (
            <div key={cert.id} className="border border-purple-200 rounded-lg p-3 bg-purple-50">
              {cert.credential_url ? (
                <a href={cert.credential_url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-purple-700 hover:underline leading-snug block">
                  {cert.title}
                </a>
              ) : (
                <span className="text-sm font-medium text-gray-900 leading-snug block">{cert.title}</span>
              )}
              <span className="text-xs text-gray-500">
                {cert.issuer}
                {cert.code ? ` | ${cert.code}` : ''}
                {cert.year ? ` | ${cert.year}` : ''}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section id="writing">
        <h2 className="section-heading">AI Writing - SAP Community</h2>
        <ul className="mt-4 space-y-3">
          {blogs.map((blog) => (
            <li key={blog.id} className="flex gap-3 items-start">
              <span className="text-purple-500 mt-1 shrink-0">-</span>
              <div>
                <a href={blog.url} target="_blank" rel="noopener noreferrer" className="text-sm text-purple-700 hover:underline font-medium">
                  {blog.title}
                </a>
                <div className="flex flex-wrap gap-1 mt-1">
                  {blog.tags.map((tag) => (
                    <span key={tag} className="tag-sm bg-purple-100 text-purple-700">{tag}</span>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section id="built">
        <h2 className="section-heading">AI Concepts Built</h2>
        <p className="mt-2 text-sm text-gray-500">Implemented hands-on in the AI Career Hub - each concept shipped, not just planned.</p>
        <div className="mt-4 space-y-2">
          {AI_BUILT.map((row) => (
            <div key={row.concept} className="flex gap-3 items-start text-sm">
              <span className={`shrink-0 mt-0.5 font-bold ${row.done ? 'text-green-500' : 'text-gray-300'}`}>
                {row.done ? 'OK' : 'TODO'}
              </span>
              <div>
                <span className={`font-semibold ${row.done ? 'text-gray-900' : 'text-gray-400'}`}>{row.concept}</span>
                <span className={`ml-2 ${row.done ? 'text-gray-600' : 'text-gray-400'}`}>- {row.detail}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

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

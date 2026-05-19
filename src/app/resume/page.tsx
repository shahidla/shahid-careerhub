import {
  getProfile,
  getExperience,
  getProjects,
  getCertifications,
  getSkills,
  getBlogs,
  getAchievements,
} from '@/lib/db'
import { getCanonicalToSlugMap } from '@/lib/blogs'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Shahid M Syed — SAP Development Architect',
  description:
    'SAP Development Architect with 19 years experience in S/4HANA modernisation, ABAP on HANA, BTP, and AI-assisted SAP automation.',
  openGraph: {
    title: 'Shahid M Syed — SAP Development Architect',
    description: 'SAP Development Architect with 19 years experience in S/4HANA modernisation, ABAP on HANA, BTP, and AI-assisted SAP automation.',
    url: 'https://shahid-careerhub.vercel.app/resume',
    type: 'profile',
  },
  alternates: { canonical: 'https://shahid-careerhub.vercel.app/resume' },
}

const NAV = [
  { id: 'profile',        label: 'Profile' },
  { id: 'experience',     label: 'Experience' },
  { id: 'projects',       label: 'Projects' },
  { id: 'ai-work',        label: 'AI Work' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'blogs',          label: 'Blogs' },
  { id: 'patent',         label: 'Patent' },
  { id: 'awards',         label: 'Awards' },
  { id: 'education',      label: 'Education' },
]

export default async function ResumePage() {
  const [profile, experience, projects, certifications, skills, blogs, achievements] =
    await Promise.all([
      getProfile(),
      getExperience(),
      getProjects(),
      getCertifications(),
      getSkills(),
      getBlogs(),
      getAchievements(),
    ])

  const canonicalToSlug = getCanonicalToSlugMap()

  const patent = achievements.find((a) => a.description.includes('US10304013B2'))
  const awards = achievements.filter((a) => !a.description.includes('US10304013B2'))
  const aiProjects = projects.filter((p) => p.is_ai)
  const aiBlogs = blogs.filter((b) => b.is_ai)

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: 'Shahid M Syed',
          jobTitle: 'SAP Development Architect',
          description: 'SAP Development Architect with 19 years experience in S/4HANA, ABAP, BTP, and AI engineering.',
          url: 'https://shahid-careerhub.vercel.app/resume',
          sameAs: [
            'https://www.linkedin.com/in/shahidmsyed/',
            'https://github.com/shahidla',
            'https://community.sap.com/t5/user/viewprofilepage/user-id/15422',
          ],
          knowsAbout: ['SAP ABAP', 'SAP BTP', 'SAP Fiori', 'S/4HANA', 'AI Engineering', 'RAG', 'LLM', 'OpenAI'],
        })}}
      />

      {/* Top bar */}
      <header className="border-b border-gray-200 px-6 py-3 flex items-center gap-6 text-sm sticky top-[49px] bg-white z-10">
        <span className="text-gray-900 font-medium">SAP Profile</span>
        <div className="ml-auto flex items-center gap-4">
          <a href="/chat" className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1.5 rounded-full transition-colors">
            Chat with my resume
          </a>
        </div>
      </header>

      <div className="max-w-6xl mx-auto flex">

        {/* Sticky side nav */}
        <aside className="hidden lg:block w-48 shrink-0">
          <nav className="sticky top-12 pt-10 pb-6 pr-6">
            <ul className="space-y-1">
              {NAV.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className={`block text-sm py-1 pl-3 border-l-2 border-transparent hover:border-blue-500 transition-colors ${item.id === 'ai-work' ? 'text-purple-600 hover:text-purple-900' : 'text-gray-500 hover:text-gray-900'}`}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-8 pt-6 border-t border-gray-100 space-y-2">
              <a href="/chat" className="block text-xs font-medium text-blue-600 hover:text-blue-800">
                Chat with my resume
              </a>
              <a href={`mailto:${profile.contact.email}`} className="block text-xs text-gray-400 hover:text-gray-700 truncate">
                {profile.contact.email}
              </a>
              <a href={profile.contact.linkedin} target="_blank" rel="noopener noreferrer" className="block text-xs text-gray-400 hover:text-gray-700">LinkedIn</a>
              <a href={profile.contact.github} target="_blank" rel="noopener noreferrer" className="block text-xs text-gray-400 hover:text-gray-700">GitHub</a>
              <a href={profile.contact.sapCommunity} target="_blank" rel="noopener noreferrer" className="block text-xs text-gray-400 hover:text-gray-700">SAP Community</a>
            </div>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 px-6 lg:px-10 py-10 space-y-16">

          {/* Profile */}
          <section id="profile">
            <h1 className="text-3xl font-bold tracking-tight">{profile.name}</h1>
            <p className="mt-2 text-base text-gray-600">{profile.headline}</p>

            {/* Contact */}
            <div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-500">
              <a href={`mailto:${profile.contact.email}`} className="hover:text-gray-900">{profile.contact.email}</a>
              <span>{profile.contact.phone}</span>
              <a href={profile.contact.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-gray-900">LinkedIn</a>
              <a href={profile.contact.github} target="_blank" rel="noopener noreferrer" className="hover:text-gray-900">GitHub</a>
              <a href={profile.contact.sapCommunity} target="_blank" rel="noopener noreferrer" className="hover:text-gray-900">SAP Community</a>
            </div>

            {/* D — Prominent chat CTA */}
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="/chat"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                <span>💬</span> Ask about my experience
              </a>
              <a href="/chat"
                className="inline-flex items-center gap-2 border border-blue-200 text-blue-700 hover:bg-blue-50 text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                <span>📋</span> Paste a job — get match score
              </a>
            </div>

            {/* Proof points */}
            <div className="mt-6 grid sm:grid-cols-2 gap-2">
              {profile.proof_points.map((p) => (
                <div key={p} className="flex gap-2 text-sm">
                  <span className="text-blue-500 mt-0.5 shrink-0">▸</span>
                  <span>{p}</span>
                </div>
              ))}
            </div>

            {/* Positioning */}
            <div className="mt-6">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Areas of Expertise</h2>
              <ul className="grid sm:grid-cols-2 gap-2">
                {profile.positioning.map((p) => (
                  <li key={p} className="flex gap-2 text-sm text-gray-700">
                    <span className="text-blue-500 mt-0.5 shrink-0">▸</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Skills */}
            <div className="mt-8 space-y-5">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Skills</h2>
              {skills.map((s) => (
                <div key={s.id}>
                  <h3 className="text-sm font-semibold text-gray-800 mb-2">{s.category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {s.items.map((item) => (
                      <span key={item} className="tag">{item}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <hr className="border-gray-100" />

          {/* A — AI highlight banner */}
          <section className="rounded-xl border border-purple-200 bg-purple-50 p-6">
            <div className="flex flex-wrap justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-purple-500 uppercase tracking-widest mb-1">Also an AI Engineer</p>
                <h2 className="text-lg font-bold text-gray-900">SAP + AI — real delivery, not just theory</h2>
                <p className="mt-2 text-sm text-gray-600 max-w-xl">
                  MCP server for AI-assisted SAP execution · ML models at SAP Labs · anomaly detection in production ·
                  7 published AI blogs · building RAG pipelines, embeddings, and agents hands-on right now.
                </p>
              </div>
              <div className="flex flex-col gap-2 shrink-0 justify-center">
                <a href="/ai" className="inline-block bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2 rounded-lg text-center transition-colors">
                  View AI Portfolio →
                </a>
                <a href="/chat" className="inline-block border border-purple-300 text-purple-700 hover:bg-purple-100 text-sm font-medium px-4 py-2 rounded-lg text-center transition-colors">
                  Chat with my resume
                </a>
              </div>
            </div>
          </section>

          <hr className="border-gray-100" />

          {/* Experience */}
          <section id="experience">
            <h2 className="section-heading">Experience</h2>
            <div className="mt-6 space-y-8">
              {experience.map((e) => (
                <div key={e.id} className="border-l-2 border-gray-100 pl-5">
                  <div className="flex flex-wrap justify-between gap-1">
                    <div>
                      <span className="font-semibold text-gray-900">{e.company}</span>
                      {e.client && <span className="text-gray-500 text-sm"> · {e.client}</span>}
                    </div>
                    <span className="text-sm text-gray-400 shrink-0">{e.start_date} – {e.end_date}</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-0.5">{e.role} · {e.location}</div>
                  <p className="mt-2 text-sm text-gray-700 leading-relaxed">{e.description}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {e.technologies.map((t) => (
                      <span key={t} className="tag-sm">{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <hr className="border-gray-100" />

          {/* Projects — B: AI projects visually distinct */}
          <section id="projects">
            <h2 className="section-heading">Key Projects</h2>
            <div className="mt-6 space-y-6">
              {projects.map((p) => (
                <div key={p.id}
                  className={`border-l-2 pl-5 ${p.is_ai ? 'border-purple-300' : 'border-gray-100'}`}>
                  <div className="flex flex-wrap justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">{p.name}</span>
                      {p.is_ai && (
                        <span className="text-xs font-semibold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">AI</span>
                      )}
                      <span className="text-gray-500 text-sm">· {p.client}</span>
                    </div>
                  </div>
                  <p className="mt-1 text-sm font-medium text-blue-700">{p.impact}</p>
                  <p className="mt-1 text-sm text-gray-700 leading-relaxed">{p.ai_summary ?? p.description}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {p.technologies.map((t) => (
                      <span key={t} className={`tag-sm ${p.is_ai ? 'bg-purple-50 text-purple-700' : ''}`}>{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <hr className="border-gray-100" />

          {/* C — AI Work section */}
          <section id="ai-work">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
              <h2 className="text-xl font-bold text-gray-900">AI Work</h2>
              <span className="text-xs font-semibold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">SAP + AI</span>
            </div>
            <p className="mt-2 text-sm text-gray-500">AI delivery within SAP, exploration through prototypes, and published thought leadership.</p>

            <div className="mt-6 space-y-4">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">AI Projects</h3>
              {aiProjects.map((p) => (
                <div key={p.id} className="border-l-2 border-purple-200 pl-5">
                  <span className="font-semibold text-gray-900 text-sm">{p.name}</span>
                  <span className="text-gray-500 text-sm"> · {p.client}</span>
                  <p className="mt-0.5 text-sm text-purple-700 font-medium">{p.impact}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 space-y-4">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">AI Blogs — SAP Community</h3>
              <ul className="space-y-3">
                {aiBlogs.map((b) => {
                  const slug = canonicalToSlug[b.url]
                  return (
                    <li key={b.id} className="border-l-2 border-purple-200 pl-5">
                      <a
                        href={slug ? `/blogs/${slug}` : b.url}
                        target={slug ? undefined : '_blank'}
                        rel={slug ? undefined : 'noopener noreferrer'}
                        className="text-sm text-purple-700 hover:underline font-medium"
                      >
                        {b.title}
                      </a>
                    </li>
                  )
                })}
              </ul>
            </div>

            <div className="mt-8">
              <a href="/ai" className="inline-block bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                Full AI Portfolio →
              </a>
            </div>
          </section>

          <hr className="border-gray-100" />

          {/* Certifications */}
          <section id="certifications">
            <h2 className="section-heading">Certifications</h2>
            <div className="mt-6 grid sm:grid-cols-2 gap-3">
              {certifications.map((c) => (
                <div key={c.id} className="border border-gray-100 rounded-lg p-3 hover:border-gray-300 transition-colors">
                  {c.credential_url ? (
                    <a href={c.credential_url} target="_blank" rel="noopener noreferrer"
                      className="text-sm font-medium text-blue-700 hover:underline leading-snug block">
                      {c.title}
                    </a>
                  ) : (
                    <span className="text-sm font-medium text-gray-900 leading-snug block">{c.title}</span>
                  )}
                  {c.code && <span className="text-xs text-gray-400 mt-0.5 block">{c.code}</span>}
                </div>
              ))}
            </div>
          </section>

          <hr className="border-gray-100" />

          {/* Blogs */}
          <section id="blogs">
            <h2 className="section-heading">Blog Posts</h2>
            <p className="mt-2 text-sm text-gray-500">Thought leadership on SAP BTP, event-driven architecture, AI-assisted workflows, and integration patterns.</p>
            <ul className="mt-5 space-y-3">
              {[
                { slug: 'blog-20-mj-ai-cognitive-pipeline-sap-btp',                          title: 'Michael Jackson: AI Cognitive Pipeline on SAP BTP, SAP CAP, ElevenLabs, Claude, HANA DB, Solace', ai: true },
                { slug: 'blog-1-event-driven-sap-cap-kyma-agentic-ai',                       title: 'Event Driven SAP CAP on Kyma with Agentic AI and UI Auto Refresh', ai: true },
                { slug: 'blog-3-event-driven-integration-sap-integration-suite',             title: 'Event Driven Integration Using SAP Integration Suite, Solace, HANA DB, and OpenAI Validation', ai: true },
                { slug: 'blog-2-automated-job-screening-sap-integration-suite-adzuna-chatgpt', title: 'Automated Job Screening Using SAP Integration Suite, Adzuna, and ChatGPT', ai: true },
                { slug: 'blog-4-multi-service-payg-sap-btp-kyma-docker-ethereum',            title: 'Multi-Service PAYG Application: SAP BTP Kyma Runtime, Docker, Ethereum, SAP AI Business Services', ai: false },
              ].map((b) => (
                <li key={b.slug} className={`border-l-2 pl-5 ${b.ai ? 'border-purple-200' : 'border-gray-100'}`}>
                  <a href={`/blogs/${b.slug}`} className={`text-sm font-medium hover:underline ${b.ai ? 'text-purple-700' : 'text-blue-700'}`}>
                    {b.title}
                  </a>
                  {b.ai && <span className="ml-2 text-xs bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded">AI</span>}
                </li>
              ))}
            </ul>
            <div className="mt-5">
              <a href="/blogs" className="text-sm text-blue-600 hover:underline font-medium">View all 24 posts →</a>
            </div>
          </section>

          <hr className="border-gray-100" />

          {/* Patent */}
          <section id="patent">
            <h2 className="section-heading">Patent</h2>
            {patent && (
              <div className="mt-6 border border-blue-100 rounded-xl p-5 bg-blue-50">
                <div className="flex flex-wrap justify-between gap-2">
                  <span className="text-sm font-semibold text-gray-900">US10304013B2</span>
                  <a href="https://patents.google.com/patent/US10304013B2/en" target="_blank" rel="noopener noreferrer"
                    className="text-sm text-blue-700 hover:underline">
                    View on Google Patents →
                  </a>
                </div>
                <p className="mt-2 text-sm text-gray-700 leading-relaxed">{patent.description}</p>
              </div>
            )}
          </section>

          <hr className="border-gray-100" />

          {/* Awards */}
          <section id="awards">
            <h2 className="section-heading">Awards & Recognition</h2>
            <div className="mt-6 space-y-4">
              {awards.map((a) => (
                <div key={a.id} className="flex gap-3">
                  <span className="text-yellow-500 shrink-0 mt-0.5">★</span>
                  <div>
                    <span className="text-sm font-semibold text-gray-900">{a.title}</span>
                    {a.year && <span className="text-sm text-gray-400"> · {a.year}</span>}
                    <p className="text-sm text-gray-600 mt-0.5">{a.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <hr className="border-gray-100" />

          {/* Education */}
          <section id="education">
            <h2 className="section-heading">Education</h2>
            <ul className="mt-6 space-y-3">
              {profile.education.map((e) => (
                <li key={e} className="flex gap-2 text-sm text-gray-700">
                  <span className="text-blue-500 mt-0.5 shrink-0">▸</span>
                  <span>{e}</span>
                </li>
              ))}
            </ul>
          </section>

        </main>
      </div>
    </div>
  )
}

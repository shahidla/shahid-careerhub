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
  title: 'Shahid M Syed - SAP Development Architect',
  description:
    'SAP Development Architect specialising in S/4HANA modernisation, ABAP on HANA, BTP, and AI-assisted SAP automation.',
  openGraph: {
    title: 'Shahid M Syed - SAP Development Architect',
    description: 'SAP Development Architect specialising in S/4HANA modernisation, ABAP on HANA, BTP, and AI-assisted SAP automation.',
    url: 'https://shahid-careerhub.vercel.app/resume',
    type: 'profile',
  },
  alternates: { canonical: 'https://shahid-careerhub.vercel.app/resume' },
}

const NAV = [
  { id: 'profile', label: 'Profile' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'blogs', label: 'Blogs' },
  { id: 'patent', label: 'Patent' },
  { id: 'awards', label: 'Awards' },
  { id: 'education', label: 'Education' },
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
  const patent = achievements.find((item) => item.description.includes('US10304013B2'))
  const awards = achievements.filter((item) => !item.description.includes('US10304013B2'))
  const aiBlogs = blogs.filter((blog) => blog.is_ai)
  const topBlogs = [...aiBlogs, ...blogs.filter((blog) => !blog.is_ai)].slice(0, 5)

  return (
    <div className="min-h-screen">
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
        }) }}
      />

      {/* Sub-header */}
      <header className="border-b border-surface-300/30 px-6 py-3 flex items-center gap-6 text-sm sticky top-[49px] bg-surface/80 backdrop-blur-xl z-10">
        <span className="text-gray-200 font-medium">SAP Profile</span>
        <div className="ml-auto flex items-center gap-4">
          <a href="/chat" className="bg-accent-blue hover:bg-blue-500 text-white text-xs font-medium px-4 py-1.5 rounded-full transition-all duration-200 shadow-lg shadow-blue-500/20">
            Chat with my resume
          </a>
        </div>
      </header>

      <div className="max-w-6xl mx-auto flex">
        {/* Sidebar */}
        <aside className="hidden lg:block w-48 shrink-0">
          <nav className="sticky top-12 pt-10 pb-6 pr-6">
            <ul className="space-y-1">
              {NAV.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} className="block text-sm py-1.5 pl-3 border-l-2 border-surface-300/30 hover:border-accent-purple/60 transition-all duration-200 text-gray-500 hover:text-gray-200">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-8 pt-6 border-t border-surface-300/20 space-y-2.5">
              <a href="/chat" className="block text-xs font-medium text-accent-purple hover:text-purple-400 transition-colors">Chat with my resume</a>
              <a href={`mailto:${profile.contact.email}`} className="block text-xs text-gray-500 hover:text-gray-300 truncate transition-colors">{profile.contact.email}</a>
              <a href={profile.contact.linkedin} target="_blank" rel="noopener noreferrer" className="block text-xs text-gray-500 hover:text-gray-300 transition-colors">LinkedIn</a>
              <a href={profile.contact.github} target="_blank" rel="noopener noreferrer" className="block text-xs text-gray-500 hover:text-gray-300 transition-colors">GitHub</a>
              <a href={profile.contact.sapCommunity} target="_blank" rel="noopener noreferrer" className="block text-xs text-gray-500 hover:text-gray-300 transition-colors">SAP Community</a>
            </div>
          </nav>
        </aside>

        <main className="flex-1 min-w-0 px-6 lg:px-10 py-10 space-y-16">
          {/* Profile */}
          <section id="profile" className="animate-fade-in">
            <h1 className="text-3xl font-display font-bold tracking-tight text-gray-100">{profile.name}</h1>
            <p className="mt-2 text-base text-gray-400">{profile.headline}</p>

            <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-500">
              <a href={`mailto:${profile.contact.email}`} className="hover:text-accent-blue transition-colors">{profile.contact.email}</a>
              <span className="text-gray-600">{profile.contact.phone}</span>
              <a href={profile.contact.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-accent-blue transition-colors">LinkedIn</a>
              <a href={profile.contact.github} target="_blank" rel="noopener noreferrer" className="hover:text-accent-blue transition-colors">GitHub</a>
              <a href={profile.contact.sapCommunity} target="_blank" rel="noopener noreferrer" className="hover:text-accent-blue transition-colors">SAP Community</a>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <a href="/chat" className="btn-primary text-sm">
                <span>💬</span> Ask about my experience
              </a>
              <a href="/chat" className="btn-outline text-sm">
                <span>📋</span> Paste a job — get match score
              </a>
            </div>

            <div className="mt-6 grid sm:grid-cols-2 gap-2">
              {profile.proof_points.map((point) => (
                <div key={point} className="flex gap-2 text-sm">
                  <span className="text-accent-blue mt-0.5 shrink-0">▸</span>
                  {point.toLowerCase().includes('teched speaker') ? (
                    <span className="text-gray-300">{point.replace('TechEd speaker', '')}<a href="/blogs/blog-18-sap-teched" className="text-accent-blue hover:underline">TechEd speaker</a></span>
                  ) : (
                    <span className="text-gray-300">{point}</span>
                  )}
                </div>
              ))}
            </div>

            {/* Areas of Expertise */}
            <div className="mt-6">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-[0.15em] mb-3">Areas of Expertise</h2>
              <ul className="grid sm:grid-cols-2 gap-2">
                {profile.positioning.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-gray-300">
                    <span className="text-accent-purple mt-0.5 shrink-0">▸</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Skills */}
            <div className="mt-8 space-y-5">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-[0.15em]">Skills</h2>
              {skills.map((skill) => (
                <div key={skill.id}>
                  <h3 className="text-sm font-semibold text-gray-300 mb-2">{skill.category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {skill.items.map((item) => (
                      <span key={item} className="tag">{item}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <hr className="border-surface-300/20" />

          {/* AI Banner */}
          <section className="glass-card p-6 border-accent-purple/20 animate-glow-pulse">
            <div className="flex flex-wrap justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-accent-purple uppercase tracking-[0.15em] mb-1">Also an AI Engineer</p>
                <h2 className="text-lg font-bold text-gray-100">SAP + AI — real delivery, not just theory</h2>
                <p className="mt-2 text-sm text-gray-400 max-w-xl leading-relaxed">
                  MCP server for AI-assisted SAP execution · ML models at SAP Labs · anomaly detection in production ·
                  {` ${aiBlogs.length} `}published AI blogs · building RAG pipelines, embeddings, and agents hands-on right now.
                </p>
              </div>
              <div className="flex flex-col gap-2 shrink-0 justify-center">
                <a href="/ai" className="btn-primary text-sm">
                  View AI Portfolio →
                </a>
                <a href="/chat" className="btn-outline text-sm !border-accent-purple/40 !text-accent-purple hover:!bg-accent-purple/10">
                  Chat with my resume
                </a>
              </div>
            </div>
          </section>

          <hr className="border-surface-300/20" />

          {/* Experience */}
          <section id="experience">
            <h2 className="section-heading">Experience</h2>
            <div className="mt-6 space-y-8">
              {experience.map((item) => (
                <div key={item.id} className="border-l-2 border-surface-300/40 pl-5 hover:border-accent-blue/50 transition-colors duration-300">
                  <div className="flex flex-wrap justify-between gap-1">
                    <div>
                      <span className="font-semibold text-gray-100">{item.company}</span>
                      {item.client && <span className="text-gray-500 text-sm"> · {item.client}</span>}
                    </div>
                    <span className="text-sm text-gray-500 shrink-0">{item.start_date} – {item.end_date}</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-0.5">{item.role} · {item.location}</div>
                  <p className="mt-2 text-sm text-gray-400 leading-relaxed">{item.description}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {item.technologies.map((tech) => (
                      <span key={tech} className="tag-sm">{tech}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <hr className="border-surface-300/20" />

          {/* Projects */}
          <section id="projects">
            <h2 className="section-heading">Key Projects</h2>
            <div className="mt-6 space-y-6">
              {projects.map((project) => (
                <div key={project.id} className={`border-l-2 pl-5 transition-colors duration-300 ${project.is_ai ? 'border-accent-purple/40 hover:border-accent-purple/70' : 'border-surface-300/40 hover:border-accent-blue/50'}`}>
                  <div className="flex flex-wrap justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-100">{project.name}</span>
                      {project.is_ai && (
                        <span className="text-xs font-semibold bg-accent-purple/20 text-accent-purple px-2 py-0.5 rounded-full border border-accent-purple/30">AI</span>
                      )}
                    </div>
                    {project.period && (
                      <span className="text-sm text-gray-500 shrink-0">{project.period}</span>
                    )}
                  </div>
                  {project.client && (
                    <div className="text-sm text-accent-blue mt-0.5">{project.client}</div>
                  )}
                  <p className="mt-1 text-sm font-medium text-accent-blue">{project.impact}</p>
                  <p className="mt-1 text-sm text-gray-400 leading-relaxed">{project.ai_summary ?? project.description}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {project.technologies.map((tech) => (
                      <span key={tech} className={`tag-sm ${project.is_ai ? '!bg-accent-purple/10 !text-accent-purple !border-accent-purple/20' : ''}`}>{tech}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <hr className="border-surface-300/20" />

          {/* Certifications */}
          <section id="certifications">
            <h2 className="section-heading">Certifications</h2>
            <div className="mt-6 grid sm:grid-cols-2 gap-3">
              {certifications.map((cert) => (
                <div key={cert.id} className="glass-card p-3 hover:border-accent-blue/30">
                  {cert.credential_url ? (
                    <a href={cert.credential_url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-accent-blue hover:underline leading-snug block">
                      {cert.title}
                    </a>
                  ) : (
                    <span className="text-sm font-medium text-gray-200 leading-snug block">{cert.title}</span>
                  )}
                  {cert.code && <span className="text-xs text-gray-500 mt-0.5 block">{cert.code}</span>}
                </div>
              ))}
            </div>
            <div className="mt-5 flex items-center gap-3 text-sm border-t border-surface-300/20 pt-4">
              <span className="text-gray-500">+ 69 completed courses covering SAP HANA, BTP, ABAP, AI/ML, and Fiori</span>
              <a href="/certifications" className="text-accent-blue hover:underline font-medium shrink-0">View all →</a>
            </div>
          </section>

          <hr className="border-surface-300/20" />

          {/* Blogs */}
          <section id="blogs">
            <h2 className="section-heading">Blogs</h2>
            <p className="mt-2 text-sm text-gray-500">Thought leadership on SAP BTP, event-driven architecture, AI-assisted workflows, and integration patterns.</p>
            <ul className="mt-5 space-y-3">
              {topBlogs.map((blog) => {
                const slug = canonicalToSlug[blog.url]
                return (
                  <li key={blog.id} className={`border-l-2 pl-5 py-1 transition-colors duration-200 ${blog.is_ai ? 'border-accent-purple/30 hover:border-accent-purple/60' : 'border-surface-300/30 hover:border-accent-blue/40'}`}>
                    <a
                      href={slug ? `/blogs/${slug}` : blog.url}
                      target={slug ? undefined : '_blank'}
                      rel={slug ? undefined : 'noopener noreferrer'}
                      className={`text-sm font-medium hover:underline ${blog.is_ai ? 'text-accent-purple' : 'text-accent-blue'}`}
                    >
                      {blog.title}
                    </a>
                    {blog.is_ai && <span className="ml-2 text-xs bg-accent-purple/15 text-accent-purple px-1.5 py-0.5 rounded border border-accent-purple/20">AI</span>}
                  </li>
                )
              })}
            </ul>
            <div className="mt-5">
              <a href="/blogs" className="text-sm text-accent-blue hover:underline font-medium">View all {blogs.length} posts →</a>
            </div>
          </section>

          <hr className="border-surface-300/20" />

          {/* Patent */}
          <section id="patent">
            <h2 className="section-heading">Patent</h2>
            {patent && (
              <div className="mt-6 glass-card p-5 border-accent-blue/20">
                <div className="flex flex-wrap justify-between gap-2">
                  <span className="text-sm font-semibold text-gray-100">US10304013B2</span>
                  <div className="flex gap-4">
                    <a href="/patent" className="text-sm text-accent-blue hover:underline">Full details →</a>
                    <a href="https://patents.google.com/patent/US10304013B2/en" target="_blank" rel="noopener noreferrer" className="text-sm text-accent-blue hover:underline">Google Patents →</a>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-400 leading-relaxed">{patent.description}</p>
              </div>
            )}
          </section>

          <hr className="border-surface-300/20" />

          {/* Awards */}
          <section id="awards">
            <h2 className="section-heading">Awards &amp; Recognition</h2>
            <div className="mt-6 space-y-4">
              {awards.map((award) => (
                <div key={award.id} className="flex gap-3">
                  <span className="text-accent-emerald shrink-0 mt-0.5">✦</span>
                  <div>
                    <span className="text-sm font-semibold text-gray-200">{award.title}</span>
                    {award.year && <span className="text-sm text-gray-500"> · {award.year}</span>}
                    <p className="text-sm text-gray-400 mt-0.5">{award.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <hr className="border-surface-300/20" />

          {/* Education */}
          <section id="education">
            <h2 className="section-heading">Education</h2>
            <ul className="mt-6 space-y-3">
              {profile.education.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-gray-300">
                  <span className="text-accent-blue mt-0.5 shrink-0">▸</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </main>
      </div>
    </div>
  )
}

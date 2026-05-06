import {
  getProfile,
  getExperience,
  getProjects,
  getCertifications,
  getSkills,
  getBlogs,
  getAchievements,
} from '@/lib/db'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Shahid M Syed — SAP Development Architect',
  description:
    'SAP Development Architect with 19 years experience in S/4HANA modernisation, ABAP on HANA, BTP, and AI-assisted SAP automation.',
}

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

  return (
    <main className="max-w-4xl mx-auto px-6 py-12 space-y-14">

      {/* Header */}
      <section>
        <h1 className="text-4xl font-bold tracking-tight">{profile.name}</h1>
        <p className="mt-2 text-lg text-gray-600">{profile.headline}</p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
          <a href={`mailto:${profile.contact.email}`} className="hover:text-gray-900">{profile.contact.email}</a>
          <span>{profile.contact.phone}</span>
          <a href={profile.contact.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-gray-900">LinkedIn</a>
          <a href={profile.contact.github} target="_blank" rel="noopener noreferrer" className="hover:text-gray-900">GitHub</a>
          <a href={profile.contact.sapCommunity} target="_blank" rel="noopener noreferrer" className="hover:text-gray-900">SAP Community</a>
        </div>
        <div className="mt-6 grid sm:grid-cols-2 gap-2">
          {profile.proof_points.map((p) => (
            <div key={p} className="flex gap-2 text-sm">
              <span className="text-blue-600 mt-0.5">▸</span>
              <span>{p}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Positioning */}
      <section>
        <h2 className="section-heading">Areas of Expertise</h2>
        <ul className="mt-3 grid sm:grid-cols-2 gap-2">
          {profile.positioning.map((p) => (
            <li key={p} className="flex gap-2 text-sm text-gray-700">
              <span className="text-blue-600 mt-0.5 shrink-0">▸</span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Skills */}
      <section>
        <h2 className="section-heading">Skills</h2>
        <div className="mt-3 space-y-4">
          {skills.map((s) => (
            <div key={s.id}>
              <h3 className="text-sm font-semibold text-gray-800 mb-1">{s.category}</h3>
              <div className="flex flex-wrap gap-2">
                {s.items.map((item) => (
                  <span key={item} className="tag">{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Experience */}
      <section>
        <h2 className="section-heading">Experience</h2>
        <div className="mt-3 space-y-8">
          {experience.map((e) => (
            <div key={e.id} className="border-l-2 border-gray-200 pl-4">
              <div className="flex flex-wrap justify-between gap-1">
                <div>
                  <span className="font-semibold text-gray-900">{e.company}</span>
                  {e.client && <span className="text-gray-500"> · {e.client}</span>}
                </div>
                <span className="text-sm text-gray-500 shrink-0">{e.start_date} – {e.end_date}</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-0.5 text-sm text-gray-600">
                <span>{e.role}</span>
                <span>·</span>
                <span>{e.location}</span>
              </div>
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

      {/* Projects */}
      <section>
        <h2 className="section-heading">Key Projects</h2>
        <div className="mt-3 space-y-6">
          {projects.map((p) => (
            <div key={p.id} className="border-l-2 border-gray-200 pl-4">
              <div className="flex flex-wrap justify-between gap-1">
                <div>
                  {p.url ? (
                    <a
                      href={p.url.startsWith('http') ? p.url : `/${p.url}`}
                      target={p.url.startsWith('http') ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      className="font-semibold text-blue-700 hover:underline"
                    >
                      {p.name}
                    </a>
                  ) : (
                    <span className="font-semibold text-gray-900">{p.name}</span>
                  )}
                  <span className="text-gray-500 text-sm"> · {p.client}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {p.tags.map((t) => (
                    <span key={t} className={`tag-sm ${p.is_ai ? 'bg-purple-100 text-purple-700' : ''}`}>{t}</span>
                  ))}
                </div>
              </div>
              <p className="mt-1 text-sm font-medium text-blue-800">{p.impact}</p>
              <p className="mt-1 text-sm text-gray-700 leading-relaxed">{p.description}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {p.technologies.map((t) => (
                  <span key={t} className="tag-sm">{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Certifications */}
      <section>
        <h2 className="section-heading">Certifications</h2>
        <div className="mt-3 grid sm:grid-cols-2 gap-3">
          {certifications.map((c) => (
            <div key={c.id} className="border border-gray-200 rounded-lg p-3">
              <div className="flex justify-between gap-2">
                <div className="flex-1">
                  {c.credential_url ? (
                    <a href={c.credential_url} target="_blank" rel="noopener noreferrer"
                      className="text-sm font-medium text-blue-700 hover:underline leading-snug block">
                      {c.title}
                    </a>
                  ) : (
                    <span className="text-sm font-medium text-gray-900 leading-snug block">{c.title}</span>
                  )}
                  <span className="text-xs text-gray-500">{c.issuer}{c.code ? ` · ${c.code}` : ''}{c.year ? ` · ${c.year}` : ''}</span>
                </div>
                {c.is_ai && <span className="tag-sm bg-purple-100 text-purple-700 shrink-0 self-start">AI</span>}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Blogs */}
      <section>
        <h2 className="section-heading">SAP Community Blogs</h2>
        <ul className="mt-3 space-y-2">
          {blogs.map((b) => (
            <li key={b.id} className="flex gap-3 items-start">
              <span className="text-blue-600 mt-1 shrink-0">▸</span>
              <div>
                <a href={b.url} target="_blank" rel="noopener noreferrer"
                  className="text-sm text-blue-700 hover:underline font-medium">
                  {b.title}
                </a>
                <div className="flex flex-wrap gap-1 mt-1">
                  {b.tags.map((t) => (
                    <span key={t} className="tag-sm">{t}</span>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Achievements */}
      <section>
        <h2 className="section-heading">Awards & Recognition</h2>
        <div className="mt-3 space-y-3">
          {achievements.map((a) => (
            <div key={a.id} className="flex gap-3">
              <span className="text-yellow-500 mt-0.5 shrink-0">★</span>
              <div>
                <span className="text-sm font-semibold text-gray-900">{a.title}</span>
                {a.year && <span className="text-sm text-gray-500"> · {a.year}</span>}
                <p className="text-sm text-gray-700 mt-0.5">{a.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Education */}
      <section>
        <h2 className="section-heading">Education</h2>
        <ul className="mt-3 space-y-2">
          {profile.education.map((e) => (
            <li key={e} className="flex gap-2 text-sm text-gray-700">
              <span className="text-blue-600 mt-0.5 shrink-0">▸</span>
              <span>{e}</span>
            </li>
          ))}
        </ul>
      </section>

    </main>
  )
}

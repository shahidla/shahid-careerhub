import { getAllBlogs } from '@/lib/blogs'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog — Shahid M Syed',
  description: 'Technical writing on SAP, AI engineering, and event-driven architecture.',
}

export default function BlogsPage() {
  const blogs = getAllBlogs()

  const featured = blogs.filter(b =>
    b.tags.some(t => ['AI', 'Generative AI', 'SAP CAP', 'SAP BTP', 'Kyma', 'Solace', 'OpenAI', 'sap btp', 'Claude', 'ElevenLabs'].includes(t))
  ).slice(0, 5)

  const archive = blogs.filter(b => !featured.includes(b))

  return (
    <main className="max-w-4xl mx-auto px-6 py-12 space-y-14">

      <section>
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-2">Technical Writing</p>
        <h1 className="text-4xl font-bold tracking-tight">Blog</h1>
        <p className="mt-3 text-lg text-gray-600">
          Articles on SAP, AI engineering, and event-driven architecture — originally published on SAP Community.
        </p>
        <p className="mt-2 text-sm text-gray-400">{blogs.length} posts</p>
      </section>

      {/* Featured / AI+SAP */}
      <section>
        <h2 className="text-xs font-semibold text-purple-500 uppercase tracking-widest mb-5">Start Here — AI + SAP</h2>
        <div className="space-y-5">
          {featured.map((b) => (
            <article key={b.slug} className="border border-purple-200 rounded-xl p-6 bg-white hover:border-purple-400 transition-colors">
              <a href={`/blogs/${b.slug}`} className="text-lg font-semibold text-gray-900 hover:text-purple-700 leading-snug block">
                {b.title}
              </a>
              <div className="mt-1 text-sm text-gray-500">
                {b.author} · {new Date(b.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              <p className="mt-2 text-gray-600 text-sm leading-relaxed">{b.excerpt}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {b.tags.map((t) => (
                  <span key={t} className="tag-sm bg-purple-50 text-purple-700">{t}</span>
                ))}
              </div>
              <div className="mt-3 text-sm">
                <a href={`/blogs/${b.slug}`} className="text-purple-600 hover:underline font-medium">Read post →</a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* All other posts */}
      <section>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">All Posts</h2>
        <div className="space-y-5">
          {archive.map((b) => (
            <article key={b.slug} className="border border-gray-200 rounded-xl p-6 bg-white hover:border-gray-300 transition-colors">
              <a href={`/blogs/${b.slug}`} className="text-lg font-semibold text-gray-900 hover:text-blue-700 leading-snug block">
                {b.title}
              </a>
              <div className="mt-1 text-sm text-gray-500">
                {b.author} · {new Date(b.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              <p className="mt-2 text-gray-600 text-sm leading-relaxed">{b.excerpt}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {b.tags.map((t) => (
                  <span key={t} className="tag-sm">{t}</span>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap gap-4 text-sm">
                <a href={`/blogs/${b.slug}`} className="text-blue-600 hover:underline font-medium">Read post →</a>
                <a href={b.canonical} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600">Originally on SAP Community ↗</a>
              </div>
            </article>
          ))}
        </div>
      </section>

    </main>
  )
}

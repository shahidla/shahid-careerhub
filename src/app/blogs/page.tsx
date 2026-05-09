import { getAllBlogs } from '@/lib/blogs'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog — Shahid M Syed',
  description: 'Technical writing on SAP, AI engineering, and event-driven architecture.',
}

export default function BlogsPage() {
  const blogs = getAllBlogs()

  return (
    <main className="max-w-4xl mx-auto px-6 py-12 space-y-14">

      <nav className="flex gap-4 text-sm border-b border-gray-200 pb-4">
        <a href="/" className="text-gray-500 hover:text-gray-900">Home</a>
        <a href="/resume" className="text-blue-600 hover:text-blue-800">SAP Profile →</a>
        <a href="/ai" className="text-purple-600 hover:text-purple-800">AI Portfolio →</a>
        <span className="text-gray-900 font-medium">Blog</span>
      </nav>

      <section>
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-2">Technical Writing</p>
        <h1 className="text-4xl font-bold tracking-tight">Blog</h1>
        <p className="mt-3 text-lg text-gray-600">
          Articles on SAP, AI engineering, and event-driven architecture — originally published on SAP Community.
        </p>
      </section>

      <section className="space-y-8">
        {blogs.map((b) => (
          <article key={b.slug} className="border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-colors">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <a href={`/blogs/${b.slug}`} className="text-xl font-semibold text-gray-900 hover:text-blue-700 leading-snug">
                  {b.title}
                </a>
                <div className="mt-1 text-sm text-gray-500">
                  {b.author} · {new Date(b.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>
            </div>
            <p className="mt-3 text-gray-700 text-sm leading-relaxed">{b.excerpt}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {b.tags.map((t) => (
                <span key={t} className="tag-sm">{t}</span>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              <a href={`/blogs/${b.slug}`} className="text-blue-600 hover:underline font-medium">
                Read post →
              </a>
              <a href={b.canonical} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600">
                Originally on SAP Community ↗
              </a>
            </div>
          </article>
        ))}
      </section>

    </main>
  )
}

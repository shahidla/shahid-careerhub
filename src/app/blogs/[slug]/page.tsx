import { getBlog, getAllBlogs, markdownToHtml } from '@/lib/blogs'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

type Props = { params: { slug: string } }

export async function generateStaticParams() {
  return getAllBlogs().map((b) => ({ slug: b.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const blog = getBlog(params.slug)
  if (!blog) return {}
  return {
    title: `${blog.title} — Shahid M Syed`,
    description: blog.excerpt,
    alternates: { canonical: blog.canonical },
  }
}

export default function BlogPage({ params }: Props) {
  const blog = getBlog(params.slug)
  if (!blog) notFound()

  const html = markdownToHtml(blog.content)

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">

      <nav className="flex gap-4 text-sm border-b border-gray-200 pb-4 mb-10">
        <a href="/" className="text-gray-500 hover:text-gray-900">Home</a>
        <a href="/resume" className="text-blue-600 hover:text-blue-800">SAP Profile →</a>
        <a href="/ai" className="text-purple-600 hover:text-purple-800">AI Portfolio →</a>
        <a href="/blogs" className="text-gray-500 hover:text-gray-900">← All Blogs</a>
      </nav>

      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight leading-snug">{blog.title}</h1>
        <div className="mt-3 text-sm text-gray-500">
          {blog.author} · {new Date(blog.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {blog.tags.map((t) => (
            <span key={t} className="tag-sm">{t}</span>
          ))}
        </div>
        <div className="mt-4">
          <a
            href={blog.canonical}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-400 hover:text-gray-600"
          >
            Originally published on SAP Community ↗
          </a>
        </div>
      </header>

      <article
        className="blog-prose"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      <footer className="mt-14 pt-8 border-t border-gray-200">
        <div className="flex flex-wrap gap-4 text-sm">
          <a href="/blogs" className="text-gray-500 hover:text-gray-900">← All Blogs</a>
          <a href={blog.canonical} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600">
            View on SAP Community ↗
          </a>
        </div>
      </footer>

    </main>
  )
}

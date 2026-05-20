import { getBlog, getAllBlogs, markdownToHtml } from '@/lib/blogs'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

type Props = { params: { slug: string } }

export async function generateStaticParams() {
  return getAllBlogs().map((blog) => ({ slug: blog.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const blog = getBlog(params.slug)
  if (!blog) return {}

  return {
    title: blog.title,
    description: blog.excerpt,
    alternates: { canonical: blog.canonical },
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      type: 'article',
      url: `https://shahid-careerhub.vercel.app/blogs/${blog.slug}`,
      publishedTime: blog.published_at,
      authors: ['Shahid M Syed'],
      tags: blog.tags,
    },
  }
}

export default function BlogPage({ params }: Props) {
  const blog = getBlog(params.slug)
  if (!blog) notFound()

  const html = markdownToHtml(blog.content)

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <a href="/blogs" className="mb-8 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900">
        Back to all blogs
      </a>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: blog.title,
            description: blog.excerpt,
            datePublished: blog.published_at,
            author: { '@type': 'Person', name: 'Shahid M Syed', url: 'https://shahid-careerhub.vercel.app/resume' },
            url: `https://shahid-careerhub.vercel.app/blogs/${blog.slug}`,
            keywords: blog.tags.join(', '),
          }),
        }}
      />

      <header className="mb-10 rounded-3xl border border-gray-200 bg-white/90 p-8 shadow-sm">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-500">SAP Community Archive</p>
          <h1 className="text-3xl font-bold leading-snug tracking-tight text-gray-900 md:text-4xl">{blog.title}</h1>
          <p className="max-w-3xl text-base leading-relaxed text-gray-600">{blog.excerpt}</p>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-gray-500">
          <span>{blog.author}</span>
          <span className="text-gray-300">|</span>
          <span>{new Date(blog.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {blog.tags.map((tag) => (
            <span key={tag} className="tag-sm">
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-6">
          <a
            href={blog.canonical}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm font-medium text-blue-700 hover:text-blue-800"
          >
            View original on SAP Community
          </a>
        </div>
      </header>

      <article className="blog-prose" dangerouslySetInnerHTML={{ __html: html }} />

      <footer className="mt-14 border-t border-gray-200 pt-8">
        <div className="flex flex-wrap gap-4 text-sm">
          <a href="/blogs" className="font-medium text-gray-500 hover:text-gray-900">
            Back to all blogs
          </a>
          <a href={blog.canonical} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-800">
            View original on SAP Community
          </a>
        </div>
      </footer>
    </main>
  )
}

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
    title: `${blog.title} - Shahid M Syed`,
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
    <main className="max-w-3xl mx-auto px-6 py-12">
      <a href="/blogs" className="mb-8 inline-block text-sm text-gray-500 hover:text-gray-900">
        ← All Blogs
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

      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight leading-snug">{blog.title}</h1>
        <div className="mt-3 text-sm text-gray-500">
          {blog.author} · {new Date(blog.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {blog.tags.map((tag) => (
            <span key={tag} className="tag-sm">
              {tag}
            </span>
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

      <article className="blog-prose" dangerouslySetInnerHTML={{ __html: html }} />

      <footer className="mt-14 border-t border-gray-200 pt-8">
        <div className="flex flex-wrap gap-4 text-sm">
          <a href="/blogs" className="text-gray-500 hover:text-gray-900">
            ← All Blogs
          </a>
          <a href={blog.canonical} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600">
            View on SAP Community ↗
          </a>
        </div>
      </footer>
    </main>
  )
}

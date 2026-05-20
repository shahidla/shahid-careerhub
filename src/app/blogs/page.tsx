import { getAllBlogs, type BlogMeta } from '@/lib/blogs'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog - Shahid M Syed',
  description: 'Technical writing on SAP, AI engineering, and event-driven architecture.',
}

type BlogsPageProps = {
  searchParams?: {
    tag?: string
    topic?: string
  }
}

type TopicOption = {
  slug: string
  label: string
}

const TOPICS: TopicOption[] = [
  { slug: 'ai-sap', label: 'AI + SAP' },
  { slug: 'integration', label: 'Integration' },
  { slug: 'btp-cap-kyma', label: 'BTP / CAP / Kyma' },
  { slug: 'abap-hana', label: 'ABAP / HANA' },
  { slug: 'ux-automation', label: 'UX / Automation' },
]

function normalizeTag(tag: string): string {
  return tag.trim().toLowerCase()
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function getTopicMatches(blog: BlogMeta): string[] {
  const haystack = `${blog.title} ${blog.excerpt} ${blog.tags.join(' ')}`.toLowerCase()
  const matches: string[] = []

  if (/(agentic ai|ai agent|chatgpt|claude|openai|generative ai|machinelearning|nlp|cognitive pipeline|ai\b)/.test(haystack)) {
    matches.push('ai-sap')
  }
  if (/(integration suite|solace|mqtt|odata|event driven|enterprise messaging|twitter)/.test(haystack)) {
    matches.push('integration')
  }
  if (/(btp|kyma|cap|cloud application programming model|sap cap|docker|ethereum)/.test(haystack)) {
    matches.push('btp-cap-kyma')
  }
  if (/(abap|hana|amdp|cds|text analysis|external views|procedures|database|xsjs|neo4j|mongodb)/.test(haystack)) {
    matches.push('abap-hana')
  }
  if (/(sapui5|ui5|fiori|robotic process automation|conversational ai|speech|canvas|ui logging|alexa)/.test(haystack)) {
    matches.push('ux-automation')
  }

  return matches
}

function getTopTags(blogs: BlogMeta[]): string[] {
  const counts = new Map<string, number>()

  for (const blog of blogs) {
    for (const tag of blog.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1)
    }
  }

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 10)
    .map(([tag]) => tag)
}

function filterBlogs(blogs: BlogMeta[], tag: string | undefined, topic: string | undefined): BlogMeta[] {
  return blogs.filter((blog) => {
    const tagMatch = !tag || blog.tags.some((item) => normalizeTag(item) === tag)
    const topicMatch = !topic || getTopicMatches(blog).includes(topic)
    return tagMatch && topicMatch
  })
}

function buildFilterHref(next: { tag?: string; topic?: string }): string {
  const params = new URLSearchParams()
  if (next.topic) params.set('topic', next.topic)
  if (next.tag) params.set('tag', next.tag)
  const query = params.toString()
  return query ? `/blogs?${query}` : '/blogs'
}

export default function BlogsPage({ searchParams }: BlogsPageProps) {
  const blogs = getAllBlogs()
  const activeTag = searchParams?.tag?.trim().toLowerCase() || undefined
  const activeTopic = searchParams?.topic?.trim().toLowerCase() || undefined
  const filteredBlogs = filterBlogs(blogs, activeTag, activeTopic)
  const featuredBlogs = blogs.filter((blog) => getTopicMatches(blog).includes('ai-sap')).slice(0, 3)
  const tagOptions = getTopTags(blogs)

  return (
    <main className="mx-auto max-w-5xl space-y-14 px-6 py-12">
      <section className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">Technical Writing</p>
        <div className="max-w-3xl space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">Blog</h1>
          <p className="text-lg text-gray-600">
            Articles on SAP, AI engineering, integration, and hands-on product experiments, originally published on SAP Community.
          </p>
          <p className="text-sm text-gray-400">
            {filteredBlogs.length} of {blogs.length} posts shown
          </p>
        </div>
      </section>

      {featuredBlogs.length > 0 ? (
        <section className="space-y-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">Start Here</p>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">AI + SAP highlights</h2>
            </div>
            <a href={buildFilterHref({ topic: 'ai-sap' })} className="text-sm font-medium text-blue-600 hover:underline">
              View all AI + SAP posts
            </a>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {featuredBlogs.map((blog) => (
              <article key={blog.slug} className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5">
                <div className="flex flex-wrap gap-2">
                  {getTopicMatches(blog)
                    .slice(0, 2)
                    .map((topic) => {
                      const label = TOPICS.find((item) => item.slug === topic)?.label ?? topic
                      return (
                        <span key={topic} className="tag-sm bg-blue-100 text-blue-700">
                          {label}
                        </span>
                      )
                    })}
                </div>
                <h3 className="mt-3 text-lg font-semibold leading-snug text-gray-900">
                  <a href={`/blogs/${blog.slug}`} className="hover:text-blue-700">
                    {blog.title}
                  </a>
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{blog.excerpt}</p>
                <div className="mt-4 text-xs text-gray-500">{formatDate(blog.published_at)}</div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="space-y-6">
        <div className="space-y-3">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Browse by topic</h2>
          <div className="flex flex-wrap gap-2">
            <a
              href={buildFilterHref({ tag: activeTag })}
              className={`tag-sm ${!activeTopic ? 'bg-gray-900 text-white' : 'hover:bg-gray-200'}`}
            >
              All topics
            </a>
            {TOPICS.map((topic) => (
              <a
                key={topic.slug}
                href={buildFilterHref({ topic: topic.slug, tag: activeTag })}
                className={`tag-sm ${activeTopic === topic.slug ? 'bg-gray-900 text-white' : 'hover:bg-gray-200'}`}
              >
                {topic.label}
              </a>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-500">Popular tags</h3>
          <div className="flex flex-wrap gap-2">
            <a
              href={buildFilterHref({ topic: activeTopic })}
              className={`tag-sm ${!activeTag ? 'bg-gray-900 text-white' : 'hover:bg-gray-200'}`}
            >
              All tags
            </a>
            {tagOptions.map((tag) => (
              <a
                key={tag}
                href={buildFilterHref({ topic: activeTopic, tag: normalizeTag(tag) })}
                className={`tag-sm ${activeTag === normalizeTag(tag) ? 'bg-gray-900 text-white' : 'hover:bg-gray-200'}`}
              >
                {tag}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section>
        {filteredBlogs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900">No posts match this filter yet.</h2>
            <p className="mt-2 text-sm text-gray-600">Try another topic or clear the tag filter to see the full archive.</p>
            <a href="/blogs" className="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline">
              Clear filters
            </a>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredBlogs.map((blog) => (
              <article key={blog.slug} className="rounded-2xl border border-gray-200 bg-white p-6 transition-colors hover:border-gray-300">
                <div className="flex flex-wrap gap-2">
                  {getTopicMatches(blog).map((topic) => {
                    const label = TOPICS.find((item) => item.slug === topic)?.label ?? topic
                    return (
                      <a
                        key={topic}
                        href={buildFilterHref({ topic, tag: activeTag })}
                        className={`tag-sm ${activeTopic === topic ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200'}`}
                      >
                        {label}
                      </a>
                    )
                  })}
                </div>
                <a href={`/blogs/${blog.slug}`} className="mt-3 block text-lg font-semibold leading-snug text-gray-900 hover:text-blue-700">
                  {blog.title}
                </a>
                <div className="mt-1 text-sm text-gray-500">
                  {blog.author} | {formatDate(blog.published_at)}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{blog.excerpt}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {blog.tags.map((tag) => (
                    <a
                      key={tag}
                      href={buildFilterHref({ topic: activeTopic, tag: normalizeTag(tag) })}
                      className={`tag-sm ${activeTag === normalizeTag(tag) ? 'bg-gray-900 text-white' : ''}`}
                    >
                      {tag}
                    </a>
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap gap-4 text-sm">
                  <a href={`/blogs/${blog.slug}`} className="font-medium text-blue-600 hover:underline">
                    Read post
                  </a>
                  <a href={blog.canonical} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600">
                    Originally on SAP Community
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

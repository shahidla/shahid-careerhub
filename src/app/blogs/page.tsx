import { getAllBlogs, type BlogMeta } from '@/lib/blogs'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog - Shahid M Syed',
  description: 'Technical writing on SAP, AI engineering, and event-driven architecture.',
}

type BlogsPageProps = {
  searchParams?: {
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

function filterBlogs(blogs: BlogMeta[], topic: string | undefined): BlogMeta[] {
  return blogs.filter((blog) => {
    return !topic || getTopicMatches(blog).includes(topic)
  })
}

function buildFilterHref(next: { topic?: string }): string {
  const params = new URLSearchParams()
  if (next.topic) params.set('topic', next.topic)
  const query = params.toString()
  return query ? `/blogs?${query}` : '/blogs'
}

export default function BlogsPage({ searchParams }: BlogsPageProps) {
  const blogs = getAllBlogs()
  const activeTopic = searchParams?.topic?.trim().toLowerCase() || undefined
  const filteredBlogs = filterBlogs(blogs, activeTopic)
  const featuredBlogs = blogs.filter((blog) => getTopicMatches(blog).includes('ai-sap')).slice(0, 3)

  return (
    <main className="mx-auto max-w-5xl space-y-14 px-6 py-12">
      <section className="space-y-4 animate-fade-in">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent-purple">Technical Writing</p>
        <div className="max-w-3xl space-y-3">
          <h1 className="text-4xl font-display font-bold tracking-tight text-gray-100">Blog</h1>
          <p className="text-lg text-gray-400">
            Articles on SAP, AI engineering, integration, and hands-on product experiments, originally published on SAP Community.
          </p>
        </div>
      </section>

      <section className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="flex flex-wrap gap-2">
          <a
            href={buildFilterHref({})}
            className={`tag-sm ${!activeTopic ? '!bg-accent-purple/20 !text-accent-purple !border-accent-purple/30' : 'hover:bg-surface-200'}`}
          >
            All posts ({blogs.length})
          </a>
          {TOPICS.map((topic) => {
            const count = blogs.filter((b) => getTopicMatches(b).includes(topic.slug)).length
            return (
              <a
                key={topic.slug}
                href={buildFilterHref({ topic: topic.slug })}
                className={`tag-sm ${activeTopic === topic.slug ? '!bg-accent-purple/20 !text-accent-purple !border-accent-purple/30' : 'hover:bg-surface-200'}`}
              >
                {topic.label} ({count})
              </a>
            )
          })}
        </div>
      </section>

      {!activeTopic && featuredBlogs.length > 0 ? (
        <section className="space-y-5 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-accent-blue">Start Here</p>
              <h2 className="text-2xl font-display font-bold tracking-tight text-gray-100">AI + SAP Highlights</h2>
            </div>
            <a href={buildFilterHref({ topic: 'ai-sap' })} className="text-sm font-medium text-accent-blue hover:underline">
              View all AI + SAP posts
            </a>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {featuredBlogs.map((blog) => (
              <article key={blog.slug} className="glass-card p-5 border-accent-blue/20 bg-accent-blue/[0.03] hover:border-accent-blue/40">
                <div className="flex flex-wrap gap-2">
                  {getTopicMatches(blog)
                    .slice(0, 2)
                    .map((topic) => {
                      const label = TOPICS.find((item) => item.slug === topic)?.label ?? topic
                      return (
                        <span key={topic} className="tag-sm !bg-accent-blue/10 !text-accent-blue !border-accent-blue/20">
                          {label}
                        </span>
                      )
                    })}
                </div>
                <h3 className="mt-3 text-lg font-semibold leading-snug text-gray-100">
                  <a href={`/blogs/${blog.slug}`} className="hover:text-accent-blue transition-colors">
                    {blog.title}
                  </a>
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-400">{blog.excerpt}</p>
                <div className="mt-4 text-xs text-gray-500">{formatDate(blog.published_at)}</div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
        {filteredBlogs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-surface-300/40 bg-surface-100/50 p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-100">No posts match this filter yet.</h2>
            <p className="mt-2 text-sm text-gray-400">Try another topic or clear the filters to see the full archive.</p>
            <a href="/blogs" className="mt-4 inline-block text-sm font-medium text-accent-blue hover:underline">
              Clear filters
            </a>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredBlogs.map((blog) => (
              <article key={blog.slug} className="glass-card p-6">
                <div className="flex flex-wrap gap-2">
                  {getTopicMatches(blog).map((topic) => {
                    const label = TOPICS.find((item) => item.slug === topic)?.label ?? topic
                    return (
                      <a
                        key={topic}
                        href={buildFilterHref({ topic })}
                        className={`tag-sm ${activeTopic === topic ? '!bg-accent-blue/10 !text-accent-blue !border-accent-blue/20' : 'hover:bg-surface-200'}`}
                      >
                        {label}
                      </a>
                    )
                  })}
                </div>
                <a href={`/blogs/${blog.slug}`} className="mt-3 block text-lg font-semibold leading-snug text-gray-100 hover:text-accent-blue transition-colors">
                  {blog.title}
                </a>
                <div className="mt-1 text-sm text-gray-500">
                  {blog.author} | {formatDate(blog.published_at)}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-gray-400">{blog.excerpt}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {blog.tags.map((tag) => (
                    <span key={tag} className="tag-sm">{tag}</span>
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap gap-4 text-sm">
                  <a href={`/blogs/${blog.slug}`} className="font-medium text-accent-blue hover:text-blue-400 transition-colors">
                    Read post
                  </a>
                  <a href={blog.canonical} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-300 transition-colors">
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

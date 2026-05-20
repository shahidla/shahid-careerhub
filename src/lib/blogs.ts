import fs from 'fs'
import path from 'path'

const BLOGS_DIR = path.join(process.cwd(), 'content/blogs')

export type BlogMeta = {
  slug: string
  title: string
  author: string
  published_at: string
  tags: string[]
  canonical: string
  excerpt: string
}

export type Blog = BlogMeta & { content: string }

function normalizeText(value: string): string {
  return value
    .replace(/\r\n/g, '\n')
    .replace(/â€™/g, "'")
    .replace(/â€˜/g, "'")
    .replace(/â€œ/g, '"')
    .replace(/â€/g, '"')
    .replace(/â€“/g, '-')
    .replace(/â€”/g, '-')
    .replace(/â€¦/g, '...')
    .replace(/â†’/g, '->')
    .replace(/Â·/g, ' | ')
    .replace(/âœ“/g, '[ok]')
    .replace(/ðŸŽ¬/g, 'Demo')
    .replace(/â€\u008b/g, '')
    .replace(/Â/g, ' ')
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function safeUrl(value: string): string {
  const trimmed = value.trim()
  if (/^(https?:|mailto:|\/)/i.test(trimmed)) return trimmed
  return '#'
}

function parseFrontmatter(raw: string): { data: Record<string, unknown>; content: string } {
  if (!raw.startsWith('---')) return { data: {}, content: raw }
  const end = raw.indexOf('\n---', 3)
  if (end === -1) return { data: {}, content: raw }
  const yaml = raw.slice(4, end).trim()
  const content = raw.slice(end + 4).trimStart()
  const data: Record<string, unknown> = {}

  for (const line of yaml.split('\n')) {
    const colon = line.indexOf(':')
    if (colon === -1) continue
    const key = line.slice(0, colon).trim()
    const val = line.slice(colon + 1).trim()
    if (val.startsWith('[')) {
      data[key] = val
        .slice(1, -1)
        .split(',')
        .map((item) => item.trim().replace(/^["']|["']$/g, ''))
    } else {
      data[key] = val.replace(/^["']|["']$/g, '')
    }
  }

  return { data, content }
}

function renderInline(md: string): string {
  let html = escapeHtml(md)

  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt: string, url: string) => {
    return `<img src="${safeUrl(url)}" alt="${alt}" />`
  })
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label: string, url: string) => {
    return `<a href="${safeUrl(url)}" target="${/^https?:/i.test(url) ? '_blank' : '_self'}" rel="${/^https?:/i.test(url) ? 'noopener noreferrer' : ''}">${label}</a>`
  })
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>')
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>')

  return html
}

export function markdownToHtml(md: string): string {
  const codeBlocks: string[] = []
  let normalized = normalizeText(md)

  normalized = normalized.replace(/```([a-zA-Z0-9_-]+)?\n([\s\S]*?)```/g, (_, lang: string, code: string) => {
    const safeCode = escapeHtml(code.trimEnd())
    const className = lang ? ` class="language-${lang}"` : ''
    const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`
    codeBlocks.push(`<pre><code${className}>${safeCode}</code></pre>`)
    return placeholder
  })

  const lines = normalized.split('\n')
  const out: string[] = []
  let paragraph: string[] = []
  let blockquote: string[] = []
  let listType: 'ul' | 'ol' | null = null

  const flushParagraph = () => {
    if (paragraph.length === 0) return
    out.push(`<p>${renderInline(paragraph.join(' '))}</p>`)
    paragraph = []
  }

  const flushBlockquote = () => {
    if (blockquote.length === 0) return
    out.push(`<blockquote><p>${renderInline(blockquote.join(' '))}</p></blockquote>`)
    blockquote = []
  }

  const flushList = () => {
    if (!listType) return
    out.push(`</${listType}>`)
    listType = null
  }

  for (const rawLine of lines) {
    const line = rawLine.trim()

    if (line === '') {
      flushParagraph()
      flushBlockquote()
      flushList()
      continue
    }

    const codeMatch = line.match(/^__CODE_BLOCK_(\d+)__$/)
    if (codeMatch) {
      flushParagraph()
      flushBlockquote()
      flushList()
      out.push(codeBlocks[Number(codeMatch[1])])
      continue
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/)
    if (headingMatch) {
      flushParagraph()
      flushBlockquote()
      flushList()
      const level = headingMatch[1].length
      out.push(`<h${level}>${renderInline(headingMatch[2].trim())}</h${level}>`)
      continue
    }

    if (line.startsWith('> ')) {
      flushParagraph()
      flushList()
      blockquote.push(line.slice(2).trim())
      continue
    }

    const orderedMatch = line.match(/^\d+\.\s+(.+)$/)
    if (orderedMatch) {
      flushParagraph()
      flushBlockquote()
      if (listType !== 'ol') {
        flushList()
        listType = 'ol'
        out.push('<ol>')
      }
      out.push(`<li>${renderInline(orderedMatch[1])}</li>`)
      continue
    }

    const unorderedMatch = line.match(/^-\s+(.+)$/)
    if (unorderedMatch) {
      flushParagraph()
      flushBlockquote()
      if (listType !== 'ul') {
        flushList()
        listType = 'ul'
        out.push('<ul>')
      }
      out.push(`<li>${renderInline(unorderedMatch[1])}</li>`)
      continue
    }

    if (/^<img\b/.test(renderInline(line))) {
      flushParagraph()
      flushBlockquote()
      flushList()
      out.push(renderInline(line))
      continue
    }

    flushBlockquote()
    flushList()
    paragraph.push(line)
  }

  flushParagraph()
  flushBlockquote()
  flushList()

  return out.join('\n')
}

export function getAllBlogs(): BlogMeta[] {
  return fs
    .readdirSync(BLOGS_DIR)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => {
      const raw = fs.readFileSync(path.join(BLOGS_DIR, file), 'utf8')
      const { data } = parseFrontmatter(raw)
      return {
        slug: file.replace(/\.mdx$/, ''),
        ...data,
        title: normalizeText(String(data.title ?? '')),
        author: normalizeText(String(data.author ?? '')),
        excerpt: normalizeText(String(data.excerpt ?? '')),
      } as BlogMeta
    })
    .sort((a, b) => {
      const dateOrder = b.published_at.localeCompare(a.published_at)
      if (dateOrder !== 0) return dateOrder
      return a.slug.localeCompare(b.slug)
    })
}

export function getCanonicalToSlugMap(): Record<string, string> {
  return Object.fromEntries(getAllBlogs().map((blog) => [blog.canonical, blog.slug]))
}

export function getBlog(slug: string): Blog | null {
  const file = path.join(BLOGS_DIR, `${slug}.mdx`)
  if (!fs.existsSync(file)) return null

  const raw = fs.readFileSync(file, 'utf8')
  const { data, content } = parseFrontmatter(raw)

  return {
    slug,
    ...data,
    title: normalizeText(String(data.title ?? '')),
    author: normalizeText(String(data.author ?? '')),
    excerpt: normalizeText(String(data.excerpt ?? '')),
    content: normalizeText(content),
  } as Blog
}

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

export function markdownToHtml(md: string): string {
  let html = escapeHtml(md)
  html = html.replace(/^###### (.+)$/gm, '<h6>$1</h6>')
  html = html.replace(/^##### (.+)$/gm, '<h5>$1</h5>')
  html = html.replace(/^#### (.+)$/gm, '<h4>$1</h4>')
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>')
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>')
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>')
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')
  html = html.replace(/`(.+?)`/g, '<code>$1</code>')
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt: string, url: string) => {
    return `<img src="${safeUrl(url)}" alt="${alt}" />`
  })
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label: string, url: string) => {
    return `<a href="${safeUrl(url)}">${label}</a>`
  })

  const lines = html.split('\n')
  const out: string[] = []
  let inParagraph = false

  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed === '') {
      if (inParagraph) {
        out.push('</p>')
        inParagraph = false
      }
      continue
    }

    if (/^<(h[1-6]|img|ul|ol|li|blockquote|pre|hr)/.test(trimmed)) {
      if (inParagraph) {
        out.push('</p>')
        inParagraph = false
      }
      out.push(trimmed)
    } else {
      if (!inParagraph) {
        out.push('<p>')
        inParagraph = true
      }
      out.push(trimmed)
    }
  }

  if (inParagraph) out.push('</p>')
  return out.join('\n')
}

export function getAllBlogs(): BlogMeta[] {
  return fs
    .readdirSync(BLOGS_DIR)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => {
      const raw = fs.readFileSync(path.join(BLOGS_DIR, file), 'utf8')
      const { data } = parseFrontmatter(raw)
      return { slug: file.replace(/\.mdx$/, ''), ...data } as BlogMeta
    })
    .sort((a, b) => b.published_at.localeCompare(a.published_at))
}

export function getCanonicalToSlugMap(): Record<string, string> {
  return Object.fromEntries(getAllBlogs().map((blog) => [blog.canonical, blog.slug]))
}

export function getBlog(slug: string): Blog | null {
  const file = path.join(BLOGS_DIR, `${slug}.mdx`)
  if (!fs.existsSync(file)) return null

  const raw = fs.readFileSync(file, 'utf8')
  const { data, content } = parseFrontmatter(raw)
  return { slug, ...data, content } as Blog
}

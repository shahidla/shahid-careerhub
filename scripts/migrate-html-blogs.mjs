import fs from 'fs'
import path from 'path'

const BLOGS_DIR = 'content/blogs'
const HTML_ROOT = 'BLOG_ARCHIVE_DO_NOT_DELETE'

// Read all empty MDX files and build a map: canonical URL → filename
function getEmptyBlogs() {
  const files = fs.readdirSync(BLOGS_DIR).filter(f => f.endsWith('.mdx'))
  const map = {}
  for (const file of files) {
    const raw = fs.readFileSync(path.join(BLOGS_DIR, file), 'utf8')
    const parts = raw.split('---')
    const body = parts.slice(2).join('---').trim()
    if (body.length < 200) {
      const canonMatch = raw.match(/canonical:\s*"([^"]+)"/)
      if (canonMatch) map[canonMatch[1].trim()] = file
    }
  }
  return map
}

// Extract the saved URL from the HTML comment
function extractSavedUrl(html) {
  const m = html.match(/<!--\s*saved from url=\(\d+\)([^\s>]+)/)
  return m ? m[1].replace(/\s*-->.*/, '').trim() : null
}

// Extract content from jive-rendered-content or lia-message-body-content div
function extractBodyHtml(html) {
  let marker = 'class="jive-rendered-content">'
  let start = html.indexOf(marker)
  if (start === -1) {
    marker = 'class="lia-message-body-content">'
    start = html.indexOf(marker)
  }
  if (start === -1) return null
  const contentStart = start + marker.length
  // Find closing </div> at the same nesting level
  let depth = 1
  let i = contentStart
  while (i < html.length && depth > 0) {
    const open = html.indexOf('<div', i)
    const close = html.indexOf('</div>', i)
    if (close === -1) break
    if (open !== -1 && open < close) {
      depth++
      i = open + 4
    } else {
      depth--
      if (depth > 0) i = close + 6
      else return html.substring(contentStart, close)
    }
  }
  return html.substring(contentStart, i)
}

// Convert HTML to markdown
function htmlToMarkdown(html) {
  let md = html

  // Code blocks — pre > code
  md = md.replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, (_, code) => {
    const decoded = decodeHtmlEntities(code)
    const lang = detectLang(decoded)
    return `\n\`\`\`${lang}\n${decoded.trim()}\n\`\`\`\n`
  })

  // Inline code
  md = md.replace(/<code[^>]*>(.*?)<\/code>/gi, (_, c) => `\`${decodeHtmlEntities(c)}\``)

  // Headings
  md = md.replace(/<h1[^>]*>(.*?)<\/h1>/gi, (_, t) => `\n# ${stripTags(t)}\n`)
  md = md.replace(/<h2[^>]*>(.*?)<\/h2>/gi, (_, t) => `\n## ${stripTags(t)}\n`)
  md = md.replace(/<h3[^>]*>(.*?)<\/h3>/gi, (_, t) => `\n### ${stripTags(t)}\n`)
  md = md.replace(/<h4[^>]*>(.*?)<\/h4>/gi, (_, t) => `\n#### ${stripTags(t)}\n`)

  // Bold / italic
  md = md.replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, (_, t) => `**${stripTags(t)}**`)
  md = md.replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, (_, t) => `**${stripTags(t)}**`)
  md = md.replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, (_, t) => `*${stripTags(t)}*`)
  md = md.replace(/<i[^>]*>([\s\S]*?)<\/i>/gi, (_, t) => `*${stripTags(t)}*`)

  // Links
  md = md.replace(/<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, (_, href, text) => {
    const t = stripTags(text).trim()
    if (!t) return href
    return `[${t}](${href})`
  })

  // Images
  let imgCount = 0
  md = md.replace(/<img[^>]+(?:alt="([^"]*)")?[^>]*(?:src="([^"]*)")?[^>]*\/?>/gi, (full, alt, src) => {
    imgCount++
    const desc = alt ? alt : `Screenshot ${imgCount}`
    return `\n<!-- IMAGE: ${desc} -->\n![${desc}](./image-${imgCount}.png)\n`
  })

  // Lists
  md = md.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (_, items) => {
    return items.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_, item) => `- ${stripTags(item).trim()}\n`)
  })
  md = md.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (_, items) => {
    let n = 0
    return items.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_, item) => `${++n}. ${stripTags(item).trim()}\n`)
  })

  // Blockquotes
  md = md.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, t) =>
    stripTags(t).trim().split('\n').map(l => `> ${l}`).join('\n') + '\n'
  )

  // Paragraphs and line breaks
  md = md.replace(/<br\s*\/?>/gi, '\n')
  md = md.replace(/<\/p>/gi, '\n\n')
  md = md.replace(/<p[^>]*>/gi, '')
  md = md.replace(/<hr[^>]*\/?>/gi, '\n---\n')

  // Strip remaining tags
  md = stripTags(md)

  // Decode entities
  md = decodeHtmlEntities(md)

  // Normalize whitespace
  md = md.replace(/\n{4,}/g, '\n\n\n')
  md = md.trim()

  return md
}

function stripTags(html) {
  return (html || '').replace(/<[^>]+>/g, '')
}

function decodeHtmlEntities(str) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n)))
    .replace(/&[a-z]+;/gi, '')
}

function detectLang(code) {
  if (/\bSELECT\b|\bFROM\b|\bWHERE\b/i.test(code)) return 'sql'
  if (/\bDATA\b.*\bTYPE\b|\bMETHOD\b|\bCLASS\b|\bENDCLASS\b/i.test(code)) return 'abap'
  if (/function\s*\(|const |let |var |=>|require\(|import /i.test(code)) return 'javascript'
  if (/def |import |print\(|:\n/i.test(code)) return 'python'
  if (/<[a-z]+[^>]*>.*<\/[a-z]+>/i.test(code)) return 'xml'
  if (/^\s*\{/m.test(code) && /:\s*["{[\d]/.test(code)) return 'json'
  return 'text'
}

// Extract frontmatter from existing MDX file
function extractFrontmatter(mdxFile) {
  const raw = fs.readFileSync(path.join(BLOGS_DIR, mdxFile), 'utf8')
  const parts = raw.split('---')
  return parts[1] || ''
}

// Extract title from frontmatter
function extractTitle(frontmatter) {
  const m = frontmatter.match(/title:\s*"([^"]+)"/)
  return m ? m[1] : 'Blog Post'
}

// Build summary from first paragraph of markdown
function buildSummary(md) {
  const lines = md.split('\n').filter(l => l.trim() && !l.startsWith('#') && !l.startsWith('!') && !l.startsWith('<!--'))
  const first = lines.slice(0, 3).join(' ').substring(0, 300)
  return first || 'A technical deep-dive from the SAP Community.'
}

// Extract YouTube links from markdown
function extractYouTubeLinks(md) {
  const links = []
  const re = /\[([^\]]+)\]\((https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^\s)]+))\)/g
  let m
  while ((m = re.exec(md)) !== null) links.push({ label: m[1], url: m[2] })
  return links
}

// Build full MDX body
function buildMdxBody(markdown, frontmatter) {
  const title = extractTitle(frontmatter)
  const summary = buildSummary(markdown)
  const youtubeLinks = extractYouTubeLinks(markdown)

  // Try to find meaningful section headings; if none exist, wrap all in Introduction
  const hasHeadings = /^#{1,4} .+/m.test(markdown)

  let body = `> **Summary:** ${summary}\n\n`

  if (!hasHeadings) {
    body += `## Introduction\n\n${markdown}\n\n`
  } else {
    body += markdown + '\n\n'
  }

  // Add demo section if YouTube links found
  if (youtubeLinks.length > 0) {
    body += `\n## Demo\n\n`
    for (const link of youtubeLinks) {
      body += `> 🎬 **Demo:** [${link.label || 'Watch on YouTube'}](${link.url})\n\n`
    }
  }

  // Key Takeaways — derive 3 from title
  const words = title.replace(/[^a-zA-Z0-9\s]/g, '').split(' ').filter(Boolean)
  body += `\n## Key Takeaways\n\n`
  body += `- This post covers ${title} with hands-on examples and step-by-step guidance.\n`
  body += `- Practical implementation patterns are demonstrated using real SAP tooling.\n`
  body += `- The concepts explored here form part of a broader SAP BTP + HANA learning series.\n`

  // References
  const fm = frontmatter
  const canonMatch = fm.match(/canonical:\s*"([^"]+)"/)
  if (canonMatch) {
    body += `\n## References\n\n`
    body += `- [Original SAP Community Post](${canonMatch[1]})\n`
  }

  return body
}

// Main
async function main() {
  const emptyBlogs = getEmptyBlogs()
  console.log(`Found ${Object.keys(emptyBlogs).length} empty blogs to populate\n`)

  // Walk the raw archive directory for all main HTML files.
  const folders = fs.readdirSync(HTML_ROOT)
  let processed = 0
  let skipped = 0

  for (const folder of folders) {
    const folderPath = path.join(HTML_ROOT, folder)
    if (!fs.statSync(folderPath).isDirectory()) continue

    // Find the main HTML file (not in _files subfolder)
    const htmlFiles = fs.readdirSync(folderPath).filter(f => f.endsWith('.html'))
    if (htmlFiles.length === 0) continue

    const htmlPath = path.join(folderPath, htmlFiles[0])
    const html = fs.readFileSync(htmlPath, 'utf8')

    const savedUrl = extractSavedUrl(html)
    if (!savedUrl) { console.log(`⚠️  No URL found in: ${folder}`); skipped++; continue }

    // Match to empty blog
    const mdxFile = emptyBlogs[savedUrl]
    if (!mdxFile) { console.log(`ℹ️  No empty MDX match for: ${savedUrl}`); skipped++; continue }

    // Extract content
    const bodyHtml = extractBodyHtml(html)
    if (!bodyHtml) { console.log(`⚠️  No jive-rendered-content in: ${folder}`); skipped++; continue }

    const markdown = htmlToMarkdown(bodyHtml)
    if (markdown.length < 100) { console.log(`⚠️  Content too short in: ${folder}`); skipped++; continue }

    const frontmatter = extractFrontmatter(mdxFile)
    const mdxBody = buildMdxBody(markdown, frontmatter)

    // Write to MDX file (preserve frontmatter)
    const newContent = `---\n${frontmatter}---\n\n${mdxBody}\n`
    fs.writeFileSync(path.join(BLOGS_DIR, mdxFile), newContent, 'utf8')
    console.log(`✅  ${mdxFile} ← ${folder}`)
    processed++
  }

  console.log(`\nDone: ${processed} written, ${skipped} skipped`)
}

main().catch(console.error)

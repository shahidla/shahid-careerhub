// Blog conversion script: SAP Community HTML -> MDX
// Run: node scripts/convert-blogs.js
// No npm dependencies required

const fs = require('fs')
const path = require('path')

const BLOGS_SRC = path.join(__dirname, '../Blogs')
const BLOGS_DEST = path.join(__dirname, '../content/blogs')
const IMAGES_DEST = path.join(__dirname, '../public/blogs')

// Slug map: folder name -> desired slug
// Adjust these as needed
const SLUG_MAP = {
  'Automated Job Screening Using SAP Integration Suite, Adzuna, and ChatGPT':
    'blog-2-automated-job-screening-sap-integration-suite-adzuna-chatgpt',
  'Event Driven Integration Using SAP Integration Suite':
    'blog-3-event-driven-integration-sap-integration-suite',
  'Event Driven SAP CAP on Kyma with Agentic AI':
    'blog-1-event-driven-sap-cap-kyma-agentic-ai', // already done, skip
  'Multi-Service PAYG Application SAP BTP Kyma Runtime, Docker, Ethereum, SAP AI Business Services':
    'blog-4-multi-service-payg-sap-btp-kyma-docker-ethereum',
  'SAP Cloud Platform Enterprise Messaging with Twitter':
    'blog-5-sap-cloud-platform-enterprise-messaging-twitter',
  'SAP HANA 1': 'blog-6-consuming-hana-views-procedures-abap-part-1',
  'SAP HANA 2': 'blog-7-consuming-hana-views-procedures-abap-part-2',
  'SAP HANA 3': 'blog-8-consuming-hana-views-procedures-abap-part-3',
  'SAP HANA EXCEL': 'blog-9-sap-hana-excel-integration',
  'SAP HANA MONGO': 'blog-10-sap-hana-mongodb-integration',
  'SAP HANA Text Analysis': 'blog-11-sap-hana-text-analysis',
  'SAP IRPA 1': 'blog-12-sap-irpa-part-1',
  'SAP IRPA 2': 'blog-13-sap-irpa-part-2',
  'SAP IRPA 3': 'blog-14-sap-irpa-part-3',
  'SAP IRPA 4': 'blog-15-sap-irpa-part-4',
  'SAP MQTT': 'blog-16-sap-mqtt',
  'SAP RIVER': 'blog-17-sap-river',
  'SAP TechEd': 'blog-18-sap-teched',
  'SAP UI Logging': 'blog-19-sap-ui-logging',
  'MJ': 'blog-20-mj-ai-cognitive-pipeline-sap-btp',
  'SAP HANA & Canvas - Exp1': 'blog-21-sap-hana-canvas-exp1',
  'SAP HANA & Canvas - Exp2': 'blog-22-sap-hana-canvas-exp2',
  'Chrome Speech Input in SAPUI5HANA Application - Exp3': 'blog-23-chrome-speech-input-sapui5-exp3',
}

function extract(html, pattern) {
  const m = html.match(pattern)
  return m ? m[1].trim() : ''
}

function extractMeta(html) {
  const title = extract(html, /"pageName":\s*"([^"]+)"/)
  const date = extract(html, /"messageCreateDate":\s*"([^"]+)"/)
  const tagsRaw = extract(html, /"user_tags":\s*\[([^\]]*)\]/)
  const canonical = extract(html, /rel="canonical"[^>]*href="([^"]+)"/) ||
    extract(html, /href="([^"]+)"[^>]*rel="canonical"/)
  const excerpt = extract(html, /<meta[^>]+name="description"[^>]+content="([^"]+)"/) ||
    extract(html, /<meta[^>]+content="([^"]+)"[^>]+name="description"/)

  const tags = tagsRaw
    .split(',')
    .map(t => t.replace(/['"]/g, '').trim())
    .filter(Boolean)

  // Normalize date to YYYY-MM-DD
  const published_at = date ? date.slice(0, 10) : '2024-01-01'

  return { title: decode(title), published_at, tags, canonical, excerpt: excerpt.slice(0, 300) }
}

function extractBody(html) {
  const m = html.match(/<div class="lia-message-body-content">([\s\S]*?)<\/div>\s*\n?\s*\n?\s*<\/div>\s*\n?\s*<\/div>\s*\n?\s*<\/div>\s*\n?\s*<div id="labelsWithEvent"/)
  if (m) return m[1].trim()
  // Fallback: grab everything between lia-message-body-content and the labels section
  const start = html.indexOf('<div class="lia-message-body-content">')
  const end = html.indexOf('<div id="labelsWithEvent"')
  if (start === -1 || end === -1) return ''
  return html.slice(start + '<div class="lia-message-body-content">'.length, end).trim()
}

function htmlToMarkdown(html, slug) {
  let md = html

  // Images: extract src and alt, rewrite to public path
  md = md.replace(/<img[^>]+src="([^"]*_files\/([^"?]+))[^"]*"[^>]*alt="([^"]*)"[^>]*>/gi, (_, _src, filename, alt) => {
    return `![${alt || filename}](/blogs/${slug}/${filename})`
  })
  md = md.replace(/<img[^>]+alt="([^"]*)"[^>]+src="([^"]*_files\/([^"?]+))[^"]*"[^>]*>/gi, (_, alt, _src, filename) => {
    return `![${alt || filename}](/blogs/${slug}/${filename})`
  })
  // Remove any remaining img wrappers
  md = md.replace(/<span[^>]*lia-inline-image[^>]*>([\s\S]*?)<\/span>/gi, '$1')
  md = md.replace(/<span[^>]*lia-message-image-wrapper[^>]*>([\s\S]*?)<\/span>/gi, '$1')

  // Headings
  md = md.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, (_, t) => `\n# ${strip(t)}\n`)
  md = md.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, (_, t) => `\n## ${strip(t)}\n`)
  md = md.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, (_, t) => `\n### ${strip(t)}\n`)
  md = md.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, (_, t) => `\n#### ${strip(t)}\n`)
  md = md.replace(/<h5[^>]*>([\s\S]*?)<\/h5>/gi, (_, t) => `\n##### ${strip(t)}\n`)
  md = md.replace(/<h6[^>]*>([\s\S]*?)<\/h6>/gi, (_, t) => `\n###### ${strip(t)}\n`)

  // Bold/italic
  md = md.replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, '**$1**')
  md = md.replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, '**$1**')
  md = md.replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, '*$1*')
  md = md.replace(/<i[^>]*>([\s\S]*?)<\/i>/gi, '*$1*')
  md = md.replace(/<u[^>]*>([\s\S]*?)<\/u>/gi, '$1')

  // Links
  md = md.replace(/<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, (_, href, text) => {
    const t = strip(text).trim()
    if (!t) return href
    return `[${t}](${href})`
  })

  // Code
  md = md.replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, (_, code) => `\n\`\`\`\n${decode(code)}\n\`\`\`\n`)
  md = md.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, '`$1`')
  md = md.replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, (_, code) => `\n\`\`\`\n${decode(code)}\n\`\`\`\n`)

  // Lists
  md = md.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (_, inner) => {
    return inner.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_, item) => `- ${strip(item).trim()}\n`) + '\n'
  })
  md = md.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (_, inner) => {
    let i = 0
    return inner.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_, item) => `${++i}. ${strip(item).trim()}\n`) + '\n'
  })

  // Blockquote
  md = md.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, inner) => {
    return strip(inner).split('\n').map(l => `> ${l}`).join('\n') + '\n'
  })

  // Iframes (videos) — keep as link
  md = md.replace(/<iframe[^>]+title="([^"]*)"[^>]*src="[^"]*youtube[^"]*"[^>]*>/gi, (_, title) => `\n*(Video: ${title})*\n`)
  md = md.replace(/<div[^>]*video-embed[^>]*>[\s\S]*?<\/div>/gi, '')
  md = md.replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, '')

  // Paragraphs and line breaks
  md = md.replace(/<br\s*\/?>/gi, '\n')
  md = md.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (_, inner) => {
    const t = strip(inner).trim()
    return t ? `\n${t}\n` : ''
  })
  md = md.replace(/<div[^>]*>([\s\S]*?)<\/div>/gi, '$1\n')

  // Decode HTML entities and clean up
  md = decode(md)

  // Remove any remaining tags
  md = md.replace(/<[^>]+>/g, '')

  // Clean up excessive blank lines
  md = md.replace(/\n{4,}/g, '\n\n').trim()

  return md
}

function strip(html) {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

function decode(str) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
}

function copyImages(folder, slug) {
  const filesDir = fs.readdirSync(folder).find(f => f.endsWith('_files'))
  if (!filesDir) return []
  const src = path.join(folder, filesDir)
  const dest = path.join(IMAGES_DEST, slug)
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true })

  const copied = []
  for (const f of fs.readdirSync(src)) {
    if (/\.(jpg|jpeg|png|gif|svg|webp)$/i.test(f)) {
      fs.copyFileSync(path.join(src, f), path.join(dest, f))
      copied.push(f)
    }
  }
  return copied
}

function convertBlog(folderName) {
  const slug = SLUG_MAP[folderName]
  if (!slug) { console.log(`  SKIP (no slug): ${folderName}`); return }

  // Skip already-converted blogs
  const ALREADY_DONE = [
    'blog-1-event-driven-sap-cap-kyma-agentic-ai',
    'blog-18-sap-teched',
  ]
  if (ALREADY_DONE.includes(slug)) {
    console.log(`  SKIP (already converted): ${folderName}`)
    return
  }

  const folder = path.join(BLOGS_SRC, folderName)
  const htmlFiles = fs.readdirSync(folder).filter(f => f.endsWith('.html'))
  if (htmlFiles.length === 0) { console.log(`  SKIP (no HTML): ${folderName}`); return }

  const html = fs.readFileSync(path.join(folder, htmlFiles[0]), 'utf8')
  const meta = extractMeta(html)
  const bodyHtml = extractBody(html)
  const bodyMd = htmlToMarkdown(bodyHtml, slug)
  const images = copyImages(folder, slug)

  const mdx = `---
title: "${meta.title.replace(/"/g, '\\"')}"
author: "Shahid"
published_at: "${meta.published_at}"
tags: [${meta.tags.map(t => `"${t}"`).join(', ')}]
canonical: "${meta.canonical}"
excerpt: "${meta.excerpt.replace(/"/g, '\\"')}"
---

${bodyMd}
`

  const destFile = path.join(BLOGS_DEST, `${slug}.mdx`)
  fs.writeFileSync(destFile, mdx, 'utf8')
  console.log(`  OK: ${slug} (${images.length} images)`)
}

// Main
if (!fs.existsSync(BLOGS_DEST)) fs.mkdirSync(BLOGS_DEST, { recursive: true })

const folders = fs.readdirSync(BLOGS_SRC).filter(f => {
  const full = path.join(BLOGS_SRC, f)
  return fs.statSync(full).isDirectory()
})

console.log(`Converting ${folders.length} blog folders...`)
for (const folder of folders) {
  process.stdout.write(`${folder}: `)
  try {
    convertBlog(folder)
  } catch (err) {
    console.log(`  ERROR: ${err.message}`)
  }
}
console.log('\nDone.')

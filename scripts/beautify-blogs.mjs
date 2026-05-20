import fs from 'fs'
import path from 'path'

const BLOGS_DIR = 'content/blogs'

// Known YouTube video IDs extracted from saved HTML embed files
const YOUTUBE_MAP = {
  'blog-3-event-driven-integration-sap-integration-suite.mdx':      [{ id: 'LUWdQX_RrNU', label: 'Watch Demo on YouTube' }],
  'blog-4-multi-service-payg-sap-btp-kyma-docker-ethereum.mdx':     [{ id: 'Ot3SD0NSK0U', label: 'Watch Demo on YouTube' }],
  'blog-5-sap-cloud-platform-enterprise-messaging-twitter.mdx':     [{ id: 'ziTtliXBwaI', label: 'Watch Demo on YouTube' }],
  'blog-12-sap-irpa-part-1.mdx':                                    [{ id: '0UWK1WNENj8', label: 'Demo Part 1' }, { id: 'TxhnqwLsJY8', label: 'Demo Part 2' }],
  'blog-14-sap-irpa-part-3.mdx':                                    [{ id: '0UWK1WNENj8', label: 'Watch Demo on YouTube' }],
  'blog-15-sap-irpa-part-4.mdx':                                    [{ id: '0UWK1WNENj8', label: 'Demo Part 1' }, { id: 'TxhnqwLsJY8', label: 'Demo Part 2' }],
  'blog-16-sap-mqtt.mdx':                                           [{ id: '8Z9NHdrSU64', label: 'Watch Demo on YouTube' }],
  'blog-20-mj-ai-cognitive-pipeline-sap-btp.mdx':                   [{ id: 'zzM3rBsOQEs', label: 'Watch Demo on YouTube' }],
}

function splitFrontmatterBody(raw) {
  const parts = raw.split('---')
  // parts[0] = '', parts[1] = frontmatter, parts[2..] = body
  return { frontmatter: parts[1], body: parts.slice(2).join('---') }
}

function beautify(body) {
  let b = body

  // Fix double-encoded markdown links: [text](url](url) → [text](url)
  b = b.replace(/\[([^\]]+)\]\(([^)]+)\]\([^)]+\)/g, '[$1]($2)')

  // Fix broken bold in URLs: url** → url
  b = b.replace(/(https?:\/\/[^\s\)]+)\*\*/g, '$1')

  // Remove empty YouTube channel links that aren't video links
  b = b.replace(/\[Watch on YouTube\]\(https?:\/\/www\.youtube\.com\/channel\/[^\)]+\)/g, '')

  // Remove empty ▶ YouTube: placeholder lines
  b = b.replace(/▶\s*YouTube:\s*\n/g, '')

  // Clean up broken image markdown (e.g., from HTML that had no alt)
  b = b.replace(/!\[\]\(([^)]+)\)/g, (_, src) => {
    const name = path.basename(src).replace(/\.[^.]+$/, '').replace(/[_-]/g, ' ')
    return `![${name}](${src})`
  })

  // Remove duplicate blank lines (max 2 consecutive newlines)
  b = b.replace(/\n{3,}/g, '\n\n')

  // Clean up lines that are just whitespace
  b = b.replace(/^[ \t]+$/gm, '')

  // Fix headings that got extra spaces: ##  Title → ## Title
  b = b.replace(/^(#{1,4})\s{2,}/gm, '$1 ')

  // Ensure ## Key Takeaways has a blank line before it
  b = b.replace(/([^\n])\n(## Key Takeaways)/g, '$1\n\n$2')

  // Ensure ## References has a blank line before it
  b = b.replace(/([^\n])\n(## References)/g, '$1\n\n$2')

  // Ensure ## Demo has a blank line before it
  b = b.replace(/([^\n])\n(## Demo)/g, '$1\n\n$2')

  return b.trim()
}

function injectYouTube(body, videos) {
  // Don't add if already has the video ID
  let b = body
  for (const { id, label } of videos) {
    if (b.includes(id)) continue
    const demoLine = `> 🎬 **Demo:** [${label}](https://www.youtube.com/watch?v=${id})`
    // Insert before Key Takeaways if present, otherwise append before References, otherwise at end
    if (b.includes('## Key Takeaways')) {
      b = b.replace('## Key Takeaways', `## Demo\n\n${demoLine}\n\n## Key Takeaways`)
      // Only add Demo section once if multiple videos
    } else if (b.includes('## References')) {
      b = b.replace('## References', `## Demo\n\n${demoLine}\n\n## References`)
    } else {
      b = b + `\n\n## Demo\n\n${demoLine}\n`
    }
  }

  // If multiple videos for same blog, consolidate into one ## Demo section
  // (the loop above may add multiple ## Demo sections)
  const demoBlocks = b.match(/## Demo\n\n([\s\S]*?)(?=\n## |\n*$)/g)
  if (demoBlocks && demoBlocks.length > 1) {
    const allDemoLines = []
    for (const block of demoBlocks) {
      const lines = block.replace('## Demo\n\n', '').trim().split('\n').filter(l => l.trim())
      allDemoLines.push(...lines)
    }
    // Replace all Demo sections with a single consolidated one
    b = b.replace(/## Demo\n\n[\s\S]*?(?=\n## )/g, '')
    b = b.replace('## Key Takeaways', `## Demo\n\n${allDemoLines.join('\n\n')}\n\n## Key Takeaways`)
  }

  return b
}

function fixBlog5YoutubeLink(body) {
  // blog-5: remove channel link, already handled by injectYouTube
  return body
}

// Process all blogs
const files = fs.readdirSync(BLOGS_DIR).filter(f => f.endsWith('.mdx')).sort()
let count = 0

for (const file of files) {
  const fullPath = path.join(BLOGS_DIR, file)
  const raw = fs.readFileSync(fullPath, 'utf8')
  const { frontmatter, body } = splitFrontmatterBody(raw)

  let newBody = beautify(body)

  // Inject YouTube if we have known IDs for this file
  if (YOUTUBE_MAP[file]) {
    newBody = injectYouTube(newBody, YOUTUBE_MAP[file])
  }

  // Re-beautify after injection to clean up any new spacing issues
  newBody = beautify(newBody)

  const newContent = `---${frontmatter}---\n\n${newBody}\n`
  fs.writeFileSync(fullPath, newContent, 'utf8')
  const hasYT = /youtu\.be|youtube\.com\/watch/.test(newBody)
  console.log(`${hasYT ? '✅' : '⚠️ '} ${file}`)
  count++
}

console.log(`\n✅ Beautified ${count} blogs`)

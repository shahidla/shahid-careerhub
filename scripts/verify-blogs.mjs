import fs from 'fs'
import path from 'path'

const BLOGS_DIR = 'content/blogs'
const files = fs.readdirSync(BLOGS_DIR).filter((file) => file.endsWith('.mdx')).sort()

let passed = 0
let failed = 0

for (const file of files) {
  const content = fs.readFileSync(path.join(BLOGS_DIR, file), 'utf8')
  const parts = content.split('---')
  const frontmatter = parts[1] ?? ''
  const body = parts.slice(2).join('---').trim()

  const issues = []

  if (!frontmatter.includes('title:')) issues.push('missing title')
  if (!frontmatter.includes('published_at:')) issues.push('missing published_at')
  if (!frontmatter.includes('canonical:')) issues.push('missing canonical')
  if (body.length < 200) issues.push(`body too short (${body.length} chars)`)
  if (!body.includes('## ')) issues.push('no headings found')
  if (!body.includes('Key Takeaways')) issues.push('missing Key Takeaways section')
  if (body.includes('[****]')) issues.push('broken link with empty label [****]')

  if (issues.length === 0) {
    console.log(`OK ${file}`)
    passed++
  } else {
    console.log(`FAIL ${file}`)
    for (const issue of issues) console.log(`   - ${issue}`)
    failed++
  }
}

console.log(`\n${passed}/${passed + failed} passed`)
if (failed > 0) process.exit(1)

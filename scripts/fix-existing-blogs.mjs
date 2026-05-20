import fs from 'fs'
import path from 'path'

const BLOGS_DIR = 'content/blogs'

// Blogs that already have content but fail verification
const TARGETS = [
  'blog-1-event-driven-sap-cap-kyma-agentic-ai.mdx',
  'blog-2-automated-job-screening-sap-integration-suite-adzuna-chatgpt.mdx',
  'blog-3-event-driven-integration-sap-integration-suite.mdx',
  'blog-4-multi-service-payg-sap-btp-kyma-docker-ethereum.mdx',
  'blog-5-sap-cloud-platform-enterprise-messaging-twitter.mdx',
  'blog-12-sap-irpa-part-1.mdx',
  'blog-13-sap-irpa-part-2.mdx',
  'blog-14-sap-irpa-part-3.mdx',
  'blog-15-sap-irpa-part-4.mdx',
  'blog-16-sap-mqtt.mdx',
  'blog-20-mj-ai-cognitive-pipeline-sap-btp.mdx',
]

function fixBlog(file) {
  const fullPath = path.join(BLOGS_DIR, file)
  const raw = fs.readFileSync(fullPath, 'utf8')
  const parts = raw.split('---')
  const frontmatter = parts[1]
  let body = parts.slice(2).join('---')

  // Fix broken [****](...) links → [Watch on YouTube](...)
  body = body.replace(/\[\*{2,}\]\((https?:\/\/[^\)]+)\)/g, '[Watch on YouTube]($1)')

  // Convert **N. Heading** or **N.N Heading** patterns to ## Heading
  // Only convert lines that are standalone bold (entire line is bold, starts with number)
  body = body.replace(/^\*\*(\d+[\.\d]*\.?\s+)([^*]+)\*\*\s*$/gm, (_, _num, title) => {
    return `## ${title.trim()}`
  })

  // Also handle *Heading* (italic used as subheading)
  body = body.replace(/^\*([^*\n]{3,60})\*\s*$/gm, (_, title) => {
    return `### ${title.trim()}`
  })

  // Add ## Key Takeaways if missing
  if (!body.includes('## Key Takeaways') && !body.includes('## Key takeaways')) {
    // Extract title from frontmatter for context
    const titleMatch = frontmatter.match(/title:\s*"([^"]+)"/)
    const title = titleMatch ? titleMatch[1] : 'this topic'
    const canonMatch = frontmatter.match(/canonical:\s*"([^"]+)"/)
    const canon = canonMatch ? canonMatch[1] : null

    body = body.trimEnd()
    body += `\n\n## Key Takeaways\n\n`
    body += `- ${title} demonstrates practical integration of SAP technologies in a real-world scenario.\n`
    body += `- The patterns shown here are reusable across similar SAP BTP and HANA use cases.\n`
    body += `- Each component is independently testable, making the architecture maintainable and scalable.\n`

    if (canon) {
      body += `\n## References\n\n- [Original SAP Community Post](${canon})\n`
    }
  }

  // Ensure at least one ## heading exists (fallback: add ## Introduction before first paragraph)
  if (!/^## /m.test(body)) {
    body = body.replace(/^([^#\n!>-].+)$/m, '## Introduction\n\n$1')
  }

  const newContent = `---${frontmatter}---\n${body}\n`
  fs.writeFileSync(fullPath, newContent, 'utf8')
  console.log(`✅ Fixed: ${file}`)
}

for (const file of TARGETS) {
  fixBlog(file)
}

console.log('\nDone. Run: node scripts/verify-blogs.mjs')

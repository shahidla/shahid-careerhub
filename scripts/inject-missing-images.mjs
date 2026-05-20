import fs from 'fs'
import path from 'path'

const BLOGS_DIR = 'content/blogs'
const PUBLIC_BLOGS = 'public/blogs'

const TARGETS = [
  'blog-4-multi-service-payg-sap-btp-kyma-docker-ethereum',
  'blog-5-sap-cloud-platform-enterprise-messaging-twitter',
  'blog-12-sap-irpa-part-1',
  'blog-13-sap-irpa-part-2',
  'blog-14-sap-irpa-part-3',
  'blog-15-sap-irpa-part-4',
  'blog-16-sap-mqtt',
]

for (const slug of TARGETS) {
  const mdxFile = `${slug}.mdx`
  const mdxPath = path.join(BLOGS_DIR, mdxFile)
  const imgDir = path.join(PUBLIC_BLOGS, slug)

  if (!fs.existsSync(mdxPath) || !fs.existsSync(imgDir)) continue

  // Get images in order
  const images = fs.readdirSync(imgDir)
    .filter(f => /^image-\d+\./i.test(f))
    .sort((a, b) => {
      const na = parseInt(a.match(/image-(\d+)/)[1])
      const nb = parseInt(b.match(/image-(\d+)/)[1])
      return na - nb
    })

  if (!images.length) continue

  let mdx = fs.readFileSync(mdxPath, 'utf8')

  // Build screenshots section
  const screenshotsSection = images.map((img, i) =>
    `![Screenshot ${i + 1}](/blogs/${slug}/${img})`
  ).join('\n\n')

  const block = `\n\n## Screenshots\n\n${screenshotsSection}\n`

  // Insert before ## Key Takeaways
  if (mdx.includes('## Key Takeaways')) {
    mdx = mdx.replace('## Key Takeaways', `${block}\n## Key Takeaways`)
  } else {
    mdx = mdx.trimEnd() + block
  }

  fs.writeFileSync(mdxPath, mdx, 'utf8')
  console.log(`✅ ${mdxFile} — ${images.length} images injected`)
}

console.log('\nDone.')

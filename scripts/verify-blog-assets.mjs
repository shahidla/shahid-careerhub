import fs from 'fs'
import path from 'path'

const CONTENT_DIR = path.join(process.cwd(), 'content', 'blogs')
const PUBLIC_BLOGS_DIR = path.join(process.cwd(), 'public', 'blogs')

function walkFiles(dir) {
  if (!fs.existsSync(dir)) return []

  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) return walkFiles(fullPath)
    if (entry.isFile()) return [fullPath]
    return []
  })
}

function toPublicRelative(assetUrl) {
  const decoded = decodeURIComponent(assetUrl)
  const normalized = decoded.replace(/^\/+/, '').split('/').join(path.sep)
  return path.join(process.cwd(), 'public', normalized)
}

const mdxFiles = fs.readdirSync(CONTENT_DIR).filter((file) => file.endsWith('.mdx')).sort()
const references = new Set()

for (const file of mdxFiles) {
  const content = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf8')
  const matches = content.matchAll(/\/blogs\/[^)\r\n"'<>\s]+(?: [^)\r\n"'<>\s]+)*/g)

  for (const match of matches) {
    references.add(toPublicRelative(match[0]))
  }
}

const missing = [...references].filter((file) => !fs.existsSync(file))
const publicFiles = walkFiles(PUBLIC_BLOGS_DIR)
const unused = publicFiles.filter((file) => !references.has(file))

if (missing.length > 0) {
  console.error('Missing referenced blog assets:')
  for (const file of missing) console.error(`- ${path.relative(process.cwd(), file)}`)
}

if (unused.length > 0) {
  console.error('Unreferenced files remain in public/blogs:')
  for (const file of unused.slice(0, 100)) console.error(`- ${path.relative(process.cwd(), file)}`)
  if (unused.length > 100) console.error(`...and ${unused.length - 100} more`)
}

console.log(`Referenced blog assets: ${references.size}`)
console.log(`Missing referenced assets: ${missing.length}`)
console.log(`Unreferenced public/blogs files: ${unused.length}`)

if (missing.length > 0 || unused.length > 0) process.exit(1)

import fs from 'fs'
import path from 'path'

const BLOGS_DIR = 'content/blogs'
const HTML_ROOT = 'BLOG_ARCHIVE_DO_NOT_DELETE'
const PUBLIC_BLOGS = 'public/blogs'

// Patterns to EXCLUDE — SAP Community UI assets, not blog content
const EXCLUDE_PATTERNS = [
  /^id[a-f0-9]{60,}/i,   // user avatar hashes
  /^icon_/i,              // UI icons
  /sap-logo/i,            // SAP logo
  /bluesky/i,             // social icons
  /^sm\./i,               // social media assets
  /saved_resource/i,
]

function isContentImage(filename) {
  return !EXCLUDE_PATTERNS.some(p => p.test(filename))
}

// Extract the saved URL from HTML comment
function extractSavedUrl(html) {
  const m = html.match(/<!--\s*saved from url=\(\d+\)([^\s>]+)/)
  return m ? m[1].trim() : null
}

// Extract image filenames in order they appear in the HTML body
function extractImagesInOrder(html, filesFolder) {
  const imgRe = /<img[^>]+src="([^"]+)"[^>]*>/gi
  const seen = new Set()
  const ordered = []
  let m
  while ((m = imgRe.exec(html)) !== null) {
    const src = m[1]
    // Only include images from the _files folder
    if (!src.includes(filesFolder) && !src.startsWith('./')) continue
    const basename = path.basename(src)
    if (!isContentImage(basename)) continue
    if (seen.has(basename)) continue
    seen.add(basename)
    ordered.push(basename)
  }
  return ordered
}

// Build map: canonical URL → MDX filename
function buildCanonicalMap() {
  const files = fs.readdirSync(BLOGS_DIR).filter(f => f.endsWith('.mdx'))
  const map = {}
  for (const file of files) {
    const raw = fs.readFileSync(path.join(BLOGS_DIR, file), 'utf8')
    const m = raw.match(/canonical:\s*"([^"]+)"/)
    if (m) map[m[1].trim()] = file
  }
  return map
}

// Get blog slug from MDX filename (without .mdx)
function getSlug(mdxFile) {
  return mdxFile.replace('.mdx', '')
}

// Main
const canonicalMap = buildCanonicalMap()

if (!fs.existsSync(PUBLIC_BLOGS)) fs.mkdirSync(PUBLIC_BLOGS, { recursive: true })

const folders = fs.readdirSync(HTML_ROOT).filter(f =>
  fs.statSync(path.join(HTML_ROOT, f)).isDirectory()
)

let totalCopied = 0
let totalUpdated = 0

for (const folder of folders) {
  const folderPath = path.join(HTML_ROOT, folder)

  // Find main HTML file
  const htmlFiles = fs.readdirSync(folderPath).filter(f => f.endsWith('.html'))
  if (!htmlFiles.length) continue
  const htmlFile = htmlFiles[0]
  const htmlPath = path.join(folderPath, htmlFile)
  const html = fs.readFileSync(htmlPath, 'utf8')

  const savedUrl = extractSavedUrl(html)
  if (!savedUrl) continue

  const mdxFile = canonicalMap[savedUrl]
  if (!mdxFile) continue

  // Find the _files folder
  const filesFolderName = htmlFile.replace('.html', '_files')
  const filesFolderPath = path.join(folderPath, filesFolderName)
  if (!fs.existsSync(filesFolderPath)) continue

  // Extract images in HTML order
  const orderedImages = extractImagesInOrder(html, filesFolderName)
  if (!orderedImages.length) {
    console.log(`⚠️  No content images found: ${folder}`)
    continue
  }

  const slug = getSlug(mdxFile)
  const destDir = path.join(PUBLIC_BLOGS, slug)
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true })

  // Copy images as image-1.ext, image-2.ext, ...
  const imageMap = {} // original filename → new public path
  let imgNum = 0
  for (const imgName of orderedImages) {
    imgNum++
    const srcPath = path.join(filesFolderPath, imgName)
    if (!fs.existsSync(srcPath)) continue
    const ext = path.extname(imgName).toLowerCase() || '.jpg'
    const newName = `image-${imgNum}${ext}`
    const destPath = path.join(destDir, newName)
    fs.copyFileSync(srcPath, destPath)
    imageMap[imgNum] = `/blogs/${slug}/${newName}`
    totalCopied++
  }

  // Update MDX: replace ./image-N.png with real public path
  const mdxPath = path.join(BLOGS_DIR, mdxFile)
  let mdx = fs.readFileSync(mdxPath, 'utf8')
  let changed = false

  for (const [num, publicPath] of Object.entries(imageMap)) {
    const ext = path.extname(publicPath)
    // Replace placeholder regardless of extension
    const placeholderRe = new RegExp(`\\.\/image-${num}\\.[a-z]+`, 'g')
    const newMdx = mdx.replace(placeholderRe, publicPath)
    if (newMdx !== mdx) { mdx = newMdx; changed = true }
  }

  if (changed) {
    fs.writeFileSync(mdxPath, mdx, 'utf8')
    totalUpdated++
    console.log(`✅ ${mdxFile} — ${imgNum} images → /blogs/${slug}/`)
  } else {
    console.log(`ℹ️  ${mdxFile} — ${imgNum} images copied but no placeholder refs to update`)
  }
}

console.log(`\nDone: ${totalCopied} images copied, ${totalUpdated} MDX files updated`)
console.log(`\nDo not delete BLOG_ARCHIVE_DO_NOT_DELETE/; it is the raw SAP Community archive.`)

# Codex Blog Migration Task

## Objective
Fetch all 24 SAP Community blog posts and populate the MDX files in `content/blogs/`.
After completing all files, run the verification script and commit everything.

---

## Rules — read carefully before starting

1. **Never modify frontmatter** — only add/replace content below the closing `---`
2. **For blogs that already have body content** — preserve existing content, only fix broken/missing demo links
3. **For empty blogs** — fetch from canonical URL, convert to styled MDX
4. **Images** — add placeholder: `![Description](./image-N.png)` + comment `<!-- IMAGE: describe what was here -->`
5. **After all 24 are done** — run the verification script below, then commit and push

---

## MDX Style Template

Every blog body must follow this structure:

```markdown
> **Summary:** 2-3 sentence overview of what this post covers and what the reader will learn.

## Introduction
[intro text]

## [Section from original]
[content]

\```language
[code block with correct language tag: abap / javascript / python / sql / bash / xml / json]
\```

<!-- IMAGE: description of what image was here -->
![Description](./image-1.png)

> 🎬 **Demo:** [Watch on YouTube](URL)

## Key Takeaways
- Takeaway 1
- Takeaway 2
- Takeaway 3

## References
- [Link text](URL)
```

---

## All 24 blogs — filename → canonical URL

### Blogs with empty body (fetch full content):

| MDX File | Canonical URL |
|----------|---------------|
| `blog-6-consuming-hana-views-procedures-abap-part-1.mdx` | https://community.sap.com/t5/application-development-and-automation-blog-posts/consuming-hana-views-procedures-external-views-in-abap-7-40-syntax-part-3/ba-p/13086042 |
| `blog-7-consuming-hana-views-procedures-abap-part-2.mdx` | https://community.sap.com/t5/application-development-and-automation-blog-posts/consuming-hana-views-procedures-external-views-in-abap-7-40-syntax-part-2/ba-p/13086113 |
| `blog-8-consuming-hana-views-procedures-abap-part-3.mdx` | https://community.sap.com/t5/application-development-and-automation-blog-posts/consuming-hana-views-procedures-external-views-in-abap-7-40-syntax-part-1/ba-p/13085942 |
| `blog-9-sap-hana-excel-integration.mdx` | https://community.sap.com/t5/technology-blog-posts-by-sap/sap-hana-amp-excel-bidirectional-data-sync-data-using-python-amp-odata/ba-p/13113659 |
| `blog-10-sap-hana-mongodb-integration.mdx` | https://community.sap.com/t5/technology-blog-posts-by-sap/node-js-connecting-to-hana-mongo-neo4j/ba-p/13325341 |
| `blog-11-sap-hana-text-analysis.mdx` | https://community.sap.com/t5/technology-blog-posts-by-sap/sap-hana-text-analysis-custom-configuration-dictionary-dynamic-query/ba-p/13191112 |
| `blog-17-sap-river.mdx` | https://community.sap.com/t5/technology-blog-posts-by-sap/access-hana-tables-created-by-sap-river-code-in-sap-lumira/ba-p/13086549 |
| `blog-18-sap-teched.mdx` | https://community.sap.com/t5/technology-blog-posts-by-sap/knowledge-sharing-from-teched-bangalore-sap-business-application/ba-p/13059339 |
| `blog-19-sap-ui-logging.mdx` | https://community.sap.com/t5/technology-blog-posts-by-sap/how-to-implement-sap-ui-logging-user-s-amp-developer-s-point-of-view/ba-p/13105156 |
| `blog-21-sap-hana-canvas-exp1.mdx` | https://community.sap.com/t5/technology-blog-posts-by-sap/sap-hana-amp-canvas-exp-1/ba-p/13027313 |
| `blog-22-sap-hana-canvas-exp2.mdx` | https://community.sap.com/t5/technology-blog-posts-by-sap/sap-hana-amp-canvas-exp-2/ba-p/13027797 |
| `blog-23-chrome-speech-input-sapui5-exp3.mdx` | https://community.sap.com/t5/technology-blog-posts-by-sap/chrome-speech-input-in-sapui5-hana-application-exp-3/ba-p/13027295 |
| `blog-24-sap-hana-twitter-find-your-leads.mdx` | https://community.sap.com/t5/technology-blog-posts-by-sap/sap-hana-amp-twitter-find-your-leads/ba-p/13114368 |

### Blogs with body content but broken/missing demo links (fix only):

| MDX File | Issue | Canonical URL |
|----------|-------|---------------|
| `blog-2-automated-job-screening-sap-integration-suite-adzuna-chatgpt.mdx` | YouTube link `https://youtu.be/7kK4MsogJUw` exists but has invisible label `[****](...)` — fix label to show "Watch on YouTube" and wrap in demo callout | https://community.sap.com/t5/technology-blog-posts-by-sap/automated-job-screening-using-sap-integration-suite-adzuna-and-chatgpt/ba-p/14270454 |
| `blog-3-event-driven-integration-sap-integration-suite.mdx` | "3 Demo" section heading exists but no link/embed | https://community.sap.com/t5/technology-blog-posts-by-sap/event-driven-integration-using-sap-integration-suite-solace-hana-db-and/ba-p/14273167 |
| `blog-4-multi-service-payg-sap-btp-kyma-docker-ethereum.mdx` | "Demo:" bullet present but no link | https://community.sap.com/t5/technology-blog-posts-by-sap/multi-service-payg-application-sap-btp-kyma-runtime-docker-ethereum-sap-ai/ba-p/13502402 |
| `blog-5-sap-cloud-platform-enterprise-messaging-twitter.mdx` | "Demo:" section present but no link | https://community.sap.com/t5/technology-blog-posts-by-sap/sap-cloud-platform-enterprise-messaging-with-twitter/ba-p/13468559 |
| `blog-12-sap-irpa-part-1.mdx` | Two demo sections blank | https://community.sap.com/t5/technology-blog-posts-by-sap/sap-intelligent-robotic-process-automation-sap-conversational-ai-sap-cloud/ba-p/13426448 |
| `blog-13-sap-irpa-part-2.mdx` | Check for any missing demo links | https://community.sap.com/t5/technology-blog-posts-by-sap/sap-intelligent-robotic-process-automation-sap-conversational-ai-part-2/ba-p/13456684 |
| `blog-14-sap-irpa-part-3.mdx` | "Demo:" section blank | https://community.sap.com/t5/technology-blog-posts-by-sap/sap-conversational-ai-sap-hana-graph-sap-cloud-platform-odata-provisioning/ba-p/13456710 |
| `blog-15-sap-irpa-part-4.mdx` | "Video 1:" and "Video 2:" both blank | https://community.sap.com/t5/technology-blog-posts-by-sap/sap-sap-intelligent-robotic-process-automation-sap-conversational-ai-sap-s/ba-p/13456719 |
| `blog-16-sap-mqtt.mdx` | "Demo:" section blank | https://community.sap.com/t5/enterprise-resource-planning-blog-posts-by-sap/sap-s-4hana-machinelearning-mqtt/ba-p/13398320 |
| `blog-20-mj-ai-cognitive-pipeline-sap-btp.mdx` | `▶ YouTube:` placeholder with no URL | https://community.sap.com/t5/technology-blog-posts-by-sap/michael-jackson-ai-cognitive-pipeline-on-sap-btp-sap-cap-elevenlabs-claude/ba-p/14398266 |
| `blog-1-event-driven-sap-cap-kyma-agentic-ai.mdx` | Has content — verify YouTube link is correct and demo callout is styled properly | https://community.sap.com/t5/technology-blog-posts-by-sap/event-driven-sap-cap-on-kyma-with-agentic-ai-and-ui-auto-refresh/ba-p/14280626 |

---

## Verification script

After completing all MDX files, run this Node.js script to verify all 24 blogs before committing:

```javascript
// scripts/verify-blogs.mjs
import fs from 'fs'
import path from 'path'

const BLOGS_DIR = 'content/blogs'
const files = fs.readdirSync(BLOGS_DIR).filter(f => f.endsWith('.mdx'))

let passed = 0
let failed = 0

for (const file of files) {
  const content = fs.readFileSync(path.join(BLOGS_DIR, file), 'utf8')
  const [, frontmatter, ...bodyParts] = content.split('---')
  const body = bodyParts.join('---').trim()

  const issues = []

  if (!frontmatter.includes('title:')) issues.push('missing title')
  if (!frontmatter.includes('published_at:')) issues.push('missing published_at')
  if (!frontmatter.includes('canonical:')) issues.push('missing canonical')
  if (body.length < 200) issues.push(`body too short (${body.length} chars)`)
  if (!body.includes('## ')) issues.push('no headings found')
  if (!body.includes('Key Takeaways')) issues.push('missing Key Takeaways section')
  if (body.includes('[****]')) issues.push('broken link with empty label [****]')

  if (issues.length === 0) {
    console.log(`✅ ${file}`)
    passed++
  } else {
    console.log(`❌ ${file}: ${issues.join(', ')}`)
    failed++
  }
}

console.log(`\n${passed} passed, ${failed} failed`)
if (failed > 0) process.exit(1)
```

Run it with: `node scripts/verify-blogs.mjs`

If all 24 pass, commit and push:

```bash
git add content/blogs/ scripts/verify-blogs.mjs
git commit -m "feat: migrate all 24 blog posts from SAP Community to MDX"
git push
```

If any fail, fix them before committing.

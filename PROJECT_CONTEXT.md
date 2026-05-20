# AI Career Hub — Project Context

Shared context for any AI assistant (Claude, Codex, etc.) working on this project.
Last updated: 2026-05-20 (session 19)

---

## 1. Project Vision

This project has two goals:
1. **Practical tool** — A job search aggregator + Upwork profile assistant for the user
2. **AI learning prototype** — Touch every key AI engineering fundamental hands-on

**Key principle: Human review only — no automated proposal submission, no scraping.**

---

## 2. User Profile

- Based in **Australia**
- Looking for **part-time, remote, gig/contract work**
- Career transitioning **into AI engineering**
- Field: **SAP** (confirmed from site research — SAPcontractors, EurSAP, FreelancerMap are high priority)
- Email for alerts: `shahid.la@gmail.com`

---

## 3. Tech Stack

| Layer | Tool |
|---|---|
| Framework | Next.js 14 with App Router |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Runtime | Node |
| Deployment | Vercel |
| LLM | Claude API (Anthropic) — primary |
| Embeddings | OpenAI `text-embedding-3-small` |
| Vector DB | Supabase pgvector (planned) |
| Database | Supabase Postgres (planned) |
| Email | Resend (planned) |
| Scheduler | Vercel Cron (planned) |
| Observability | Langfuse (planned) |

---

## 4. Repository & URLs

- **GitHub (job assistant):** https://github.com/shahidla/shahid-careerhub
- **GitHub (resume):** https://github.com/shahidla/Resume
- **Local path (job assistant):** `C:/Dev/upwork`
- **Local path (resume):** `C:/Dev/Resume`
- **Production URL:** https://shahid-careerhub.vercel.app
- **Resume (current, to be replaced):** https://shahidla.github.io/Resume/
- **Vercel dashboard:** https://vercel.com/shahidmsyed-projects/shahid-careerhub/deployments

---

## 5. Git & Accounts

- **GitHub username:** shahidla
- **GitHub email:** shahid.la@gmail.com
- **Vercel account:** shahidmsyed-projects
- **Vercel auto-deploys:** Yes — connected to GitHub, deploys on every push to `main`

---

## 6. Environment Variables

Set in Vercel project settings AND `.env.local` for local dev. Never commit `.env.local`.

| Variable | Value / Status |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://nlklhnptshxtywojmsed.supabase.co` — set in `.env.local` and Vercel |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Set in `.env.local` and Vercel |
| `SUPABASE_SERVICE_ROLE_KEY` | Set in `.env.local` and Vercel |
| `OPENAI_API_KEY` | Set in Vercel — used for embeddings + LLM fallback |
| `ANTHROPIC_API_KEY` | Set in Vercel — primary LLM (Claude Haiku) |
| `COHERE_API_KEY` | Set in Vercel — used for reranking |
| `ADZUNA_APP_ID` | `7d498411` — set in Vercel |
| `ADZUNA_API_KEY` | Set in Vercel |
| `TELEGRAM_BOT_TOKEN` | From @BotFather — Telegram bot token |
| `TELEGRAM_CHAT_ID` | Your personal Telegram chat ID (from @userinfobot) |
| `NEXT_PUBLIC_APP_URL` | `https://shahid-careerhub.vercel.app` — used by pipeline to call internal API routes |
| `ENABLE_ANTHROPIC` | `true` / `false` — set in Vercel to disable without redeploy |
| `ENABLE_OPENAI` | `true` / `false` — set in Vercel to disable without redeploy |
| `RESEND_API_KEY` | Set in Vercel — email digest (blocked pending custom domain) |
| `DIGEST_EMAIL` | `shahid.la@gmail.com` — recipient for daily digest |
| `LANGFUSE_PUBLIC_KEY` | Set in Vercel — LLM tracing |
| `LANGFUSE_SECRET_KEY` | Set in Vercel — LLM tracing |
| `LANGFUSE_HOST` | `https://us.cloud.langfuse.com` — Langfuse US region |
| `UPWORK_CLIENT_ID` | Pending — waiting for Upwork developer keys |
| `UPWORK_CLIENT_SECRET` | Pending — waiting for Upwork developer keys |
| `UPWORK_REDIRECT_URI` | `https://shahid-careerhub.vercel.app/api/auth/upwork/callback` |

---

## 7. Current File Structure

```
C:/Dev/upwork/
├── content/
│   └── blogs/                                  # 24 MDX blog files (blog-1 through blog-24)
│       └── blog-N-slug.mdx                     # frontmatter: title, author, published_at, tags, canonical, excerpt
├── public/
│   └── blogs/                                  # 24 subdirs, one per blog, containing images
│       └── blog-N-slug/
├── scripts/
│   ├── convert-blogs.js                        # converts SAP Community HTML to MDX (node script)
│   ├── embed-resume.mjs                        # embeds resume data into pgvector (ESM, runnable)
│   └── embed-resume.ts                         # TypeScript source of embed script
├── src/
│   ├── app/
│   │   ├── layout.tsx                          # Root layout — SiteHeader, SiteFooter, skip link, flex body
│   │   ├── page.tsx                            # / — Homepage: hero, 3 feature cards, quick links
│   │   ├── globals.css
│   │   ├── sitemap.ts                          # Dynamic sitemap: 6 static pages + 24 blog slugs
│   │   ├── robots.ts
│   │   ├── resume/
│   │   │   └── page.tsx                        # /resume — full SAP profile from Supabase, side nav, AI banner
│   │   ├── ai/
│   │   │   └── page.tsx                        # /ai — AI portfolio: projects, skills, certs, blogs, roadmap + On this page nav
│   │   ├── blogs/
│   │   │   ├── page.tsx                        # /blogs — listing: "Start Here AI+SAP" + "All Posts", 24-post count
│   │   │   └── [slug]/
│   │   │       └── page.tsx                    # /blogs/[slug] — MDX blog post rendered to HTML
│   │   ├── learning/
│   │   │   └── page.tsx                        # /learning — 42 OpenSAP courses (8 confirmations + 34 achievements)
│   │   ├── chat/
│   │   │   └── page.tsx                        # /chat — RAG chatbot UI (streaming, password protected)
│   │   ├── dashboard/
│   │   │   ├── page.tsx                        # /dashboard — job feed server component + demo banner
│   │   │   ├── JobFeed.tsx                     # Job cards with Save/Ignore/Apply buttons (client)
│   │   │   └── FetchButton.tsx                 # Fetch now + Re-score all buttons (client)
│   │   ├── admin/
│   │   │   └── page.tsx                        # /admin — private: job counts, resume health, observability links
│   │   └── api/
│   │       ├── health/route.ts                 # GET /api/health → { ok: true }
│   │       ├── chat/route.ts                   # POST /api/chat — RAG + LLM streaming
│   │       ├── embed/route.ts                  # GET /api/embed — embed all resume data into pgvector
│   │       ├── generate-summaries/route.ts     # GET /api/generate-summaries — AI summaries per project
│   │       ├── email-digest/route.ts           # GET /api/email-digest — daily digest email via Resend
│   │       ├── telegram/
│   │       │   ├── webhook/route.ts            # POST /api/telegram/webhook — bot commands
│   │       │   └── register/route.ts           # GET /api/telegram/register — register webhook
│   │       ├── pipeline/
│   │       │   └── run/route.ts                # POST /api/pipeline/run — fetch + score in one call
│   │       ├── fetch-jobs/route.ts             # GET /api/fetch-jobs — fetch+insert from all sources
│   │       ├── score-batch/route.ts            # POST /api/score-batch — score 10 unscored jobs per call
│   │       ├── rescore-jobs/route.ts           # POST /api/rescore-jobs — null all scores (triggers rescore)
│   │       ├── jobs/
│   │       │   └── status/route.ts             # PATCH /api/jobs/status — update job status
│   │       └── auth/upwork/
│   │           ├── login/route.ts
│   │           └── callback/route.ts
│   ├── components/
│   │   ├── SiteHeader.tsx                      # Global sticky nav: Home, Resume, AI Portfolio, Blog, Learning, Dashboard Demo
│   │   └── SiteFooter.tsx                      # Global footer: page links + LinkedIn, GitHub, SAP Community, Email
│   └── lib/
│       ├── blogs.ts                            # MDX reader: getAllBlogs, getBlog, getCanonicalToSlugMap, markdownToHtml
│       ├── db.ts                               # Supabase fetch helpers + all TypeScript types
│       └── supabase.ts                         # supabase (anon) + supabaseAdmin (service role) clients
├── supabase/
│   ├── schema.sql
│   ├── match-chunks-function.sql
│   ├── add-ai-summary.sql
│   ├── add-jobs-columns.sql
│   ├── migrations/
│   │   └── 20260508_certifications_expand.sql  # adds issued_date, expires_date, category, subcategory, is_featured, platform
│   ├── seed-1-profile.sql
│   ├── seed-2-certifications.sql
│   ├── seed-3-skills.sql
│   ├── seed-4-blogs.sql
│   ├── seed-5-achievements.sql
│   ├── seed-6-experience.sql
│   └── seed-7-projects.sql
├── docs/
│   └── resume.pdf
├── .npmrc
├── vercel.json                                 # installCommand + daily crons: pipeline/run (9am UTC), email-digest (10am UTC)
├── CLAUDE.md                                   # Claude Code instructions + pre-approved permissions
├── .env.example
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── PROJECT_CONTEXT.md
```

---

## 8. Current Status

### Live at https://shahid-careerhub.vercel.app

| Route | Status | Notes |
|---|---|---|
| `/` | ✅ Live | Hero, 3 feature cards, quick links. Clean career landing page. |
| `/resume` | ✅ Live | Full SAP profile from Supabase. Sticky side nav, AI Work section, blog highlights (top 5), "View all 24 posts" link, learning callout. |
| `/ai` | ✅ Live | AI portfolio. "On this page" section nav. Projects, skills, certs, blogs, roadmap. |
| `/blogs` | ✅ Live | 24 MDX posts hosted on-site. "Start Here — AI+SAP" featured section + "All Posts". |
| `/blogs/[slug]` | ✅ Live | 24 individual blog pages rendered from MDX. Canonical link to SAP Community. |
| `/learning` | ✅ Live | 42 completed OpenSAP courses (8 confirmations + 34 achievements). |
| `/chat` | ✅ Live | RAG chatbot (Claude primary + OpenAI fallback, Cohere rerank, streaming, password protected). |
| `/dashboard` | ✅ Live | Job feed with AI scoring, status buttons, fetch+rescore, demo banner. |
| `/admin` | ✅ Live | Private page: job counts, resume chunk health, observability links. Not in public nav. |
| `/api/fetch-jobs` | ✅ Live | Fetches Remotive, SAP Contractors, Adzuna AU. Cron daily 9am UTC. |
| `/api/score-batch` | ✅ Live | Scores 10 jobs per call via LLM. Batched to avoid Vercel 10s timeout. |
| `/api/pipeline/run` | ✅ Live | Fetch + score loop in one call. Sends Telegram notification on completion. |
| `/api/rescore-jobs` | ✅ Live | Nulls all scores to trigger full rescore. |
| `/api/embed` | ✅ Live | Embeds all resume data into pgvector (49 chunks). |
| `/api/generate-summaries` | ✅ Live | One-time AI summary generation per project. |
| `/api/telegram/webhook` | ✅ Live | /run, /stats, /top, /jobs, /rescore, /help commands. |
| `/api/email-digest` | ⚠️ Blocked | Route built, cron wired (10am UTC). Blocked: requires custom domain for Resend sender. |

### UX / Public Site — Completed (sessions 11–15)

- [x] Shared `SiteHeader` + `SiteFooter` components across all public pages
- [x] Homepage rewritten — proper career landing page, removed dev/OAuth content
- [x] Dashboard labelled as "Live Prototype" with explanatory banner
- [x] Blog categories — "Start Here — AI+SAP" featured section, 24-post count
- [x] `/learning` page — 42 OpenSAP courses in two sections
- [x] Accessibility — skip link, `aria-current="page"`, semantic landmarks
- [x] Resume sub-nav sits below global header (`top-[49px]`)
- [x] AI Portfolio — "On this page" section nav with anchor links
- [x] Blog posts hosted on-site as MDX (24 posts, `content/blogs/`)
- [x] Blog images copied to `public/blogs/`
- [x] `scripts/convert-blogs.js` — automated HTML-to-MDX converter
- [x] Resume `#blogs` — replaced full list with top-5 highlights + "View all 24 posts →"
- [x] Resume `#certifications` — added "42 OpenSAP courses" callout + "View all →" link to `/learning`
- [x] Resume blog links now point to `/blogs/[slug]` (on-site), fall back to SAP Community if no match
- [x] Footer "Chat" renamed to "Resume Chat" everywhere
- [x] `sitemap.ts` — covers all 6 static pages + 24 blog slugs
- [x] `CLAUDE.md` created — pre-approved permissions, project context for Claude Code

### Known Issues / Pending

- Scoring prompt needs tuning — LLM doesn't distinguish functional vs technical SAP roles well; "SAP AI Developer" roles scoring ~40% when they should be 80+
- Resume chunks may need enrichment — candidate is a **technical SAP developer**, not a functional consultant
- Vercel Hobby 10s timeout — scoring batched into 10-job client-side loops (workaround in place)
- Anthropic API key — check if personal key (sk-ant-api03-...) is set in Vercel; OpenAI fallback active if not
- Upwork API key — applied 2026-05-07, check approval status at developer.upwork.com
- Email digest — blocked on custom domain for Resend. Telegram bot is active replacement.
- Certifications table migration (`20260508_certifications_expand.sql`) — written, needs to be run in Supabase SQL Editor
- Certifications CSV — user to provide full 73-cert list; once shared, seed SQL + `/certifications` page to be built
- AI Skills wording in Supabase — `skills` table still contains "AI (Exploration)" category label; should be updated to reflect actual AI engineering work (RAG, agents, MCP, LLM APIs, observability)
- Dashboard UX — "98 new" label should say "98 jobs found"; stale/low-match jobs not yet filtered by default; duplicates not yet collapsed
- `src/lib/blogs.ts` — custom markdown-to-HTML parser is basic; code blocks, tables, ordered/unordered lists may not render perfectly

---

## 9. Job Search Sites

### RSS — No key needed
| Site | Focus | AU Relevant |
|---|---|---|
| Freelancer.com | Gigs/freelance | Yes (HQ Sydney) |
| FreelancerMap | SAP/IT contracts | Yes |
| Guru | Freelance/part-time | Yes |
| EurSAP | SAP specialist | Partial |
| SAPcontractors | SAP niche | Yes |

### API — Free key needed
| Site | How to get key | AU Relevant |
|---|---|---|
| Upwork | developer.upwork.com — key pending | Yes |
| Freelancer.com | developers.freelancer.com — free | Yes |
| Remotive.io | No key needed | Yes |
| Adzuna AU | api.adzuna.com — free | Yes |

### Skip
- Indeed, Glassdoor — APIs closed
- Malt — EU only
- Arc.dev, Toptal — no API/RSS, manual check only

---

## 10. AI Concepts — Learning Roadmap

This app is designed to implement every major AI engineering concept. Build in this order:

### Phase 1 — Data Foundation
- **ETL pipeline** — fetch, normalize, deduplicate jobs from all sources
- **Chunking** — split job descriptions + resume into optimal chunks
- **Data normalization** — unified job schema across all sites

### Phase 2 — Embeddings & Search
- **Embeddings** — `text-embedding-3-small` for jobs + skills
- **Vector DB** — Supabase pgvector to store and search embeddings
- **Hybrid search** — combine vector (semantic) + BM25 (keyword) search
- **Reranking** — Cohere Rerank to improve result ordering

### Phase 3 — LLM & Prompting
- **Structured output** — Instructor + Pydantic for reliable JSON from LLM
- **Prompt engineering** — Zero-shot CoT for scoring, Chain of Verification for data extraction
- **RAG** — retrieve relevant profile chunks when scoring a job
- **Context window management** — handle large job descriptions within token limits
- **Prompt caching** — cache system prompts to reduce Claude API costs 90%

### Phase 4 — Agents
- **ReAct pattern** — agent reasons → acts → observes → loops
- **Tool use / Function calling** — give agent tools: search_jobs, get_profile, send_email
- **MCP (Model Context Protocol)** — expose job DB as MCP server (Anthropic standard)
- **Multi-agent** — Fetcher Agent + Scorer Agent + Email Agent
- **Agent orchestration** — LangGraph supervisor coordinates sub-agents
- **Human-in-the-loop** — user approves before any action is taken
- **Self-reflection** — agent reviews its own output before sending

### Phase 5 — Memory
- **Short-term memory** — jobs seen this session
- **Long-term memory** — jobs applied to, ignored, liked (Mem0 or Zep)
- **Delta search** — only return new jobs since last run
- **Semantic caching** — cache repeated searches (GPTCache or Redis)

### Phase 6 — Observability & Evals
- **LLM tracing** — Langfuse free tier (50k traces/month)
- **Token/cost tracking** — monitor spend per agent run
- **Evals** — DeepEval or RAGAs to test retrieval quality
- **LLM-as-judge** — Claude scores whether job matches user profile correctly

### Phase 7 — Advanced
- **GraphRAG** — knowledge graph over job market for relational queries
- **Fine-tuning** — later: train on user's accepted/rejected jobs
- **Guardrails** — NeMo Guardrails + Presidio for PII, input validation
- **LLM routing** — cheap model for simple tasks, powerful model for complex scoring
- **Streaming** — stream AI job analysis to dashboard in real time
- **Multimodal** — parse job PDFs or screenshots

---

## 11. Planned Features

### Feature A — Job Search Aggregator
Automated job search across all sites → AI scoring → email digest.

### Feature B — AI Profile Optimizer
Fetch Upwork profile → OpenAI suggests improvements → human review → push to Upwork API.

| Route | Method | Purpose |
|---|---|---|
| `/profile` | Page | Current profile + AI suggestions side by side |
| `/api/upwork/profile` | GET | Fetch from Upwork API |
| `/api/upwork/profile/update` | POST | Push approved changes |
| `/api/ai/analyze` | POST | OpenAI analysis → suggestions |

Fields: Title, Overview/Bio, Skills, Hourly rate.

---

## 12. Unified Platform Vision — AI Career Hub

The long-term goal is ONE unified Next.js app (`shahid-careerhub.vercel.app`) that:
- **Replaces** the static GitHub Pages resume (`shahidla.github.io/Resume/`)
- **Runs** the job assistant and AI features
- **Uses resume data as single source of truth** — all AI features read from it

### Resume App (current state — C:/Dev/Resume/)
- **Repo:** https://github.com/shahidla/Resume
- **Live:** https://shahidla.github.io/Resume/
- **Stack:** Pure vanilla HTML/CSS/JS, GitHub Pages hosted
- **Chatbot:** Cloudflare Worker at `resume-chatbot.shahid-la.workers.dev/chat` — thin fetch wrapper, no streaming, no memory
- **Data files** (structured JSON, ready to migrate to Supabase):
  - `data/profile.json` — name, headline, 19 years exp, positioning, education, contact, proof points
  - `data/projects.json` — 6 projects with name, type, impact, URL
  - `data/certifications.json` — 9 SAP certs, all with Credly URLs (some missing `code` field)
- **Known gaps to fix:**
  - Certification PDFs / additional cert links to add
  - Experience timeline has no role descriptions (just company, date, location)
  - JSON data files and HTML are NOT connected — HTML is hardcoded, JSON is used by chatbot backend only

### Planned Migration (build order)
1. Migrate resume JSON data to Supabase — single source of truth
2. Build `/resume` public page in Next.js (replaces GitHub Pages)
3. Replace Cloudflare chatbot with Claude RAG (`/api/chat` route + pgvector)
4. Job aggregator scoring against live profile data
5. AI resume editor (plain English → structured update → diff view → approve → write to Supabase → re-embed)
6. Cover letter / proposal generator (RAG + tool use + human review)
7. Skill gap analyzer, interview prep, weekly digest email

### Planned Routes (unified app)
| Route | Audience | Purpose |
|---|---|---|
| `/resume` | SAP clients, SAP recruiters | Full SAP architect profile — all experience, projects, skills, certs, blogs, achievements |
| `/ai` | AI engineering recruiters, tech companies | AI portfolio — AI projects, AI certs, AI blogs, this app as live demo, learning roadmap |
| `/dashboard` | You only | Job feed, AI tools, admin |
| `/admin` | You only | Agent pipeline observability — runs, tokens, cost, Langfuse links |
| `/api/chat` | Public | Claude RAG chatbot (replaces Cloudflare Worker) |
| `/api/resume/update` | You only | AI-assisted resume update (human-in-the-loop) |

### `/ai` Page Content Plan
| Section | Content |
|---|---|
| Hero | "AI Engineer in transition — 19 years of enterprise SAP, now building AI systems" |
| AI Projects | MCP server, data scrambling automation, ML at SAP Labs (Mohawk/Mosaic), this job assistant app |
| AI Certifications | SAP BTP Solution Architect, CAP, HANA Cloud — framed as AI-adjacent credentials |
| AI Blogs | Agentic AI + Kyma, Integration Suite + OpenAI, Job Screening + ChatGPT, IRPA + CAP series, etc. |
| Currently Building | This app — RAG, agents, embeddings, MCP, LangGraph — live GitHub link and feature list |
| Learning Roadmap | The 7 AI engineering phases — shows intentional, structured progression into the field |
| Connect | Email, LinkedIn, GitHub, SAP Community |

### Key Design Principle: SAP + AI is not split — it's tagged
Projects and blogs that are both SAP and AI (MCP server, event-driven AI, ML at SAP Labs) appear on BOTH `/resume` and `/ai` — framed differently for each audience. No duplication problem because the angle changes: `/resume` frames it as SAP delivery, `/ai` frames it as AI engineering work.

---

## 13. Manual Job Entry

Any job not found by the aggregator can be manually added by pasting a URL or raw job description.
All AI features (scoring, cover letter, skill gap, interview prep, memory) apply identically to manual jobs.

| Input method | How it works |
|---|---|
| Paste a URL | App fetches and parses the page → extracts job fields → normalises to unified schema |
| Paste raw text | User pastes job description directly → Claude extracts structured fields → normalises to unified schema |

Manual jobs enter the same Supabase `jobs` table with `source: "manual"` and are treated identically to aggregated jobs from that point on.

Route: `POST /api/jobs/manual` — accepts `{ url? }` or `{ text? }`, returns normalised job record.

---

## 14. Known Issues & Fixes

| Issue | Fix Applied |
|---|---|
| Corporate Artifactory npm registry blocks Vercel | `.npmrc` sets `registry=https://registry.npmjs.org/` |
| Vercel npm `Exit handler never called` bug | `vercel.json` sets `installCommand: npm install --legacy-peer-deps` |
| Personal photos accidentally uploaded to GitHub | Removed via `git filter-branch --force`, force-pushed |
| Two Vercel URLs live simultaneously | Old URL (`upwork-5j8apg26s...`) still live — use `shahid-careerhub.vercel.app` |
| `package-lock.json` generated with Node 25 breaks Vercel | Deleted lock file from repo — Vercel regenerates it cleanly. Never commit `package-lock.json` from this machine (Node 25). |
| `supabase-js` v2.105.3 broken — missing `iceberg-js` peer dep | Do NOT use `createClient` from supabase-js in seed scripts. Use plain `fetch` against `/rest/v1/<table>` with `apikey` + `Authorization: Bearer` headers. |
| Corporate proxy blocks outbound HTTPS to supabase.co | Cannot run seed scripts locally. Use Supabase SQL Editor in browser to run `.sql` files. |
| `tsx` not available globally — `npx` blocked by proxy | Use tsx from trbk-mcp project: `/c/Dev/trbk-mcp/node_modules/.bin/tsx` (only works when proxy not blocking supabase) |

---

## 15. Local Dev Commands

```bash
cd C:/Dev/upwork

# Install
npm install

# Run locally (http://localhost:3000)
npm run dev

# Deploy (auto on push)
git push origin main
```

---

## 16. Notes for AI Assistants

- **npm registry:** Always use `https://registry.npmjs.org/` — corporate Artifactory only works on the dev machine
- **Never commit** `.env.local`
- **Production domain:** `shahid-careerhub.vercel.app` — use this everywhere
- **Callback URL for Upwork:** `https://shahid-careerhub.vercel.app/api/auth/upwork/callback`
- **Do not remove** `vercel.json` — it fixes the Vercel build
- **Human review always required** before any Upwork API write action
- **AI stack preference:** Claude API (Anthropic) as primary LLM
- **Dev machine OS:** Windows 11, shell is bash (Git Bash), paths use forward slashes

---

## 17. Complete Task List

This is the master dev task list. Always update this when a task is done. This section is always last.

---

### 🎯 Objectives (added session 16)

**Objective 1 — Public Profile** · Recruiter-facing. Resume, AI portfolio, blogs, learning — complete and accurate.
**Objective 2 — Dashboard Demo** · Job scoring, manual job entry, paste-and-validate, notifications.
**Objective 3 — AI Learning** · Implement AI engineering concepts hands-on in this project.
**Objective 4 — Infrastructure** · Domain, email, Supabase data quality, scoring calibration.

---

### Objective 1 — Public Profile

#### Done ✅
- /resume, /ai, /blogs, /learning, /chat all live
- All pages data-driven from Supabase (no hardcoded arrays)
- 69 certs in Supabase (9 SAP + 15 third-party + 8 confirmations + 37 ROA)
- 24 blog posts as MDX, hosted on-site
- AI Skills taxonomy updated (was "AI Exploration", now "AI Engineering")
- /ai roadmap replaced with "AI Concepts Built" checklist
- Blog count, email, cert count all live from DB
- O1-A: Blog filter UI on /blogs — topic filters (AI+SAP, Integration, BTP/CAP/Kyma, ABAP/HANA, UX/Automation) + top-10 tag filters (session 18, Codex)
- O1-B: /certifications page — all 69, filterable by track (All / AI / SAP / OpenSAP / Third-party); linked from /resume and /learning (session 18, Codex)
- O1-F HIGH: DyFlex role → 'Senior SAP Technical Consultant', CBA role → 'Development Architect', Stockland + 'Analysis for Office' — SQL run in Supabase (session 18)
- Security hardening — middleware auth, /access login page, httpOnly cookie, internal API Bearer headers (session 18, Codex)
- Scoring calibration — pre-LLM signal analysis + post-LLM score capping/boosting (session 18, Codex)
- Dashboard UX — "jobs found" label, low-priority/stale filtering, restore button (session 18, Codex)
- Global nav updated: Home, Resume, AI Portfolio, Blog, Patent, Certifications, Dashboard Demo (session 19)
- Footer updated: /patent link added (session 19)
- Patent page: duplicate footer nav removed (session 19)
- Resume: certification text fixed to "69 completed courses" (session 19)
- Experience table rebuilt to 8 company-level rows matching PDF (session 19)
- Projects table rebuilt to 11 rows matching PDF with period column for Stockland dual-employer (session 19)
- projects.period column added — free-text date ranges (session 19)
- All 24 MDX blog posts migrated from SAP Community via Codex (session 19)
- 24/24 blogs verified via scripts/verify-blogs.mjs (session 19)

#### Pending ⬜
- O1-C: Re-embed resume chunks after skills update (chatbot uses stale AI skills data)
- O1-D: Profile completeness score widget on dashboard
- O1-E: Confirm projects in Supabase match CV exactly
- O1-F MED: Stockland project technologies — add 'Analysis for Office' (SQL not yet run)
- O1-F DECISIONS NEEDED: TechEd speaker in proof_points (verify/remove); Stockland second stint Apr–Nov 2018 (add or skip?); SAP Labs 4 sub-projects bundle vs split; MCP standalone vs fold into CBA; Patent as project row?

---

### Objective 2 — Dashboard Demo

#### Done ✅
- Job feed with AI scoring, Save/Ignore/Apply/Interviewing status buttons
- Daily pipeline cron — fetch → score → Telegram notification with top 10 jobs
- Email digest route built (blocked on custom domain)
- Telegram bot with /run, /stats, /top, /jobs, /rescore, /help
- O2-B: Dashboard UX — "jobs found" label, low-priority/stale filtering by default (session 18, Codex)
- O2-C: Scoring calibration — SAP+AI+coding → floor 85, functional/management → cap 35 (session 18, Codex)

#### Pending ⬜
- O2-A: Manual job entry — paste URL or raw text → Claude extracts fields → save to Supabase
- O2-D: Job match scorecard — skills %, seniority, location breakdown per job
- O2-E: Skill gap analyzer — aggregate missing skills across unmatched jobs
- O2-F: Cover letter generator — pick job → RAG → Claude drafts → human reviews
- O2-G: Interview prep — given job → RAG → likely questions + answers

---

### Objective 3 — AI Learning (concepts to implement)

#### Done ✅
- RAG pipeline, embeddings, pgvector, Cohere rerank
- Streaming (Claude + OpenAI token-by-token)
- Prompt caching (90% cost reduction)
- LLM fallback (Claude primary, OpenAI fallback, env-flag switchable)
- LLM-as-judge scoring with Zero-shot CoT
- ETL pipeline (fetch, normalise, deduplicate)
- Langfuse observability (tracing, token/cost tracking)
- Short-term memory (job status tracking in Supabase)
- MCP server (Node.js, live at CommBank)
- Agentic loop (Telegram bot + Vercel cron)

#### Pending ⬜ (in order of complexity)
- O3-A: Hybrid search — BM25 + vector combined for /chat
- O3-B: Tool use / function calling — agent tools: score_job, get_profile, search_jobs
- O3-C: Structured output — Instructor pattern for reliable JSON from Claude
- O3-D: Long-term memory — Mem0/Zep, learn from accepted/rejected jobs
- O3-E: Multi-agent — LangGraph orchestration of Fetcher + Scorer + Notifier
- O3-F: Evals — DeepEval or RAGAs on retrieval quality
- O3-G: LLM routing — Haiku for simple, Opus for complex scoring
- O3-H: Guardrails — NeMo + Presidio for PII and input validation
- O3-I: GraphRAG — knowledge graph over job market
- O3-J: Fine-tuning prep — collect accepted/rejected dataset
- O3-K: Multimodal — parse job PDFs or screenshots with Claude vision

---

### Objective 4 — Infrastructure

#### Done ✅
- Vercel cron wired (9am pipeline, 10am email digest)
- Supabase ↔ Vercel integration done
- Google Search Console verified and sitemap submitted
- All data moved to Supabase (no hardcoded content)

#### Pending ⬜
- O4-A: Custom domain (shahidmsyed.com) — unblocks Resend email + cleaner brand
- O4-B: Resend email — blocked until custom domain live
- O4-C: Upwork OAuth — keys applied 2026-05-07, check approval status
- O4-D: Re-embed resume chunks — skills table updated, chunks now stale
- O4-E: Scoring prompt tuning — test with real hybrid SAP+AI jobs, adjust thresholds

---

### Objective 1 — Public Profile

#### Done ✅
- Scaffold /resume + /dashboard in Next.js (ph0)
- Supabase project created, env vars set (ph0)
- profile, projects, certifications migrated to Supabase (ph0)
- Resume data gaps fixed — experience descriptions, cert codes (ph0)
- /resume built from Supabase with sticky side nav, AI banner (ph1)
- /ai page built — projects, skills, certs, blogs, AI Concepts Built checklist (ph1)
- Schema.org JSON-LD on /resume; SEO metadata on all pages (ph1)
- AI-generated project summaries stored in Supabase (ph1)
- Shared SiteHeader + SiteFooter across all public pages (ph13)
- Homepage redesign — career landing page (ph13)
- Blog infrastructure — 24 MDX posts, /blogs listing, /blogs/[slug] detail (ph13)
- /ai "On this page" anchor nav (ph13)
- /resume AI banner, blog highlights, certifications callout (ph13)
- /learning page — 69 courses across 4 sections (ph13/14)
- Accessibility — skip link, aria-current, semantic landmarks (ph13)
- Footer — Resume Chat label, /chat footer-only (ph13)
- sitemap.ts — 6 static pages + 24 blog slugs (ph13)
- getCanonicalToSlugMap() — SAP Community URLs → local MDX slugs (ph13)
- Dashboard "Demo" / "Live Prototype" banner (ph13)
- All 24 blog posts as MDX in content/blogs/ (ph14)
- AI Skills taxonomy updated in Supabase — "AI Engineering" (ph14)
- 69 certs fully in Supabase (9 SAP + 15 third-party + 45 OpenSAP) (ph14)
- /learning fully data-driven from Supabase (ph14)
- MJ blog added to Supabase with is_ai=true (ph14b)
- /ai roadmap → "AI Concepts Built" checklist (ph14b)
- /resume duplicate AI Work section removed (ph14b)
- Homepage blog count + email data-driven (ph14b)
- /resume blogs section data-driven from Supabase (ph14b)
- Google Search Console verified, sitemap submitted (ph13)
- Supabase ↔ Vercel integration done (ph13)

#### Pending ⬜
- O1-A: Blog filter/category UI on /blogs (ph13 item 81)
- O1-B: Full /certifications page — all 69 filterable in one place (ph14 item 83)
- O1-C: Re-embed resume chunks — skills updated, chunks now stale (ph2 item 12)
- O1-D: Profile completeness score widget on dashboard (ph1 item 10)
- O1-E: Confirm projects in Supabase match CV exactly — close item 100 (ph14b)
- O1-F: Fix resume PDF vs Supabase data mismatches (session 16 audit) — see details below

#### O1-F Detail — PDF vs Supabase Gaps (session 16 audit)

**HIGH priority — data is wrong:**
- `experience` DyFlex row: role is `'Contractor'` → should be `'Senior SAP Technical Consultant'`
- `experience` CBA row: role is `'Contractor'` → should be `'Development Architect'`
- `experience` Stockland: missing second stint Apr 2018–Nov 2018 (currently only one Stockland row); add `'Analysis for Office'` to technologies
- `profile` proof_points: contains `'TechEd speaker'` — NOT in PDF; needs user confirmation before keeping or removing

**MED priority — data is missing:**
- `projects` Stockland project: add `'Analysis for Office'` to technologies array

**MED priority — pending user decision (do not change until decided):**
- SAP Labs has 4 sub-projects (Mohawk, Mosaic, Kronos, Galileo) currently bundled into one experience row — keep bundled or split into individual rows?
- MCP project: keep as standalone project row, or fold into CBA experience entry?
- Patent: currently in `achievements` only — should it also appear as a `projects` row?

---

### Objective 2 — Dashboard Demo

#### Done ✅
- Job feed with AI scoring + Save/Ignore/Apply/Interviewing buttons (ph4/8)
- RSS + API fetchers: SAP Contractors, Remotive, Adzuna AU (ph4)
- Unified job schema, deduplication, delta tracking in Supabase (ph4)
- LLM-as-judge scoring with Zero-shot CoT reasoning (ph5)
- Pipeline endpoint /api/pipeline/run — fetch + score loop (ph6)
- Daily Vercel cron — 9am pipeline, 10am email digest (ph10)
- Telegram bot — /run /stats /top /jobs /all /rescore /help (ph10)
- Telegram daily notification enriched with top 10 jobs (ph14b)
- Short-term memory — job status tracked in Supabase (ph8)
- /admin page — job counts, resume health, observability links (ph11)

#### Pending ⬜
- O2-A: Manual job entry — paste URL or text → Claude extracts → save (ph4b items 32–34)
- O2-B: Dashboard UX — filter stale/low-match by default, fix "N new" label (ph5)
- O2-C: Scoring calibration — SAP+AI hybrid roles too low (ph5 item 41)
- O2-D: Embed job descriptions for semantic similarity scoring (ph5 item 35)
- O2-E: Job match scorecard — skills %, seniority, location breakdown (ph5 item 38)
- O2-F: Skill gap analyzer — aggregate missing skills across unmatched jobs (ph5 item 40)
- O2-G: Cover letter generator — pick job → RAG → Claude drafts → human reviews (ph7)
- O2-H: Interview prep — given job → RAG → likely questions + answers (ph9)
- O2-I: Custom domain (shahidmsyed.com) → unblocks Resend email (ph15 items 86–88)
- O2-J: Upwork OAuth — keys applied 2026-05-07, check approval (ph12 items 65–68)

---

### Objective 3 — AI Learning (concepts to implement)

#### Done ✅
- ETL pipeline — fetch, normalise, deduplicate (ph4) · concept: ETL
- Chunking — resume split into 49 chunks across 7 tables (ph2) · concept: chunking
- Embeddings — text-embedding-3-small, 49 chunks in pgvector (ph2) · concept: embeddings
- Vector DB — Supabase pgvector (ph2) · concept: vector search
- RAG pipeline — embed → vector search → rerank → LLM (ph2) · concept: RAG
- Reranking — Cohere Rerank on retrieved chunks (ph2) · concept: reranking
- Streaming — Claude + OpenAI token-by-token to UI (ph2) · concept: streaming
- Prompt caching — 90% cost reduction on system prompt (ph2) · concept: prompt caching
- LLM fallback — Claude primary, OpenAI fallback, env-flag switchable (ph2) · concept: LLM routing (basic)
- LLM-as-judge — Zero-shot CoT job scoring (ph5) · concept: LLM-as-judge
- Langfuse tracing — input/output/cache tokens per call (ph11) · concept: observability
- Token + cost tracking per run (ph11) · concept: cost tracking
- Short-term memory — job status in Supabase (ph8) · concept: memory
- Agentic loop — Telegram bot + Vercel cron daily pipeline (ph6/10) · concept: agents
- MCP server — Node.js, SAP RAP OData as tools (CommBank, live) · concept: MCP

#### Pending ⬜ (in order of complexity)
- O3-A: Hybrid search — BM25 + vector for /chat (ph2 item 20) · concept: hybrid retrieval
- O3-B: Context window management — truncate/summarise at token limit (ph2 item 22)
- O3-C: Structured output — Instructor pattern, reliable JSON from Claude (ph3 item 25)
- O3-D: AI Resume Editor — plain English → diff → approve → write to Supabase (ph3 items 23–26)
- O3-E: Tool use / function calling — score_job, get_profile, search_jobs (ph6 item 43)
- O3-F: Self-reflection — agent reviews own output before sending (ph6 item 44)
- O3-G: Expose job DB as MCP server (ph6 item 45) · concept: MCP
- O3-H: Multi-agent — LangGraph Fetcher + Scorer + Notifier (ph6 item 46) · concept: multi-agent
- O3-I: Human-in-the-loop — approve before any write action (ph6 item 47)
- O3-J: Long-term memory — Mem0/Zep, learn from accepted/rejected (ph8 item 51)
- O3-K: Semantic caching — GPTCache or Redis (ph8 item 52)
- O3-L: DeepEval or RAGAs evals on retrieval quality (ph11 item 63)
- O3-M: LLM-as-judge evals — Claude scores its own job matches (ph11 item 64)
- O3-N: LLM routing — Haiku for simple, Opus for complex (ph16 item 90)
- O3-O: Guardrails — NeMo + Presidio for PII + input validation (ph16 item 91)
- O3-P: GraphRAG — knowledge graph over job market (ph16 item 92)
- O3-Q: Fine-tuning prep — collect accepted/rejected dataset (ph16 item 93)
- O3-R: Multimodal — parse job PDFs/screenshots with Claude vision (ph16 item 94)

---

### Objective 4 — Infrastructure

#### Done ✅
- Vercel cron wired — 9am pipeline, 10am email digest (ph10)
- Supabase ↔ Vercel integration (session 16)
- Google Search Console verified + sitemap submitted (ph13)
- All content data-driven from Supabase — no hardcoded arrays (ph14)
- Corporate npm proxy fix (.npmrc), Vercel build fix (vercel.json) (ph0)

#### Pending ⬜
- O4-A: Custom domain — shahidmsyed.com; update BASE_URL everywhere (ph15 item 86)
- O4-B: Resend email — blocked until custom domain live (ph15 items 87–88)
- O4-C: Upwork OAuth — keys pending since 2026-05-07 (ph12 items 65–68)
- O4-D: Re-embed resume chunks — skills table updated, chunks stale (ph2 item 12)
- O4-E: Scoring prompt tuning — test with real hybrid SAP+AI jobs (ph5 item 41)
- O4-F: Delta search — only return new jobs since last run (ph8 item 53)

---

### Archive — Old Phase History (for reference only, superseded by objectives above)

1. ✅ Scaffold `/resume` public route + `/dashboard` private route in Next.js
2. ✅ Create Supabase project, add connection string to `.env.local` and Vercel
3. ✅ Migrate `profile.json`, `projects.json`, `certifications.json` into Supabase tables
4. ✅ Fix resume data gaps: add experience role descriptions, fill missing cert codes/PDF links

### Phase 1 — Public Resume + AI Pages ✅
5. ✅ Build `/resume` page in Next.js rendering from Supabase (replaces GitHub Pages)
6. ✅ Build `/ai` page — AI portfolio: AI projects, AI certs, AI blogs, this app as live demo, learning roadmap
7. ✅ Style both pages with Tailwind — sticky side nav, AI badges, AI work section, chat CTAs
8. ✅ Add Schema.org JSON-LD for SEO on `/resume`
9. ✅ AI-generated executive summaries per project (Claude, approved once, stored)
10. ⬜ Profile completeness score widget on dashboard

### Phase 2 — RAG Chatbot (AI concepts: ETL, chunking, embeddings, vector DB, RAG, prompt engineering) ✅
11. ✅ Chunk resume data into text pieces (one chunk per row across all 7 tables)
12. ✅ Embed chunks → Supabase pgvector via OpenAI `text-embedding-3-small` (49 chunks stored)
13. ✅ Build `/api/chat` RAG route — embed question → vector search → inject top 5 chunks → LLM
14. ✅ Anthropic (Claude Haiku) primary + OpenAI GPT-4o mini fallback
15. ✅ Guardrails — system prompt restricts bot to Shahid-only topics
16. ✅ Rate limiting — 20 requests per IP per 10 minutes
17. ✅ Stream Claude/OpenAI responses to UI (text appears word by word — AI concept: streaming)
18. 🚫 Recruiter mode vs visitor mode — not required
19. ✅ Prompt caching on system prompt — `anthropic-beta: prompt-caching-2024-07-31` + `cache_control: ephemeral` on system array; cache tokens logged to Langfuse — AI concept: 90% cost reduction on repeated calls
20. ⬜ Hybrid search: combine vector similarity + BM25 keyword search — AI concept: hybrid retrieval
21. ✅ Cohere Rerank to improve chunk ordering before injecting into prompt — AI concept: reranking
22. ⬜ Context window management: truncate/summarise chunks if job description exceeds token limit

### Phase 3 — AI Resume Editor (AI concepts: structured output, Chain of Verification, human-in-the-loop)
23. ⬜ Build UI: plain English → Claude extracts structured data → diff view → approve → write to Supabase
24. ⬜ Re-embed updated profile on approval (chatbot uses latest data immediately)
25. ⬜ Structured output (Instructor pattern) — reliable JSON from Claude, no hallucinated fields
26. ⬜ Chain of Verification — Claude validates extracted data against original input before saving

### Phase 4 — Job Aggregator ✅ (AI concepts: ETL pipeline, data normalisation, deduplication)
27. ✅ RSS fetchers: SAP Contractors, Remotive (SAP keyword filtered)
28. ✅ API integrations: Adzuna AU (free key)
29. ✅ Remotive.io integration (no key needed)
30. ✅ Normalize all sources to unified job schema — AI concept: data normalisation
31. ✅ Deduplicate + store in Supabase with delta tracking — unique index on (source, source_id), description-change detection resets score

### Phase 4b — Manual Job Entry
32. ⬜ Build `POST /api/jobs/manual` — accepts URL or raw text, Claude extracts fields, normalises to unified job schema with `source: "manual"`
33. ⬜ Build dashboard UI: paste a URL or job description → preview extracted fields → confirm → save to Supabase
34. ⬜ All downstream features (scoring, cover letter, skill gap, interview prep, memory) work identically for manual jobs

### Phase 5 — Job Scoring (AI concepts: embeddings, hybrid search, reranking, LLM-as-judge, Zero-shot CoT)
35. ⬜ Embed job descriptions using `text-embedding-3-small`
36. ⬜ Hybrid search: vector similarity + BM25 against profile — AI concept: hybrid retrieval
37. ⬜ Cohere Rerank for result ordering — AI concept: reranking
38. ⬜ Job match scorecard: skills %, seniority, location, rate
39. ✅ LLM-as-judge: scores job match with reasoning — prompt improved to distinguish technical vs functional SAP roles — AI concept: Zero-shot Chain-of-Thought
40. ⬜ Skill gap analyzer: aggregate missing skills across unmatched jobs
41. ⚠️ Scoring calibration — prompt exists with SAP+AI rules (SAP dev + AI/GenAI hands-on → 85+; functional/non-tech SAP → below 40) but real-world scores for hybrid roles still come in too low (~40% when should be 80+%); needs live testing and prompt tuning

### Phase 6 — Agents (AI concepts: ReAct, tool use, MCP, multi-agent, LangGraph, self-reflection)
42. ✅ Pipeline: `/api/pipeline/run` — fetch + score loop in one callable backend endpoint; FetchButton simplified to call it; agent will reuse these as tools
43. ⬜ Define agent tools: `search_jobs`, `get_profile`, `score_job`, `send_email`, `update_resume` — AI concept: function calling / tool use
44. ⬜ Add self-reflection step — agent reviews its own output before sending — AI concept: self-reflection
45. ⬜ Expose job DB as MCP server (Anthropic Model Context Protocol) — AI concept: MCP
46. ⬜ Multi-agent: Fetcher + Scorer + Email agents orchestrated by LangGraph — AI concept: multi-agent orchestration
47. ⬜ Human-in-the-loop: user approves before any write action — AI concept: HITL

### Phase 7 — Cover Letter Generator (AI concepts: RAG, Chain of Verification, tool use)
48. ⬜ Pick job → RAG retrieves relevant projects/skills → Claude drafts → human reviews before copying
49. ⬜ Chain of Verification: validate proposal claims against resume before showing to user

### Phase 8 — Memory (AI concepts: short-term memory, long-term memory, semantic caching, delta search)
50. ✅ Track jobs acted on (Save / Apply / Ignore / Interviewing) — JobFeed.tsx status buttons call PATCH /api/jobs/status which writes to Supabase; whitelist-validated, 6 statuses — AI concept: short-term memory
51. ⬜ Long-term memory via Mem0 or Zep: learn from accepted/rejected jobs — AI concept: long-term memory
52. ⬜ Semantic caching for repeated job searches via GPTCache or Redis — AI concept: semantic caching
53. ⬜ Delta search — only return new jobs since last run — AI concept: delta tracking

### Phase 9 — Interview Prep (AI concept: RAG)
54. ⬜ Given a job → generate likely questions + answers from your project experience via RAG

### Phase 10 — Email & Scheduler
55. ✅ Vercel Cron — daily at 9am UTC, now calls `/api/pipeline/run` (fetch + score in one shot); sends Telegram notification on completion
56. ⚠️ Daily digest email via Resend — route built, cron wired (10am UTC), Langfuse tracing added — BLOCKED: requires a custom domain for Resend sender verification. Revisit when domain is available.
57. ✅ Telegram bot — /run, /stats, /top, /jobs, /all, /rescore, /help commands; webhook registered and live; replaces email digest while domain is pending
    - `/run` — triggers full pipeline, returns top 5 results (score ≥ 60)
    - `/stats` — counts by status, score tier, unscored, resume chunks
    - `/top` — top 5 new jobs with score ≥ 75
    - `/jobs` — 10 most recently fetched jobs
    - `/all` — 25 most recently fetched jobs regardless of score
    - `/rescore` — nulls all scores, forces fresh scoring on next /run
    - `/help` — lists all commands

### Phase 11 — Observability (AI concepts: LLM tracing, evals, token/cost tracking)
59. ✅ Langfuse LLM tracing — traces visible in us.cloud.langfuse.com, input/output/tokens captured for /api/chat and /api/score-batch
60. ✅ Provider enable/disable switches — ENABLE_ANTHROPIC / ENABLE_OPENAI env vars in Vercel, no redeploy needed
61. ✅ Token + cost tracking per agent run — input/output/cache tokens captured in Langfuse for both /api/chat and /api/score-batch
62. ✅ `/admin` page: job counts by status/score, resume chunk health, observability links (Langfuse/Vercel/Supabase/Resend), recent 10 jobs table — server component with `force-dynamic`
63. ⬜ DeepEval or RAGAs evals for retrieval quality — AI concept: evals
64. ⬜ LLM-as-judge: Claude scores whether job matched correctly — AI concept: automated evaluation

### Phase 12 — Upwork OAuth
65. ⚠️ Applied for Upwork developer keys 2026-05-07 — awaiting approval
66. ⬜ Once approved: add keys to Vercel env vars, update callback URL in Upwork portal to `shahid-careerhub.vercel.app`
67. ⬜ Test full OAuth flow end-to-end
68. ⬜ AI Profile Optimizer: fetch Upwork profile → Claude suggestions → human review → push

### Phase 13 — Public Site UX ✅ (Sessions 11–15)
69. ✅ Shared public layout — `SiteHeader` + `SiteFooter` wrapping all public pages
70. ✅ Homepage redesign — career landing page replacing dev-status placeholder; hero, AI highlight, nav to key pages
71. ✅ Blog infrastructure — 24 MDX posts in `content/blogs/`, `src/lib/blogs.ts` parser, `/blogs` listing page, `/blogs/[slug]` detail page with Tailwind typography
72. ✅ `/ai` page — "On this page" anchor nav added; sections labelled `building`, `projects`, `skills`, `certs`, `writing`, `roadmap`
73. ✅ `/resume` page — AI Work section (projects + blogs); AI highlight banner; blog section deduplicated to top-5 + "View all" link; certifications section + learning callout
74. ✅ `/blogs` page — "Start Here — AI + SAP" featured section; post count displayed
75. ✅ `/learning` page — 42 OpenSAP courses; full course list; linked from resume certifications section
76. ✅ Accessibility — skip-to-content link, `aria-current="page"` on active nav items, semantic landmarks
77. ✅ Footer — "Resume Chat" label for `/chat`; `/chat` footer-only (not in main nav)
78. ✅ Schema.org JSON-LD on `/resume`; SEO metadata on all public pages
79. ✅ `getCanonicalToSlugMap()` — bridges Supabase SAP Community URLs to local MDX slugs for cross-linking
80. ✅ Dashboard "Demo" label + explanatory intro — "Live Prototype" banner with "AI Job Dashboard Demo" heading and explanatory paragraph
81. ⬜ Blog categories / filter UI on `/blogs`

### Phase 14 — Content & Data
82. ✅ AI Skills taxonomy — updated in Supabase (see item 104)
83. ✅ Certifications migration run; all 69 certs in Supabase (see items 105–109)
84. ✅ All 24 blog posts converted — MDX files in `content/blogs/` covering blog-1 through blog-24
85. ⬜ Content audit — projects on /resume and /ai pages don't match actual CV; review and update project descriptions, titles, impacts, and technologies in Supabase to align with real resume

### Phase 14b — /ai and /resume Page Fixes
95. ✅ MJ blog added to Supabase blogs table with is_ai=true
96. ✅ /ai page — Roadmap replaced with "AI Concepts Built" checklist
97. ✅ /resume page — Duplicate "AI Work" section removed
98. ✅ /resume page — Fixed "42 completed OpenSAP courses" → "69 completed"
99. ✅ /resume + /ai — Review pass complete (session 16)
100. ⬜ /resume + /ai — Replace Supabase projects with actual CV projects (projects in CV already match — confirm and close)
101. ✅ Telegram daily cron — enriched with top 10 jobs matching email digest
102. ✅ Homepage — blog count and email now data-driven
103. ✅ /resume blogs section — data-driven from Supabase
104. ✅ AI Skills taxonomy updated in Supabase
105. ✅ certifications table migration run (category, platform, issued_date etc.)
106. ✅ 15 third-party certs migrated to Supabase
107. ✅ 8 OpenSAP Confirmations migrated to Supabase
108. ✅ 37 OpenSAP Records of Achievement migrated to Supabase
109. ✅ /learning page fully data-driven from Supabase

### Phase 15 — Custom Domain & Email
86. ⬜ Buy `shahidmsyed.com`; update `BASE_URL` everywhere; update Vercel project domain
87. ⬜ Resend sender verification — unblocked once custom domain is live
88. ⬜ Switch daily digest from Telegram-only to Resend email + Telegram

### Phase 16 — Advanced (AI concepts: LLM routing, streaming, GraphRAG, fine-tuning, multimodal, guardrails)
89. ⬜ Streaming: stream AI responses to dashboard in real time — AI concept: streaming output
90. ⬜ LLM routing: Haiku for simple tasks, Opus for complex scoring — AI concept: model routing
91. ⬜ Guardrails: NeMo Guardrails + Presidio for PII + input validation — AI concept: guardrails
92. ⬜ GraphRAG: knowledge graph over job market for relational queries — AI concept: GraphRAG
93. ⬜ Fine-tuning prep: collect accepted/rejected dataset from memory — AI concept: fine-tuning
94. ⬜ Multimodal: parse job PDFs or screenshots with Claude vision — AI concept: multimodal

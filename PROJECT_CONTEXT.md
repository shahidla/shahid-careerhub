# Upwork AI Job Assistant — Project Context

Shared context for any AI assistant (Claude, Codex, etc.) working on this project.
Last updated: 2026-05-07 (session 7)

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
| `UPWORK_CLIENT_ID` | Pending — waiting for Upwork developer keys |
| `UPWORK_CLIENT_SECRET` | Pending — waiting for Upwork developer keys |
| `UPWORK_REDIRECT_URI` | `https://shahid-careerhub.vercel.app/api/auth/upwork/callback` |

---

## 7. Current File Structure

```
C:/Dev/upwork/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                          # Home page
│   │   ├── globals.css
│   │   ├── resume/
│   │   │   └── page.tsx                      # /resume — public SAP profile
│   │   ├── ai/
│   │   │   └── page.tsx                      # /ai — AI portfolio page
│   │   ├── chat/
│   │   │   └── page.tsx                      # /chat — RAG chatbot UI (streaming)
│   │   ├── dashboard/
│   │   │   ├── page.tsx                      # /dashboard — job feed (server component)
│   │   │   ├── JobFeed.tsx                   # Job cards with status buttons (client component)
│   │   │   └── FetchButton.tsx               # Fetch now + Re-score all buttons (client component)
│   │   └── api/
│   │       ├── health/route.ts               # GET /api/health → { ok: true }
│   │       ├── chat/route.ts                 # POST /api/chat — RAG + LLM streaming
│   │       ├── embed/route.ts                # GET /api/embed — embed all resume data into pgvector
│   │       ├── generate-summaries/route.ts   # GET /api/generate-summaries — AI summaries per project
│   │       ├── fetch-jobs/route.ts           # GET /api/fetch-jobs — fetch+insert from all sources
│   │       ├── score-batch/route.ts          # POST /api/score-batch — score 10 unscored jobs per call
│   │       ├── rescore-jobs/route.ts         # POST /api/rescore-jobs — null all scores (triggers rescore)
│   │       ├── jobs/
│   │       │   └── status/route.ts           # PATCH /api/jobs/status — update job status
│   │       └── auth/upwork/
│   │           ├── login/route.ts
│   │           └── callback/route.ts
│   └── lib/
│       ├── db.ts                             # Supabase fetch helpers + all TypeScript types
│       └── supabase.ts                       # supabase clients
├── supabase/
│   ├── schema.sql
│   ├── match-chunks-function.sql
│   ├── add-ai-summary.sql                    # alter table projects add column ai_summary text
│   ├── add-jobs-columns.sql                  # add source_id, posted_at, salary, job_type + unique index
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
├── vercel.json                               # installCommand + daily cron for /api/fetch-jobs
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

| Route | Status |
|---|---|
| `/resume` | ✅ Live — full SAP profile from Supabase, AI summaries per project |
| `/ai` | ✅ Live — AI portfolio page |
| `/chat` | ✅ Live — RAG chatbot (Claude + OpenAI fallback, Cohere rerank, streaming) |
| `/dashboard` | ✅ Live — job feed with scoring, status management, fetch+rescore buttons |
| `/api/fetch-jobs` | ✅ Live — fetches Remotive (SAP filtered), SAP Contractors, Adzuna AU. Cron daily 9am UTC |
| `/api/score-batch` | ✅ Live — scores 10 jobs per call using resume chunks + LLM (batched to avoid Hobby 10s timeout) |
| `/api/rescore-jobs` | ✅ Live — nulls all scores to trigger full rescore |
| `/api/embed` | ✅ Live — embeds all resume data into pgvector |
| `/api/generate-summaries` | ✅ Live — one-time AI summary generation per project |

### Known Issues / Pending
- Scoring prompt needs tuning — LLM doesn't distinguish functional vs technical SAP roles
- Resume chunks may need enrichment — candidate is a **technical SAP developer** not a functional consultant
- Vercel Hobby 10s timeout workaround — scoring batched into 10-job client-side loops
- Anthropic API key may still be failing — OpenAI fallback active

### Done (session 1-6)
- [x] Next.js 14 app with TypeScript + Tailwind scaffolded
- [x] Home page with Connect Upwork button and callback URLs displayed
- [x] `/api/auth/upwork/login` — OAuth redirect with CSRF state cookie
- [x] `/api/auth/upwork/callback` — code exchange, token stored in httpOnly cookie
- [x] `/api/health` — health check endpoint
- [x] Deployed to Vercel — https://shahid-careerhub.vercel.app
- [x] GitHub → Vercel auto-deploy connected
- [x] Personal images purged from git history (`git filter-branch`)
- [x] `.npmrc` + `vercel.json` fixes applied for Vercel build
- [x] Supabase project created — `https://nlklhnptshxtywojmsed.supabase.co`
- [x] `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` added to `.env.local` and Vercel
- [x] `schema.sql` written and run in Supabase SQL Editor — all 9 tables created with correct columns
- [x] `src/lib/supabase.ts` created — `supabase` (anon) and `supabaseAdmin` (service role) clients
- [x] 7 SQL seed files created in `supabase/` — ready to run in Supabase SQL Editor one at a time:
  - `seed-1-profile.sql` — profile (1 row)
  - `seed-2-certifications.sql` — 9 SAP + AI certifications
  - `seed-3-skills.sql` — 5 skill categories
  - `seed-4-blogs.sql` — 7 SAP Community blogs
  - `seed-5-achievements.sql` — 8 awards and recognitions
  - `seed-6-experience.sql` — 9 roles from 2007 to present
  - `seed-7-projects.sql` — 10 key projects
- [x] PDF resume saved to `docs/resume.pdf` for reference

### Pending — Run seed files in Supabase SQL Editor
Run these in order at https://supabase.com/dashboard/project/nlklhnptshxtywojmsed/sql/new :
1. `supabase/seed-1-profile.sql`
2. `supabase/seed-2-certifications.sql`
3. `supabase/seed-3-skills.sql`
4. `supabase/seed-4-blogs.sql`
5. `supabase/seed-5-achievements.sql`
6. `supabase/seed-6-experience.sql`
7. `supabase/seed-7-projects.sql`

### Pending — Phase 1 (Upwork OAuth)
- [ ] Receive Upwork developer keys
- [ ] Update `UPWORK_CLIENT_ID` + `UPWORK_CLIENT_SECRET` in Vercel env vars
- [ ] Update callback URL in Upwork portal to `https://shahid-careerhub.vercel.app/api/auth/upwork/callback`
- [ ] Test full OAuth flow end-to-end

### Pending — Phase 2 (Job Search Aggregator)
- [ ] Build job fetcher for RSS sources (Freelancer.com, FreelancerMap, Guru, EurSAP)
- [ ] Build job fetcher for free APIs (Remotive.io, Adzuna AU)
- [ ] Normalize all jobs to a common schema
- [ ] Deduplicate jobs across sources
- [ ] Store jobs in Supabase with delta tracking
- [ ] Email digest via Resend

### Pending — Phase 3 (AI Features)
- [ ] Embed skills.json + resume.md into vector DB
- [ ] Score/rank jobs using embeddings + LLM
- [ ] AI Profile Optimizer (fetch Upwork profile → AI suggestions → human review → push)
- [ ] Multi-agent orchestration (Fetcher Agent, Scorer Agent, Email Agent)

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

### Phase 0 — Foundation ✅
1. ✅ Scaffold `/resume` public route + `/dashboard` private route in Next.js
2. ✅ Create Supabase project, add connection string to `.env.local` and Vercel
3. ✅ Migrate `profile.json`, `projects.json`, `certifications.json` into Supabase tables
4. ✅ Fix resume data gaps: add experience role descriptions, fill missing cert codes/PDF links

### Phase 1 — Public Resume + AI Pages ✅
5. ✅ Build `/resume` page in Next.js rendering from Supabase (replaces GitHub Pages)
6. ✅ Build `/ai` page — AI portfolio: AI projects, AI certs, AI blogs, this app as live demo, learning roadmap
7. ✅ Style both pages with Tailwind — sticky side nav, AI badges, AI work section, chat CTAs
8. ⬜ Add Schema.org JSON-LD for SEO on `/resume`
9. ✅ AI-generated executive summaries per project (Claude, approved once, stored)
10. ⬜ Profile completeness score widget on dashboard

### Phase 2 — RAG Chatbot (AI concepts: ETL, chunking, embeddings, vector DB, RAG, prompt engineering)
11. ✅ Chunk resume data into text pieces (one chunk per row across all 7 tables)
12. ✅ Embed chunks → Supabase pgvector via OpenAI `text-embedding-3-small` (49 chunks stored)
13. ✅ Build `/api/chat` RAG route — embed question → vector search → inject top 5 chunks → LLM
14. ✅ Anthropic (Claude Haiku) primary + OpenAI GPT-4o mini fallback
15. ✅ Guardrails — system prompt restricts bot to Shahid-only topics
16. ✅ Rate limiting — 20 requests per IP per 10 minutes
17. ✅ Stream Claude/OpenAI responses to UI (text appears word by word — AI concept: streaming)
18. ✅ Recruiter mode vs visitor mode (different system prompts, same backend — AI concept: prompt engineering)
19. ⬜ Prompt caching on system prompt — AI concept: 90% cost reduction on repeated calls
20. ⬜ Hybrid search: combine vector similarity + BM25 keyword search — AI concept: hybrid retrieval
21. ✅ Cohere Rerank to improve chunk ordering before injecting into prompt — AI concept: reranking
22. ⬜ Context window management: truncate/summarise chunks if job description exceeds token limit

### Phase 3 — AI Resume Editor (AI concepts: structured output, Chain of Verification, human-in-the-loop)
23. ⬜ Build UI: plain English → Claude extracts structured data → diff view → approve → write to Supabase
24. ⬜ Re-embed updated profile on approval (chatbot uses latest data immediately)
25. ⬜ Structured output (Instructor pattern) — reliable JSON from Claude, no hallucinated fields
26. ⬜ Chain of Verification — Claude validates extracted data against original input before saving

### Phase 4 — Job Aggregator (AI concepts: ETL pipeline, data normalisation, deduplication)
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
39. ✅ LLM-as-judge: scores job match with reasoning — AI concept: Zero-shot Chain-of-Thought. **TODO: improve prompt to distinguish technical vs functional SAP roles**
40. ⬜ Skill gap analyzer: aggregate missing skills across unmatched jobs

### Phase 6 — Agents (AI concepts: ReAct, tool use, MCP, multi-agent, LangGraph, self-reflection)
41. ⬜ Build ReAct agent: Fetcher → Scorer → Ranker → Email loop — AI concept: ReAct pattern (reason → act → observe)
42. ⬜ Define agent tools: `search_jobs`, `get_profile`, `score_job`, `send_email`, `update_resume` — AI concept: function calling / tool use
43. ⬜ Add self-reflection step — agent reviews its own output before sending — AI concept: self-reflection
44. ⬜ Expose job DB as MCP server (Anthropic Model Context Protocol) — AI concept: MCP
45. ⬜ Multi-agent: Fetcher + Scorer + Email agents orchestrated by LangGraph — AI concept: multi-agent orchestration
46. ⬜ Human-in-the-loop: user approves before any write action — AI concept: HITL

### Phase 7 — Cover Letter Generator (AI concepts: RAG, Chain of Verification, tool use)
47. ⬜ Pick job → RAG retrieves relevant projects/skills → Claude drafts → human reviews before copying
48. ⬜ Chain of Verification: validate proposal claims against resume before showing to user

### Phase 8 — Memory (AI concepts: short-term memory, long-term memory, semantic caching, delta search)
49. ⬜ Track jobs acted on (Apply / Pass / Save) in Supabase — AI concept: short-term memory
50. ⬜ Long-term memory via Mem0 or Zep: learn from accepted/rejected jobs — AI concept: long-term memory
51. ⬜ Semantic caching for repeated job searches via GPTCache or Redis — AI concept: semantic caching
52. ⬜ Delta search — only return new jobs since last run — AI concept: delta tracking

### Phase 9 — Interview Prep (AI concept: RAG)
53. ⬜ Given a job → generate likely questions + answers from your project experience via RAG

### Phase 10 — Email & Scheduler
54. ✅ Vercel Cron — daily at 9am UTC, calls /api/fetch-jobs
55. ⬜ Weekly digest email via Resend: new jobs, top 3, skill gaps, profile score

### Phase 11 — Observability (AI concepts: LLM tracing, evals, token/cost tracking)
56. ⬜ Langfuse LLM tracing — 50k traces/month free — AI concept: observability
57. ⬜ Token + cost tracking per agent run
58. ⬜ `/admin` page: run history, jobs per source, tokens, cost, Langfuse links
59. ⬜ DeepEval or RAGAs evals for retrieval quality — AI concept: evals
60. ⬜ LLM-as-judge: Claude scores whether job matched correctly — AI concept: automated evaluation

### Phase 12 — Upwork OAuth
61. ⬜ Receive Upwork developer keys, add to Vercel env vars
62. ⬜ Update callback URL in Upwork portal to `shahid-careerhub.vercel.app`
63. ⬜ Test full OAuth flow end-to-end
64. ⬜ AI Profile Optimizer: fetch Upwork profile → Claude suggestions → human review → push

### Phase 13 — Advanced (AI concepts: LLM routing, streaming, GraphRAG, fine-tuning, multimodal, guardrails)
65. ⬜ Streaming: stream AI responses to dashboard in real time — AI concept: streaming output
66. ⬜ LLM routing: Haiku for simple tasks, Opus for complex scoring — AI concept: model routing
67. ⬜ Guardrails: NeMo Guardrails + Presidio for PII + input validation — AI concept: guardrails
68. ⬜ GraphRAG: knowledge graph over job market for relational queries — AI concept: GraphRAG
69. ⬜ Fine-tuning prep: collect accepted/rejected dataset from memory — AI concept: fine-tuning
70. ⬜ Multimodal: parse job PDFs or screenshots with Claude vision — AI concept: multimodal

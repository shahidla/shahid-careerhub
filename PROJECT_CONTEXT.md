# Upwork AI Job Assistant — Project Context

Shared context for any AI assistant (Claude, Codex, etc.) working on this project.
Last updated: 2026-05-05 (session 2)

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

- **GitHub (job assistant):** https://github.com/shahidla/upwork
- **GitHub (resume):** https://github.com/shahidla/Resume
- **Local path (job assistant):** `C:/Dev/upwork`
- **Local path (resume):** `C:/Dev/Resume`
- **Production URL:** https://upwork-sepia.vercel.app
- **Resume (current, to be replaced):** https://shahidla.github.io/Resume/
- **Vercel dashboard:** https://vercel.com/shahidmsyed-projects/upwork/deployments

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
| `UPWORK_CLIENT_ID` | Pending — waiting for Upwork developer keys |
| `UPWORK_CLIENT_SECRET` | Pending — waiting for Upwork developer keys |
| `UPWORK_REDIRECT_URI` | `https://upwork-5j8apg26s-shahidmsyed-projects.vercel.app/api/auth/upwork/callback` (registered with Upwork) |
| `OPENAI_API_KEY` | Not yet added |

> Note: The Upwork developer portal was registered with the OLD callback URL (`upwork-5j8apg26s...`). Update to `upwork-sepia.vercel.app` when keys arrive.

---

## 7. Current File Structure

```
C:/Dev/upwork/
├── src/app/
│   ├── layout.tsx
│   ├── page.tsx                          # Home page — Connect Upwork button + callback URLs
│   ├── globals.css
│   └── api/
│       ├── health/route.ts               # GET /api/health → { ok: true }
│       └── auth/upwork/
│           ├── login/route.ts            # GET /api/auth/upwork/login → redirects to Upwork OAuth
│           └── callback/route.ts         # GET /api/auth/upwork/callback → exchanges code for token
├── .npmrc                                # registry=https://registry.npmjs.org/
├── vercel.json                           # installCommand: npm install --legacy-peer-deps
├── .env.example
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── PROJECT_CONTEXT.md
```

---

## 8. Current Status

### Done
- [x] Next.js 14 app with TypeScript + Tailwind scaffolded
- [x] Home page with Connect Upwork button and callback URLs displayed
- [x] `/api/auth/upwork/login` — OAuth redirect with CSRF state cookie
- [x] `/api/auth/upwork/callback` — code exchange, token stored in httpOnly cookie
- [x] `/api/health` — health check endpoint
- [x] Deployed to Vercel — https://upwork-sepia.vercel.app
- [x] GitHub → Vercel auto-deploy connected
- [x] Personal images purged from git history (`git filter-branch`)
- [x] `.npmrc` + `vercel.json` fixes applied for Vercel build

### Pending — Phase 1 (Upwork OAuth)
- [ ] Receive Upwork developer keys
- [ ] Update `UPWORK_CLIENT_ID` + `UPWORK_CLIENT_SECRET` in Vercel env vars
- [ ] Update callback URL in Upwork portal to `https://upwork-sepia.vercel.app/api/auth/upwork/callback`
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

## 15. Unified Platform Vision — AI Career Hub

The long-term goal is ONE unified Next.js app (`upwork-sepia.vercel.app`) that:
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
| Route | Purpose |
|---|---|
| `/resume` | Public-facing resume (replaces GitHub Pages) |
| `/dashboard` | Private — job feed, AI tools, admin |
| `/admin` | Agent pipeline observability — runs, tokens, cost, Langfuse links |
| `/api/chat` | Claude RAG chatbot (replaces Cloudflare Worker) |
| `/api/resume/update` | AI-assisted resume update (human-in-the-loop) |

### Key Principles
- **Public resume** at `/resume` — no auth needed, Schema.org JSON-LD preserved for SEO
- **Private dashboard** at `/dashboard` — job feed, AI tools
- **Human review always required** before any resume write or Upwork API action
- **Cloudflare Worker chatbot** to be retired once Claude RAG is live

---

## 16. Manual Job Entry

Any job not found by the aggregator can be manually added by pasting a URL or raw job description.
All AI features (scoring, cover letter, skill gap, interview prep, memory) apply identically to manual jobs.

| Input method | How it works |
|---|---|
| Paste a URL | App fetches and parses the page → extracts job fields → normalises to unified schema |
| Paste raw text | User pastes job description directly → Claude extracts structured fields → normalises to unified schema |

Manual jobs enter the same Supabase `jobs` table with `source: "manual"` and are treated identically to aggregated jobs from that point on.

Route: `POST /api/jobs/manual` — accepts `{ url? }` or `{ text? }`, returns normalised job record.

---

## 17. Complete Task List (55 tasks + manual job entry)

### Phase 0 — Foundation
1. Scaffold `/resume` public route + `/dashboard` private route in Next.js
2. Create Supabase project, add connection string to `.env.local` and Vercel
3. Migrate `profile.json`, `projects.json`, `certifications.json` into Supabase tables
4. Fix resume data gaps: add experience role descriptions, fill missing cert codes/PDF links

### Phase 1 — Public Resume Page
5. Build `/resume` page rendering from Supabase (replaces GitHub Pages)
6. Add Schema.org JSON-LD for SEO
7. Style with Tailwind to match/improve current site
8. AI-generated executive summaries per project (Claude, approved once, stored)
9. Profile completeness score widget

### Phase 2 — RAG Chatbot
10. Chunk resume data into optimal pieces
11. Embed chunks → Supabase pgvector (OpenAI `text-embedding-3-small`)
12. Build `/api/chat` RAG route with Claude (replaces Cloudflare Worker)
13. Recruiter mode vs visitor mode (different system prompts, same backend)
14. Stream Claude responses to UI
15. Add prompt caching to system prompt (90% cost reduction)

### Phase 3 — AI Resume Editor
16. Build UI: plain English → Claude extracts structured data → diff view → approve → write to Supabase
17. Re-embed updated profile on approval (chatbot uses latest data immediately)
18. Structured output (Instructor pattern) for reliable JSON from Claude

### Phase 4 — Job Aggregator
19. RSS fetchers: Freelancer.com, FreelancerMap, Guru, EurSAP, SAPcontractors
20. API integrations: Freelancer.com, Adzuna AU (apply for free keys)
21. Remotive.io integration (no key needed)
22. Normalize all sources to unified job schema
23. Deduplicate + store in Supabase with delta tracking

### Phase 4b — Manual Job Entry
24. Build `POST /api/jobs/manual` — accepts URL or raw text, fetches/parses, normalises to unified job schema with `source: "manual"`
25. Build dashboard UI: paste a URL or job description → preview extracted fields → confirm → save to Supabase
26. All downstream features (scoring, cover letter, skill gap, interview prep, memory) work identically for manual jobs

### Phase 5 — Job Scoring
27. Embed job descriptions
28. Hybrid search: vector similarity + BM25 against profile
29. Cohere Rerank for result ordering
30. Job match scorecard: skills %, seniority, location, rate
31. LLM-as-judge: Claude scores job match with reasoning
32. Skill gap analyzer: aggregate missing skills across unmatched jobs

### Phase 6 — Agents
33. Build ReAct agent: Fetcher → Scorer → Ranker → Email loop
34. Define agent tools: `search_jobs`, `get_profile`, `score_job`, `send_email`, `update_resume`
35. Add self-reflection step (agent reviews its own output)
36. Expose job DB as MCP server (Anthropic Model Context Protocol)
37. Multi-agent: Fetcher + Scorer + Email agents orchestrated by LangGraph

### Phase 7 — Cover Letter Generator
38. Pick job → RAG retrieves relevant projects/skills → Claude drafts → human reviews before copying
39. Add Chain of Verification to validate proposal claims against resume

### Phase 8 — Memory
40. Track jobs acted on (Apply / Pass / Save) in Supabase
41. Long-term memory via Mem0 or Zep: learn from accepted/rejected jobs
42. Semantic caching for repeated job searches (GPTCache or Redis)

### Phase 9 — Interview Prep
43. Given a job → generate likely questions + answers from your project experience via RAG

### Phase 10 — Email & Scheduler
44. Vercel Cron to run job agent on schedule
45. Weekly digest email via Resend: new jobs, top 3, skill gaps, profile score

### Phase 11 — Observability
46. Langfuse LLM tracing (50k traces/month free)
47. Token + cost tracking per agent run
48. `/admin` page: run history, jobs per source, tokens, cost, Langfuse links
49. DeepEval or RAGAs evals for retrieval quality

### Phase 12 — Upwork OAuth
50. Receive Upwork developer keys, add to Vercel env vars
51. Update callback URL in Upwork portal to `upwork-sepia.vercel.app`
52. Test full OAuth flow end-to-end
53. AI Profile Optimizer: fetch Upwork profile → Claude suggestions → human review → push

### Phase 13 — Advanced
54. Guardrails: NeMo Guardrails + Presidio for PII + input validation
55. LLM routing: Haiku for simple tasks, Opus for complex scoring
56. GraphRAG: knowledge graph over job market
57. Fine-tuning prep: collect accepted/rejected dataset from memory
58. Multimodal: parse job PDFs or screenshots with Claude vision

---

## 12. Known Issues & Fixes

| Issue | Fix Applied |
|---|---|
| Corporate Artifactory npm registry blocks Vercel | `.npmrc` sets `registry=https://registry.npmjs.org/` |
| Vercel npm `Exit handler never called` bug | `vercel.json` sets `installCommand: npm install --legacy-peer-deps` |
| Personal photos accidentally uploaded to GitHub | Removed via `git filter-branch --force`, force-pushed |
| Two Vercel URLs live simultaneously | Old URL (`upwork-5j8apg26s...`) still live — use `upwork-sepia.vercel.app` |

---

## 13. Local Dev Commands

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

## 14. Notes for AI Assistants

- **npm registry:** Always use `https://registry.npmjs.org/` — corporate Artifactory only works on the dev machine
- **Never commit** `.env.local`
- **Production domain:** `upwork-sepia.vercel.app` — use this everywhere
- **Callback URL registered with Upwork:** currently the OLD URL — update when keys arrive
- **Do not remove** `vercel.json` — it fixes the Vercel build
- **Human review always required** before any Upwork API write action
- **AI stack preference:** Claude API (Anthropic) as primary LLM
- **Dev machine OS:** Windows 11, shell is bash (Git Bash), paths use forward slashes

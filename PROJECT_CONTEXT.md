# Upwork AI Job Assistant — Project Context

Shared context for any AI assistant (Claude, Codex, etc.) working on this project.
Last updated: 2026-05-05

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

- **GitHub:** https://github.com/shahidla/upwork
- **Local path:** `C:/Dev/upwork`
- **Production URL:** https://upwork-sepia.vercel.app
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

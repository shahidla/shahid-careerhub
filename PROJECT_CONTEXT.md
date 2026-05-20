# AI Career Hub - Project Context

Shared context for future work on this repo.
Last updated: 2026-05-20

---

## 1. Project Vision

This project serves two goals:
1. A practical job search and recruiter-facing profile hub for Shahid.
2. A live AI engineering prototype that exercises real RAG, scoring, agent, and automation patterns.

Key principle:
- Human review only. No automated proposal submission or unsafe scraping.

---

## 2. User Profile

- Based in Australia
- Looking for part-time, remote, contract, and gig work
- Core background: SAP technical engineering
- Current transition: stronger public positioning into AI engineering
- Alert email: `shahid.la@gmail.com`

---

## 3. Stack

| Layer | Tool |
|---|---|
| Framework | Next.js 14 App Router |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Runtime | Node.js |
| Deployment | Vercel |
| Database | Supabase Postgres |
| Vector search | Supabase pgvector |
| Primary LLM | Anthropic |
| Fallback LLM | OpenAI |
| Reranking | Cohere |
| Observability | Langfuse |
| Notifications | Telegram |
| Email | Resend (built, not fully live) |

---

## 4. Repository & URLs

- GitHub repo: https://github.com/shahidla/shahid-careerhub
- Resume repo: https://github.com/shahidla/Resume
- Production URL: https://shahid-careerhub.vercel.app
- Vercel project: `shahidmsyed-projects/shahid-careerhub`
- Current working repo path on this laptop: `C:\Users\shahi\Downloads\shahid-careerhub`

---

## 5. Important Runtime Notes

- Vercel is the source of truth for runtime secrets.
- Local `.env.local` is not required for the normal workflow unless someone wants to run the app locally.
- Vercel CLI login and project link were already set up on this laptop.
- Telegram is working in production and should be left as-is unless explicitly revisited.

---

## 6. High-Level App Map

Public routes:
- `/` - landing page
- `/resume` - full SAP profile
- `/ai` - AI portfolio
- `/blogs` - on-site blog archive
- `/blogs/[slug]` - MDX-backed blog detail
- `/learning` - course and learning archive
- `/certifications` - recruiter-friendly credential index
- `/chat` - protected resume chat
- `/dashboard` - protected AI-scored job dashboard
- `/admin` - protected operational/admin page

Key API routes:
- `/api/chat`
- `/api/embed`
- `/api/fetch-jobs`
- `/api/score-batch`
- `/api/rescore-jobs`
- `/api/pipeline/run`
- `/api/jobs/status`
- `/api/telegram/register`
- `/api/telegram/webhook`
- `/api/email-digest`

---

## 7. Security / Platform State

Completed:
- Sensitive routes and pages are protected server-side.
- Access flow uses server-side secret handling instead of only client-side gating.
- Middleware protects `/chat`, `/dashboard`, `/admin`, and sensitive APIs.
- Internal routes support protected internal calls.
- Blog rendering was hardened versus raw unsanitized markdown injection.
- Build and lint pass cleanly.

Operational notes:
- `APP_ACCESS_PASSWORD` is expected in Vercel.
- `CRON_SECRET` should exist in Vercel for secure cron invocation.
- `TELEGRAM_WEBHOOK_SECRET` is supported in code, but Telegram currently works and was intentionally left unchanged.

---

## 8. Current Public Status

Live and working:
- `/`
- `/resume`
- `/ai`
- `/blogs`
- `/blogs/[slug]`
- `/learning`
- `/chat`
- `/dashboard`
- `/admin`
- `/access`
- `/api/telegram/register`

Verified already in deployed production:
- protected routes work
- Telegram messages are arriving
- site pages load correctly

---

## 9. Work Already Deployed

Latest deployed hardening/copy pass before the current local stack:
- server-side protected access flow
- middleware-based protection for sensitive pages and routes
- improved copy on public pages
- safer blog rendering
- working Telegram registration route

That deployed state was confirmed healthy by smoke testing.

---

## 10. Current Local-Only Changes (Not Yet Deployed)

These changes exist locally and pass `npm run lint` and `npm run build`, but have not been pushed yet.

### Product improvements

1. Scoring calibration
- File: `src/app/api/score-batch/route.ts`
- Added deterministic job-signal analysis for SAP, AI, coding, integration, functional bias, and management bias.
- Added prompt hints plus post-LLM score calibration.
- Goal: boost true SAP + AI technical roles and suppress non-coding SAP functional/managerial roles.

2. Resume/project seed data corrections
- Files:
  - `supabase/seed-6-experience.sql`
  - `supabase/seed-7-projects.sql`
- Safe fixes applied:
  - CBA role changed to `Development Architect`
  - DyFlex role changed to `Senior SAP Technical Consultant`
  - Stockland updated to include `Analysis for Office`

3. Blog UX upgrade
- Files:
  - `src/app/blogs/page.tsx`
  - `src/app/blogs/[slug]/page.tsx`
- Added:
  - featured AI + SAP section
  - topic filters
  - tag filters
  - better empty-state handling
  - copy cleanup

4. Dashboard UX upgrade
- Files:
  - `src/app/dashboard/page.tsx`
  - `src/app/dashboard/JobFeed.tsx`
- Added:
  - `jobs found` wording instead of misleading `new`
  - low-priority / stale filtering by default
  - clearer status and visibility controls

5. Certifications experience
- New route:
  - `src/app/certifications/page.tsx`
- Wiring updates:
  - `src/components/SiteHeader.tsx`
  - `src/components/SiteFooter.tsx`
  - `src/app/resume/page.tsx`
  - `src/app/ai/page.tsx`
  - `src/app/learning/page.tsx`
- Goal:
  - separate recruiter-friendly credential index from the more archive-style learning page

6. Skills seed wording refresh
- File: `supabase/seed-3-skills.sql`
- Replaced `AI (Exploration)` with `AI Engineering`
- Updated descriptions to better match current RAG, MCP, and LLM integration work

---

## 11. Known Pending Decisions

These items were intentionally not changed automatically because they need Shahid’s decision or confirmation:

- `profile.proof_points` includes `TechEd speaker`
  - present in seed data
  - not clearly confirmed from the PDF audit
- Missing second Stockland stint (`Apr 2018 - Nov 2018`)
- Whether SAP Labs sub-projects should stay bundled or be split out
  - Mohawk
  - Mosaic
  - Kronos
  - Galileo
- Whether the MCP project should stay standalone or be folded into the CBA experience

---

## 12. Recommended Next Order

If continuing product work after the current local stack, the best next order is:

1. Deploy the current local stack so the new `/blogs`, `/dashboard`, and `/certifications` UX can be reviewed live.
2. Continue the resume/PDF audit only for changes that are safe and unambiguous.
3. Re-run embeddings after any seed/data updates that materially affect chat grounding.
4. Then move to deeper product features such as:
   - manual job entry
   - skill-gap analysis
   - interview prep
   - hybrid search in `/chat`

---

## 13. Verification State

Current local stack:
- `npm run lint` ✅
- `npm run build` ✅

Production checks already completed on the last deployed version:
- `/access` ✅
- `/chat` ✅
- `/dashboard` ✅
- `/admin` ✅
- `/resume` ✅
- `/ai` ✅
- Telegram webhook registration route reachable ✅

---

## 14. Notes for the Next Agent

- Do not touch the untracked file `docs/Shahid M Syed - 2016 - old.doc` unless explicitly asked.
- Do not assume `.env.local` is authoritative; the user prefers Vercel-only secret management.
- The repo is safe to build locally without relying on production secrets for normal code changes.
- The current uncommitted work is meaningful and should not be discarded.

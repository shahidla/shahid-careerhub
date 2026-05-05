# Upwork AI Job Assistant — Project Context

This file is a shared context document for any AI assistant (Claude, Codex, etc.) working on this project.
Last updated: 2026-05-05

---

## Project Overview

A production-ready web app that integrates with the Upwork API to help the user manage their Upwork profile and jobs using AI assistance.

**Key principle: Human review only — no automated proposal submission, no scraping.**

---

## Tech Stack

- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Runtime:** Node
- **Deployment:** Vercel
- **AI:** OpenAI API

---

## Repository & URLs

- **GitHub:** https://github.com/shahidla/upwork
- **Local path (main dev machine):** `C:/Dev/upwork`
- **Production URL:** https://upwork-sepia.vercel.app
- **Vercel project:** https://vercel.com/shahidmsyed-projects/upwork/deployments

---

## Git & Accounts

- **GitHub username:** shahidla
- **GitHub email:** shahid.la@gmail.com
- **Vercel account:** shahidmsyed-projects
- **Vercel connected to GitHub:** Yes — auto-deploys on every push to `main`

---

## Environment Variables

Defined in `.env.example`. Must be set in Vercel project settings and `.env.local` for local dev.

| Variable | Value / Description |
|---|---|
| `UPWORK_CLIENT_ID` | Pending — waiting for Upwork developer keys |
| `UPWORK_CLIENT_SECRET` | Pending — waiting for Upwork developer keys |
| `UPWORK_REDIRECT_URI` | `https://upwork-sepia.vercel.app/api/auth/upwork/callback` |
| `OPENAI_API_KEY` | Not yet added |

---

## Current Status (as of 2026-05-05)

### Done
- [x] Next.js 14 app scaffolded with TypeScript + Tailwind
- [x] Home page at `/` showing app name, status, Connect Upwork button, and callback URLs
- [x] API route `/api/auth/upwork/login` — redirects user to Upwork OAuth with CSRF state cookie
- [x] API route `/api/auth/upwork/callback` — receives OAuth code, exchanges for access token, stores in httpOnly cookie
- [x] API route `/api/health` — returns `{ ok: true, app: "upwork-ai-job-assistant" }`
- [x] `.env.example` created
- [x] Deployed to Vercel — production URL: https://upwork-sepia.vercel.app
- [x] GitHub connected to Vercel for auto-deploy on push to `main`
- [x] Personal images accidentally uploaded purged from entire git history using `git filter-branch`

### Pending
- [ ] Upwork developer keys not yet received — apply at https://www.upwork.com/developer/keys
- [ ] Once keys arrive: add `UPWORK_CLIENT_ID`, `UPWORK_CLIENT_SECRET`, `UPWORK_REDIRECT_URI` to Vercel environment variables
- [ ] Register callback URL on Upwork developer portal: `https://upwork-sepia.vercel.app/api/auth/upwork/callback`
- [ ] Test full OAuth flow end-to-end by clicking "Connect Upwork"
- [ ] Add `OPENAI_API_KEY` to Vercel env vars
- [ ] Build AI Profile Optimizer feature (see below)

---

## File Structure

```
C:/Dev/upwork/
├── src/
│   └── app/
│       ├── layout.tsx
│       ├── page.tsx                          # Home page with Connect Upwork button
│       ├── globals.css
│       └── api/
│           ├── health/
│           │   └── route.ts                  # GET /api/health
│           └── auth/
│               └── upwork/
│                   ├── login/
│                   │   └── route.ts          # GET /api/auth/upwork/login
│                   └── callback/
│                       └── route.ts          # GET /api/auth/upwork/callback
├── .npmrc                                    # registry=https://registry.npmjs.org/
├── vercel.json                               # installCommand: npm install --legacy-peer-deps
├── .env.example
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Known Issues & Fixes

### Corporate npm registry on dev machine
- Dev machine uses corporate Artifactory registry (`artifactory.internal.cba:443`)
- Vercel cannot reach this — `.npmrc` overrides to `https://registry.npmjs.org/`
- Vercel also had an npm `Exit handler never called` bug — fixed by adding `vercel.json` with `installCommand: npm install --legacy-peer-deps`

### Git history cleanup
- Two personal photos (`20260505_115505.jpg`, `Screenshot_20260505_123240_Canon PRINT.jpg`) were accidentally uploaded via GitHub browser UI
- Removed using `git filter-branch` and force-pushed — no longer in history

---

## Planned Feature: AI Profile Optimizer

### Goal
Read the user's Upwork profile, use OpenAI to suggest improvements, let the user review and approve changes, then push approved changes back to Upwork API.

### Routes to build
| Route | Method | Purpose |
|---|---|---|
| `/profile` | Page | Show current profile + AI suggestions side by side |
| `/api/upwork/profile` | GET | Fetch profile from Upwork API |
| `/api/upwork/profile/update` | POST | Push approved changes to Upwork |
| `/api/ai/analyze` | POST | Send profile to OpenAI, return suggestions |

### Fields to optimize
- Title (short punchy headline)
- Overview/Bio (rewritten for clarity and keywords)
- Skills (suggest missing relevant skills)
- Hourly rate (suggest based on skills/experience)

### Status
- Deferred — will build after OAuth flow is working end-to-end

---

## Local Dev Commands

```bash
# Install dependencies
cd C:/Dev/upwork
npm install

# Run locally
npm run dev
# App runs at http://localhost:3000

# Push to deploy (auto-deploys to Vercel)
git push origin main
```

---

## Notes for AI Assistants

- Always use `https://registry.npmjs.org/` for npm installs — corporate registry won't work outside the dev machine
- Never commit `.env.local` — it is gitignored
- All Upwork API interactions must show changes to the user for review before applying
- The production domain is `upwork-sepia.vercel.app` — use this for all callback URLs
- After pushing to GitHub, Vercel auto-deploys — check https://vercel.com/shahidmsyed-projects/upwork/deployments
- `vercel.json` overrides the install command — do not remove it

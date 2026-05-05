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

## Repository

- **GitHub:** https://github.com/shahidla/upwork
- **Local path (main dev machine):** `C:/Dev/upwork`
- **Vercel URL:** https://upwork-5j8apg26s-shahidmsyed-projects.vercel.app

---

## Git & Accounts

- **GitHub username:** shahidla
- **GitHub email:** shahid.la@gmail.com
- **Vercel account:** shahidmsyed-projects
- **Vercel connected to GitHub:** Yes (auto-deploys on push to `main`)

---

## Environment Variables

Defined in `.env.example`. Must be set in Vercel project settings and `.env.local` for local dev.

| Variable | Description |
|---|---|
| `UPWORK_CLIENT_ID` | Upwork app client ID (pending — waiting for Upwork developer keys) |
| `UPWORK_CLIENT_SECRET` | Upwork app client secret (pending) |
| `UPWORK_REDIRECT_URI` | `https://upwork-5j8apg26s-shahidmsyed-projects.vercel.app/api/auth/upwork/callback` |
| `OPENAI_API_KEY` | OpenAI API key (not yet added) |

---

## Current Status (as of 2026-05-05)

### Done
- [x] Next.js 14 app scaffolded with TypeScript + Tailwind
- [x] Home page at `/` showing app name, status, and callback URLs
- [x] API route `/api/auth/upwork/login` — redirects user to Upwork OAuth with CSRF state
- [x] API route `/api/auth/upwork/callback` — receives OAuth code, exchanges for access token, stores in httpOnly cookie
- [x] API route `/api/health` — returns `{ ok: true, app: "upwork-ai-job-assistant" }`
- [x] `.env.example` created
- [x] Deployed to Vercel
- [x] GitHub connected to Vercel for auto-deploy
- [x] `.npmrc` added with `registry=https://registry.npmjs.org/` to fix Vercel build (corporate Artifactory was blocking installs)
- [x] Personal images accidentally uploaded to GitHub purged from entire git history using `git filter-branch`

### In Progress
- [ ] Vercel build still failing — `package-lock.json` was generated against corporate Artifactory registry, needs to be regenerated using public registry and pushed
- [ ] Waiting for Upwork developer keys to arrive (applied on Upwork developer portal)

### Pending
- [ ] Add `UPWORK_CLIENT_ID`, `UPWORK_CLIENT_SECRET`, `UPWORK_REDIRECT_URI` to Vercel environment variables once keys arrive
- [ ] Test full OAuth flow end-to-end
- [ ] Build AI Profile Optimizer feature (see below)

---

## File Structure

```
C:/Dev/upwork/
├── src/
│   └── app/
│       ├── layout.tsx
│       ├── page.tsx                          # Home page
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
├── .npmrc                                    # Forces public npm registry for Vercel
├── .env.example
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Known Issues & Fixes

### Corporate npm registry
- The dev machine uses a corporate Artifactory registry (`artifactory.internal.cba:443`)
- Vercel cannot reach this registry — `.npmrc` overrides it to `https://registry.npmjs.org/`
- `package-lock.json` needs to be regenerated using public registry before Vercel build will succeed

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

# Deploy (auto on git push — manual trigger if needed)
git push origin main
```

---

## Notes for AI Assistants

- Always use `https://registry.npmjs.org/` for npm installs — corporate registry won't work outside the dev machine
- Never commit `.env.local` — it is gitignored
- All Upwork API interactions must show changes to the user for review before applying
- The Vercel project is named `upwork` under team `shahidmsyed-projects`
- After pushing to GitHub, Vercel auto-deploys — check dashboard at https://vercel.com/shahidmsyed-projects/upwork/deployments

# CareerHub — Claude Instructions

## Project
Next.js 14 portfolio site for Shahid M Syed. Deployed on Vercel at https://shahid-careerhub.vercel.app.

## Permissions — pre-approved, no prompting needed
- Edit, create, delete any file under `src/`, `content/`, `public/`, `scripts/`
- Run `git add`, `git commit`, `git push`, `git pull`, `git stash`
- Run `npm run build`, `npm run dev`
- Run `node scripts/*`
- Read any file in the project

## Do NOT touch
- `.env.local` — never modify
- `supabase/` migrations — ask first
- `package.json` dependency changes — ask first (corporate network blocks npm)

## Commit style
- Conventional commits: `feat:`, `fix:`, `chore:`
- Always add `Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>`
- Commit and push after each logical unit of work

## Current UX work in progress
Implementing all items from careerhub-ux-recommendations.html:
1. Shared public layout (header + footer) across all public pages
2. Homepage redesign — proper career landing page, remove dev status content
3. Dashboard — label as "Demo", add explanatory intro
4. Blog — add categories, "Start here" featured section
5. Accessibility — skip link, aria-current, focus rings, semantic landmarks
6. /chat stays password-protected, add to footer only (not main nav)

## Public pages
/ /resume /ai /blogs /blogs/[slug] /dashboard /chat
## Private pages  
/admin — do not link from public nav
/api/* — do not link from public nav

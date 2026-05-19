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

## Current focus
- Blog categories / filter UI on `/blogs`
- Content audit — align projects on site with actual CV (update Supabase)
- AI Skills taxonomy — replace "AI (Exploration)" in Supabase skills table
- Scoring calibration — SAP+AI hybrid roles scoring too low

## Public pages
/ /resume /ai /blogs /blogs/[slug] /dashboard /chat /learning
## Private pages  
/admin — do not link from public nav
/api/* — do not link from public nav

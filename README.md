# AI Career Hub

A job search aggregator and AI career assistant built with Next.js 14, TypeScript, and Tailwind CSS.

## Setup

### 1. Clone the repo

```bash
git clone https://github.com/shahidla/shahid-careerhub.git
cd shahid-careerhub
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in your credentials:

| Variable | Description |
|---|---|
| `UPWORK_CLIENT_ID` | Your Upwork app client ID |
| `UPWORK_CLIENT_SECRET` | Your Upwork app client secret |
| `UPWORK_REDIRECT_URI` | OAuth callback URL |
| `OPENAI_API_KEY` | Your OpenAI API key |
| `APP_ACCESS_PASSWORD` | Shared password for protected pages and private APIs |
| `CRON_SECRET` | Secret used by Vercel cron Authorization header |

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

Protected routes such as `/chat`, `/dashboard`, `/admin`, and the private mutation APIs require the shared `APP_ACCESS_PASSWORD`.

## OAuth Callback URLs

**Local development:**

```text
http://localhost:3000/api/auth/upwork/callback
```

**Production (after Vercel deployment):**

```text
https://YOUR-VERCEL-DOMAIN.vercel.app/api/auth/upwork/callback
```

Register the production URL in your [Upwork Developer Portal](https://www.upwork.com/developer/keys) app settings.

## API Routes

| Route | Method | Description |
|---|---|---|
| `/api/auth/upwork/callback` | GET | Upwork OAuth callback handler |
| `/api/health` | GET | Health check |

## Blog Archive

The repo is intended to rebuild the blog archive even if SAP Community or Vercel content becomes unavailable.

| Path | Purpose |
|---|---|
| `BLOG_ARCHIVE_DO_NOT_DELETE/` | Raw downloaded SAP Community source archive. Do not delete; this is preservation material. |
| `content/blogs/` | Production MDX posts rendered by the site. |
| `public/blogs/` | Only media files referenced by the production MDX posts. |
| `scripts/verify-blog-assets.mjs` | Verifies every referenced blog asset exists and no unreferenced public blog assets remain. |

Run the archive checks with:

```bash
npm run verify:blogs
```

## Deploy to Vercel

### Option A - Vercel CLI

```bash
npm install -g vercel
vercel
```

### Option B - GitHub integration

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) and import the repo
3. Add environment variables in Vercel project settings
4. Deploy

After deployment, update `UPWORK_REDIRECT_URI` in Vercel env vars to your production URL.

## Compliance

This app is designed for human-review-only workflows. No automated proposal submission. No scraping.

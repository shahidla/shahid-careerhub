# Upwork AI Job Assistant

A minimal production-ready web app for Upwork API integration, built with Next.js 14, TypeScript, and Tailwind CSS.

## Setup

### 1. Clone the repo

```bash
git clone https://github.com/shahidla/upwork.git
cd upwork
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

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## OAuth Callback URLs

**Local development:**
```
http://localhost:3000/api/auth/upwork/callback
```

**Production (after Vercel deployment):**
```
https://YOUR-VERCEL-DOMAIN.vercel.app/api/auth/upwork/callback
```

Register the production URL in your [Upwork Developer Portal](https://www.upwork.com/developer/keys) app settings.

## API Routes

| Route | Method | Description |
|---|---|---|
| `/api/auth/upwork/callback` | GET | Upwork OAuth callback handler |
| `/api/health` | GET | Health check |

## Deploy to Vercel

### Option A — Vercel CLI

```bash
npm install -g vercel
vercel
```

### Option B — GitHub integration

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) and import the repo
3. Add environment variables in Vercel project settings
4. Deploy

After deployment, update `UPWORK_REDIRECT_URI` in Vercel env vars to your production URL.

## Compliance

This app is designed for human-review-only workflows. No automated proposal submission. No scraping.

import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const RESEND_KEY = process.env.RESEND_API_KEY
const DIGEST_EMAIL = process.env.DIGEST_EMAIL ?? 'shahid.la@gmail.com'

type Job = {
  id: string
  title: string
  company: string
  location: string
  url: string
  match_score: number | null
  match_reasoning: string | null
  source: string
  posted_at: string | null
}

async function getTopJobs(): Promise<Job[]> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/jobs?select=id,title,company,location,url,match_score,match_reasoning,source,posted_at&match_score=gte.60&status=eq.new&order=match_score.desc&limit=10`,
    { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
  )
  if (!res.ok) return []
  return res.json()
}

function buildHtml(jobs: Job[]): string {
  if (jobs.length === 0) {
    return `<p>No new high-scoring jobs today.</p>`
  }

  const rows = jobs.map((job, i) => `
    <tr>
      <td style="padding:12px 8px;border-bottom:1px solid #eee;font-weight:600;color:#111;">${i + 1}</td>
      <td style="padding:12px 8px;border-bottom:1px solid #eee;">
        <a href="${job.url}" style="color:#2563eb;text-decoration:none;font-weight:600;">${job.title}</a>
        <div style="color:#6b7280;font-size:13px;">${job.company}${job.location ? ` · ${job.location}` : ''} · ${job.source}</div>
        ${job.match_reasoning ? `<div style="color:#374151;font-size:13px;margin-top:4px;font-style:italic;">${job.match_reasoning}</div>` : ''}
      </td>
      <td style="padding:12px 8px;border-bottom:1px solid #eee;text-align:center;">
        <span style="background:${(job.match_score ?? 0) >= 80 ? '#dcfce7' : '#dbeafe'};color:${(job.match_score ?? 0) >= 80 ? '#166534' : '#1e40af'};padding:2px 10px;border-radius:999px;font-size:13px;font-weight:600;">${job.match_score}</span>
      </td>
    </tr>
  `).join('')

  return `
    <div style="font-family:system-ui,sans-serif;max-width:680px;margin:0 auto;padding:24px;">
      <h1 style="font-size:20px;font-weight:700;color:#111;margin-bottom:4px;">Daily Job Digest</h1>
      <p style="color:#6b7280;font-size:14px;margin-bottom:24px;">${jobs.length} high-match jobs found · <a href="https://shahid-careerhub.vercel.app/dashboard" style="color:#2563eb;">View dashboard</a></p>
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr style="background:#f9fafb;">
            <th style="padding:8px;text-align:left;font-size:12px;color:#6b7280;width:30px;">#</th>
            <th style="padding:8px;text-align:left;font-size:12px;color:#6b7280;">Job</th>
            <th style="padding:8px;text-align:center;font-size:12px;color:#6b7280;width:60px;">Score</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <p style="color:#9ca3af;font-size:12px;margin-top:24px;">Sent by AI Career Hub · <a href="https://shahid-careerhub.vercel.app" style="color:#9ca3af;">shahid-careerhub.vercel.app</a></p>
    </div>
  `
}

export async function GET() {
  if (!RESEND_KEY) return NextResponse.json({ error: 'RESEND_API_KEY not set' }, { status: 500 })

  const jobs = await getTopJobs()

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_KEY}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      from: 'AI Career Hub <onboarding@resend.dev>',
      to: DIGEST_EMAIL,
      subject: `Job Digest — ${jobs.length} high-match jobs`,
      html: buildHtml(jobs),
    }),
  })

  const data = await res.json()
  if (!res.ok) return NextResponse.json({ error: data }, { status: 500 })
  return NextResponse.json({ sent: true, id: data.id, jobs: jobs.length })
}

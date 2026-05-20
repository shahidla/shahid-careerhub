import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const TOKEN = process.env.TELEGRAM_BOT_TOKEN!
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://shahid-careerhub.vercel.app'
const WEBHOOK_SECRET = process.env.TELEGRAM_WEBHOOK_SECRET

export async function GET() {
  if (!TOKEN) return NextResponse.json({ error: 'TELEGRAM_BOT_TOKEN not set' }, { status: 500 })

  const webhookUrl = `${BASE_URL}/api/telegram/webhook`
  const params = new URLSearchParams({ url: webhookUrl })
  if (WEBHOOK_SECRET) params.set('secret_token', WEBHOOK_SECRET)

  const res = await fetch(`https://api.telegram.org/bot${TOKEN}/setWebhook?${params.toString()}`)
  const data = await res.json()
  return NextResponse.json(data)
}

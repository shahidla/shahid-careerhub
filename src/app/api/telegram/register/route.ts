import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const TOKEN = process.env.TELEGRAM_BOT_TOKEN!
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://shahid-careerhub.vercel.app'

export async function GET() {
  if (!TOKEN) return NextResponse.json({ error: 'TELEGRAM_BOT_TOKEN not set' }, { status: 500 })

  const webhookUrl = `${BASE_URL}/api/telegram/webhook`
  const res = await fetch(`https://api.telegram.org/bot${TOKEN}/setWebhook?url=${encodeURIComponent(webhookUrl)}`)
  const data = await res.json()
  return NextResponse.json(data)
}

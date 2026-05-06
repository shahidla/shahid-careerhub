import { NextResponse } from 'next/server'

export async function GET() {
  const anthropic = process.env.ANTHROPIC_API_KEY
  const openai = process.env.OPENAI_API_KEY

  return NextResponse.json({
    anthropic: anthropic
      ? `set — starts with: ${anthropic.slice(0, 10)}... length: ${anthropic.length}`
      : 'NOT SET',
    openai: openai
      ? `set — starts with: ${openai.slice(0, 8)}... length: ${openai.length}`
      : 'NOT SET',
  })
}

import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  if (error) {
    return NextResponse.json(
      { success: false, error, message: 'Upwork OAuth returned an error' },
      { status: 400 }
    )
  }

  if (code) {
    return NextResponse.json({
      success: true,
      message: 'Upwork OAuth callback received',
      codeReceived: true,
      state: state ?? null,
    })
  }

  return NextResponse.json(
    { success: false, message: 'No code or error received' },
    { status: 400 }
  )
}

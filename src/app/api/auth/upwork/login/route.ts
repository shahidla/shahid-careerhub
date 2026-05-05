import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const clientId = process.env.UPWORK_CLIENT_ID
  const redirectUri = process.env.UPWORK_REDIRECT_URI

  if (!clientId || !redirectUri) {
    return NextResponse.json(
      { error: 'UPWORK_CLIENT_ID or UPWORK_REDIRECT_URI not configured' },
      { status: 500 }
    )
  }

  const state = crypto.randomUUID()

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    state,
  })

  const authUrl = `https://www.upwork.com/ab/account-security/oauth2/authorize?${params.toString()}`

  const response = NextResponse.redirect(authUrl)
  // Store state in cookie to verify on callback
  response.cookies.set('upwork_oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600, // 10 minutes
  })

  return response
}

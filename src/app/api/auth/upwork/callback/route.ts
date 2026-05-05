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

  // Verify state to prevent CSRF
  const savedState = request.cookies.get('upwork_oauth_state')?.value
  if (!state || state !== savedState) {
    return NextResponse.json(
      { success: false, message: 'Invalid state parameter' },
      { status: 400 }
    )
  }

  if (!code) {
    return NextResponse.json(
      { success: false, message: 'No code received' },
      { status: 400 }
    )
  }

  const clientId = process.env.UPWORK_CLIENT_ID
  const clientSecret = process.env.UPWORK_CLIENT_SECRET
  const redirectUri = process.env.UPWORK_REDIRECT_URI

  if (!clientId || !clientSecret || !redirectUri) {
    return NextResponse.json(
      { success: false, message: 'Missing Upwork credentials in environment variables' },
      { status: 500 }
    )
  }

  // Exchange code for access token
  const tokenResponse = await fetch('https://www.upwork.com/api/v3/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      client_id: clientId,
      client_secret: clientSecret,
    }),
  })

  if (!tokenResponse.ok) {
    const errorText = await tokenResponse.text()
    return NextResponse.json(
      { success: false, message: 'Token exchange failed', detail: errorText },
      { status: 502 }
    )
  }

  const tokenData = await tokenResponse.json()

  const response = NextResponse.json({
    success: true,
    message: 'Upwork OAuth successful',
    tokenType: tokenData.token_type,
    expiresIn: tokenData.expires_in,
  })

  // Store access token in httpOnly cookie
  response.cookies.set('upwork_access_token', tokenData.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: tokenData.expires_in ?? 86400,
  })

  if (tokenData.refresh_token) {
    response.cookies.set('upwork_refresh_token', tokenData.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })
  }

  // Clear state cookie
  response.cookies.delete('upwork_oauth_state')

  return response
}

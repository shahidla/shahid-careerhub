import { NextRequest, NextResponse } from 'next/server'
import {
  ACCESS_COOKIE_NAME,
  ACCESS_SESSION_MAX_AGE,
  getAppAccessSecret,
  normaliseNextPath,
} from '@/lib/access'

export async function POST(request: NextRequest) {
  const { password, next } = await request.json()
  const expected = getAppAccessSecret()

  if (!expected) {
    return NextResponse.json(
      { ok: false, error: 'APP_ACCESS_PASSWORD is not configured.' },
      { status: 500 },
    )
  }

  if (password !== expected) {
    return NextResponse.json(
      { ok: false, error: 'Incorrect access password.' },
      { status: 401 },
    )
  }

  const response = NextResponse.json({
    ok: true,
    redirectTo: normaliseNextPath(next),
  })

  response.cookies.set(ACCESS_COOKIE_NAME, expected, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: ACCESS_SESSION_MAX_AGE,
  })

  return response
}

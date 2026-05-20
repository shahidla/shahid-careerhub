import { NextRequest, NextResponse } from 'next/server'
import {
  ACCESS_COOKIE_NAME,
  isValidAccessSecret,
  isValidAuthorizationHeader,
} from './src/lib/access'

function isAuthorised(request: NextRequest): boolean {
  const cookieValue = request.cookies.get(ACCESS_COOKIE_NAME)?.value
  if (isValidAccessSecret(cookieValue)) return true

  return isValidAuthorizationHeader(request.headers.get('authorization'))
}

export function middleware(request: NextRequest) {
  if (isAuthorised(request)) {
    return NextResponse.next()
  }

  const { pathname, search } = request.nextUrl

  if (pathname.startsWith('/api/')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const loginUrl = new URL('/access', request.url)
  loginUrl.searchParams.set('next', `${pathname}${search}`)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: [
    '/chat/:path*',
    '/dashboard/:path*',
    '/admin/:path*',
    '/api/chat',
    '/api/embed',
    '/api/fetch-jobs',
    '/api/score-batch',
    '/api/jobs/:path*',
    '/api/pipeline/run',
    '/api/rescore-jobs',
    '/api/generate-summaries',
    '/api/telegram/register',
    '/api/email-digest',
  ],
}

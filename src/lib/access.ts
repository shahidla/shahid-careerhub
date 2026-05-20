export const ACCESS_COOKIE_NAME = 'careerhub_access'
export const ACCESS_SESSION_MAX_AGE = 60 * 60 * 8

export function getAppAccessSecret(): string | null {
  return process.env.APP_ACCESS_PASSWORD
    ?? process.env.CHAT_ACCESS_PASSWORD
    ?? process.env.NEXT_PUBLIC_CHAT_PASSWORD
    ?? null
}

export function getCronSecret(): string | null {
  return process.env.CRON_SECRET ?? null
}

export function isValidAccessSecret(value: string | null | undefined): boolean {
  const secret = getAppAccessSecret()
  return Boolean(secret && value === secret)
}

export function isValidAuthorizationHeader(value: string | null): boolean {
  if (!value) return false

  const appSecret = getAppAccessSecret()
  if (appSecret && value === `Bearer ${appSecret}`) return true

  const cronSecret = getCronSecret()
  if (cronSecret && value === `Bearer ${cronSecret}`) return true

  return false
}

export function getInternalAuthorizationHeader(): string | null {
  const appSecret = getAppAccessSecret()
  if (appSecret) return `Bearer ${appSecret}`

  const cronSecret = getCronSecret()
  if (cronSecret) return `Bearer ${cronSecret}`

  return null
}

export function getInternalAuthHeaders(): HeadersInit {
  const authorization = getInternalAuthorizationHeader()
  return authorization ? { Authorization: authorization } : {}
}

export function normaliseNextPath(nextPath: string | null | undefined): string {
  if (!nextPath || !nextPath.startsWith('/')) return '/chat'
  if (nextPath.startsWith('//')) return '/chat'
  return nextPath
}

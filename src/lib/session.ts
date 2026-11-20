const SESSION_HINT_COOKIE = 'af_session'

let knownExpired = false
let expiredHandler: (() => void) | null = null

export function hasSessionHint(): boolean {
  return document.cookie.split('; ').some((cookie) => cookie.startsWith(SESSION_HINT_COOKIE + '='))
}

export function isSessionKnownExpired(): boolean {
  return knownExpired
}

export function markSessionStarted(): void {
  knownExpired = false
}

export function markSessionExpired(): void {
  if (knownExpired) return
  knownExpired = true
  expiredHandler?.()
}

export function onSessionExpired(handler: () => void): void {
  expiredHandler = handler
}

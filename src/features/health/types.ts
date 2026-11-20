export const CHECK_STATUS = { ok: 'ok', down: 'down' } as const

export type CheckStatus = (typeof CHECK_STATUS)[keyof typeof CHECK_STATUS]

export type Health = { status: 'ok'; checks: Record<string, CheckStatus> }

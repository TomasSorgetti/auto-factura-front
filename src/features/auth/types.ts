export const LOGIN_STEPS = { TOTP: 'totp', TOTP_SETUP: 'totp_setup' } as const

export type LoginStep = (typeof LOGIN_STEPS)[keyof typeof LOGIN_STEPS]
export type LoginInput = { email: string; password: string }
export type LoginStart = { next: LoginStep; expiresAt: string }
export type TotpSetup = { secret: string; otpauthUrl: string; qrCode: string }
export type CodeInput = { code: string }
export type EnrollResult = { recoveryCodes: string[]; sessionIssued: boolean }
export type RecoveryResult = { recoveryCodesLeft: number }
export type Me = { email: string; recoveryCodesLeft: number }

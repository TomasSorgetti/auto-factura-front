import { api } from '@/lib/api'
import type {
  CodeInput,
  EnrollResult,
  LoginInput,
  LoginStart,
  Me,
  RecoveryResult,
  TotpSetup,
} from '@/features/auth/types'

export function login(input: LoginInput) {
  return api.post<LoginStart>('/auth/login', { body: input })
}

export function setupTotp() {
  return api.post<TotpSetup>('/auth/totp/setup')
}

export function enrollTotp(input: CodeInput) {
  return api.post<EnrollResult>('/auth/totp/enroll', { body: input })
}

export function verifyTotp(input: CodeInput) {
  return api.postVoid('/auth/totp', { body: input })
}

export function verifyRecovery(input: CodeInput) {
  return api.post<RecoveryResult>('/auth/recovery', { body: input })
}

export function logout() {
  return api.postVoid('/auth/logout')
}

export function getMe(signal?: AbortSignal) {
  return api.get<Me>('/admin/me', { signal })
}

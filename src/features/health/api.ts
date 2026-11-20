import { api } from '@/lib/api'
import type { Health } from '@/features/health/types'

export function getHealth(signal?: AbortSignal) {
  return api.get<Health>('/health', { signal })
}

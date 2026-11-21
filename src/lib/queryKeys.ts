import type { ClientListParams } from '@/features/clients/types'

export const queryKeys = {
  clients: {
    all: ['clients'] as const,
    list: (params: ClientListParams) => ['clients', 'list', params] as const,
    detail: (id: string) => ['clients', 'detail', id] as const,
  },
  health: {
    all: ['health'] as const,
  },
  settings: {
    all: ['settings'] as const,
  },
  auth: {
    all: ['auth'] as const,
    me: ['auth', 'me'] as const,
  },
}

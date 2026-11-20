export const queryKeys = {
  health: {
    all: ['health'] as const,
  },
  auth: {
    all: ['auth'] as const,
    me: ['auth', 'me'] as const,
  },
}

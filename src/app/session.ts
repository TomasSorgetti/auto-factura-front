import { queryClient } from '@/app/queryClient'
import { router } from '@/app/router'
import { onSessionExpired } from '@/lib/session'

export function registerSessionExpiry(): void {
  onSessionExpired(() => {
    const next = encodeURIComponent(location.pathname + location.search)
    void router.navigate('/login?next=' + next, { replace: true }).then(() => {
      queryClient.clear()
    })
  })
}

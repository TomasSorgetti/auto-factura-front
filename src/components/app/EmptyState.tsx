import { ContactRound } from 'lucide-react'
import type { ReactNode } from 'react'

type EmptyStateProps = {
  title: string
  action?: ReactNode
}

export function EmptyState({ title, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-lg bg-card px-4 py-14 text-center">
      <span className="empty-icon"><ContactRound aria-hidden="true" /></span>
      <p className="text-sm text-muted-foreground">{title}</p>
      {action}
    </div>
  )
}

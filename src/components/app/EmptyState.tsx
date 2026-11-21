import type { ReactNode } from 'react'

type EmptyStateProps = {
  title: string
  action?: ReactNode
}

export function EmptyState({ title, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed p-8 text-center">
      <p className="text-sm text-muted-foreground">{title}</p>
      {action}
    </div>
  )
}

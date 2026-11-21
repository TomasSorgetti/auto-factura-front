import type { ReactNode } from 'react'

type PageHeaderProps = { title: string; description?: string; actions?: ReactNode }

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <header className="page-heading">
      <div><h1>{title}</h1>{description && <p>{description}</p>}</div>
      {actions}
    </header>
  )
}

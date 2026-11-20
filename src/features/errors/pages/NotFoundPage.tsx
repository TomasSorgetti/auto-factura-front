import { Link } from 'react-router'
import { Button } from '@/components/ui/button'

export function NotFoundPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">No encontramos esta página</h1>
      <p className="text-muted-foreground text-sm">Revisá la dirección o volvé al inicio.</p>
      <Button asChild>
        <Link to="/app">Ir al inicio</Link>
      </Button>
    </div>
  )
}

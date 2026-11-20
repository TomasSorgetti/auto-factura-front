import { Receipt } from 'lucide-react'
import { Outlet } from 'react-router'
import { Card, CardContent } from '@/components/ui/card'

export function AuthLayout() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-4">
      <div className="flex items-center gap-2 text-lg font-semibold">
        <Receipt className="size-5" aria-hidden="true" />
        Auto Factura
      </div>
      <Card className="w-full max-w-sm">
        <CardContent>
          <Outlet />
        </CardContent>
      </Card>
    </main>
  )
}

import { PageHeader } from '@/components/app/PageHeader'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { FiscalSettingsForm } from '@/features/settings/components/FiscalSettingsForm'
import { useSettings } from '@/features/settings/queries'
import type { ArcaEnv } from '@/features/settings/types'
import { getErrorMessage } from '@/lib/errors'

const ARCA_ENV_LABELS: Record<ArcaEnv, string> = {
  homologation: 'Homologación (pruebas)',
  production: 'Producción',
}

function FormSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} className="flex flex-col gap-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-9 w-full" />
        </div>
      ))}
    </div>
  )
}

export function SettingsPage() {
  const { data, error, isPending, refetch } = useSettings()

  return (
    <>
      <PageHeader title="Configuración" description="Tus datos fiscales para emitir facturas" />
      <Card>
        <CardHeader>
          <CardTitle>Entorno de ARCA</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-start gap-2">
          {data ? (
            <Badge variant={data.arcaEnv === 'production' ? 'default' : 'secondary'}>
              {ARCA_ENV_LABELS[data.arcaEnv]}
            </Badge>
          ) : (
            <Skeleton className="h-5 w-40" />
          )}
          <p className="text-sm text-muted-foreground">
            Se cambia desde la consola con <code>cmd/admin set-arca-env</code>.
          </p>
        </CardContent>
      </Card>
      {isPending && <FormSkeleton />}
      {error && (
        <Alert variant="destructive">
          <AlertDescription className="flex flex-col items-start gap-3">
            {getErrorMessage(error)}
            <Button variant="outline" size="sm" onClick={() => void refetch()}>
              Reintentar
            </Button>
          </AlertDescription>
        </Alert>
      )}
      {data === null && (
        <Alert>
          <AlertDescription>Todavía no cargaste tus datos fiscales. Los necesitás para emitir facturas.</AlertDescription>
        </Alert>
      )}
      {data !== undefined && <FiscalSettingsForm settings={data} />}
    </>
  )
}

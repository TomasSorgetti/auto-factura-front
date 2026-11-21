import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ApiError } from '@/lib/api'
import { API_ERROR_CODES, getErrorMessage } from '@/lib/errors'
import { CHECK_STATUS } from '@/features/health/types'
import type { CheckStatus } from '@/features/health/types'
import { useHealth } from '@/features/health/queries'

const CHECK_LABELS: Record<string, string> = {
  postgres: 'Base de datos',
  redis: 'Redis',
}

function CheckRow({ name, status }: { name: string; status: CheckStatus }) {
  const isDown = status === CHECK_STATUS.down
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm">{CHECK_LABELS[name] ?? name}</span>
      <Badge variant={isDown ? 'destructive' : 'secondary'}>{isDown ? 'Caído' : 'Funcionando'}</Badge>
    </div>
  )
}

export function SystemStatusCard() {
  const { data, error, isPending, refetch } = useHealth()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estado del sistema</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {isPending && (
          <>
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-24" />
          </>
        )}
        {data &&
          Object.keys(data.checks).map((name) => <CheckRow key={name} name={name} status={CHECK_STATUS.ok} />)}
        {error instanceof ApiError && error.code === API_ERROR_CODES.SERVICE_NOT_READY ? (
          Object.entries(error.fields).map(([name, value]) => (
            <CheckRow key={name} name={name} status={value === CHECK_STATUS.down ? CHECK_STATUS.down : CHECK_STATUS.ok} />
          ))
        ) : error ? (
          <div className="flex flex-col items-start gap-3">
            <p className="text-sm">{getErrorMessage(error)}</p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Reintentar
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { formatDate } from '@/lib/date'
import { formatARS } from '@/lib/money'
import { OPEN_QUOTES, UPCOMING_RUNS } from '@/features/dashboard/mock'
import { QUOTE_STATUS } from '@/features/dashboard/types'
import type { QuoteStatus } from '@/features/dashboard/types'

const QUOTE_LABEL: Record<QuoteStatus, string> = {
  [QUOTE_STATUS.sent]: 'Sin respuesta',
  [QUOTE_STATUS.approved]: 'Aprobado sin facturar',
}

export function UpcomingCard() {
  const expectedCents = UPCOMING_RUNS.reduce((total, run) => total + run.amountCents, 0)
  return (
    <Card>
      <CardHeader>
        <CardTitle>Qué viene</CardTitle>
        <CardDescription>
          Ingreso esperado en 30 días: <span className="font-medium text-foreground tabular-nums">{formatARS(expectedCents)}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <section aria-labelledby="runs-title" className="flex flex-col gap-3">
          <h3 id="runs-title" className="text-sm font-medium">
            Próximas facturas recurrentes
          </h3>
          <ul className="flex flex-col gap-2">
            {UPCOMING_RUNS.map((run) => (
              <li key={run.id} className="flex items-center justify-between gap-2 text-sm">
                <span className="flex flex-col">
                  <span>{run.client}</span>
                  <span className="text-xs text-muted-foreground tabular-nums">{formatDate(run.date)}</span>
                </span>
                <span className="font-medium tabular-nums">{formatARS(run.amountCents)}</span>
              </li>
            ))}
          </ul>
        </section>
        <Separator />
        <section aria-labelledby="quotes-title" className="flex flex-col gap-3">
          <h3 id="quotes-title" className="text-sm font-medium">
            Presupuestos abiertos
          </h3>
          <ul className="flex flex-col gap-2">
            {OPEN_QUOTES.map((quote) => (
              <li key={quote.id} className="flex items-center justify-between gap-2 text-sm">
                <span className="flex flex-col items-start gap-1">
                  <span>{quote.client}</span>
                  <Badge variant="secondary">{QUOTE_LABEL[quote.status]}</Badge>
                </span>
                <span className="font-medium tabular-nums">{formatARS(quote.amountCents)}</span>
              </li>
            ))}
          </ul>
        </section>
      </CardContent>
    </Card>
  )
}

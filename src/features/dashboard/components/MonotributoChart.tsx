import { CartesianGrid, Line, LineChart, ReferenceLine, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import type { ChartConfig } from '@/components/ui/chart'
import { formatARS } from '@/lib/money'
import {
  MONOTRIBUTO_CAP_CENTS,
  MONOTRIBUTO_NEXT_CAP_CENTS,
  MONOTRIBUTO_SERIES,
  MONOTRIBUTO_USED_CENTS,
} from '@/features/dashboard/mock'

const config = {
  accumulatedCents: { label: 'Facturación acumulada', color: 'var(--chart-5)' },
  projectedCents: { label: 'Proyección', color: 'var(--chart-2)' },
} satisfies ChartConfig

const compact = new Intl.NumberFormat('es-AR', { notation: 'compact', maximumFractionDigits: 1 })

export function MonotributoChart() {
  const percent = Math.round((MONOTRIBUTO_USED_CENTS / MONOTRIBUTO_CAP_CENTS) * 100)
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tope del monotributo</CardTitle>
        <CardDescription>
          Facturación de los últimos 12 meses y proyección según tus reglas recurrentes.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between text-sm">
            <span className="font-medium tabular-nums">{formatARS(MONOTRIBUTO_USED_CENTS)}</span>
            <span className="text-muted-foreground tabular-nums">de {formatARS(MONOTRIBUTO_CAP_CENTS)} · {percent}%</span>
          </div>
          <Progress className="[&>[data-slot=progress-indicator]]:bg-chart-5" value={percent} aria-label="Porcentaje del tope usado" />
        </div>
        <ChartContainer config={config} className="aspect-auto h-64 w-full">
          <LineChart data={MONOTRIBUTO_SERIES} margin={{ left: 4, right: 12, top: 8 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis
              width={48}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value: number) => compact.format(value / 100)}
              domain={[0, Math.round(MONOTRIBUTO_NEXT_CAP_CENTS * 1.1)]}
            />
            <ChartTooltip
              content={<ChartTooltipContent formatter={(value) => formatARS(Number(value))} />}
            />
            <ReferenceLine y={MONOTRIBUTO_CAP_CENTS} stroke="var(--destructive)" label={{ value: 'Tu tope', position: 'insideTopLeft', fontSize: 11 }} />
            <ReferenceLine
              y={MONOTRIBUTO_NEXT_CAP_CENTS}
              stroke="var(--chart-2)"
              strokeDasharray="4 4"
              label={{ value: 'Categoría siguiente', position: 'insideBottomLeft', fontSize: 11 }}
            />
            <Line dataKey="accumulatedCents" type="monotone" stroke="var(--color-accumulatedCents)" strokeWidth={2} dot={false} connectNulls />
            <Line
              dataKey="projectedCents"
              type="monotone"
              stroke="var(--color-projectedCents)"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              connectNulls
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

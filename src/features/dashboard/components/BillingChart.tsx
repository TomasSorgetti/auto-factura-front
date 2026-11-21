import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import type { ChartConfig } from '@/components/ui/chart'
import { formatARS } from '@/lib/money'
import { MONTHLY_BILLING } from '@/features/dashboard/mock'

const config = {
  invoicedCents: { label: 'Facturado', color: 'var(--chart-5)' },
  collectedCents: { label: 'Cobrado', color: 'var(--chart-2)' },
} satisfies ChartConfig

const compact = new Intl.NumberFormat('es-AR', { notation: 'compact', maximumFractionDigits: 1 })

export function BillingChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Facturado vs. cobrado</CardTitle>
        <CardDescription>Últimos 12 meses.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="aspect-auto h-64 w-full">
          <BarChart data={MONTHLY_BILLING} margin={{ left: 4, right: 4 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis width={48} tickLine={false} axisLine={false} tickFormatter={(value: number) => compact.format(value / 100)} />
            <ChartTooltip content={<ChartTooltipContent formatter={(value) => formatARS(Number(value))} />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="invoicedCents" fill="var(--color-invoicedCents)" radius={4} />
            <Bar dataKey="collectedCents" fill="var(--color-collectedCents)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

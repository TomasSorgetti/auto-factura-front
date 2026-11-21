import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import type { ChartConfig } from '@/components/ui/chart'
import { formatARS } from '@/lib/money'
import { DEBT_BUCKETS } from '@/features/dashboard/mock'

const config = {
  amountCents: { label: 'Pendiente', color: 'var(--chart-5)' },
} satisfies ChartConfig

const compact = new Intl.NumberFormat('es-AR', { notation: 'compact', maximumFractionDigits: 1 })

export function DebtAgingChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Antigüedad de la deuda</CardTitle>
        <CardDescription>Lo pendiente de cobro, por días desde el vencimiento.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="aspect-auto h-56 w-full">
          <BarChart data={DEBT_BUCKETS} margin={{ left: 4, right: 4 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="bucket" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis width={48} tickLine={false} axisLine={false} tickFormatter={(value: number) => compact.format(value / 100)} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel formatter={(value) => formatARS(Number(value))} />} />
            <Bar dataKey="amountCents" fill="var(--color-amountCents)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

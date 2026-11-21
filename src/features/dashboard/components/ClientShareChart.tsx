import { Bar, BarChart, LabelList, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import type { ChartConfig } from '@/components/ui/chart'
import { CLIENT_SHARES } from '@/features/dashboard/mock'

const config = {
  percent: { label: 'Ingresos', color: 'var(--chart-5)' },
} satisfies ChartConfig

export function ClientShareChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Concentración por cliente</CardTitle>
        <CardDescription>Porcentaje de tus ingresos de los últimos 12 meses.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="aspect-auto h-56 w-full">
          <BarChart data={CLIENT_SHARES} layout="vertical" margin={{ left: 0, right: 36 }}>
            <YAxis dataKey="client" type="category" tickLine={false} axisLine={false} width={104} />
            <XAxis type="number" hide domain={[0, 100]} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel formatter={(value) => `${value}%`} />} />
            <Bar dataKey="percent" fill="var(--color-percent)" radius={4}>
              <LabelList dataKey="percent" position="right" offset={8} className="fill-foreground" fontSize={12} formatter={(value) => `${value}%`} />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

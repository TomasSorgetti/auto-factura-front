import { useId, useState } from 'react'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatARS } from '@/lib/money'
import { MONTHLY_BILLING } from '../mock'

const config = {
  invoicedCents: { label: 'Facturado', color: 'var(--chart-1)' },
  collectedCents: { label: 'Cobrado', color: 'var(--chart-3)' },
} satisfies ChartConfig

export function BillingChart() {
  const [months, setMonths] = useState('6')
  const gradient = useId()
  return (
    <section className="panel income-panel">
      <div className="panel-heading">
        <div>
          <h2>Evolución de ingresos</h2>
          <p>Facturación y cobros por mes</p>
        </div>
        <Select value={months} onValueChange={setMonths}>
          <SelectTrigger size="sm" aria-label="Período del gráfico">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {['3', '6', '12'].map((n) => (
              <SelectItem key={n} value={n}>
                {n} meses
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="chart-key">
        <span>Facturado</span>
        <span>Cobrado</span>
      </div>
      <ChartContainer config={config} className="aspect-auto h-[185px] min-w-0 w-full">
        <AreaChart
          data={MONTHLY_BILLING.slice(-Number(months))}
          margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1">
              <stop stopColor="var(--chart-1)" stopOpacity=".24" />
              <stop offset="1" stopColor="var(--chart-1)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} strokeDasharray="3 5" />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={9} fontSize={11} />
          <YAxis
            width={52}
            domain={[80000000, 130000000]}
            ticks={[80000000, 95000000, 110000000, 125000000]}
            tickLine={false}
            axisLine={false}
            fontSize={10}
            tickFormatter={(v: number) => (v / 100000000).toLocaleString('es-AR') + ' M'}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value, name) => (
                  <span>
                    {config[name as keyof typeof config].label} · {formatARS(Number(value))}
                  </span>
                )}
              />
            }
          />
          <Area
            type="monotone"
            dataKey="invoicedCents"
            stroke="var(--chart-1)"
            fill={`url(#${gradient})`}
            strokeWidth={2.5}
            isAnimationActive={false}
          />
          <Area
            type="monotone"
            dataKey="collectedCents"
            stroke="var(--chart-3)"
            strokeDasharray="5 5"
            fill="none"
            strokeWidth={1.8}
            isAnimationActive={false}
          />
        </AreaChart>
      </ChartContainer>
    </section>
  )
}

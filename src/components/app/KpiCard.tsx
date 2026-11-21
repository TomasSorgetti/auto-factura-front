import { TrendingDown, TrendingUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { formatARS } from '@/lib/money'

type KpiCardProps = {
  label: string
  valueCents: number
  hint: string
  trend?: { percent: number; direction: 'up' | 'down' }
}

export function KpiCard({ label, valueCents, hint, trend }: KpiCardProps) {
  const TrendIcon = trend?.direction === 'down' ? TrendingDown : TrendingUp
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {formatARS(valueCents)}
        </CardTitle>
      </CardHeader>
      <CardFooter className="gap-2 text-sm text-muted-foreground">
        {trend && (
          <Badge variant="outline">
            <TrendIcon className="size-3" aria-hidden="true" />
            {trend.direction === 'down' ? '-' : '+'}
            {trend.percent}%
          </Badge>
        )}
        {hint}
      </CardFooter>
    </Card>
  )
}

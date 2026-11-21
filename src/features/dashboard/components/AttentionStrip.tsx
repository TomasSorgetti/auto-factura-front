import { AlertTriangle, ArrowRight, CheckCircle2, Info, OctagonAlert } from 'lucide-react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { ALERT_TONE } from '@/features/dashboard/types'
import type { AlertTone, AttentionAlert } from '@/features/dashboard/types'

const TONE_ICON = {
  [ALERT_TONE.danger]: OctagonAlert,
  [ALERT_TONE.warning]: AlertTriangle,
  [ALERT_TONE.info]: Info,
} as const satisfies Record<AlertTone, typeof Info>

const TONE_STYLE: Record<AlertTone, string> = {
  [ALERT_TONE.danger]: 'bg-destructive/10 text-destructive',
  [ALERT_TONE.warning]: 'bg-muted text-foreground',
  [ALERT_TONE.info]: 'bg-muted text-muted-foreground',
}

type AttentionStripProps = {
  alerts: AttentionAlert[]
}

export function AttentionStrip({ alerts }: AttentionStripProps) {
  if (alerts.length === 0) {
    return (
      <div className="flex items-center gap-2 rounded-lg border bg-card px-4 py-3 text-sm text-muted-foreground">
        <CheckCircle2 className="size-4" aria-hidden="true" />
        Todo al día
      </div>
    )
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Requiere tu atención</CardTitle>
        <CardDescription>Lo que conviene resolver hoy.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="grid gap-3 md:grid-cols-2">
          {alerts.map((alert) => {
            const Icon = TONE_ICON[alert.tone]
            return (
              <li key={alert.id}>
                <Link
                  to={alert.to}
                  className="group flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  <span className={cn('flex size-8 shrink-0 items-center justify-center rounded-md', TONE_STYLE[alert.tone])}>
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="text-sm font-medium">{alert.title}</span>
                    <span className="text-sm text-muted-foreground">{alert.detail}</span>
                  </span>
                  <Button asChild variant="ghost" size="xs" className="shrink-0 self-center">
                    <span>
                      {alert.actionLabel}
                      <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                    </span>
                  </Button>
                </Link>
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  )
}

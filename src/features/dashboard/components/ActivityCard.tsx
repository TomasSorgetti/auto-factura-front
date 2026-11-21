import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ACTIVITY } from '@/features/dashboard/mock'

export function ActivityCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Actividad reciente</CardTitle>
        <CardDescription>Lo que hizo el sistema por vos.</CardDescription>
      </CardHeader>
      <CardContent>
        <ol className="flex flex-col">
          {ACTIVITY.map((event, index) => (
            <li key={event.id} className="relative flex gap-3 pb-4 last:pb-0">
              {index < ACTIVITY.length - 1 && (
                <span className="absolute top-3 left-1 h-full w-px bg-border" aria-hidden="true" />
              )}
              <span className="mt-1.5 size-2 shrink-0 rounded-full bg-foreground" aria-hidden="true" />
              <div className="flex flex-col">
                <span className="text-sm">{event.text}</span>
                <span className="text-xs text-muted-foreground">{event.when}</span>
              </div>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  )
}

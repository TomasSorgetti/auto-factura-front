import { ArrowDown, ArrowUp, Banknote, LogIn, ReceiptText, Send, Zap } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ACTIVITY } from '@/features/dashboard/mock'
import type { ActivityEvent } from '@/features/dashboard/types'

const eventIcons = {
  invoice: ReceiptText,
  portal: LogIn,
  payment: Banknote,
  quote: Send,
  automation: Zap,
} satisfies Record<ActivityEvent['kind'], typeof ReceiptText>

function ActivityIllustration() {
  return (
    <div className="activity-art" aria-hidden="true">
      <div className="activity-reel">
        {[0, 1].map((copy) => (
          <div key={copy}>
            {Object.entries(eventIcons).map(([kind, Icon]) => {
              return (
                <div key={kind} className="activity-slip" data-kind={kind}>
                  <Icon />
                  <span className="activity-slip-lines" />
                  <i />
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

export function ActivityCard() {
  const listId = useId()
  const listRef = useRef<HTMLOListElement>(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  useEffect(() => {
    const list = listRef.current
    if (!list) return

    const syncEdges = () => {
      setAtStart(list.scrollTop <= 1)
      setAtEnd(list.scrollTop + list.clientHeight >= list.scrollHeight - 1)
    }

    const observer = new ResizeObserver(syncEdges)
    observer.observe(list)
    const rowObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const row = entry.target as HTMLLIElement
        const clippedAtTop = entry.boundingClientRect.top < (entry.rootBounds?.top ?? 0)
        const offset = (1 - entry.intersectionRatio) * (clippedAtTop ? -10 : 10)
        row.style.setProperty('--event-opacity', String(entry.intersectionRatio))
        row.style.setProperty('--event-offset', `${offset}px`)
      }
    }, { root: list, threshold: Array.from({ length: 21 }, (_, i) => i / 20) })
    for (const row of list.children) rowObserver.observe(row)
    list.addEventListener('scroll', syncEdges, { passive: true })
    return () => {
      observer.disconnect()
      rowObserver.disconnect()
      list.removeEventListener('scroll', syncEdges)
    }
  }, [])

  function scrollEvent(direction: 'up' | 'down') {
    const list = listRef.current
    if (!list) return
    const rows = Array.from(list.querySelectorAll('li'))
    const target =
      direction === 'down'
        ? rows.find((row) => row.offsetTop > list.scrollTop + 1)
        : rows.reverse().find((row) => row.offsetTop < list.scrollTop - 1)
    if (target) list.scrollTo({ top: target.offsetTop })
  }

  return (
    <Card className="activity-card">
      <CardHeader>
        <CardTitle>Actividad reciente</CardTitle>
        <CardDescription>Lo que hizo el sistema por vos.</CardDescription>
      </CardHeader>
      <CardContent className="activity-body">
        <div className="min-w-0">
          <ol
            ref={listRef}
            id={listId}
            tabIndex={0}
            aria-label="Historial de actividad"
            className="activity-history"
            data-at-start={atStart}
            data-at-end={atEnd}
          >
            {ACTIVITY.map((event, index) => (
              <li key={event.id} data-kind={event.kind} className="relative pb-4 last:pb-0">
                {index < ACTIVITY.length - 1 && (
                  <span className="absolute top-3 left-1 h-full w-px bg-border" aria-hidden="true" />
                )}
                <div className="activity-event flex gap-3">
                  <span className="mt-1.5 size-2 shrink-0 rounded-full bg-(--event-color)" aria-hidden="true" />
                  <div className="flex flex-col">
                    <span className="text-sm">{event.text}</span>
                    <span className="text-xs text-muted-foreground">{event.when}</span>
                  </div>
                </div>
              </li>
            ))}
          </ol>
          {!(atStart && atEnd) && (
            <div className="activity-navigation">
              <span>{ACTIVITY.length} eventos</span>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Ver un evento más reciente"
                aria-controls={listId}
                disabled={atStart}
                onClick={() => scrollEvent('up')}
              >
                <ArrowUp aria-hidden="true" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                aria-controls={listId}
                disabled={atEnd}
                onClick={() => scrollEvent('down')}
              >
                Ver anteriores <ArrowDown aria-hidden="true" />
              </Button>
            </div>
          )}
        </div>
        <ActivityIllustration />
      </CardContent>
    </Card>
  )
}

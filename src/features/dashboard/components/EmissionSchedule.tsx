import { CalendarDays } from 'lucide-react'
import { formatWholeARS } from '@/lib/money'
import { UPCOMING_RUNS } from '../mock'

const month = new Intl.DateTimeFormat('es-AR', { month: 'short', timeZone: 'UTC' })

export function EmissionSchedule() {
  return (
    <section className="panel schedule-panel">
      <div className="panel-heading">
        <div>
          <h2>Próximas emisiones</h2>
          <p>Agenda de facturación recurrente</p>
        </div>
        <CalendarDays className="panel-icon" aria-hidden="true" />
      </div>
      <ul>
        {UPCOMING_RUNS.map((run) => (
          <li key={run.id}>
            <time dateTime={run.date}>
              <strong>{run.date.slice(-2)}</strong>
              <small>{month.format(new Date(run.date)).replace('.', '')}</small>
            </time>
            <span>{run.client}</span>
            <strong>{formatWholeARS(run.amountCents)}</strong>
          </li>
        ))}
      </ul>
    </section>
  )
}

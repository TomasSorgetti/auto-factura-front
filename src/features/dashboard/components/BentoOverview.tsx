import {
  ArrowUpRight,
  CalendarDays,
  FileText,
  Gauge,
  Mail,
  ReceiptText,
  TrendingUp,
  Workflow,
  Zap,
} from 'lucide-react'
import { useId, type ReactNode } from 'react'
import { InvoiceIllustration } from '@/components/app/InvoiceIllustration'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ClientShareChart } from './ClientShareChart'
import { DebtAgingChart } from './DebtAgingChart'
import { MonotributoChart } from './MonotributoChart'
import { UpcomingCard } from './UpcomingCard'
import { MONOTRIBUTO_CAP_CENTS, MONOTRIBUTO_USED_CENTS, MONTHLY_BILLING, UPCOMING_RUNS } from '../mock'
import { formatWholeARS } from '@/lib/money'

function Circuit() {
  return (
    <svg className="circuit-art" viewBox="0 0 240 112" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1.25">
        <path d="M-8 56h111M131 56h15q10 0 10-10v-9q0-9 10-9h77M131 56h15q10 0 10 10v9q0 9 10 9h77" />
        <path className="circuit-signal" d="M44 56h62m27 0h13q10 0 10-10v-9q0-9 10-9h19" />
      </g>
      <g className="circuit-node">
        <rect x="20" y="39" width="35" height="34" rx="8" />
        <CalendarDays x="29" y="47" width="17" height="17" />
        <rect x="181" y="11" width="35" height="34" rx="8" />
        <FileText x="190" y="19" width="17" height="17" />
        <rect x="181" y="67" width="35" height="34" rx="8" />
        <Mail x="190" y="76" width="17" height="17" />
      </g>
      <rect x="90" y="29" width="54" height="54" rx="14" className="circuit-halo" />
      <rect x="95" y="34" width="44" height="44" rx="10" className="circuit-core" />
      <Zap x="106" y="44" width="22" height="24" className="circuit-bolt" />
    </svg>
  )
}

function TaxMeter({ percent }: { percent: number }) {
  const id = useId()
  const activeTicks = Math.round((percent * 43) / 100)
  return (
    <svg className="tax-art" viewBox="0 0 210 120" aria-hidden="true">
      <defs>
        <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="24" x2="37">
          <stop stopColor="#43946d" />
          <stop offset="1" stopColor="#8fe7ad" />
        </linearGradient>
      </defs>
      <g strokeWidth="3.3">
        {Array.from({ length: 43 }, (_, i) => (
          <path
            key={i}
            d="M24 98h13"
            transform={`rotate(${(i * 180) / 42} 105 98)`}
            className={i < activeTicks ? 'meter-active' : undefined}
            style={{ animationDelay: `${i * 14}ms` }}
            stroke={i < activeTicks ? `url(#${id})` : 'var(--meter-idle)'}
          />
        ))}
      </g>
      <path d="M43 98a62 62 0 0 1 124 0" fill="none" stroke="var(--meter-idle)" strokeDasharray="2 4" />
      <text x="105" y="87" textAnchor="middle" className="meter-value">
        {percent}
        <tspan fontSize="14">%</tspan>
      </text>
      <text x="105" y="103" textAnchor="middle" className="meter-label">
        DEL TOPE
      </text>
    </svg>
  )
}

function DetailTile({
  label,
  className,
  face,
  children,
}: {
  label: string
  className: string
  face: ReactNode
  children: ReactNode
}) {
  const summaryId = useId()
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label={`Ver detalle de ${label.toLowerCase()}`}
          aria-describedby={summaryId}
          className={`overview-tile ${className}`}
        >
          <span id={summaryId} className="contents">
            {face}
          </span>
          <ArrowUpRight className="tile-arrow" aria-hidden="true" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[85svh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{label}</DialogTitle>
          <DialogDescription>Datos de ejemplo · Noviembre de 2026</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
}

export function BentoOverview() {
  const current = MONTHLY_BILLING[MONTHLY_BILLING.length - 1]
  const previous = MONTHLY_BILLING[MONTHLY_BILLING.length - 2]
  const change = ((current.invoicedCents / previous.invoicedCents - 1) * 100).toLocaleString('es-AR', {
    maximumFractionDigits: 1,
  })
  const percent = Math.round((100 * MONOTRIBUTO_USED_CENTS) / MONOTRIBUTO_CAP_CENTS)
  return (
    <section className="overview-grid" aria-label="Resumen del mes con datos de ejemplo">
      <DetailTile
        label="Facturación"
        className="billing-tile"
        face={
          <>
            <span className="tile-title">
              <ReceiptText />
              Facturación del mes
            </span>
            <span className="billing-total">{formatWholeARS(current.invoicedCents)}</span>
            <span className="billing-change">
              <span>
                <TrendingUp />
                {change}%
              </span>{' '}
              vs. octubre
            </span>
            <InvoiceIllustration />
            <span className="billing-breakdown">
              <span>
                <small>Cobrado</small>
                <strong>{formatWholeARS(current.collectedCents)}</strong>
              </span>
              <span>
                <small>Por cobrar</small>
                <strong>{formatWholeARS(current.invoicedCents - current.collectedCents)}</strong>
              </span>
            </span>
          </>
        }
      >
        <ClientShareChart />
        <DebtAgingChart />
      </DetailTile>
      <DetailTile
        label="Automatizaciones"
        className="automation-tile"
        face={
          <>
            <span className="tile-title">
              <Workflow />
              Automatizaciones
            </span>
            <span className="tile-description">Emisiones recurrentes</span>
            <Circuit />
            <span className="tile-caption">
              <i />
              {UPCOMING_RUNS.length} programadas
            </span>
          </>
        }
      >
        <UpcomingCard />
      </DetailTile>
      <DetailTile
        label="Monotributo"
        className="tax-tile"
        face={
          <>
            <span className="tile-title">
              <Gauge />
              Monotributo
            </span>
            <span className="tile-description">Facturación acumulada</span>
            <TaxMeter percent={percent} />
            <span className="sr-only">{percent}% del tope usado.</span>
            <span className="tile-caption">Categoría C</span>
          </>
        }
      >
        <MonotributoChart />
      </DetailTile>
    </section>
  )
}

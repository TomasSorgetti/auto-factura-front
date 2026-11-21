import type {
  ActivityEvent,
  AttentionAlert,
  ClientShare,
  DebtBucket,
  Kpi,
  MonotributoPoint,
  MonthlyBilling,
  OpenQuote,
  UpcomingRun,
} from '@/features/dashboard/types'
import { ALERT_TONE, QUOTE_STATUS } from '@/features/dashboard/types'

export const MONOTRIBUTO_CAP_CENTS = 1_880_000_000
export const MONOTRIBUTO_NEXT_CAP_CENTS = 2_350_000_000
export const MONOTRIBUTO_USED_CENTS = 1_203_200_000

export const ALERTS: AttentionAlert[] = [
  {
    id: 'review',
    tone: ALERT_TONE.warning,
    title: '2 facturas esperan tu OK',
    detail: 'Se emiten solas en 1 h 20 min si no las revisás.',
    actionLabel: 'Revisar',
    to: '/app',
  },
  {
    id: 'error',
    tone: ALERT_TONE.danger,
    title: '1 factura rechazada por ARCA',
    detail: 'Acme S.A. · corregí el dato y reintentá.',
    actionLabel: 'Ver error',
    to: '/app',
  },
  {
    id: 'payments',
    tone: ALERT_TONE.info,
    title: '3 pagos por confirmar',
    detail: 'Los detectamos en tu casilla de mail.',
    actionLabel: 'Confirmar',
    to: '/app',
  },
  {
    id: 'cap',
    tone: ALERT_TONE.warning,
    title: 'Llevás el 64% del tope',
    detail: 'Categoría C · te avisamos al llegar al 80%.',
    actionLabel: 'Ver detalle',
    to: '/app',
  },
]

export const KPIS: Kpi[] = [
  {
    id: 'invoiced',
    label: 'Facturado este mes',
    valueCents: 120_000_000,
    hint: 'contra octubre',
    trend: { percent: 12.5, direction: 'up' },
  },
  { id: 'pending', label: 'Pendiente de cobro', valueCents: 30_000_000, hint: '4 facturas' },
  { id: 'overdue', label: 'Vencido', valueCents: 10_000_000, hint: '12 días de atraso promedio' },
  { id: 'cap', label: 'Te queda del tope', valueCents: 676_800_000, hint: '64% usado en 12 meses' },
]

export const MONOTRIBUTO_SERIES: MonotributoPoint[] = [
  { month: 'Dic', accumulatedCents: 690_000_000, projectedCents: null },
  { month: 'Ene', accumulatedCents: 742_000_000, projectedCents: null },
  { month: 'Feb', accumulatedCents: 801_000_000, projectedCents: null },
  { month: 'Mar', accumulatedCents: 868_000_000, projectedCents: null },
  { month: 'Abr', accumulatedCents: 921_000_000, projectedCents: null },
  { month: 'May', accumulatedCents: 986_000_000, projectedCents: null },
  { month: 'Jun', accumulatedCents: 1_031_000_000, projectedCents: null },
  { month: 'Jul', accumulatedCents: 1_088_000_000, projectedCents: null },
  { month: 'Ago', accumulatedCents: 1_121_000_000, projectedCents: null },
  { month: 'Sep', accumulatedCents: 1_152_000_000, projectedCents: null },
  { month: 'Oct', accumulatedCents: 1_180_000_000, projectedCents: null },
  { month: 'Nov', accumulatedCents: 1_203_200_000, projectedCents: 1_203_200_000 },
  { month: 'Dic', accumulatedCents: null, projectedCents: 1_262_000_000 },
  { month: 'Ene', accumulatedCents: null, projectedCents: 1_318_000_000 },
  { month: 'Feb', accumulatedCents: null, projectedCents: 1_371_000_000 },
  { month: 'Mar', accumulatedCents: null, projectedCents: 1_425_000_000 },
]

export const MONTHLY_BILLING: MonthlyBilling[] = [
  { month: 'Dic', invoicedCents: 98_000_000, collectedCents: 92_000_000 },
  { month: 'Ene', invoicedCents: 104_000_000, collectedCents: 99_000_000 },
  { month: 'Feb', invoicedCents: 112_000_000, collectedCents: 108_000_000 },
  { month: 'Mar', invoicedCents: 118_000_000, collectedCents: 110_000_000 },
  { month: 'Abr', invoicedCents: 106_000_000, collectedCents: 115_000_000 },
  { month: 'May', invoicedCents: 121_000_000, collectedCents: 104_000_000 },
  { month: 'Jun', invoicedCents: 99_000_000, collectedCents: 112_000_000 },
  { month: 'Jul', invoicedCents: 109_000_000, collectedCents: 101_000_000 },
  { month: 'Ago', invoicedCents: 95_000_000, collectedCents: 98_000_000 },
  { month: 'Sep', invoicedCents: 101_000_000, collectedCents: 96_000_000 },
  { month: 'Oct', invoicedCents: 106_700_000, collectedCents: 99_000_000 },
  { month: 'Nov', invoicedCents: 120_000_000, collectedCents: 90_000_000 },
]

export const CLIENT_SHARES: ClientShare[] = [
  { client: 'Acme S.A.', percent: 46 },
  { client: 'Estudio Rivas', percent: 24 },
  { client: 'Lumen Studio', percent: 16 },
  { client: 'Panadería Sur', percent: 9 },
  { client: 'Otros', percent: 5 },
]

export const DEBT_BUCKETS: DebtBucket[] = [
  { bucket: '0 a 30', amountCents: 22_000_000 },
  { bucket: '31 a 60', amountCents: 5_500_000 },
  { bucket: 'Más de 60', amountCents: 12_500_000 },
]

export const UPCOMING_RUNS: UpcomingRun[] = [
  { id: 'r1', client: 'Acme S.A.', date: '2026-11-25', amountCents: 55_000_000 },
  { id: 'r2', client: 'Estudio Rivas', date: '2026-12-01', amountCents: 28_800_000 },
  { id: 'r3', client: 'Lumen Studio', date: '2026-12-05', amountCents: 19_000_000 },
  { id: 'r4', client: 'Panadería Sur', date: '2026-12-10', amountCents: 10_500_000 },
]

export const OPEN_QUOTES: OpenQuote[] = [
  { id: 'q1', client: 'Lumen Studio', status: QUOTE_STATUS.sent, amountCents: 42_000_000 },
  { id: 'q2', client: 'Acme S.A.', status: QUOTE_STATUS.approved, amountCents: 75_000_000 },
]

export const ACTIVITY: ActivityEvent[] = [
  { id: 'a1', kind: 'invoice', text: 'Factura 0003-00000012 emitida a Acme S.A.', when: 'Hace 2 h' },
  { id: 'a2', kind: 'portal', text: 'Acme S.A. entró al portal', when: 'Hace 5 h' },
  { id: 'a3', kind: 'payment', text: 'Pago de $ 280.000,00 imputado a Estudio Rivas', when: 'Ayer' },
  { id: 'a4', kind: 'quote', text: 'Presupuesto enviado a Lumen Studio', when: 'Ayer' },
  { id: 'a5', kind: 'automation', text: 'Regla mensual de Panadería Sur ejecutada', when: '19/11/2026' },
  { id: 'a6', kind: 'payment', text: 'Pago de Lumen Studio registrado', when: '18/11/2026' },
  { id: 'a7', kind: 'invoice', text: 'Factura 0003-00000011 emitida a Estudio Rivas', when: '18/11/2026' },
  { id: 'a8', kind: 'quote', text: 'Presupuesto enviado a Panadería Sur', when: '17/11/2026' },
  { id: 'a9', kind: 'portal', text: 'Estudio Rivas consultó sus comprobantes', when: '16/11/2026' },
  { id: 'a10', kind: 'automation', text: 'Recordatorio de cobro enviado a Acme S.A.', when: '15/11/2026' },
  { id: 'a11', kind: 'payment', text: 'Pago de Panadería Sur registrado', when: '14/11/2026' },
  { id: 'a12', kind: 'invoice', text: 'Factura 0003-00000010 emitida a Lumen Studio', when: '13/11/2026' },
]

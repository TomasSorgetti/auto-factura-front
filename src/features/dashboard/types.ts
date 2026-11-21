export const ALERT_TONE = {
  danger: 'danger',
  warning: 'warning',
  info: 'info',
} as const

export type AlertTone = (typeof ALERT_TONE)[keyof typeof ALERT_TONE]

export type AttentionAlert = {
  id: string
  tone: AlertTone
  title: string
  detail: string
  actionLabel: string
  to: string
}

export type Kpi = {
  id: string
  label: string
  valueCents: number
  hint: string
  trend?: { percent: number; direction: 'up' | 'down' }
}

export type MonotributoPoint = {
  month: string
  accumulatedCents: number | null
  projectedCents: number | null
}

export type MonthlyBilling = {
  month: string
  invoicedCents: number
  collectedCents: number
}

export type ClientShare = {
  client: string
  percent: number
}

export type DebtBucket = {
  bucket: string
  amountCents: number
}

export type UpcomingRun = {
  id: string
  client: string
  date: string
  amountCents: number
}

export const QUOTE_STATUS = {
  sent: 'sent',
  approved: 'approved',
} as const

export type QuoteStatus = (typeof QUOTE_STATUS)[keyof typeof QUOTE_STATUS]

export type OpenQuote = {
  id: string
  client: string
  status: QuoteStatus
  amountCents: number
}

export type ActivityEvent = {
  id: string
  text: string
  when: string
}

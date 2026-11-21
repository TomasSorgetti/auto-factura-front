export const MONOTRIBUTO_CATEGORIES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'] as const
export type MonotributoCategory = (typeof MONOTRIBUTO_CATEGORIES)[number]
export type ArcaEnv = 'homologation' | 'production'

export type FiscalSettingsInput = {
  cuit: string
  legalName: string
  address: string
  grossIncomeNumber: string
  activityStartDate: string
  pointOfSale: number
  monotributoCategory: MonotributoCategory
  annualCapCents: number
}

export type FiscalSettings = FiscalSettingsInput & { arcaEnv: ArcaEnv; updatedAt: string }

import { z } from 'zod'
import { isValidCUIT, normalizeCUIT } from '@/lib/cuit'
import { parseARSToCents } from '@/lib/money'
import { MONOTRIBUTO_CATEGORIES } from '@/features/settings/types'

function todayISO(): string {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${String(now.getFullYear())}-${month}-${day}`
}

export const fiscalSettingsSchema = z.object({
  cuit: z.string().refine((v) => isValidCUIT(normalizeCUIT(v)), 'Revisá el CUIT: el dígito verificador no coincide.'),
  legalName: z.string().trim().min(1, 'Completá tu nombre o razón social.'),
  address: z.string().trim().min(1, 'Completá tu domicilio fiscal.'),
  grossIncomeNumber: z.string().trim().min(1, 'Completá tu número de Ingresos Brutos o "Exento".'),
  activityStartDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Completá la fecha de inicio de actividades.')
    .refine((v) => v <= todayISO(), 'La fecha no puede ser futura.'),
  pointOfSale: z
    .string()
    .regex(/^\d{1,5}$/, 'Tiene que ser un número entre 1 y 99999.')
    .refine((v) => Number(v) >= 1, 'Tiene que ser un número entre 1 y 99999.'),
  monotributoCategory: z.string().pipe(z.enum(MONOTRIBUTO_CATEGORIES, 'Elegí tu categoría.')),
  annualCap: z
    .string()
    .refine((v) => (parseARSToCents(v) ?? 0) > 0, 'Escribí el tope en pesos, por ejemplo 25.000.000,00.'),
})

export type FiscalSettingsValues = z.input<typeof fiscalSettingsSchema>
export type FiscalSettingsField = keyof FiscalSettingsValues

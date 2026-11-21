import { z } from 'zod'
import { isValidCUIT, normalizeCUIT } from '@/lib/cuit'
import { TAX_CONDITIONS } from '@/features/clients/types'

export const clientSchema = z.object({
  legalName: z.string().trim().min(1, 'Completá la razón social.').max(200, 'Máximo 200 caracteres.'),
  cuit: z.string().refine((v) => isValidCUIT(normalizeCUIT(v)), 'Revisá el CUIT: el dígito verificador no coincide.'),
  taxCondition: z.string().pipe(z.enum(TAX_CONDITIONS, 'Elegí la condición frente al IVA.')),
  address: z.string().trim().min(1, 'Completá el domicilio.').max(300, 'Máximo 300 caracteres.'),
  notes: z.string().trim().max(2000, 'Máximo 2000 caracteres.'),
})

export type ClientFormValues = z.input<typeof clientSchema>
export type ClientFormField = keyof ClientFormValues

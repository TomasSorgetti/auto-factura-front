import { z } from 'zod'

export const credentialsSchema = z.object({
  email: z.string().trim().min(1, 'Ingresá tu email.').email('El email no es válido.'),
  password: z.string().min(1, 'Ingresá tu contraseña.'),
})
export const totpSchema = z.object({ code: z.string().regex(/^\d{6}$/, 'El código tiene 6 números.') })
export const recoverySchema = z.object({
  code: z
    .string()
    .trim()
    .regex(/^[A-Za-z2-7]{5}-?[A-Za-z2-7]{5}$/, 'El código tiene 10 caracteres, como ABCDE-FGHIJ.'),
})

export type CredentialsValues = z.infer<typeof credentialsSchema>
export type RecoveryValues = z.infer<typeof recoverySchema>

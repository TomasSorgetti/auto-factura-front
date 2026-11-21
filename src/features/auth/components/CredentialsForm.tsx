import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useLogin } from '@/features/auth/queries'
import { LoginProviders } from './LoginProviders'
import { credentialsSchema, type CredentialsValues } from '@/features/auth/schemas'
import type { LoginStep } from '@/features/auth/types'
import { ApiError } from '@/lib/api'
import { API_ERROR_CODES, getErrorMessage } from '@/lib/errors'

type CredentialsFormProps = {
  notice: string | null
  onSuccess: (next: LoginStep) => void
}

export function CredentialsForm({ notice, onSuccess }: CredentialsFormProps) {
  const login = useLogin()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CredentialsValues>({ resolver: zodResolver(credentialsSchema) })

  const submit = handleSubmit((values) => {
    login.mutate(values, {
      onSuccess: (result) => onSuccess(result.next),
      onError: (error) => {
        if (error instanceof ApiError && error.code === API_ERROR_CODES.VALIDATION_FAILED) {
          if (error.fields.email) setError('email', { message: error.fields.email })
          if (error.fields.password) setError('password', { message: error.fields.password })
        }
      },
    })
  })

  const showAlert =
    login.error !== null &&
    !(login.error instanceof ApiError && login.error.code === API_ERROR_CODES.VALIDATION_FAILED)

  return (
    <form onSubmit={(event) => void submit(event)} noValidate className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold">Ingresá a Auto Factura</h1>
      <LoginProviders />
      {notice && (
        <Alert>
          <AlertDescription>{notice}</AlertDescription>
        </Alert>
      )}
      {showAlert && (
        <Alert variant="destructive">
          <AlertDescription>{getErrorMessage(login.error)}</AlertDescription>
        </Alert>
      )}
      <FieldGroup>
        <Field data-invalid={errors.email ? true : undefined}>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            autoComplete="username"
            aria-invalid={errors.email ? true : undefined}
            {...register('email')}
          />
          <FieldError errors={[errors.email]} />
        </Field>
        <Field data-invalid={errors.password ? true : undefined}>
          <FieldLabel htmlFor="password">Contraseña</FieldLabel>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            aria-invalid={errors.password ? true : undefined}
            {...register('password')}
          />
          <FieldError errors={[errors.password]} />
        </Field>
      </FieldGroup>
      <Button type="submit" disabled={login.isPending}>
        {login.isPending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
        Ingresar
      </Button>
    </form>
  )
}

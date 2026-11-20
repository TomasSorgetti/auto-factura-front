import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { useVerifyRecovery, useVerifyTotp } from '@/features/auth/queries'
import { recoverySchema, type RecoveryValues } from '@/features/auth/schemas'
import { ApiError } from '@/lib/api'
import { API_ERROR_CODES, getErrorMessage } from '@/lib/errors'

type TotpFormProps = {
  onSuccess: () => void
  onChallengeExpired: () => void
}

export function TotpForm({ onSuccess, onChallengeExpired }: TotpFormProps) {
  const [useRecovery, setUseRecovery] = useState(false)
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-semibold">
          {useRecovery ? 'Código de recuperación' : 'Código del autenticador'}
        </h1>
        <p className="text-sm text-muted-foreground">
          {useRecovery
            ? 'Escribí uno de los códigos de recuperación que guardaste. Cada uno sirve una sola vez.'
            : 'Abrí Google Authenticator y escribí el código de 6 números.'}
        </p>
      </div>
      {useRecovery ? (
        <RecoveryCodeForm onSuccess={onSuccess} onChallengeExpired={onChallengeExpired} />
      ) : (
        <AuthenticatorCodeForm onSuccess={onSuccess} onChallengeExpired={onChallengeExpired} />
      )}
      <Button type="button" variant="link" className="h-auto p-0" onClick={() => setUseRecovery(!useRecovery)}>
        {useRecovery ? 'Usar el autenticador' : 'Usar un código de recuperación'}
      </Button>
    </div>
  )
}

function AuthenticatorCodeForm({ onSuccess, onChallengeExpired }: TotpFormProps) {
  const verify = useVerifyTotp()
  const [code, setCode] = useState('')

  function submit(value: string) {
    verify.mutate(
      { code: value },
      {
        onSuccess,
        onError: (error) => {
          setCode('')
          if (error instanceof ApiError && error.code === API_ERROR_CODES.LOGIN_CHALLENGE_INVALID) {
            toast.error(getErrorMessage(error))
            onChallengeExpired()
          }
        },
      },
    )
  }

  return (
    <Field data-invalid={verify.error ? true : undefined}>
      <FieldLabel htmlFor="totp-code">Código de 6 números</FieldLabel>
      <InputOTP
        id="totp-code"
        maxLength={6}
        value={code}
        onChange={setCode}
        onComplete={submit}
        disabled={verify.isPending}
        autoFocus
        autoComplete="one-time-code"
        inputMode="numeric"
        pattern="[0-9]*"
        aria-invalid={verify.error ? true : undefined}
      >
        <InputOTPGroup>
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <InputOTPSlot key={index} index={index} />
          ))}
        </InputOTPGroup>
      </InputOTP>
      {verify.error && <FieldError>{getErrorMessage(verify.error)}</FieldError>}
      {verify.isPending && (
        <p className="flex items-center gap-2 text-sm text-muted-foreground" role="status">
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          Verificando
        </p>
      )}
    </Field>
  )
}

function RecoveryCodeForm({ onSuccess, onChallengeExpired }: TotpFormProps) {
  const verify = useVerifyRecovery()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RecoveryValues>({ resolver: zodResolver(recoverySchema) })

  const submit = handleSubmit((values) => {
    verify.mutate(values, {
      onSuccess: (result) => {
        const left = result.recoveryCodesLeft
        const message =
          left === 1 ? 'Te queda 1 código de recuperación.' : `Te quedan ${left} códigos de recuperación.`
        if (left <= 3) toast.warning(message)
        else toast(message)
        onSuccess()
      },
      onError: (error) => {
        reset()
        if (error instanceof ApiError && error.code === API_ERROR_CODES.LOGIN_CHALLENGE_INVALID) {
          toast.error(getErrorMessage(error))
          onChallengeExpired()
        }
      },
    })
  })

  const message = errors.code?.message ?? (verify.error ? getErrorMessage(verify.error) : undefined)

  return (
    <form onSubmit={(event) => void submit(event)} noValidate className="flex flex-col gap-4">
      <Field data-invalid={message ? true : undefined}>
        <FieldLabel htmlFor="recovery-code">Código de recuperación</FieldLabel>
        <Input
          id="recovery-code"
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          className="font-mono"
          placeholder="ABCDE-FGHIJ"
          aria-invalid={message ? true : undefined}
          {...register('code')}
        />
        {message && <FieldError>{message}</FieldError>}
      </Field>
      <Button type="submit" disabled={verify.isPending}>
        {verify.isPending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
        Ingresar
      </Button>
    </form>
  )
}

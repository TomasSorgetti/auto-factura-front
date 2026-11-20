import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { CopyButton } from '@/components/app/CopyButton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { useEnrollTotp } from '@/features/auth/queries'
import type { EnrollResult, TotpSetup as TotpSetupData } from '@/features/auth/types'
import { ApiError } from '@/lib/api'
import { API_ERROR_CODES, getErrorMessage } from '@/lib/errors'

type TotpSetupProps = {
  setup: TotpSetupData | undefined
  isLoading: boolean
  error: Error | null
  onRetry: () => void
  onEnrolled: (result: EnrollResult) => void
  onChallengeExpired: () => void
}

export function TotpSetup({ setup, isLoading, error, onRetry, onEnrolled, onChallengeExpired }: TotpSetupProps) {
  const enroll = useEnrollTotp()
  const [code, setCode] = useState('')

  function submit(value: string) {
    enroll.mutate(
      { code: value },
      {
        onSuccess: onEnrolled,
        onError: (err) => {
          setCode('')
          if (err instanceof ApiError && err.code === API_ERROR_CODES.LOGIN_CHALLENGE_INVALID) {
            toast.error(getErrorMessage(err))
            onChallengeExpired()
          }
        },
      },
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-semibold">Configurá el autenticador</h1>
        <p className="text-sm text-muted-foreground">
          Tu cuenta pide un segundo paso. Escaneá este código con Google Authenticator (o cualquier app compatible).
        </p>
      </div>
      {isLoading && (
        <div className="flex justify-center py-8" role="status">
          <Loader2 className="size-6 animate-spin text-muted-foreground" aria-hidden="true" />
          <span className="sr-only">Cargando el código QR</span>
        </div>
      )}
      {error && (
        <div className="flex flex-col gap-4">
          <Alert variant="destructive">
            <AlertDescription>{getErrorMessage(error)}</AlertDescription>
          </Alert>
          <Button type="button" variant="outline" onClick={onRetry}>
            Reintentar
          </Button>
        </div>
      )}
      {setup && (
        <>
          <img
            src={setup.qrCode}
            alt="Código QR para tu app de autenticación"
            width={224}
            height={224}
            className="mx-auto size-56 rounded-md border"
          />
          <div className="flex flex-col gap-2 text-sm">
            <p>¿No podés escanear? Cargá esta clave a mano:</p>
            <div className="flex items-center gap-2">
              <code className="min-w-0 flex-1 break-all rounded-md bg-muted p-2 font-mono">
                {setup.secret.match(/.{1,4}/g)?.join(' ') ?? setup.secret}
              </code>
              <CopyButton text={setup.secret} label="Copiar clave" />
            </div>
          </div>
          <Field data-invalid={enroll.error ? true : undefined}>
            <FieldLabel htmlFor="enroll-code">Escribí el código que muestra la app</FieldLabel>
            <InputOTP
              id="enroll-code"
              maxLength={6}
              value={code}
              onChange={setCode}
              onComplete={submit}
              disabled={enroll.isPending}
              autoComplete="one-time-code"
              inputMode="numeric"
              pattern="[0-9]*"
              aria-invalid={enroll.error ? true : undefined}
            >
              <InputOTPGroup>
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <InputOTPSlot key={index} index={index} />
                ))}
              </InputOTPGroup>
            </InputOTP>
            {enroll.error && <FieldError>{getErrorMessage(enroll.error)}</FieldError>}
          </Field>
        </>
      )}
    </div>
  )
}

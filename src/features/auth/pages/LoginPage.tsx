import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { CredentialsForm } from '@/features/auth/components/CredentialsForm'
import { RecoveryCodes } from '@/features/auth/components/RecoveryCodes'
import { TotpForm } from '@/features/auth/components/TotpForm'
import { TotpSetup } from '@/features/auth/components/TotpSetup'
import { useSetupTotp } from '@/features/auth/queries'
import { LOGIN_STEPS, type EnrollResult, type LoginStep } from '@/features/auth/types'
import { queryKeys } from '@/lib/queryKeys'
import { markSessionStarted } from '@/lib/session'

type Step = 'credentials' | 'totp' | 'setup' | 'codes'

const RELOGIN_NOTICE = 'Entrá de nuevo con tu código.'

export function LoginPage() {
  const [step, setStep] = useState<Step>('credentials')
  const [enrolled, setEnrolled] = useState<EnrollResult | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const setup = useSetupTotp()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const next = searchParams.get('next')
  const safeNext = next?.startsWith('/app') ? next : '/app'

  function finish() {
    markSessionStarted()
    void queryClient.invalidateQueries({ queryKey: queryKeys.auth.all })
    void navigate(safeNext, { replace: true })
  }

  function onCredentials(nextStep: LoginStep) {
    setNotice(null)
    if (nextStep === LOGIN_STEPS.TOTP) {
      setStep('totp')
      return
    }
    setStep('setup')
    setup.mutate()
  }

  function backToCredentials() {
    setup.reset()
    setStep('credentials')
  }

  function onEnrolled(result: EnrollResult) {
    setEnrolled(result)
    setStep('codes')
  }

  function onCodesContinue() {
    if (enrolled?.sessionIssued) {
      finish()
      return
    }
    setEnrolled(null)
    setup.reset()
    setNotice(RELOGIN_NOTICE)
    setStep('credentials')
  }

  switch (step) {
    case 'credentials':
      return <CredentialsForm notice={notice} onSuccess={onCredentials} />
    case 'totp':
      return <TotpForm onSuccess={finish} onChallengeExpired={backToCredentials} />
    case 'setup':
      return (
        <TotpSetup
          setup={setup.data}
          isLoading={setup.isPending}
          error={setup.error}
          onRetry={() => setup.mutate()}
          onEnrolled={onEnrolled}
          onChallengeExpired={backToCredentials}
        />
      )
    case 'codes':
      return (
        <RecoveryCodes
          codes={enrolled?.recoveryCodes ?? []}
          continueLabel={enrolled?.sessionIssued ? 'Ir al panel' : 'Ir a ingresar'}
          onContinue={onCodesContinue}
        />
      )
  }
}

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { clientSchema, type ClientFormField, type ClientFormValues } from '@/features/clients/schemas'
import { TAX_CONDITIONS, TAX_CONDITION_LABELS, type ClientInput } from '@/features/clients/types'
import { ApiError } from '@/lib/api'
import { normalizeCUIT } from '@/lib/cuit'
import { API_ERROR_CODES, ERROR_MESSAGES, getErrorMessage } from '@/lib/errors'

const EMPTY_VALUES: ClientFormValues = {
  legalName: '',
  cuit: '',
  taxCondition: '',
  address: '',
  notes: '',
}

const FIELD_MESSAGES: Record<ClientFormField, string> = {
  legalName: 'Completá la razón social.',
  cuit: 'Revisá el CUIT: el dígito verificador no coincide.',
  taxCondition: 'Elegí la condición frente al IVA.',
  address: 'Completá el domicilio.',
  notes: 'Máximo 2000 caracteres.',
}

function isFormField(key: string): key is ClientFormField {
  return Object.hasOwn(FIELD_MESSAGES, key)
}

function toInput(values: ClientFormValues): ClientInput | null {
  const parsed = clientSchema.safeParse(values)
  if (!parsed.success) return null
  return { ...parsed.data, cuit: normalizeCUIT(parsed.data.cuit) }
}

type ClientFormProps = {
  defaultValues?: ClientFormValues
  onSubmit: (input: ClientInput) => Promise<void>
  submitLabel: string
  pending: boolean
}

export function ClientForm({ defaultValues = EMPTY_VALUES, onSubmit, submitLabel, pending }: ClientFormProps) {
  const [alertMessage, setAlertMessage] = useState<string | null>(null)
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues,
  })

  const submit = handleSubmit(async (values) => {
    const input = toInput(values)
    if (!input) return
    setAlertMessage(null)
    try {
      await onSubmit(input)
    } catch (error) {
      if (error instanceof ApiError && error.code === API_ERROR_CODES.CLIENT_CUIT_TAKEN) {
        setError('cuit', { message: ERROR_MESSAGES.CLIENT_CUIT_TAKEN })
      } else if (error instanceof ApiError && error.code === API_ERROR_CODES.VALIDATION_FAILED) {
        for (const key of Object.keys(error.fields)) {
          if (isFormField(key)) setError(key, { message: FIELD_MESSAGES[key] })
        }
      } else {
        setAlertMessage(getErrorMessage(error))
      }
    }
  })

  return (
    <form onSubmit={(event) => void submit(event)} noValidate className="flex flex-col gap-6">
      {alertMessage && (
        <Alert variant="destructive">
          <AlertDescription>{alertMessage}</AlertDescription>
        </Alert>
      )}
      <FieldGroup>
        <Field data-invalid={errors.legalName ? true : undefined}>
          <FieldLabel htmlFor="legalName">Razón social</FieldLabel>
          <Input id="legalName" aria-invalid={errors.legalName ? true : undefined} {...register('legalName')} />
          <FieldError errors={[errors.legalName]} />
        </Field>
        <Field data-invalid={errors.cuit ? true : undefined}>
          <FieldLabel htmlFor="cuit">CUIT</FieldLabel>
          <Input id="cuit" inputMode="numeric" aria-invalid={errors.cuit ? true : undefined} {...register('cuit')} />
          <FieldError errors={[errors.cuit]} />
        </Field>
        <Field data-invalid={errors.taxCondition ? true : undefined}>
          <FieldLabel htmlFor="taxCondition">Condición frente al IVA</FieldLabel>
          <Controller
            control={control}
            name="taxCondition"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  id="taxCondition"
                  className="w-full"
                  aria-invalid={errors.taxCondition ? true : undefined}
                  onBlur={field.onBlur}
                >
                  <SelectValue placeholder="Elegí la condición" />
                </SelectTrigger>
                <SelectContent>
                  {TAX_CONDITIONS.map((condition) => (
                    <SelectItem key={condition} value={condition}>
                      {TAX_CONDITION_LABELS[condition]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError errors={[errors.taxCondition]} />
        </Field>
        <Field data-invalid={errors.address ? true : undefined}>
          <FieldLabel htmlFor="address">Domicilio</FieldLabel>
          <Input id="address" aria-invalid={errors.address ? true : undefined} {...register('address')} />
          <FieldError errors={[errors.address]} />
        </Field>
        <Field data-invalid={errors.notes ? true : undefined}>
          <FieldLabel htmlFor="notes">Notas internas</FieldLabel>
          <Textarea id="notes" aria-invalid={errors.notes ? true : undefined} {...register('notes')} />
          <FieldDescription>Solo las ves vos. Se guardan cifradas.</FieldDescription>
          <FieldError errors={[errors.notes]} />
        </Field>
      </FieldGroup>
      <div>
        <Button type="submit" disabled={pending}>
          {pending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { contactSchema, type ContactFormField, type ContactFormValues } from '@/features/clients/schemas'
import { CONTACT_ROLES, CONTACT_ROLE_LABELS, type ContactInput } from '@/features/clients/types'
import { ApiError } from '@/lib/api'
import { API_ERROR_CODES, ERROR_MESSAGES, getErrorMessage } from '@/lib/errors'

const EMPTY_VALUES: ContactFormValues = { name: '', email: '', role: 'to', portalAccess: false }

const FIELD_MESSAGES: Record<ContactFormField, string> = {
  name: 'Completá el nombre.',
  email: 'Revisá el email.',
  role: 'Elegí si recibe las facturas o va en copia.',
  portalAccess: 'Revisá este dato.',
}

function isFormField(key: string): key is ContactFormField {
  return Object.hasOwn(FIELD_MESSAGES, key)
}

type ContactFormProps = {
  defaultValues?: ContactFormValues
  onSubmit: (input: ContactInput) => Promise<void>
  submitLabel: string
  pending: boolean
}

export function ContactForm({ defaultValues = EMPTY_VALUES, onSubmit, submitLabel, pending }: ContactFormProps) {
  const [alertMessage, setAlertMessage] = useState<string | null>(null)
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues,
  })

  const submit = handleSubmit(async (values) => {
    const parsed = contactSchema.safeParse(values)
    if (!parsed.success) return
    setAlertMessage(null)
    try {
      await onSubmit(parsed.data)
    } catch (error) {
      if (error instanceof ApiError && error.code === API_ERROR_CODES.CONTACT_EMAIL_TAKEN) {
        setError('email', { message: ERROR_MESSAGES.CONTACT_EMAIL_TAKEN })
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
        <Field data-invalid={errors.name ? true : undefined}>
          <FieldLabel htmlFor="contactName">Nombre</FieldLabel>
          <Input id="contactName" aria-invalid={errors.name ? true : undefined} {...register('name')} />
          <FieldError errors={[errors.name]} />
        </Field>
        <Field data-invalid={errors.email ? true : undefined}>
          <FieldLabel htmlFor="contactEmail">Email</FieldLabel>
          <Input
            id="contactEmail"
            type="email"
            autoComplete="off"
            aria-invalid={errors.email ? true : undefined}
            {...register('email')}
          />
          <FieldError errors={[errors.email]} />
        </Field>
        <Field data-invalid={errors.role ? true : undefined}>
          <FieldLabel htmlFor="contactRole">Rol</FieldLabel>
          <Controller
            control={control}
            name="role"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  id="contactRole"
                  className="w-full"
                  aria-invalid={errors.role ? true : undefined}
                  onBlur={field.onBlur}
                >
                  <SelectValue placeholder="Elegí el rol" />
                </SelectTrigger>
                <SelectContent>
                  {CONTACT_ROLES.map((role) => (
                    <SelectItem key={role} value={role}>
                      {CONTACT_ROLE_LABELS[role]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError errors={[errors.role]} />
        </Field>
        <Field orientation="horizontal">
          <Controller
            control={control}
            name="portalAccess"
            render={({ field }) => (
              <Switch id="contactPortalAccess" checked={field.value} onCheckedChange={field.onChange} />
            )}
          />
          <div className="flex flex-col gap-1">
            <FieldLabel htmlFor="contactPortalAccess">Acceso al portal</FieldLabel>
            <FieldDescription>Se usa cuando habilites el portal del cliente.</FieldDescription>
          </div>
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

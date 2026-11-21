import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useUpdateSettings } from '@/features/settings/queries'
import {
  fiscalSettingsSchema,
  type FiscalSettingsField,
  type FiscalSettingsValues,
} from '@/features/settings/schemas'
import { MONOTRIBUTO_CATEGORIES, type FiscalSettings, type FiscalSettingsInput } from '@/features/settings/types'
import { ApiError } from '@/lib/api'
import { normalizeCUIT } from '@/lib/cuit'
import { API_ERROR_CODES, getErrorMessage } from '@/lib/errors'
import { formatARS, parseARSToCents } from '@/lib/money'

const EMPTY_VALUES: FiscalSettingsValues = {
  cuit: '',
  legalName: '',
  address: '',
  grossIncomeNumber: '',
  activityStartDate: '',
  pointOfSale: '',
  monotributoCategory: '',
  annualCap: '',
}

const API_FIELD_TO_FORM: Record<string, FiscalSettingsField> = {
  cuit: 'cuit',
  legalName: 'legalName',
  address: 'address',
  grossIncomeNumber: 'grossIncomeNumber',
  activityStartDate: 'activityStartDate',
  pointOfSale: 'pointOfSale',
  monotributoCategory: 'monotributoCategory',
  annualCapCents: 'annualCap',
}

const FIELD_MESSAGES: Record<FiscalSettingsField, string> = {
  cuit: 'Revisá el CUIT: el dígito verificador no coincide.',
  legalName: 'Completá tu nombre o razón social.',
  address: 'Completá tu domicilio fiscal.',
  grossIncomeNumber: 'Completá tu número de Ingresos Brutos o "Exento".',
  activityStartDate: 'La fecha no puede ser futura.',
  pointOfSale: 'Tiene que ser un número entre 1 y 99999.',
  monotributoCategory: 'Elegí tu categoría.',
  annualCap: 'Escribí el tope en pesos, por ejemplo 25.000.000,00.',
}

function toFormValues(settings: FiscalSettings | null): FiscalSettingsValues {
  if (!settings) return EMPTY_VALUES
  return {
    cuit: settings.cuit,
    legalName: settings.legalName,
    address: settings.address,
    grossIncomeNumber: settings.grossIncomeNumber,
    activityStartDate: settings.activityStartDate,
    pointOfSale: String(settings.pointOfSale),
    monotributoCategory: settings.monotributoCategory,
    annualCap: formatARS(settings.annualCapCents),
  }
}

function toInput(values: FiscalSettingsValues): FiscalSettingsInput | null {
  const annualCapCents = parseARSToCents(values.annualCap)
  const parsed = fiscalSettingsSchema.safeParse(values)
  if (annualCapCents === null || !parsed.success) return null
  const data = parsed.data
  return {
    cuit: normalizeCUIT(data.cuit),
    legalName: data.legalName,
    address: data.address,
    grossIncomeNumber: data.grossIncomeNumber,
    activityStartDate: data.activityStartDate,
    pointOfSale: Number(data.pointOfSale),
    monotributoCategory: data.monotributoCategory,
    annualCapCents,
  }
}

type FiscalSettingsFormProps = {
  settings: FiscalSettings | null
}

export function FiscalSettingsForm({ settings }: FiscalSettingsFormProps) {
  const update = useUpdateSettings()
  const {
    register,
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isDirty },
  } = useForm<FiscalSettingsValues>({
    resolver: zodResolver(fiscalSettingsSchema),
    defaultValues: toFormValues(settings),
  })

  const submit = handleSubmit((values) => {
    const input = toInput(values)
    if (!input) return
    update.mutate(input, {
      onSuccess: (saved) => {
        reset(toFormValues(saved))
      },
      onError: (error) => {
        if (error instanceof ApiError && error.code === API_ERROR_CODES.VALIDATION_FAILED) {
          for (const key of Object.keys(error.fields)) {
            const field = API_FIELD_TO_FORM[key]
            if (field) setError(field, { message: FIELD_MESSAGES[field] })
          }
        }
      },
    })
  })

  const showAlert =
    update.error !== null &&
    !(update.error instanceof ApiError && update.error.code === API_ERROR_CODES.VALIDATION_FAILED)

  return (
    <form onSubmit={(event) => void submit(event)} noValidate className="flex flex-col gap-6">
      {showAlert && (
        <Alert variant="destructive">
          <AlertDescription>{getErrorMessage(update.error)}</AlertDescription>
        </Alert>
      )}
      <FieldGroup className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Field data-invalid={errors.cuit ? true : undefined}>
          <FieldLabel htmlFor="cuit">CUIT</FieldLabel>
          <Input id="cuit" inputMode="numeric" aria-invalid={errors.cuit ? true : undefined} {...register('cuit')} />
          <FieldError errors={[errors.cuit]} />
        </Field>
        <Field data-invalid={errors.legalName ? true : undefined}>
          <FieldLabel htmlFor="legalName">Nombre o razón social</FieldLabel>
          <Input id="legalName" aria-invalid={errors.legalName ? true : undefined} {...register('legalName')} />
          <FieldError errors={[errors.legalName]} />
        </Field>
        <Field data-invalid={errors.address ? true : undefined}>
          <FieldLabel htmlFor="address">Domicilio fiscal</FieldLabel>
          <Input id="address" aria-invalid={errors.address ? true : undefined} {...register('address')} />
          <FieldError errors={[errors.address]} />
        </Field>
        <Field data-invalid={errors.grossIncomeNumber ? true : undefined}>
          <FieldLabel htmlFor="grossIncomeNumber">Ingresos Brutos</FieldLabel>
          <Input
            id="grossIncomeNumber"
            aria-invalid={errors.grossIncomeNumber ? true : undefined}
            {...register('grossIncomeNumber')}
          />
          <FieldError errors={[errors.grossIncomeNumber]} />
        </Field>
        <Field data-invalid={errors.activityStartDate ? true : undefined}>
          <FieldLabel htmlFor="activityStartDate">Inicio de actividades</FieldLabel>
          <Input
            id="activityStartDate"
            type="date"
            aria-invalid={errors.activityStartDate ? true : undefined}
            {...register('activityStartDate')}
          />
          <FieldError errors={[errors.activityStartDate]} />
        </Field>
        <Field data-invalid={errors.pointOfSale ? true : undefined}>
          <FieldLabel htmlFor="pointOfSale">Punto de venta (Web Services)</FieldLabel>
          <Input
            id="pointOfSale"
            type="number"
            min={1}
            max={99999}
            aria-invalid={errors.pointOfSale ? true : undefined}
            {...register('pointOfSale')}
          />
          <FieldDescription>
            Es el punto de venta dado de alta para Web Services, no el de Comprobantes en línea.
          </FieldDescription>
          <FieldError errors={[errors.pointOfSale]} />
        </Field>
        <Field data-invalid={errors.monotributoCategory ? true : undefined}>
          <FieldLabel htmlFor="monotributoCategory">Categoría del monotributo</FieldLabel>
          <Controller
            control={control}
            name="monotributoCategory"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  id="monotributoCategory"
                  className="w-full"
                  aria-invalid={errors.monotributoCategory ? true : undefined}
                  onBlur={field.onBlur}
                >
                  <SelectValue placeholder="Elegí tu categoría" />
                </SelectTrigger>
                <SelectContent>
                  {MONOTRIBUTO_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError errors={[errors.monotributoCategory]} />
        </Field>
        <Field data-invalid={errors.annualCap ? true : undefined}>
          <FieldLabel htmlFor="annualCap">Tope anual de la categoría</FieldLabel>
          <Input
            id="annualCap"
            inputMode="decimal"
            aria-invalid={errors.annualCap ? true : undefined}
            {...register('annualCap')}
          />
          <FieldDescription>ARCA actualiza los topes cada semestre. Cuando cambien, actualizalo acá.</FieldDescription>
          <FieldError errors={[errors.annualCap]} />
        </Field>
      </FieldGroup>
      <div>
        <Button type="submit" disabled={update.isPending || !isDirty}>
          {update.isPending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
          Guardar
        </Button>
      </div>
    </form>
  )
}

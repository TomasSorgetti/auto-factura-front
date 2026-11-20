import { Download } from 'lucide-react'
import { useState } from 'react'
import { CopyButton } from '@/components/app/CopyButton'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldLabel } from '@/components/ui/field'

type RecoveryCodesProps = {
  codes: string[]
  continueLabel: string
  onContinue: () => void
}

const FILE_NAME = 'auto-factura-codigos-de-recuperacion.txt'

function downloadCodes(codes: string[]) {
  const url = URL.createObjectURL(new Blob([codes.join('\n') + '\n'], { type: 'text/plain' }))
  const link = document.createElement('a')
  link.href = url
  link.download = FILE_NAME
  link.click()
  URL.revokeObjectURL(url)
}

export function RecoveryCodes({ codes, continueLabel, onContinue }: RecoveryCodesProps) {
  const [saved, setSaved] = useState(false)
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-semibold">Guardá tus códigos de recuperación</h1>
        <p className="text-sm text-muted-foreground">
          Si perdés el teléfono, cada código te deja entrar una vez. No los vamos a volver a mostrar.
        </p>
      </div>
      <ul className="grid grid-cols-2 gap-2 rounded-md border bg-muted p-3 font-mono text-sm">
        {codes.map((code) => (
          <li key={code}>{code}</li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-2">
        <CopyButton text={codes.join('\n')} label="Copiar todos los códigos">
          Copiar todos
        </CopyButton>
        <Button type="button" variant="outline" onClick={() => downloadCodes(codes)}>
          <Download className="size-4" aria-hidden="true" />
          Descargar
        </Button>
      </div>
      <Field orientation="horizontal">
        <Checkbox id="codes-saved" checked={saved} onCheckedChange={(value) => setSaved(value === true)} />
        <FieldLabel htmlFor="codes-saved">Ya los guardé en un lugar seguro</FieldLabel>
      </Field>
      <Button type="button" disabled={!saved} onClick={onContinue}>
        {continueLabel}
      </Button>
    </div>
  )
}

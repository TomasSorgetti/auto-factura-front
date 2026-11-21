import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatCUIT, normalizeCUIT } from '@/lib/cuit'

type DeleteClientDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  cuit: string
  pending: boolean
  onConfirm: () => void
}

export function DeleteClientDialog({ open, onOpenChange, cuit, pending, onConfirm }: DeleteClientDialogProps) {
  const [typed, setTyped] = useState('')
  const matches = normalizeCUIT(typed) === cuit

  function handleOpenChange(next: boolean) {
    if (!next) setTyped('')
    onOpenChange(next)
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar este cliente?</AlertDialogTitle>
          <AlertDialogDescription>
            Se borran el cliente y todos sus contactos. No se puede deshacer. Si solo querés dejar de usarlo, archivalo.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex flex-col gap-2">
          <Label htmlFor="delete-client-cuit">Para confirmar, escribí el CUIT: {formatCUIT(cuit)}</Label>
          <Input
            id="delete-client-cuit"
            inputMode="numeric"
            autoComplete="off"
            value={typed}
            onChange={(event) => setTyped(event.target.value)}
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={pending || !matches}
            onClick={(event) => {
              event.preventDefault()
              onConfirm()
            }}
          >
            {pending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

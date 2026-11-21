import { MoreHorizontal } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { ConfirmDialog } from '@/components/app/ConfirmDialog'
import { ErrorState } from '@/components/app/ErrorState'
import { FormDialog } from '@/components/app/FormDialog'
import { ListSkeleton } from '@/components/app/ListSkeleton'
import { PageHeader } from '@/components/app/PageHeader'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ClientForm } from '@/features/clients/components/ClientForm'
import { ClientInfoCard } from '@/features/clients/components/ClientInfoCard'
import { ContactForm } from '@/features/clients/components/ContactForm'
import { ContactsCard } from '@/features/clients/components/ContactsCard'
import {
  useArchiveClient,
  useClient,
  useCreateContact,
  useDeleteContact,
  useUnarchiveClient,
  useUpdateClient,
  useUpdateContact,
} from '@/features/clients/queries'
import type { ClientInput, Contact, ContactInput } from '@/features/clients/types'
import { ApiError } from '@/lib/api'
import { API_ERROR_CODES, getErrorMessage } from '@/lib/errors'

type ContactDialog = { mode: 'create' } | { mode: 'edit'; contact: Contact }

export function ClientDetailPage() {
  const { id = '' } = useParams()
  const client = useClient(id)
  const update = useUpdateClient(id)
  const archive = useArchiveClient(id)
  const unarchive = useUnarchiveClient(id)
  const createContact = useCreateContact(id)
  const updateContact = useUpdateContact(id)
  const deleteContact = useDeleteContact(id)
  const [editOpen, setEditOpen] = useState(false)
  const [archiveOpen, setArchiveOpen] = useState(false)
  const [contactDialog, setContactDialog] = useState<ContactDialog | null>(null)
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  if (client.isPending) return <ListSkeleton />
  if (client.isError) {
    if (client.error instanceof ApiError && client.error.code === API_ERROR_CODES.NOT_FOUND) {
      return (
        <Alert>
          <AlertDescription className="flex flex-col items-start gap-3">
            No encontramos este cliente.
            <Button variant="outline" size="sm" asChild>
              <Link to="/app/clients">Volver a clientes</Link>
            </Button>
          </AlertDescription>
        </Alert>
      )
    }
    return <ErrorState error={client.error} onRetry={() => void client.refetch()} />
  }

  const data = client.data
  const archived = data.archivedAt !== null

  async function saveClient(input: ClientInput) {
    await update.mutateAsync(input)
    setEditOpen(false)
  }

  async function saveContact(input: ContactInput) {
    if (contactDialog?.mode === 'edit') {
      await updateContact.mutateAsync({ contactId: contactDialog.contact.id, input })
    } else {
      await createContact.mutateAsync(input)
    }
    setContactDialog(null)
  }

  async function runAction(action: () => Promise<unknown>, close: () => void) {
    setActionError(null)
    try {
      await action()
    } catch (error) {
      setActionError(getErrorMessage(error))
    }
    close()
  }

  const actions = (
    <div className="flex items-center gap-2">
      {!archived && <Button onClick={() => setEditOpen(true)}>Editar</Button>}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" aria-label="Más acciones">
            <MoreHorizontal className="size-4" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {archived ? (
            <DropdownMenuItem
              disabled={unarchive.isPending}
              onSelect={() =>
                void runAction(
                  () => unarchive.mutateAsync(),
                  () => undefined,
                )
              }
            >
              Desarchivar
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onSelect={() => setArchiveOpen(true)}>Archivar</DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )

  return (
    <>
      <PageHeader title={data.legalName} actions={actions} />
      {archived && (
        <>
          <Badge variant="secondary" className="self-start">
            Archivado
          </Badge>
          <Alert>
            <AlertDescription>Este cliente está archivado. Desarchivalo para editarlo.</AlertDescription>
          </Alert>
        </>
      )}
      {actionError && (
        <Alert variant="destructive">
          <AlertDescription>{actionError}</AlertDescription>
        </Alert>
      )}
      <ClientInfoCard client={data} />
      <ContactsCard
        contacts={data.contacts}
        readOnly={archived}
        onAdd={() => setContactDialog({ mode: 'create' })}
        onEdit={(contact) => setContactDialog({ mode: 'edit', contact })}
        onDelete={setContactToDelete}
      />
      <FormDialog open={editOpen} onOpenChange={setEditOpen} title="Editar cliente">
        <ClientForm
          defaultValues={{
            legalName: data.legalName,
            cuit: data.cuit,
            taxCondition: data.taxCondition,
            address: data.address,
            notes: data.notes,
          }}
          onSubmit={saveClient}
          submitLabel="Guardar cambios"
          pending={update.isPending}
        />
      </FormDialog>
      <FormDialog
        open={contactDialog !== null}
        onOpenChange={(open) => {
          if (!open) setContactDialog(null)
        }}
        title={contactDialog?.mode === 'edit' ? 'Editar contacto' : 'Agregar contacto'}
      >
        <ContactForm
          defaultValues={
            contactDialog?.mode === 'edit'
              ? {
                  name: contactDialog.contact.name,
                  email: contactDialog.contact.email,
                  role: contactDialog.contact.role,
                  portalAccess: contactDialog.contact.portalAccess,
                }
              : undefined
          }
          onSubmit={saveContact}
          submitLabel={contactDialog?.mode === 'edit' ? 'Guardar cambios' : 'Agregar contacto'}
          pending={createContact.isPending || updateContact.isPending}
        />
      </FormDialog>
      <ConfirmDialog
        open={archiveOpen}
        onOpenChange={setArchiveOpen}
        title="¿Archivar este cliente?"
        description="Deja de aparecer en la lista de activos y no se puede editar. Podés desarchivarlo cuando quieras."
        confirmLabel="Archivar"
        pending={archive.isPending}
        onConfirm={() =>
          void runAction(
            () => archive.mutateAsync(),
            () => setArchiveOpen(false),
          )
        }
      />
      <ConfirmDialog
        open={contactToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setContactToDelete(null)
        }}
        title="¿Borrar este contacto?"
        description="Se borran su nombre y su email. No se puede deshacer."
        confirmLabel="Borrar"
        destructive
        pending={deleteContact.isPending}
        onConfirm={() => {
          const target = contactToDelete
          if (!target) return
          void runAction(
            () => deleteContact.mutateAsync(target.id),
            () => setContactToDelete(null),
          )
        }}
      />
    </>
  )
}

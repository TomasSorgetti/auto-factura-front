import { Pencil, Plus, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CONTACT_ROLE_LABELS, type Contact } from '@/features/clients/types'

export const MAX_CONTACTS = 20

type ContactsCardProps = {
  contacts: Contact[]
  readOnly: boolean
  onAdd: () => void
  onEdit: (contact: Contact) => void
  onDelete: (contact: Contact) => void
}

export function ContactsCard({ contacts, readOnly, onAdd, onEdit, onDelete }: ContactsCardProps) {
  const limitReached = contacts.length >= MAX_CONTACTS
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <CardTitle>Contactos</CardTitle>
        {!readOnly && (
          <div className="flex items-center gap-3">
            {limitReached && <span className="text-muted-foreground text-sm">Máximo 20 contactos.</span>}
            <Button size="sm" onClick={onAdd} disabled={limitReached}>
              <Plus className="size-4" aria-hidden="true" />
              Agregar contacto
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {contacts.length === 0 ? (
          <p className="text-muted-foreground text-sm">Sin contactos. Agregá al menos uno para poder mandar facturas.</p>
        ) : (
          <ul className="flex flex-col divide-y">
            {contacts.map((contact) => (
              <li key={contact.id} className="flex items-center justify-between gap-3 py-3">
                <div className="flex min-w-0 flex-col gap-1">
                  <span className="truncate text-sm font-medium">{contact.name}</span>
                  <span className="text-muted-foreground truncate text-sm">{contact.email}</span>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">{CONTACT_ROLE_LABELS[contact.role]}</Badge>
                    {contact.portalAccess && <span className="text-muted-foreground text-xs">Acceso al portal</span>}
                  </div>
                </div>
                {!readOnly && (
                  <div className="flex shrink-0 gap-1">
                    <Button variant="ghost" size="icon" aria-label="Editar contacto" onClick={() => onEdit(contact)}>
                      <Pencil className="size-4" aria-hidden="true" />
                    </Button>
                    <Button variant="ghost" size="icon" aria-label="Borrar contacto" onClick={() => onDelete(contact)}>
                      <Trash2 className="size-4" aria-hidden="true" />
                    </Button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

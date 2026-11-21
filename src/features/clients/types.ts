export const TAX_CONDITIONS = ['registered', 'monotributo', 'exempt', 'final_consumer'] as const
export type TaxCondition = (typeof TAX_CONDITIONS)[number]
export const TAX_CONDITION_LABELS: Record<TaxCondition, string> = {
  registered: 'Responsable Inscripto',
  monotributo: 'Monotributista',
  exempt: 'Exento',
  final_consumer: 'Consumidor Final',
}
export const CONTACT_ROLES = ['to', 'cc'] as const
export type ContactRole = (typeof CONTACT_ROLES)[number]
export const CONTACT_ROLE_LABELS: Record<ContactRole, string> = { to: 'Destinatario', cc: 'En copia' }

export type ClientStatus = 'active' | 'archived'
export type ClientSummary = {
  id: string
  legalName: string
  cuit: string
  taxCondition: TaxCondition
  archivedAt: string | null
  contactsCount: number
}
export type ClientList = { items: ClientSummary[]; total: number; limit: number; offset: number }
export type Contact = {
  id: string
  name: string
  email: string
  role: ContactRole
  portalAccess: boolean
  createdAt: string
  updatedAt: string
}
export type ClientDetail = {
  id: string
  legalName: string
  cuit: string
  taxCondition: TaxCondition
  address: string
  notes: string
  archivedAt: string | null
  createdAt: string
  updatedAt: string
  contacts: Contact[]
}
export type ClientInput = { legalName: string; cuit: string; taxCondition: TaxCondition; address: string; notes: string }
export type ContactInput = { name: string; email: string; role: ContactRole; portalAccess: boolean }
export type ClientListParams = { q: string; status: ClientStatus; page: number }

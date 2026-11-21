import { api } from '@/lib/api'
import type {
  ClientDetail,
  ClientInput,
  ClientList,
  ClientListParams,
  Contact,
  ContactInput,
} from '@/features/clients/types'

export const CLIENTS_PAGE_SIZE = 50

function clientPath(id: string): string {
  return `/admin/clients/${encodeURIComponent(id)}`
}

function contactPath(clientId: string, contactId: string): string {
  return `${clientPath(clientId)}/contacts/${encodeURIComponent(contactId)}`
}

export function listClients(params: ClientListParams, signal?: AbortSignal) {
  const query = new URLSearchParams({
    q: params.q,
    status: params.status,
    limit: String(CLIENTS_PAGE_SIZE),
    offset: String((params.page - 1) * CLIENTS_PAGE_SIZE),
  })
  return api.get<ClientList>(`/admin/clients?${query.toString()}`, { signal })
}

export function getClient(id: string, signal?: AbortSignal) {
  return api.get<ClientDetail>(clientPath(id), { signal })
}

export function createClient(input: ClientInput) {
  return api.post<ClientDetail>('/admin/clients', { body: input })
}

export function updateClient(id: string, input: ClientInput) {
  return api.put<ClientDetail>(clientPath(id), { body: input })
}

export function deleteClient(id: string) {
  return api.delete(clientPath(id))
}

export function archiveClient(id: string) {
  return api.post<ClientDetail>(`${clientPath(id)}/archive`)
}

export function unarchiveClient(id: string) {
  return api.post<ClientDetail>(`${clientPath(id)}/unarchive`)
}

export function createContact(clientId: string, input: ContactInput) {
  return api.post<Contact>(`${clientPath(clientId)}/contacts`, { body: input })
}

export function updateContact(clientId: string, contactId: string, input: ContactInput) {
  return api.put<Contact>(contactPath(clientId, contactId), { body: input })
}

export function deleteContact(clientId: string, contactId: string) {
  return api.delete(contactPath(clientId, contactId))
}

import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  archiveClient,
  createClient,
  createContact,
  deleteClient,
  deleteContact,
  getClient,
  listClients,
  unarchiveClient,
  updateClient,
  updateContact,
} from '@/features/clients/api'
import type { ClientDetail, ClientInput, ClientListParams, Contact, ContactInput } from '@/features/clients/types'
import { queryKeys } from '@/lib/queryKeys'

export function useClients(params: ClientListParams) {
  return useQuery({
    queryKey: queryKeys.clients.list(params),
    queryFn: ({ signal }) => listClients(params, signal),
    placeholderData: keepPreviousData,
  })
}

export function useClient(id: string) {
  return useQuery({
    queryKey: queryKeys.clients.detail(id),
    queryFn: ({ signal }) => getClient(id, signal),
  })
}

export function useCreateClient() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createClient,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.clients.all })
      toast.success('Creamos el cliente.')
    },
  })
}

function useClientDetailMutation(id: string, message: string) {
  const queryClient = useQueryClient()
  return {
    onSuccess: async (detail: ClientDetail) => {
      queryClient.setQueryData(queryKeys.clients.detail(id), detail)
      await queryClient.invalidateQueries({ queryKey: queryKeys.clients.all })
      toast.success(message)
    },
  }
}

export function useUpdateClient(id: string) {
  const handlers = useClientDetailMutation(id, 'Guardamos los cambios.')
  return useMutation({ mutationFn: (input: ClientInput) => updateClient(id, input), ...handlers })
}

export function useArchiveClient(id: string) {
  const handlers = useClientDetailMutation(id, 'Archivamos el cliente.')
  return useMutation({ mutationFn: () => archiveClient(id), ...handlers })
}

export function useUnarchiveClient(id: string) {
  const handlers = useClientDetailMutation(id, 'Desarchivamos el cliente.')
  return useMutation({ mutationFn: () => unarchiveClient(id), ...handlers })
}

export function useDeleteClient(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => deleteClient(id),
    onSuccess: async () => {
      queryClient.removeQueries({ queryKey: queryKeys.clients.detail(id) })
      await queryClient.invalidateQueries({ queryKey: queryKeys.clients.all })
      toast.success('Eliminamos el cliente.')
    },
  })
}

function useContactMutationHandlers(clientId: string, message: string) {
  const queryClient = useQueryClient()
  return {
    onSuccess: async (contact: Contact) => {
      queryClient.setQueryData<ClientDetail>(queryKeys.clients.detail(clientId), (detail) => {
        if (!detail) return detail
        const exists = detail.contacts.some((c) => c.id === contact.id)
        const contacts = exists
          ? detail.contacts.map((c) => (c.id === contact.id ? contact : c))
          : [...detail.contacts, contact]
        return { ...detail, contacts }
      })
      await queryClient.invalidateQueries({ queryKey: queryKeys.clients.all })
      toast.success(message)
    },
  }
}

export function useCreateContact(clientId: string) {
  const handlers = useContactMutationHandlers(clientId, 'Agregamos el contacto.')
  return useMutation({ mutationFn: (input: ContactInput) => createContact(clientId, input), ...handlers })
}

export function useUpdateContact(clientId: string) {
  const handlers = useContactMutationHandlers(clientId, 'Actualizamos el contacto.')
  return useMutation({
    mutationFn: (args: { contactId: string; input: ContactInput }) => updateContact(clientId, args.contactId, args.input),
    ...handlers,
  })
}

export function useDeleteContact(clientId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (contactId: string) => deleteContact(clientId, contactId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.clients.all })
      toast.success('Borramos el contacto.')
    },
  })
}

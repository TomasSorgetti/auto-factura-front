import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createClient, listClients } from '@/features/clients/api'
import type { ClientListParams } from '@/features/clients/types'
import { queryKeys } from '@/lib/queryKeys'

export function useClients(params: ClientListParams) {
  return useQuery({
    queryKey: queryKeys.clients.list(params),
    queryFn: ({ signal }) => listClients(params, signal),
    placeholderData: keepPreviousData,
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

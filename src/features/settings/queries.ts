import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getSettings, updateSettings } from '@/features/settings/api'
import { queryKeys } from '@/lib/queryKeys'

export function useSettings() {
  return useQuery({
    queryKey: queryKeys.settings.all,
    queryFn: ({ signal }) => getSettings(signal),
  })
}

export function useUpdateSettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateSettings,
    onSuccess: (settings) => {
      queryClient.setQueryData(queryKeys.settings.all, settings)
      toast.success('Guardamos tus datos fiscales.')
    },
  })
}

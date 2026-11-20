import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { getMe, logout } from '@/features/auth/api'
import { getErrorMessage } from '@/lib/errors'
import { queryKeys } from '@/lib/queryKeys'

export function useMe() {
  return useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: ({ signal }) => getMe(signal),
    staleTime: 5 * 60_000,
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  return useMutation({
    mutationFn: logout,
    onSuccess: async () => {
      await navigate('/login', { replace: true })
      queryClient.clear()
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}

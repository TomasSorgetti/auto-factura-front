import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { enrollTotp, getMe, login, logout, setupTotp, verifyRecovery, verifyTotp } from '@/features/auth/api'
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

export function useLogin() {
  return useMutation({ mutationFn: login })
}

export function useSetupTotp() {
  return useMutation({ mutationFn: setupTotp })
}

export function useEnrollTotp() {
  return useMutation({ mutationFn: enrollTotp })
}

export function useVerifyTotp() {
  return useMutation({ mutationFn: verifyTotp })
}

export function useVerifyRecovery() {
  return useMutation({ mutationFn: verifyRecovery })
}

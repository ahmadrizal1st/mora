import { useMutation } from '@tanstack/react-query'
import { AuthService } from '../services/auth.service'
import { useAuthStore } from '../store/authStore'
import { useNavigate } from '@tanstack/react-router'
import type { Verify2FACredentials } from '../types/auth.types'

export const useVerify2FAMutation = () => {
  const setToken = useAuthStore((s) => s.setToken)
  const navigate = useNavigate()

  return useMutation({
    mutationKey: ['auth', 'verify2FA'],
    mutationFn: async (credentials: Verify2FACredentials) => {
      return await AuthService.verify2FA(credentials)
    },
    onSuccess: (data) => {
      setToken(data.access_token)
      navigate({ to: '/dashboard' })
    },
  })
}

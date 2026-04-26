import { useMutation } from '@tanstack/react-query'
import { AuthService } from '../services/auth.service'
import { useAuthStore } from '../store/authStore'
import { useNavigate } from '@tanstack/react-router'
import type { Verify2FACredentials, AuthResponse } from '../types/auth.types'
import { AxiosError } from 'axios'

export const useVerify2FAMutation = () => {
  const setAuth = useAuthStore((s) => s.setAuth)
  const navigate = useNavigate()

  return useMutation<AuthResponse, AxiosError<{ message?: string }>, Verify2FACredentials>({
    mutationKey: ['auth', 'verify2FA'],
    mutationFn: async (credentials: Verify2FACredentials) => {
      return await AuthService.verify2FA(credentials)
    },
    onSuccess: (data) => {
      setAuth(data)
      navigate({ to: '/dashboard' })
    },
  })
}

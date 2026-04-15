import { useMutation } from '@tanstack/react-query'
import { useAuthStore } from '../store/authStore'
import { useNavigate } from '@tanstack/react-router'
import type { LoginCredentials } from '../types/auth.types'

export const useSignInMutation = () => {
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()

  return useMutation({
    mutationKey: ['auth', 'signIn'],
    mutationFn: async (credentials: LoginCredentials) => {
      await login(credentials)
    },
    onSuccess: () => {
      // Redirect after successful login
      navigate({ to: '/dashboard' })
    },
  })
}

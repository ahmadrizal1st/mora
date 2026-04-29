import { useMutation } from '@tanstack/react-query'
import { useAuthStore } from '../store/authStore'
import { useNavigate } from '@tanstack/react-router'
import type { LoginCredentials } from '../types/auth.types'
import { AxiosError } from 'axios'

export const useSignInMutation = (redirectPath?: string) => {
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()

  return useMutation<void, AxiosError<any>, LoginCredentials>({
    mutationKey: ['auth', 'signIn'],
    mutationFn: async (credentials: LoginCredentials) => {
      await login(credentials)
    },
    onSuccess: () => {
      // Redirect after successful login
      if (redirectPath) {
        window.location.href = redirectPath
      } else {
        navigate({ to: '/dashboard' })
      }
    },
  })
}

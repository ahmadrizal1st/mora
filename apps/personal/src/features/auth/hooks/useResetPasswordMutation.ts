import { useMutation } from '@tanstack/react-query'
import { AuthService } from '../services/auth.service'
import { useNavigate } from '@tanstack/react-router'
import type { ResetPasswordCredentials } from '../types/auth.types'
import { AxiosError } from 'axios'

export const useResetPasswordMutation = () => {
  const navigate = useNavigate()

  return useMutation<void, AxiosError, ResetPasswordCredentials>({
    mutationKey: ['auth', 'resetPassword'],
    mutationFn: async (credentials: ResetPasswordCredentials) => {
      await AuthService.resetPassword(credentials)
    },
    onSuccess: () => {
      navigate({ to: '/sign-in' })
    },
  })
}

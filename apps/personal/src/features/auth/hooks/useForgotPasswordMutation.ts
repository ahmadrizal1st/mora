import { useMutation } from '@tanstack/react-query'
import { AuthService } from '../services/auth.service'
import type { ForgotPasswordCredentials } from '../types/auth.types'

export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationKey: ['auth', 'forgotPassword'],
    mutationFn: async (credentials: ForgotPasswordCredentials) => {
      await AuthService.forgotPassword(credentials)
    },
  })
}

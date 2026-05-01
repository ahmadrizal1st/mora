import { useMutation } from '@tanstack/react-query'
import { AuthService } from '../services/auth.service'
import type { ForgotPasswordCredentials } from '../types/auth.types'
import { AxiosError } from 'axios'

export const useForgotPasswordMutation = () => {
  return useMutation<void, AxiosError, ForgotPasswordCredentials>({
    mutationKey: ['auth', 'forgotPassword'],
    mutationFn: async (credentials: ForgotPasswordCredentials) => {
      await AuthService.forgotPassword(credentials)
    },
  })
}

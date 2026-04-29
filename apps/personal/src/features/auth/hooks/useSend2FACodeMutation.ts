import { useMutation } from '@tanstack/react-query'
import { AuthService } from '../services/auth.service'
import { useNavigate } from '@tanstack/react-router'
import type { PhoneCredentials } from '../types/auth.types'
import { AxiosError } from 'axios'

export const useSend2FACodeMutation = () => {
  const navigate = useNavigate()

  return useMutation<void, AxiosError, PhoneCredentials>({
    mutationKey: ['auth', 'send2FACode'],
    mutationFn: async (credentials: PhoneCredentials) => {
      await AuthService.send2FACode(credentials)
    },
    onSuccess: () => {
      navigate({ to: '/2-step-verification-code' })
    },
  })
}

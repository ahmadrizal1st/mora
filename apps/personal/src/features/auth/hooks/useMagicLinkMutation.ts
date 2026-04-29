import { useMutation } from '@tanstack/react-query'
import { AuthService } from '../services/auth.service'
import type { MagicLinkCredentials } from '../types/auth.types'
import { AxiosError } from 'axios'

export const useMagicLinkMutation = () => {
  return useMutation<void, AxiosError, MagicLinkCredentials>({
    mutationKey: ['auth', 'magicLink'],
    mutationFn: async (credentials: MagicLinkCredentials) => {
      await AuthService.sendMagicLink(credentials)
    },
  })
}

import { useMutation } from '@tanstack/react-query'
import { AuthService } from '../services/auth.service'
import type { MagicLinkCredentials } from '../types/auth.types'

export const useMagicLinkMutation = () => {
  return useMutation({
    mutationKey: ['auth', 'magicLink'],
    mutationFn: async (credentials: MagicLinkCredentials) => {
      await AuthService.sendMagicLink(credentials)
    },
  })
}

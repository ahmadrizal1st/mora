import { createFileRoute } from '@tanstack/react-router'
import AuthLock from '@/features/auth/pages/AuthLock'

export const Route = createFileRoute('/auth-lock')({
  component: AuthLock,
})

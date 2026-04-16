import { createFileRoute } from '@tanstack/react-router'
import SignInLink from '@/features/auth/pages/SignInLink'

export const Route = createFileRoute('/sign-in-link')({
  component: SignInLink,
})

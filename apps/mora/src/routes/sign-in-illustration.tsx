import { createFileRoute } from '@tanstack/react-router'
import SignInIllustration from '@/features/auth/pages/SignInIllustration'

export const Route = createFileRoute('/sign-in-illustration')({
  component: SignInIllustration,
})

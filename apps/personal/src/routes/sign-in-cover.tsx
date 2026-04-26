import { createFileRoute } from '@tanstack/react-router'
import SignInCover from '@/features/auth/pages/SignInCover'

export const Route = createFileRoute('/sign-in-cover')({
  component: SignInCover,
})

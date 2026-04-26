import { createFileRoute } from '@tanstack/react-router'
import SignUp from '@/features/auth/pages/SignUp'

export const Route = createFileRoute('/sign-up')({
  component: SignUp,
})

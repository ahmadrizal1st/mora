import { createFileRoute } from '@tanstack/react-router'
import TwoStepVerification from '@/features/auth/pages/TwoStepVerification'

export const Route = createFileRoute('/2-step-verification')({
  component: TwoStepVerification,
})

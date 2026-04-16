import { createFileRoute } from '@tanstack/react-router'
import TwoStepVerificationCode from '@/features/auth/pages/TwoStepVerificationCode'

export const Route = createFileRoute('/2-step-verification-code')({
  component: TwoStepVerificationCode,
})

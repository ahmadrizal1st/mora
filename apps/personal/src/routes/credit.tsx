import { createFileRoute } from '@tanstack/react-router'
import CreditLayout from '@/features/credit/pages/CreditLayout'

export const Route = createFileRoute('/credit')({
  component: CreditLayout,
})

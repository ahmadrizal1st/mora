import { createFileRoute } from '@tanstack/react-router'
import CreditsPage from '@/features/transaction/pages/CreditsPage'

export const Route = createFileRoute('/credits')({
  component: CreditsPage,
})

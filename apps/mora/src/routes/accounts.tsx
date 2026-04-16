import { createFileRoute } from '@tanstack/react-router'
import { AccountsPage } from '@/features/transaction/pages/AccountsPage'

export const Route = createFileRoute('/accounts')({
  component: AccountsPage,
})

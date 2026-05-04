import { createFileRoute } from '@tanstack/react-router'
import { AccountsPage } from '@/features/accounts/pages/AccountsPage'
import { z } from 'zod'

const accountsSearchSchema = z.object({
  search: z.string().optional(),
  sort: z.string().optional(),
})

export const Route = createFileRoute('/accounts')({
  validateSearch: (search) => accountsSearchSchema.parse(search),
  component: AccountsPage,
})

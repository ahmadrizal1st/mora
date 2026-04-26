import { createFileRoute } from '@tanstack/react-router'
import { AccountsPage } from '@/features/transaction/pages/AccountsPage'
import { z } from 'zod'

const accountsSearchSchema = z.object({
  group_by: z.enum(['day', 'week', 'month', 'year']).optional().default('day'),
  search: z.string().optional(),
  sort: z.string().optional(),
})

export const Route = createFileRoute('/accounts')({
  validateSearch: (search) => accountsSearchSchema.parse(search),
  component: AccountsPage,
})

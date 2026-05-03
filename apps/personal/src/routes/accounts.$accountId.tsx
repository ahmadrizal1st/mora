import { createFileRoute } from '@tanstack/react-router'
import { AccountDetailPage } from '@/features/transaction/pages/AccountDetailPage'
import { z } from 'zod'

const accountDetailSearchSchema = z.object({
  date_from: z.string().optional(),
  date_to: z.string().optional(),
  search: z.string().optional(),
  sort: z.string().optional(),
  page: z.number().optional().default(1),
  per_page: z.number().optional().default(10),
})

export const Route = createFileRoute('/accounts/$accountId')({
  validateSearch: (search) => accountDetailSearchSchema.parse(search),
  component: AccountDetailPage,
})

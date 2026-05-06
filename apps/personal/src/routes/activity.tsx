import { createFileRoute } from '@tanstack/react-router'
import { TransactionListPage } from '@/features/transaction/pages/TransactionListPage'
import { z } from 'zod'

export const Route = createFileRoute('/activity')({
  component: TransactionListPage,
  validateSearch: z.object({
    page: z.number().optional(),
    per_page: z.number().optional(),
    type: z.enum(['income', 'expense', 'transfer']).optional(),
    account_id: z.number().optional(),
    category_id: z.number().optional(),
    status_id: z.number().optional(),
    date_from: z.string().optional(),
    date_to: z.string().optional(),
    search: z.string().optional(),
  }),
})

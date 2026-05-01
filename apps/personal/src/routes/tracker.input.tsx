import { createFileRoute } from '@tanstack/react-router'
import TrackerInputPage from '@/features/tracker/pages/TrackerInputPage'
import { z } from 'zod'

export const Route = createFileRoute('/tracker/input')({
  component: TrackerInputPage,
  validateSearch: z.object({
    id: z.string().optional(),
    text: z.string().optional(),
    amount: z.number().optional(),
    merchant: z.string().optional(),
  }),
})

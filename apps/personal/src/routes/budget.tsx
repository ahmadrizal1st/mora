import { createFileRoute } from '@tanstack/react-router'
import { BudgetPage } from '@/features/budget/pages/BudgetPage'

export const Route = createFileRoute('/budget')({
  component: BudgetPage,
})

import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router'

export const Route = createFileRoute('/planning/budget')({
  component: lazyRouteComponent(() => import('@/features/planning/pages/BudgetPage').then(m => ({ default: m.BudgetPage }))),
})

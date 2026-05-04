import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router'

export const Route = createFileRoute('/planning')({
  component: lazyRouteComponent(() => import('@/features/planning/pages/PlanningPage').then(m => ({ default: m.PlanningPage }))),
})

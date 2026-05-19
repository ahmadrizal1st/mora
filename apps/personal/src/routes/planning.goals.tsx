import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router'

export const Route = createFileRoute('/planning/goals')({
  component: lazyRouteComponent(() => import('@/features/planning/pages/GoalsPage').then(m => ({ default: m.GoalsPage }))),
})

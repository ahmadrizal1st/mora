import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router'

export const Route = createFileRoute('/planning')({
  component: lazyRouteComponent(() =>
    import('@/features/planning/pages/PlanningLayout').then((m) => ({ default: m.PlanningLayout }))
  ),
})

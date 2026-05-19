import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router'

export const Route = createFileRoute('/planning/subscriptions')({
  component: lazyRouteComponent(() => import('@/features/planning/pages/SubscriptionsPage').then(m => ({ default: m.SubscriptionsPage }))),
})

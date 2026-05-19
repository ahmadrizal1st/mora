import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router'

export const Route = createFileRoute('/credit/overview')({
  component: lazyRouteComponent(() => import('@/features/credit/pages/CreditOverviewPage').then(m => ({ default: m.CreditOverviewPage }))),
})

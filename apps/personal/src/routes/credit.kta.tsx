import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router'

export const Route = createFileRoute('/credit/kta')({
  component: lazyRouteComponent(() => import('@/features/credit/pages/CreditKTAPage').then(m => ({ default: m.CreditKTAPage }))),
})

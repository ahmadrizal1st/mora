import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router'

export const Route = createFileRoute('/credit/paylater')({
  component: lazyRouteComponent(() => import('@/features/credit/pages/CreditPaylaterPage').then(m => ({ default: m.CreditPaylaterPage }))),
})

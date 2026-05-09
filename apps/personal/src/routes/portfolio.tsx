import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router'

export const Route = createFileRoute('/portfolio')({
  component: lazyRouteComponent(() => import('@/features/wealth/pages/WealthPage').then(m => ({ default: m.WealthPage }))),
})

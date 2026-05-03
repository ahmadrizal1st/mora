import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router'

export const Route = createFileRoute('/assets')({
  component: lazyRouteComponent(() => import('@/features/assets/pages/AssetsPage')),
})

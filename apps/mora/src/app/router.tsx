import { createRouter } from '@tanstack/react-router'
import { routeTree } from '../routeTree.gen'
import { type useAuthStore } from '../features/auth/store/authStore'

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  context: {
    auth: undefined as unknown as ReturnType<typeof useAuthStore>,
  },
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

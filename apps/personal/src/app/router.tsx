import { createRouter } from '@tanstack/react-router'
import { routeTree } from '../routeTree.gen'
import { type AuthState } from '../features/auth/store/authStore'

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
  context: {
    auth: undefined as unknown as AuthState,
  },
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

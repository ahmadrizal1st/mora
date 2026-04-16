import {
  createRootRouteWithContext,
  Outlet,
  ScrollRestoration,
  redirect,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { QueryProvider } from '@/app/providers/QueryProvider'
import { ThemeProvider } from '@/app/providers/ThemeProvider'
import { ThemeSettings } from '@/shared/components/layout/ThemeSettings'
import { BottomNav } from '@/shared/components/layout/BottomNav'
import type { AuthState } from '@/features/auth/store/authStore'

export interface MyRouterContext {
  auth: AuthState
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  beforeLoad: ({ context, location }) => {
    // Wait for auth to initialize before making redirection decisions
    if (!context.auth || context.auth.isLoading) {
      return
    }

    const publicPaths = [
      '/',
      '/sign-in',
      '/sign-up',
      '/forgot-password',
      '/reset-password',
      '/2-step-verification',
      '/2-step-verification-code',
      '/sign-in-cover',
      '/sign-in-illustration',
      '/sign-in-link',
      '/auth-lock'
    ]
    
    const isPublicPath = publicPaths.includes(location.pathname)
    const isAuthenticated = context.auth.isAuthenticated

    // Redirect unauthenticated users away from private content
    if (!isAuthenticated && !isPublicPath) {
      throw redirect({ to: '/sign-in' })
    }

    // Redirect authenticated users away from guest content (like sign-in or welcome landing)
    const guestOnlyPaths = ['/', '/sign-in', '/sign-up', '/forgot-password', '/reset-password']
    if (isAuthenticated && guestOnlyPaths.includes(location.pathname)) {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: RootComponent,
})

function RootComponent() {
  const { auth } = Route.useRouteContext()

  if (auth.isLoading) {
    return (
      <div className="page page-center">
        <div className="container container-tight py-4">
          <div className="text-center">
            <div className="mb-3">
              <span className="spinner-border spinner-border-sm text-secondary" role="status"></span>
            </div>
            <div className="text-secondary">Loading your session...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <QueryProvider>
      <ThemeProvider>
        <Outlet />
        <ScrollRestoration />
        <BottomNav />
        <ThemeSettings />
        {import.meta.env.DEV && <TanStackRouterDevtools position="bottom-right" />}
      </ThemeProvider>
    </QueryProvider>
  )
}

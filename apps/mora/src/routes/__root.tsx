import {
  createRootRouteWithContext,
  Outlet,
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

  // We no longer block the entire UI while loading. 
  // Redirection logic in beforeLoad handles security.
  // This helps unblock the UI if there's a hang in API calls.
  
  return (
    <QueryProvider>
      <ThemeProvider>
        {auth.isLoading && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '3px', background: '#3b82f6', zIndex: 9999 }}>
            <div className="progress-bar-indeterminate"></div>
          </div>
        )}
        <Outlet />
        <BottomNav />
        <ThemeSettings />
        {import.meta.env.DEV && <TanStackRouterDevtools position="bottom-right" />}
      </ThemeProvider>
    </QueryProvider>
  )
}

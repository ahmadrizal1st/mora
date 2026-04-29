import { RouterProvider } from '@tanstack/react-router'
import { useAuth } from '../features/auth/hooks/useAuth'
import { router } from './router'

export function App() {
  const auth = useAuth()

  if (!auth._hasHydrated || auth.isLoading) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '3px',
          background: '#3b82f6',
          zIndex: 9999,
        }}
      >
        <div className="progress-bar-indeterminate"></div>
      </div>
    )
  }

  return <RouterProvider router={router} context={{ auth }} />
}

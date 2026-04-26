import { RouterProvider } from '@tanstack/react-router'
import { useAuth } from '../features/auth/hooks/useAuth'
import { router } from './router'

export function App() {
  const auth = useAuth()
  return <RouterProvider router={router} context={{ auth }} />
}

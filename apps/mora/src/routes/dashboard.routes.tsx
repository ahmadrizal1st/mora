// src/routes/dashboard.routes.tsx
import { Route } from 'react-router-dom'
import { lazy, Suspense, type ComponentType } from 'react'
import { ProtectedRoute } from './guards/ProtectedRoute'

function load<P extends object>(factory: () => Promise<{ default: ComponentType<P> }>) {
  const Page = lazy(factory)
  return (props: P) => (
    <Suspense fallback={null}>
      <Page {...props} />
    </Suspense>
  )
}

const Dashboard = load(() => import('@/features/dashboard/pages/Dashboard'))
const DashboardCrypto = load(() => import('@/features/dashboard/pages/DashboardCrypto'))
const DashboardAssets = load(() => import('@/features/dashboard/pages/DashboardAssets'))

export const dashboardRoutes = (
  <>
    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
    <Route path="/dashboard-crypto" element={<ProtectedRoute><DashboardCrypto /></ProtectedRoute>} />
    <Route path="/dashboard-assets" element={<ProtectedRoute><DashboardAssets /></ProtectedRoute>} />
  </>
)

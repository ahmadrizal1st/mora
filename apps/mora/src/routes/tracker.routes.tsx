// src/routes/tracker.routes.tsx
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

const TrackerPage = load(() => import('@/features/tracker/pages/TrackerPage'))
const TrackerInputPage = load(() => import('@/features/tracker/pages/TrackerInputPage'))
const ScannerPage = load(() => import('@/features/scanner/pages/ScannerPage'))

export const trackerRoutes = (
  <>
    <Route path="/tracker" element={<ProtectedRoute><TrackerPage /></ProtectedRoute>} />
    <Route path="/tracker/input" element={<ProtectedRoute><TrackerInputPage /></ProtectedRoute>} />
    <Route path="/tracker/photo" element={<ProtectedRoute><ScannerPage /></ProtectedRoute>} />
  </>
)

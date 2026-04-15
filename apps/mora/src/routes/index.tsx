import { Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense, type ComponentType } from 'react'

// Feature route groups
import { authRoutes } from './auth.routes'
import { dashboardRoutes } from './dashboard.routes'
import { trackerRoutes } from './tracker.routes'

function load<P extends object>(factory: () => Promise<{ default: ComponentType<P> }>) {
  const Page = lazy(factory)
  return (props: P) => (
    <Suspense fallback={null}>
      <Page {...props} />
    </Suspense>
  )
}

// Errors
const Error429 = load(() => import('../pages/Error429'))
const Error403 = load(() => import('../pages/Error403'))
const Error404 = load(() => import('../pages/Error404'))
const Error500 = load(() => import('../pages/Error500'))
const ErrorMaintenance = load(() => import('../pages/ErrorMaintenance'))

// AppRoutes logic

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* ===== FEATURE ROUTES ===== */}
      {authRoutes}
      {dashboardRoutes}
      {trackerRoutes}

      {/* ===== APP ROUTES ===== */}
      {/* Errors */}
      <Route path="/error-403" element={<Error403 />} />
      <Route path="/error-429" element={<Error429 />} />
      <Route path="/error-404" element={<Error404 />} />
      <Route path="/error-500" element={<Error500 />} />
      <Route path="/error-maintenance" element={<ErrorMaintenance />} />

      {/* Catch All */}
      <Route path="*" element={<Error404 />} />
    </Routes>
  )
}
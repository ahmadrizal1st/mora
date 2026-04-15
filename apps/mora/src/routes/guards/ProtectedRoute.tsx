import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="page page-center">
        <div className="container container-slim py-4">
          <div className="text-center">
            <div className="mb-3">
              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
              Loading...
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    const isMobile = window.innerWidth < 768
    if (isMobile) {
      return <Navigate to="/welcome" replace />
    }
    return <Navigate to="/sign-in" state={{ from: location }} replace />
  }

  return <>{children}</>
}

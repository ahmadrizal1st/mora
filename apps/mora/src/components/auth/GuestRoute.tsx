import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

interface GuestRouteProps {
  children: React.ReactNode
}

export const GuestRoute: React.FC<GuestRouteProps> = ({ children }) => {
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

  if (isAuthenticated) {
    const from = (location.state as any)?.from?.pathname || '/dashboard'
    return <Navigate to={from} replace />
  }

  return <>{children}</>
}

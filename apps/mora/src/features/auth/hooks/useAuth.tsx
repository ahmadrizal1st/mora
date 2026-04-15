import { useEffect } from 'react'
import { useAuthStore } from '../store/authStore'

export const useAuth = () => {
  const { token, user, isLoading, refreshUser, setIsLoading } = useAuthStore()

  // Initialize block: to fetch fresh user data when token exists on mount
  useEffect(() => {
    const init = async () => {
      if (token && !user) {
        await refreshUser()
      }
      setIsLoading(false)
    }
    
    // Only run if we are loading
    if (isLoading) {
      init()
    }
  }, [token, user, isLoading, refreshUser, setIsLoading])

  return store
}

// Keep this as a dummy export for components that previously imported AuthProvider
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>
}

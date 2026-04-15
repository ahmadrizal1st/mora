import { useEffect } from 'react'
import { useAuthStore } from '../store/authStore'

export const useAuth = () => {
  const store = useAuthStore()

  // Initialize block: to fetch fresh user data when token exists on mount
  useEffect(() => {
    const init = async () => {
      if (store.token && !store.user) {
        await store.refreshUser()
      }
      store.setIsLoading(false)
    }
    
    // Only run if we are loading
    if (store.isLoading) {
      init()
    }
  }, [store.token, store.user, store.isLoading, store.refreshUser, store.setIsLoading])

  return store
}

// Keep this as a dummy export for components that previously imported AuthProvider
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>
}

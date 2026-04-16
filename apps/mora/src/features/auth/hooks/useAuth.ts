import { useEffect } from 'react'
import { useAuthStore } from '../store/authStore'

export const useAuth = () => {
  const store = useAuthStore()
  const { token, user, isLoading, refreshUser, setIsLoading, _hasHydrated } = store

  // Initialize block: to fetch fresh user data when token exists on mount
  useEffect(() => {
    // Wait until store is hydrated from localStorage before making any decisions
    if (!_hasHydrated) return

    const init = async () => {
      try {
        // Only fetch user if we have a token but no user data yet
        if (token && !user) {
          await refreshUser()
        }
      } catch (error) {
        console.error('Auth initialization failed:', error)
      } finally {
        // Always stop loading regardless of success/fail
        setIsLoading(false)
      }
    }
    
    // Only run if we are in the initial loading state
    if (isLoading) {
      init()
    }
  }, [_hasHydrated, token, user, isLoading, refreshUser, setIsLoading])

  return store
}

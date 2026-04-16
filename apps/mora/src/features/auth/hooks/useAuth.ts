import { useEffect } from 'react'
import { useAuthStore } from '../store/authStore'

export const useAuth = () => {
  const store = useAuthStore()
  const { token, user, isLoading, refreshUser, setIsLoading, _hasHydrated } = store

  // Initialize block: to fetch fresh user data when token exists on mount
  useEffect(() => {
    // Wait until store is hydrated from localStorage before making any decisions
    if (!_hasHydrated) {
      return
    }


    const init = async () => {
      try {
        if (token && !user) {
          await refreshUser()
        }
      } catch (error) {
        console.error('❌ [Auth] Initialization failed:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    // Safety timeout: force close loading screen after 10s if stuck
    const timeout = setTimeout(() => {
      if (isLoading) {
        console.warn('⚠️ [Auth] Initialization timed out. Forcing UI to load.')
        setIsLoading(false)
      }
    }, 10000)

    // Only run if we are in the initial loading state
    if (isLoading) {
      init()
    }

    return () => clearTimeout(timeout)
  }, [_hasHydrated, token, user, isLoading, refreshUser, setIsLoading])

  return store
}

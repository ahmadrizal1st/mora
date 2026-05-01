import { useEffect } from 'react'
import { useAuthStore } from '../store/authStore'

export const useAuth = () => {
  const store = useAuthStore()
  const { token, user, isLoading, refreshUser, setIsLoading, _hasHydrated } = store

  useEffect(() => {
    if (!_hasHydrated) {
      return
    }

    const init = async () => {
      try {
        if (token && !user) {
          await refreshUser()
        }
      } catch {
        // Silently handle
      } finally {
        setIsLoading(false)
      }
    }
    
    const timeout = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false)
      }
    }, 10000)

    if (isLoading) {
      init()
    }

    return () => clearTimeout(timeout)
  }, [_hasHydrated, token, user, isLoading, refreshUser, setIsLoading])

  return store
}

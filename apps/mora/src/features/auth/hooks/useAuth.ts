import { useEffect } from 'react'
import { useAuthStore } from '../store/authStore'

export const useAuth = () => {
  const store = useAuthStore()
  const { token, user, isLoading, refreshUser, setIsLoading } = store

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

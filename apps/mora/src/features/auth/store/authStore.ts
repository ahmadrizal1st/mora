import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { User, LoginCredentials, RegisterCredentials } from '../types/auth.types'
import { AuthService } from '../services/auth.service'

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>
  loginWithGoogle: (credential: string) => Promise<void>
  register: (credentials: RegisterCredentials) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
  setIsLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true, // Start true for initial check

      setIsLoading: (loading) => set({ isLoading: loading }),

      login: async (credentials) => {
        const response = await AuthService.login(credentials)
        if (response.access_token) {
          localStorage.setItem('token', response.access_token)
          localStorage.setItem('user', JSON.stringify(response.user))
        }
        set({ 
          user: response.user, 
          token: response.access_token, 
          isAuthenticated: !!response.access_token 
        })
      },

      loginWithGoogle: async (credential) => {
        set({ isLoading: true })
        try {
          const response = await AuthService.googleLogin(credential)
          if (response.access_token) {
            localStorage.setItem('token', response.access_token)
            localStorage.setItem('user', JSON.stringify(response.user))
          }
          set({ 
            user: response.user, 
            token: response.access_token, 
            isAuthenticated: !!response.access_token 
          })
        } finally {
          set({ isLoading: false })
        }
      },

      register: async (credentials) => {
        const response = await AuthService.register(credentials)
        if (response.access_token) {
          localStorage.setItem('token', response.access_token)
          localStorage.setItem('user', JSON.stringify(response.user))
          set({ 
            user: response.user, 
            token: response.access_token, 
            isAuthenticated: true 
          })
        }
      },

      logout: async () => {
        try {
          await AuthService.logout()
        } catch (error) {
          console.error('Logout failed:', error)
        } finally {
          set({ user: null, token: null, isAuthenticated: false })
          // Optionally clear localStorage items if needed separately from Zustand
          localStorage.removeItem('token')
          localStorage.removeItem('user')
        }
      },

      refreshUser: async () => {
        try {
          const userData = await AuthService.getMe()
          localStorage.setItem('user', JSON.stringify(userData))
          set({ user: userData })
        } catch (error) {
          console.error('Failed to refresh user:', error)
          get().logout()
        }
      },
    }),
    {
      name: 'auth-storage', // unique name
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: !!state.token }), // Only persist these
    }
  )
)

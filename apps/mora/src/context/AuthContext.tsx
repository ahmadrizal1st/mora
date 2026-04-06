import React, { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { User, LoginCredentials, RegisterCredentials } from '../types/auth'
import { AuthService } from '../services/AuthService'

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  loginWithGoogle: (credential: string) => Promise<void>
  register: (credentials: RegisterCredentials) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('user')
      if (!savedUser || savedUser === 'undefined') return null
      return JSON.parse(savedUser)
    } catch (error) {
      console.error('Failed to parse user from localStorage:', error)
      localStorage.removeItem('user')
      return null
    }
  })
  const [token, setToken] = useState<string | null>(() => {
    const savedToken = localStorage.getItem('token')
    return (savedToken === 'undefined' || savedToken === 'null') ? null : savedToken
  })
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const initialized = React.useRef(false)

  const isAuthenticated = !!token

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const initializeAuth = async () => {
      if (token) {
        try {
          const userData = await AuthService.getMe()
          setUser(userData)
          localStorage.setItem('user', JSON.stringify(userData))
        } catch (error) {
          console.error('Failed to fetch user:', error)
          handleLogout()
        }
      }
      setIsLoading(false)
    }

    initializeAuth()
  }, [token])

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await AuthService.login(credentials)
      setUser(response.user)
      setToken(response.access_token)
      localStorage.setItem('token', response.access_token)
      localStorage.setItem('user', JSON.stringify(response.user))
    } catch (error) {
      throw error
    }
  }

  const loginWithGoogle = async (credential: string) => {
    setIsLoading(true)
    try {
      const response = await AuthService.googleLogin(credential)
      setUser(response.user)
      setToken(response.access_token)
      localStorage.setItem('token', response.access_token)
      localStorage.setItem('user', JSON.stringify(response.user))
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (credentials: RegisterCredentials) => {
    try {
      const response = await AuthService.register(credentials)
      // Note: If backend requires OTP, this will need to be handled.
      // For now, we sync with the current expected behavior.
      if (response.access_token) {
        setUser(response.user)
        setToken(response.access_token)
        localStorage.setItem('token', response.access_token)
        localStorage.setItem('user', JSON.stringify(response.user))
      }
    } catch (error) {
      throw error
    }
  }

  const handleLogout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const logout = async () => {
    try {
      await AuthService.logout()
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      handleLogout()
    }
  }

  const refreshUser = async () => {
    try {
      const userData = await AuthService.getMe()
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
    } catch (error) {
      console.error('Failed to refresh user:', error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        login,
        loginWithGoogle,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

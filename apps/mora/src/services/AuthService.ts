import api from '../utils/api'
import type { LoginCredentials, RegisterCredentials, AuthResponse, User } from '../types/auth'

export const AuthService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('auth/login', credentials)
    return response.data
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('auth/register', credentials)
    return response.data
  },

  async logout(): Promise<void> {
    await api.post('auth/logout')
  },

  async getMe(): Promise<User> {
    const response = await api.get<{ data: User }>('auth/me')
    return response.data.data
  },
}

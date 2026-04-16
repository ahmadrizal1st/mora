import api from '@/shared/api/client'
import type { 
  LoginCredentials, 
  RegisterCredentials, 
  AuthResponse, 
  User,
  ForgotPasswordCredentials,
  ResetPasswordCredentials,
  Verify2FACredentials,
  MagicLinkCredentials,
  PhoneCredentials
} from '../types/auth.types'

export const AuthService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('auth/login', credentials)
    return response.data
  },

  async googleLogin(credential: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('auth/google', { credential })
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

  async forgotPassword(data: ForgotPasswordCredentials): Promise<void> {
    await api.post('auth/forgot-password', data)
  },

  async resetPassword(data: ResetPasswordCredentials): Promise<void> {
    await api.post('auth/reset-password', data)
  },

  async verify2FA(data: Verify2FACredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('security/2fa/verify', data)
    return response.data
  },

  async sendMagicLink(data: MagicLinkCredentials): Promise<void> {
    await api.post('auth/magic-link', data)
  },

  async lockSession(): Promise<void> {
    // This could also be a local clear/suspend, but let's call API if it exists
    await api.post('security/lock')
  },

  async send2FACode(data: PhoneCredentials): Promise<void> {
    await api.post('security/2fa/send', data)
  },
}

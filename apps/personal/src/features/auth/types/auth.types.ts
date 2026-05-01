export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  created_at: string
  updated_at: string
}

export interface AuthResponse {
  user: User
  access_token: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export interface ForgotPasswordCredentials {
  email: string
}

export interface ResetPasswordCredentials {
  token: string
  password: string
  password_confirmation: string
}

export interface Verify2FACredentials {
  code: string
  device_id?: string
}

export interface MagicLinkCredentials {
  email: string
}

export interface PhoneCredentials {
  phone: string
  country_code: string
}

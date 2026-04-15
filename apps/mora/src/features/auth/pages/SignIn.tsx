// src/pages/SignIn.tsx
import React, { useState } from 'react'
import SingleLayout from '@/shared/layouts/SingleLayout'
import { SignInCard } from '@/shared/components/cards/SignInCard'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useNavigate } from 'react-router-dom'

export default function SignIn() {
  const { login, loginWithGoogle } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]> | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)
 
  const handleLogin = async (_e: React.FormEvent, data: any) => {
    setError(null)
    setFieldErrors(undefined)
    setIsLoading(true)
    try {
      await login(data)
      navigate('/dashboard')
    } catch (err: any) {
      const responseData = err.response?.data
      setError(responseData?.message || 'Login failed. Please check your credentials.')
      setFieldErrors(responseData?.errors)
    } finally {
      setIsLoading(false)
    }
  }
 
  const handleGoogleSuccess = async (credentialResponse: any) => {
    setError(null)
    setIsLoading(true)
    try {
      await loginWithGoogle(credentialResponse.credential)
      navigate('/dashboard')
    } catch (err: any) {
      const responseData = err.response?.data
      setError(responseData?.message || 'Google login failed.')
    } finally {
      setIsLoading(false)
    }
  }
 
  const handleGoogleError = () => {
    setError('Google login failed. Please try again.')
  }
 
  return (
    <SingleLayout>
      <SignInCard
        onSubmit={handleLogin}
        onGoogleSuccess={handleGoogleSuccess}
        onGoogleError={handleGoogleError}
        isLoading={isLoading}
        error={error}
        fieldErrors={fieldErrors}
      />
    </SingleLayout>
  )
}
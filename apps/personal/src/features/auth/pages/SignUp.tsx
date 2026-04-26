// src/pages/SignUp.tsx
import React, { useState } from 'react'
import SingleLayout from '@/shared/layouts/SingleLayout'
import { SignUpCard } from '@/shared/components/cards/SignUpCard'
import { useNavigate } from '@tanstack/react-router'
import { type RegisterCredentials, useAuth } from '@/features/auth'

export default function SignUp() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]> | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)

  const handleRegister = async (_e: React.FormEvent, data: RegisterCredentials) => {
    setError(null)
    setFieldErrors(undefined)
    setIsLoading(true)
    try {
      await register(data)
      navigate('/dashboard')
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string; error?: string; errors?: Record<string, string[]> } }; data?: { message?: string; errors?: Record<string, string[]> } | string }
      console.error('[SignUp] Registration error:', error)
      console.error('[SignUp] err.response:', error.response)
      console.error('[SignUp] err.response?.data:', error.response?.data)

      const responseData = error?.response?.data ?? error?.data ?? null

      const message =
        responseData?.message ||
        (typeof responseData === 'string' ? responseData : null) ||
        'Registration failed. Please check your data.'

      const errors = responseData?.errors ?? null

      setError(message)
      setFieldErrors(errors)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SingleLayout>
      <SignUpCard 
        onSubmit={handleRegister} 
        isLoading={isLoading} 
        error={error} 
        fieldErrors={fieldErrors} 
      />
    </SingleLayout>
  )
}
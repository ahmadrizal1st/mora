import React, { useState } from 'react'
import SingleLayout from '@/shared/layouts/SingleLayout'
import { SignUpCard } from '@/shared/components/cards/SignUpCard'
import { useNavigate } from '@tanstack/react-router'
import axios from 'axios'
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
      navigate({ to: '/dashboard' })
    } catch (err: unknown) {
      console.error('[SignUp] Registration error:', err)

      let message = 'Registration failed. Please check your data.'
      let errors: Record<string, string[]> | undefined = undefined

      if (axios.isAxiosError(err)) {
        const responseData = err.response?.data as
          | { message?: string; errors?: Record<string, string[]> }
          | undefined
        message = responseData?.message || message
        errors = responseData?.errors
      } else if (err instanceof Error) {
        message = err.message
      }

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

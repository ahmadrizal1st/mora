// src/pages/SignUp.tsx
import React, { useState } from 'react'
import SingleLayout from '../layouts/SingleLayout'
import { SignUpCard } from '../components/cards/SignUpCard'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function SignUp() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]> | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)

  const handleRegister = async (_e: React.FormEvent, data: any) => {
    setError(null)
    setFieldErrors(undefined)
    setIsLoading(true)
    try {
      await register(data)
      navigate('/dashboard')
    } catch (err: any) {
      console.error('[SignUp] Registration error:', err)
      console.error('[SignUp] err.response:', err.response)
      console.error('[SignUp] err.response?.data:', err.response?.data)

      const responseData = err?.response?.data ?? err?.data ?? null

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
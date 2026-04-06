// src/pages/SignIn.tsx
import React, { useState } from 'react'
import SingleLayout from '../layouts/SingleLayout'
import { SignInCard } from '../components/cards/SignInCard'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function SignIn() {
  const { login } = useAuth()
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

  return (
    <SingleLayout>
      <SignInCard onSubmit={handleLogin} isLoading={isLoading} error={error} fieldErrors={fieldErrors} />
    </SingleLayout>
  )
}
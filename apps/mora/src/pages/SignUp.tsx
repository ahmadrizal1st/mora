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
      const responseData = err.response?.data
      setError(responseData?.message || 'Registration failed. Please check your data.')
      setFieldErrors(responseData?.errors)
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
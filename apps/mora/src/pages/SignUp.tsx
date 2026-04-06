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
  const [isLoading, setIsLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent, data: any) => {
    setError(null)
    setIsLoading(true)
    try {
      await register(data)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please check your data.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SingleLayout>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      <SignUpCard onSubmit={handleRegister} isLoading={isLoading} />
    </SingleLayout>
  )
}
// src/features/auth/pages/ForgotPassword.tsx
import { useState } from 'react'
import SingleLayout from '@/shared/layouts/SingleLayout'
import { ForgotPasswordCard } from '@/shared/components/cards/ForgotPasswordCard'
import { useForgotPasswordMutation } from '../hooks/useForgotPasswordMutation'
import { AxiosError } from 'axios'

export default function ForgotPassword() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const forgotPasswordMutation = useForgotPasswordMutation()

  const handleForgotPassword = (email: string) => {
    setError(null)
    setSuccess(false)
    
    forgotPasswordMutation.mutate({ email }, {
      onSuccess: () => {
        setSuccess(true)
      },
      onError: (err: AxiosError<{ message?: string }>) => {
        setError(err.response?.data?.message || 'Failed to send reset link.')
      }
    })
  }

  return (
    <SingleLayout>
      <ForgotPasswordCard 
        onSubmit={handleForgotPassword}
        isLoading={forgotPasswordMutation.isPending}
        error={error}
        success={success}
      />
    </SingleLayout>
  )
}
// src/features/auth/pages/ResetPassword.tsx
import { useState } from 'react'
import SingleLayout from '@/shared/layouts/SingleLayout'
import { ResetPasswordCard } from '@/shared/components/cards/ResetPasswordCard'
import { useResetPasswordMutation } from '../hooks/useResetPasswordMutation'
import { useSearch } from '@tanstack/react-router'
import { AxiosError } from 'axios'

export default function ResetPassword() {
  // TanStack Router search params for token
  const search = useSearch({ from: '/reset-password' }) as { token?: string }
  const token = search.token || ''

  const resetMutation = useResetPasswordMutation()
  const [error, setError] = useState<string | null>(null)

  const handleReset = (password: string, passwordConfirmation: string) => {
    setError(null)
    
    if (!token) {
      setError('Reset token is missing. Please check your email link.')
      return
    }

    if (password !== passwordConfirmation) {
      setError('Passwords do not match.')
      return
    }

    resetMutation.mutate({
      token,
      password,
      password_confirmation: passwordConfirmation
    }, {
      onError: (err: AxiosError<{ message?: string }>) => {
        setError(err.response?.data?.message || 'Failed to reset password.')
      }
    })
  }

  return (
    <SingleLayout>
      <ResetPasswordCard 
        onSubmit={handleReset}
        isLoading={resetMutation.isPending}
        error={error}
      />
    </SingleLayout>
  )
}

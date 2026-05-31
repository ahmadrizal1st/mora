import { useState } from 'react'
import SingleLayout from '@/shared/layouts/SingleLayout'
import { ForgotPasswordCard } from '@/shared/components/cards/ForgotPasswordCard'
import { useForgotPasswordMutation } from '../hooks/useForgotPasswordMutation'

export default function ForgotPassword() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const forgotPasswordMutation = useForgotPasswordMutation()

  const handleForgotPassword = (email: string) => {
    setError(null)
    setSuccess(false)

    forgotPasswordMutation.mutate(
      { email },
      {
        onSuccess: () => {
          setSuccess(true)
        },
        onError: (err) => {
          const responseData = err.response?.data as { message?: string } | undefined
          setError(responseData?.message || 'Failed to send reset link.')
        },
      }
    )
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

// src/pages/SignIn.tsx
import { useState } from 'react'
import SingleLayout from '@/shared/layouts/SingleLayout'
import { SignInCard } from '@/shared/components/cards/SignInCard'
import { useAuthStore } from '@/features/auth/store/authStore'
import { useSignInMutation } from '@/features/auth/hooks/useSignInMutation'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import type { SignInFormData } from '@/features/auth/components/SignInForm'
import { useNavigate, useSearch } from '@tanstack/react-router'

export default function SignIn() {
  const loginWithGoogle = useAuthStore(s => s.loginWithGoogle)
  const navigate = useNavigate()
  const { redirect } = useSearch({ from: '/sign-in' })
  const signInMutation = useSignInMutation(redirect)

  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]> | undefined>(undefined)

  const googleSignInMutation = useMutation<void, AxiosError, string>({
    mutationFn: async (credential: string) => {
      await loginWithGoogle(credential)
    },
    onSuccess: () => {
      if (redirect) {
        window.location.href = redirect
      } else {
        navigate({ to: '/dashboard' })
      }
    },
    onError: (err) => {
      const responseData = err.response?.data as { message?: string } | undefined
      setError(responseData?.message || 'Google login failed.')
    }
  })

  const handleLogin = (data: SignInFormData) => {
    setError(null)
    setFieldErrors(undefined)
    signInMutation.mutate(data, {
      onError: (err) => {
        const responseData = err.response?.data as { message?: string, errors?: Record<string, string[]> } | undefined
        setError(responseData?.message || 'Login failed. Please check your credentials.')
        setFieldErrors(responseData?.errors)
      }
    })
  }

  const handleGoogleSuccess = (credentialResponse: { credential?: string }) => {
    setError(null)
    if (credentialResponse.credential) {
      googleSignInMutation.mutate(credentialResponse.credential)
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
        isLoading={signInMutation.isPending || googleSignInMutation.isPending}
        error={error}
        fieldErrors={fieldErrors}
      />
    </SingleLayout>
  )
}
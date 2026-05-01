// src/features/auth/pages/SignInIllustration.tsx
import { useState } from 'react'
import SingleLayout from '@/shared/layouts/SingleLayout'
import { NavbarLogo } from '@/shared/components/layout/NavbarLogo'
import { SignInCard } from '@/shared/components/cards'
import { Illustration } from '@/shared/components/ui/Illustration'
import { useSignInMutation } from '../hooks/useSignInMutation'
import { useAuthStore } from '@/features/auth/store/authStore'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import type { SignInFormData } from '@/features/auth/components/SignInForm'
import { useNavigate } from '@tanstack/react-router'

export default function SignInIllustration() {
  const loginWithGoogle = useAuthStore(s => s.loginWithGoogle)
  const navigate = useNavigate()
  const signInMutation = useSignInMutation()

  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]> | undefined>(undefined)

  const googleSignInMutation = useMutation<void, AxiosError, string>({
    mutationFn: async (credential: string) => {
      await loginWithGoogle(credential)
    },
    onSuccess: () => navigate({ to: '/dashboard' }),
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

  return (
    <SingleLayout containerSize="lg" hideLogo>
      <div className="row align-items-center g-4">
        <div className="col-lg">
          <div className="container-tight">
            <div className="text-center mb-4">
              <NavbarLogo />
            </div>
            <SignInCard 
              showHeader={true} 
              onSubmit={handleLogin}
              onGoogleSuccess={handleGoogleSuccess}
              isLoading={signInMutation.isPending || googleSignInMutation.isPending}
              error={error}
              fieldErrors={fieldErrors}
            />
          </div>
        </div>
        <div className="col-lg d-none d-lg-block">
          <Illustration
            image="boy-with-key.svg"
            className="d-block mx-auto"
            height={400}
            alt="Sign in illustration"
          />
        </div>
      </div>
    </SingleLayout>
  )
}

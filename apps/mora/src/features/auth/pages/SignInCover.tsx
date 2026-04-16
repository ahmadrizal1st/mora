// src/features/auth/pages/SignInCover.tsx
import { useState } from 'react'
import { NavbarLogo } from '@/shared/components/layout/NavbarLogo'
import { SignInForm } from '@/features/auth/components/SignInForm'
import { Photo } from '@/shared/components/ui/Photo'
import { useSignInMutation } from '../hooks/useSignInMutation'
import { AxiosError } from 'axios'
import type { SignInFormData } from '@/features/auth/components/SignInForm'

export default function SignInCover() {
  const signInMutation = useSignInMutation()
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]> | undefined>(undefined)

  const handleLogin = (data: SignInFormData) => {
    setError(null)
    setFieldErrors(undefined)
    signInMutation.mutate(data, {
      onError: (err: AxiosError<{ message?: string, errors?: Record<string, string[]> }>) => {
        const responseData = err.response?.data
        setError(responseData?.message || 'Login failed. Please check your credentials.')
        setFieldErrors(responseData?.errors)
      }
    })
  }

  return (
    <div className="page page-center bg-white" style={{ minHeight: '100vh' }}>
      <div className="row g-0 flex-fill">
        <div className="col-12 col-lg-6 col-xl-4 border-top-wide border-primary d-flex flex-column justify-content-center">
          <div className="container container-tight my-5 px-lg-5">
            <div className="text-center mb-4">
              <NavbarLogo />
            </div>
            <h2 className="h3 text-center mb-3">Login to your account</h2>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <SignInForm 
              onSubmit={handleLogin} 
              isLoading={signInMutation.isPending}
              fieldErrors={fieldErrors}
            />

            <div className="text-center text-secondary mt-3">
              Don't have account yet? <a href="/sign-up" tabIndex={-1}>Sign up</a>
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-6 col-xl-8 d-none d-lg-block">
          <Photo
            id={11}
            background={true}
            className="bg-cover h-100 min-vh-100"
          />
        </div>
      </div>
    </div>
  )
}

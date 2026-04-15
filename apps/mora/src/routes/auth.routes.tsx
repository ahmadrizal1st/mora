// src/routes/auth.routes.tsx
import { Route } from 'react-router-dom'
import { lazy, Suspense, type ComponentType } from 'react'

function load<P extends object>(factory: () => Promise<{ default: ComponentType<P> }>) {
  const Page = lazy(factory)
  return (props: P) => (
    <Suspense fallback={null}>
      <Page {...props} />
    </Suspense>
  )
}

const SignIn = load(() => import('@/features/auth/pages/SignIn'))
const SignUp = load(() => import('@/features/auth/pages/SignUp'))
const ForgotPassword = load(() => import('@/features/auth/pages/ForgotPassword'))
const SignInCover = load(() => import('@/features/auth/pages/SignInCover'))
const SignInIllustration = load(() => import('@/features/auth/pages/SignInIllustration'))
const SignInLink = load(() => import('@/features/auth/pages/SignInLink'))
const TwoStepVerification = load(() => import('@/features/auth/pages/TwoStepVerification'))
const TwoStepVerificationCode = load(() => import('@/features/auth/pages/TwoStepVerificationCode'))
const AuthLock = load(() => import('@/features/auth/pages/AuthLock'))
const Welcome = load(() => import('@/features/auth/pages/Welcome'))

import { GuestRoute } from './guards/GuestRoute'

export const authRoutes = (
  <>
    <Route path="/sign-in" element={<GuestRoute><SignIn /></GuestRoute>} />
    <Route path="/welcome" element={<GuestRoute><Welcome /></GuestRoute>} />
    <Route path="/sign-up" element={<GuestRoute><SignUp /></GuestRoute>} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/sign-in-cover" element={<GuestRoute><SignInCover /></GuestRoute>} />
    <Route path="/sign-in-illustration" element={<GuestRoute><SignInIllustration /></GuestRoute>} />
    <Route path="/sign-in-link" element={<GuestRoute><SignInLink /></GuestRoute>} />
    <Route path="/2-step-verification" element={<TwoStepVerification />} />
    <Route path="/2-step-verification-code" element={<TwoStepVerificationCode />} />
    <Route path="/auth-lock" element={<AuthLock />} />
  </>
)

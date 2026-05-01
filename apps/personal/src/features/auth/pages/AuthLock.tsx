// src/features/auth/pages/AuthLock.tsx
import { useState } from 'react'
import SingleLayout from '@/shared/layouts/SingleLayout'
import { AuthLockCard } from '@/shared/components/cards'
import { useAuthStore } from '@/features/auth/store/authStore'
import { useSignInMutation } from '../hooks/useSignInMutation'
import { AxiosError } from 'axios'
import { type Person } from '@/shared/types/common.types'
import { getApiErrorMessage } from '@/shared/utils/errorUtils'

export default function AuthLock() {
  const user = useAuthStore(s => s.user)
  const signInMutation = useSignInMutation()
  const [error, setError] = useState<string | null>(null)

  const handleUnlock = (password: string) => {
    setError(null)
    if (!user?.email) {
      setError('User session not found. Please sign in again.')
      return
    }

    // Re-sign in with current user's email and provided password
    signInMutation.mutate({ 
      email: user.email, 
      password 
    }, {
      onError: (err: AxiosError) => {
        setError(getApiErrorMessage(err, 'Unlock failed. Please check your password.'))
      }
    })
  }

  // Convert User to Person type for AuthLockCard
  const person: Person | undefined = user ? {
    full_name: user.name,
    photo: user.avatar,
    email: user.email
  } : undefined

  return (
    <SingleLayout>
      {error && (
        <div className="alert alert-danger mb-3" role="alert">
          {error}
        </div>
      )}
      <AuthLockCard 
        person={person} 
        onUnlock={handleUnlock}
      />
    </SingleLayout>
  )
}

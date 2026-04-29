import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import SignIn from '@/features/auth/pages/SignIn'

const signInSearchSchema = z.object({
  redirect: z.string().optional(),
})

export const Route = createFileRoute('/sign-in')({
  validateSearch: signInSearchSchema,
  component: SignIn,
})

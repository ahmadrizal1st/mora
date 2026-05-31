import * as z from 'zod'

export const signInSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(4, 'Password must be at least 4 characters'),
  remember: z.boolean(),
})

export type SignInFormData = z.infer<typeof signInSchema>

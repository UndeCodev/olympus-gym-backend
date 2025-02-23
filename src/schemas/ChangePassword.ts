import { z } from 'zod'

export const changePasswordSchema = z.object({
  oldPassword: z.string({
    invalid_type_error: 'Old password must be a string',
    required_error: 'Old password is required'
  }),
  newPassword: z
    .string({
      invalid_type_error: 'New password must be a string',
      required_error: 'New password is required'
    })
    .min(12, 'The new password must be at least 12 characters long')
    .regex(/[A-Z]/, 'Must contain at least one capital letter')
    .regex(/[a-z]/, 'Must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Must contain at least one number')
    .regex(/[\W_]/, 'Must contain at least one symbol')
})

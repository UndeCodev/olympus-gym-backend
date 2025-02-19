import { z } from 'zod'
import { ValidationSchemaResult } from '../types'
import { zodValidationService } from '../services/zodValidationService'

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
    .min(12, 'La nueva contraseña debe tener al menos 12 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una letra mayúscula')
    .regex(/[a-z]/, 'Debe contener al menos una letra minúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número')
    .regex(/[\W_]/, 'Debe contener al menos un símbolo')
})

export const validateChangePassword = (data: unknown): ValidationSchemaResult<typeof changePasswordSchema> => zodValidationService(changePasswordSchema, data)

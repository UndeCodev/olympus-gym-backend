import z from 'zod'
import validator from 'validator'
import { zodValidationService } from '../services/zodValidationService'
import { ValidationSchemaResult } from '../types'

const onlyLetters = /^[a-zA-Z]+$/

export const userSchema = z.object({
  firstName: z
    .string({
      invalid_type_error: 'First name must be a string',
      required_error: 'First name is required'
    })
    .regex(onlyLetters, 'First name must contain only letters')
    .min(2, 'First name must be at least 2 characters long')
    .trim(),
  lastName: z
    .string({
      invalid_type_error: 'Last name must be a string',
      required_error: 'Last name is required'
    })
    .trim(),
  phoneNumber: z
    .string({
      invalid_type_error: 'Phone number must be a string',
      required_error: 'Phone number is required'
    })
    .regex(/^\d{3}-\d{3}-\d{4}$/, 'Invalid phone number format. Expected format: ###-###-####'),
  birthDate: z
    .string().date(),
  email: z
    .string({
      invalid_type_error: 'Email must be a string',
      required_error: 'Email is required'
    })
    .email({
      message: 'Invalid email address'
    }),
  password: z
    .string({
      invalid_type_error: 'Password must be a string',
      required_error: 'Password is required'
    })
    .refine(validator.isStrongPassword, 'Password must be contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number, and 1 symbol')
})

// Just the email and password without .refine
const loginSchema = userSchema.pick({ email: true }).extend({
  password: z
    .string({
      invalid_type_error: 'Password must be a string',
      required_error: 'Password is required'
    })
})

// Just the email
const validateResendSchema = userSchema.pick({ email: true })

export const validateUser = (data: unknown): ValidationSchemaResult<typeof userSchema> => zodValidationService(userSchema, data)

export const validateResendVerification = (data: unknown): ValidationSchemaResult<typeof validateResendSchema> => zodValidationService(validateResendSchema, data)

export const validateLoginUser = (data: unknown): ValidationSchemaResult<typeof loginSchema> => zodValidationService(loginSchema, data)

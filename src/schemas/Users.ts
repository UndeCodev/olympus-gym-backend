import z from 'zod'
import { ValidationSchemaResult } from '../types'
import validator from 'validator'

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
  phoneNumber: z.string({
    invalid_type_error: 'Phone number must be a string',
    required_error: 'Phone number is required'
  }).refine(validator.isMobilePhone, 'Invalid phone number'),
  birthDate: z.string().date('Invalid date format'),
  email: z.string({
    invalid_type_error: 'Email must be a string',
    required_error: 'Email is required'
  }).email({
    message: 'Invalid email address'
  }),
  password: z.string({
    invalid_type_error: 'Password must be a string',
    required_error: 'Password is required'
  }).refine(validator.isStrongPassword, 'Password must be contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number, and 1 symbol')
})

const loginSchema = z.object({
  email: z.string({
    invalid_type_error: 'Email must be a string',
    required_error: 'Email is required'
  }).email({
    message: 'Invalid email address'
  }),
  password: z.string({
    invalid_type_error: 'Password must be a string',
    required_error: 'Password is required'
  })
})

export const validateUser = (data: unknown): ValidationSchemaResult => {
  const result = userSchema.safeParse(data)

  return result.success
    ? { success: true, data: result.data }
    : { success: false, error: result.error }
}

export const validatePartialUser = (data: unknown): ValidationSchemaResult => {
  const result = loginSchema.safeParse(data)

  return result.success
    ? { success: true, data: result.data }
    : { success: false, error: result.error }
}

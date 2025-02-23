import { ZodError, type ZodSchema, z } from 'zod'
import { User } from './interfaces/User'

type ValidationSchemaResult<T extends ZodSchema> =
  | { success: true, data: z.infer<T> }
  | { success: false, error: ZodError }

export type NonSensitiveUserData = Omit<User, 'password' | 'emailVerified' | 'twoFactorEnabled'>
export type AuthLoginDataUser = Pick<User, 'email' | 'password'>

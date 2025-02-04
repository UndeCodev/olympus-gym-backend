import { ZodError, type ZodSchema, z } from 'zod'
import { HttpCode } from './enums'
import { Role } from '@prisma/client'

type ValidationSchemaResult<T extends ZodSchema> =
  | { success: true, data: z.infer<T> }
  | { success: false, error: ZodError }

// User interface
export interface User {
  id?: number
  firstName: string
  lastName: string
  phoneNumber: string
  birthDate: Date
  email: string
  emailVerified?: boolean
  twoFactorEnabled?: boolean
  createdAt?: Date
  updatedAt?: Date | null
  password: string
  role?: Role
}

export type NonSensitiveUserData = Omit<User, 'password', 'emailVerified', 'twoFactorEnabled'>
export type AuthLoginDataUser = Pick<User, 'email' | 'password'>

// Error handler interface
interface AppErrorArgs {
  name?: string
  httpCode: HttpCode
  description: string
  isOperational?: boolean
}

export interface EmailType {
  messageType: MailType
  subject: string
  title: string
  message: string
  actionPath: string
  actionButtonText: string
  subMessage: string | null
  expirationTime: int
}

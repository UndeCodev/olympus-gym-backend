import { ZodSchema } from 'zod'
import { HttpCode } from './enums'
import { Role } from '@prisma/client'

type ValidationSchemaResult = { success: true, data: z.infer<typeof ZodSchema> } | { success: false, error: z.ZodError }

// User interface
export interface User {
  id: number
  firstName: string
  lastName: string
  phoneNumber: string
  birthDate: Date
  email: string
  password: string
  role: Role
}

export type NonSensitiveUserData = Omit<User, 'password'>
export type AuthLoginDataUser = Pick<User, 'email' | 'password'>

// Error handler interface
interface AppErrorArgs {
  name?: string
  httpCode: HttpCode
  description: string
  isOperational?: boolean
}

declare module 'express-session' {
  interface SessionData {
    user: NonSensitiveUserData | null
    access_token: string | null
  }
}

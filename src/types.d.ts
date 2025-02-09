import { ZodSchema } from 'zod'
import { HttpCode } from './enums'

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
}

//Faqs interface
export interface Faqs {
  id?: number,
  question: string,
  answer: string,
}

//products interface
export interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  stockAvailable: number;
  dateAdded: Date;
  status: ProductStatus;
  categoryId: number; 
}

//categories interface
export interface Category {
  id?: number;
  name: string;
}

// Enum for product status
export enum ProductStatus {
  AVAILABLE = "AVAILABLE",
  OUT_OF_STOCK = "OUT_OF_STOCK",
}

export type NonSensitiveUserData = Omit<User, 'password'>
export type AuthUserData = Pick<User, 'email' | 'password'>

// Error handler interface
interface AppErrorArgs {
  name?: string
  httpCode: HttpCode
  description: string
  isOperational?: boolean
}

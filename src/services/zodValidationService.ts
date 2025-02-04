import { ZodSchema } from 'zod'
import { ValidationSchemaResult } from '../types'

export const zodValidationService = <T extends ZodSchema> (schema: T, data: unknown): ValidationSchemaResult<T> => {
  return schema.safeParse(data)
}

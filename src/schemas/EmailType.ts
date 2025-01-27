import z from 'zod'
import { ValidationSchemaResult } from '../types'
import { MessageType } from '@prisma/client'

export const emailTypeSchema = z.object({
  messageType: z
    .enum([MessageType.validateEmail, MessageType.resetPassword], {
      message: `messageType solo debe de ser valor ${String(MessageType.resetPassword)} o ${String(MessageType.validateEmail)}`
    }),
  subject: z
    .string({
      invalid_type_error: 'subject must be a string',
      required_error: 'subject is required'
    }),
  title: z
    .string({
      invalid_type_error: 'subject must be a string',
      required_error: 'subject is required'
    }),
  message: z
    .string({
      invalid_type_error: 'message must be a string',
      required_error: 'message is required'
    }),
  actionPath: z
    .string({
      invalid_type_error: 'actionPath must be a string',
      required_error: 'actionPath is required'
    }),
  actionButtonText: z
    .string({
      invalid_type_error: 'actionButtonText must be a string',
      required_error: 'actionButtonText is required'
    }),
  subMessage: z
    .string({
      invalid_type_error: 'subMessage must be a string',
      required_error: 'subMessage is required'
    }),
  expirationTime: z
    .number({
      invalid_type_error: 'expirationTime must be a number',
      required_error: 'expirationTime is required'
    })
})

export const validateEmailType = (data: unknown): ValidationSchemaResult => {
  const result = emailTypeSchema.safeParse(data)

  return result.success
    ? { success: true, data: result.data }
    : { success: false, error: result.error }
}

import { MessageType } from '@prisma/client'

export interface EmailType {
  messageType: MessageType
  subject: string
  title: string
  message: string
  actionPath: string
  actionButtonText: string
  subMessage: string | null
  expirationTime: number
}

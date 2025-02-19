import { PrismaClient } from '@prisma/client'
import { AppError } from '../exceptions/AppError'
import { HttpCode } from '../enums'
import { EmailType } from '../interfaces/EmailType'

const prisma = new PrismaClient()

export const getAllEmailTypes = async (): Promise<EmailType[]> => {
  return await prisma.email_messages.findMany()
}

export const createEmailType = async (inputData: EmailType): Promise<EmailType | AppError> => {
  const { messageType, subject, title, message, actionPath, actionButtonText, subMessage, expirationTime } = inputData

  const existsMessageType = await prisma.email_messages.findUnique({
    where: {
      messageType
    }
  })

  if (existsMessageType !== null) {
    throw new AppError({
      name: 'AuthError',
      httpCode: HttpCode.BAD_REQUEST,
      description: `El tipo de correo ${String(messageType)} ya existe.`
    })
  }

  const messageTypeCreated = await prisma.email_messages.create({
    data: {
      messageType,
      subject,
      title,
      message,
      actionPath,
      actionButtonText,
      subMessage,
      expirationTime
    }
  })

  return messageTypeCreated
}

import { PrismaClient } from '@prisma/client'
import { AppError } from '../exceptions/AppError'
import { HttpCode } from '../enums'
import { EmailType } from '../interfaces/EmailType'
import { CompanyProfile } from '../interfaces/CompanyProfile'

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

export const getCompanyProfile = async (): Promise<CompanyProfile> => {
  const profile = await prisma.company_profile.findFirst()

  if (profile === null) {
    throw new AppError({
      name: 'CompanyProfileError',
      httpCode: HttpCode.NOT_FOUND,
      description: 'No hay ningún perfil de la empresa'
    })
  }

  return profile
}

export const updateCompanyProfile = async (inputData: CompanyProfile): Promise<CompanyProfile> => {
  const { id, socialMedia, ...dataToUpdate } = inputData

  const companyProfileUpdated = await prisma.company_profile.update({
    where: {
      id
    },
    data: {
      socialMedia: socialMedia ?? undefined,
      ...dataToUpdate
    }
  })

  return companyProfileUpdated
}

// Default
// export const default = async (): Promise<...> => {}

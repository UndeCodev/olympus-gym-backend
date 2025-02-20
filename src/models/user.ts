import { PrismaClient } from '@prisma/client'
import type { AuthLoginDataUser, NonSensitiveUserData } from '../types'
import { AppError } from '../exceptions/AppError'
import { HttpCode } from '../enums'
import { User } from '../interfaces/user.interface'
import { comparePassword, hashPassword } from '../utils/passwordUtils'

const prisma = new PrismaClient()

export const findUserByEmail = async (email: string): Promise<User | AppError> => {
  const user = await prisma.user.findUnique({
    where: {
      email
    }
  })

  if (user === null) {
    throw new AppError({
      name: 'AuthError',
      httpCode: HttpCode.BAD_REQUEST,
      description: `El usuario con el email ${email} no está registrado`
    })
  }

  return user
}

export const findUserById = async (id: number): Promise<User | AppError> => {
  const user = await prisma.user.findUnique({
    where: {
      id
    }
  })

  if (user === null) {
    throw new AppError({
      name: 'AuthError',
      httpCode: HttpCode.BAD_REQUEST,
      description: `El usuario con el ID ${id} no fue encontrado.`
    })
  }

  return user
}

export const createUser = async (input: User): Promise<User> => {
  const { firstName, lastName, phoneNumber, birthDate, email, password } =
    input

  const userFound = await prisma.user.findUnique({
    where: { email }
  })

  if (userFound !== null) {
    throw new AppError({
      name: 'AuthError',
      httpCode: HttpCode.BAD_REQUEST,
      description: `El usuario con el correo ${email} ya existe`
    })
  }

  const hashedPassword = await hashPassword(password)

  return await prisma.user.create({
    data: {
      firstName,
      lastName,
      phoneNumber,
      birthDate,
      email,
      password: hashedPassword
    }
  })
}

export const loginUser = async (input: AuthLoginDataUser): Promise<NonSensitiveUserData | undefined> => {
  const { email, password } = input

  const userFound = await findUserByEmail(email)
  if (userFound instanceof AppError) return

  const verifyPassword = await comparePassword(password, userFound.password)

  if (!verifyPassword) {
    throw new AppError({
      name: 'AuthError',
      httpCode: HttpCode.UNAUTHORIZED,
      description: 'El correo electrónico o la contraseña son inválidos.'
    })
  }

  const user: NonSensitiveUserData = {
    id: userFound.id,
    firstName: userFound.firstName,
    lastName: userFound.lastName,
    phoneNumber: userFound.phoneNumber,
    birthDate: userFound.birthDate,
    email: userFound.email,
    role: userFound.role
  }

  return user
}

export const resetPassword = async (userId: number, newPassword: string): Promise<void> => {
  const userFound = await findUserById(userId)

  if (userFound instanceof AppError) return

  const hashedPassword = await hashPassword(newPassword)

  await prisma.user.update({
    where: {
      id: userId
    },
    data: {
      password: hashedPassword
    }
  })
}

//  const default = async(input: data): Promise<boolean | AppError> => {
// }

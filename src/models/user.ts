import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import { AuthLoginDataUser, NonSensitiveUserData, User } from '../types'
import { SALT_ROUNDS } from '../config/config'
import { AppError } from '../exceptions/AppError'
import { HttpCode } from '../enums'

const prisma = new PrismaClient()

export class UserModel {
  static async findUserByEmail (email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: {
        email
      }
    })
  }

  static async createUser (input: User): Promise<NonSensitiveUserData | AppError> {
    const { firstName, lastName, phoneNumber, birthDate, email, password } =
      input

    const userFound = await this.findUserByEmail(email)

    if (userFound !== null) {
      throw new AppError({
        name: 'AuthError',
        httpCode: HttpCode.BAD_REQUEST,
        description: `El usuario con el correo ${email} ya existe`
      })
    }

    const hashedPassword = await bcrypt.hash(password, Number(SALT_ROUNDS))

    const userCreated = await prisma.user.create({
      data: {
        firstName,
        lastName,
        phoneNumber,
        birthDate,
        email,
        password: hashedPassword
      }
    })

    return userCreated
  }

  static async loginUser (input: AuthLoginDataUser): Promise<NonSensitiveUserData | AppError> {
    const { email, password } = input

    const userFound = await this.findUserByEmail(email)

    if (userFound === null) {
      throw new AppError({
        name: 'AuthError',
        httpCode: HttpCode.NOT_FOUND,
        description: `El usuario con el correo ${email} no está registrado.`
      })
    }

    const verifyPassword = await bcrypt.compare(password, userFound.password)

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

  // static async default (input: data): Promise<NonSensitiveUserData | AppError> {
  // }
}

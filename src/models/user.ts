import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import { AuthUserData, NonSensitiveUserData, User } from '../types'
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
        description: `User with the email ${email} already exists`
      })
    }

    const hashedPassword = await bcrypt.hash(password, Number(SALT_ROUNDS))

    const userCreated = await prisma.user.create({
      data: {
        firstName,
        lastName,
        phoneNumber,
        birthDate: new Date(birthDate),
        email,
        password: hashedPassword
      }
    })

    return userCreated
  }

  static async loginUser (input: AuthUserData): Promise<NonSensitiveUserData | AppError> {
    const { email, password } = input

    const userFound = await this.findUserByEmail(email)

    if (userFound === null) {
      throw new AppError({
        name: 'AuthError',
        httpCode: HttpCode.NOT_FOUND,
        description: `User with the email ${email} doesn't exists`
      })
    }

    const verifyPassword = await bcrypt.compare(password, userFound.password)

    if (!verifyPassword) {
      throw new AppError({
        name: 'AuthError',
        httpCode: HttpCode.UNAUTHORIZED,
        description: 'Email or password are'
      })
    }

    const user: NonSensitiveUserData = {
      id: userFound.id,
      firstName: userFound.firstName,
      lastName: userFound.lastName,
      phoneNumber: userFound.phoneNumber,
      birthDate: userFound.birthDate,
      email: userFound.email
    }

    return user
  }
}

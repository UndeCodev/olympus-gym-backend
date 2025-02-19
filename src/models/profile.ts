import { PrismaClient } from '@prisma/client'
import { AppError } from '../exceptions/AppError'
import { HttpCode } from '../enums'
import bcrypt from 'bcrypt'
import * as UserModel from './user'
import { SALT_ROUNDS } from '../config/config'

const prisma = new PrismaClient()

export const changePassword = async (userId: number, oldPassword: string, newPassword: string): Promise<void> => {
  const user = await UserModel.findUserById(userId)

  if (user instanceof AppError) return

  const isPasswordMatch = await bcrypt.compare(oldPassword, user.password)

  if (!isPasswordMatch) {
    throw new AppError({
      name: 'ProfileError',
      httpCode: HttpCode.BAD_REQUEST,
      description: 'La contraseña actual es incorrecta'
    })
  }

  const hashedPassword = await bcrypt.hash(newPassword, Number(SALT_ROUNDS))

  await prisma.user.update({
    where: { id: userId },
    data: {
      password: hashedPassword
    }
  })
}

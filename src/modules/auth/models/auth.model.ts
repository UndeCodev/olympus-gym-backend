import { PrismaClient } from '../../../../generated/prisma';
import { User } from '../../../core/entities/User';
import { AppError } from '../../../core/errors/AppError';
import { HttpCode } from '../../../shared/interfaces/HttpCode';

const prisma = new PrismaClient();

export class AuthModel {
  static async findUserByEmail(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    return user;
  }

  static async createUser(user: User) {
    const existingUser = await this.findUserByEmail(user.email);

    if (existingUser) {
      throw new AppError({
        httpCode: HttpCode.CONFLIT,
        description: 'El correo electrónico ya está registrado',
      });
    }

    const newUser = await prisma.user.create({ data: user });

    return newUser;
  }
}

import { PrismaClient } from '../../../../generated/prisma';
import { User } from '../../../core/entities/User';
import { AppError } from '../../../core/errors/AppError';
import { HttpCode } from '../../../shared/interfaces/HttpCode';

import bcrypt from 'bcrypt';

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

    const hashedPassword = await bcrypt.hash(user.password, 10);

    user.password = hashedPassword;

    const newUser = await prisma.user.create({ data: user });

    return newUser;
  }

  static async login(email: string, password: string) {
    const user = await this.findUserByEmail(email);

    if (!user) {
      throw new AppError({
        httpCode: HttpCode.NOT_FOUND,
        description: 'El correo electrónico no esta registrado',
      });
    }

    if (!user.emailVerified) {
      throw new AppError({
        httpCode: HttpCode.UNAUTHORIZED,
        description:
          'El correo electrónico no ha sido verificado. Por favor, revisa tu correo electrónico para verificar tu cuenta.',
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new AppError({
        httpCode: HttpCode.UNAUTHORIZED,
        description: 'Credenciales incorrectas',
      });
    }

    const { password: _, emailVerified, twoFactorEnabled, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }
}

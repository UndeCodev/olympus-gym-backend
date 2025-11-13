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

  static async findUserByEmailWithoutSensitiveData(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        birthDate: true,
        email: true,
        phoneNumber: true,
        rol: true,
        emailVerified: true,
        verifyCode: true
      },
    });
    return user;
  }

  static async findUserById(id: number) {
    const user = await prisma.user.findUnique({ where: { id } });
    return user;
  }

  static async findUserByIdWithouSensitiveData(id: number) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        birthDate: true,
        email: true,
        phoneNumber: true,
        rol: true,
        emailVerified: true,
        verifyCode: true,
        profilePictureUrl: true
      },
    });
    return user;
  }

  static async createUser(user: User) {
    const existingUser = await this.findUserByEmail(user.email);

    if (existingUser) {
      throw new AppError({
        httpCode: HttpCode.CONFLICT,
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

    const { password: _, twoFactorEnabled, refreshToken, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }

  static async verifyEmail(userId: number) {
    const userFound = await this.findUserById(userId);

    if (!userFound) {
      throw new AppError({
        httpCode: HttpCode.NOT_FOUND,
        description: 'No se encontro el usuario',
      });
    }

    if (userFound.emailVerified) {
      throw new AppError({
        httpCode: HttpCode.CONFLICT,
        description: 'El correo electrónico ya ha sido verificado',
      });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { emailVerified: true },
    });
  }

  static async resetPassword(id: number, newPassword: string) {
    const userFound = await this.findUserById(id);

    if (!userFound) {
      throw new AppError({
        httpCode: HttpCode.NOT_FOUND,
        description: 'No se encontró el usuario',
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
  }

  static async changePassword(userId: number, oldPassword: string, newPassword: string) {
    const userFound = await this.findUserById(userId);

    if (!userFound) {
      throw new AppError({
        httpCode: HttpCode.NOT_FOUND,
        description: 'No se encontró el usuario',
      });
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, userFound.password);

    if (!isPasswordValid) {
      throw new AppError({
        httpCode: HttpCode.UNAUTHORIZED,
        description: 'Credenciales incorrectas',
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }
}

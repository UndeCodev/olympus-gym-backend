import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '../../../../generated/prisma';
import { AppError } from '../../../core/errors/AppError';
import { HttpCode } from '../../../shared/interfaces/HttpCode';

const prisma = new PrismaClient();

export const authorize = (roles: string[]) => {
  return async (_: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user;

    if (!user) {
      throw new AppError({
        httpCode: HttpCode.UNAUTHORIZED,
        description: 'Auhtentication required',
      });
    }

    const userFound = await prisma.user.findUnique({ where: { id: user.id } });

    if (!userFound || !roles.includes(userFound.rol)) {
      throw new AppError({
        httpCode: HttpCode.FORBIDDEN,
        description: 'Unauthorized access',
      });
    }

    next();
  };
};

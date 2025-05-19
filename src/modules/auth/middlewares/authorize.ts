import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '../../../../generated/prisma';
import { AppError } from '../../../core/errors/AppError';
import { HttpCode } from '../../../shared/interfaces/HttpCode';

const prisma = new PrismaClient();

export const authorize = (roles: string[]) => {
  return async (_: Request, res: Response, next: NextFunction) => {
    const userId = res.locals.user;
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user || !roles.includes(user.rol)) {
      throw new AppError({
        httpCode: HttpCode.FORBIDDEN,
        description: 'Acceso denegado',
      });
    }

    next();
  };
};

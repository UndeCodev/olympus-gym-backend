import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../core/errors/AppError';
import { HttpCode } from '../interfaces/HttpCode';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.cookies.access_token;

  if (!accessToken) {
    throw new AppError({
      httpCode: HttpCode.UNAUTHORIZED,
      description: 'No token provided',
    });
  }

  const decoded = jwt.verify(accessToken, String(JWT_SECRET));

  if (typeof decoded !== 'string' && 'id' in decoded) {
    res.locals.user = (decoded as JwtPayload).id;
    return next();
  }

  throw new AppError({
    httpCode: HttpCode.UNAUTHORIZED,
    description: 'Invalid token',
  });
};

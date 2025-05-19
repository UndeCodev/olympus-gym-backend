import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../../core/errors/AppError';
import { HttpCode } from '../../../shared/interfaces/HttpCode';
import { tokenService } from '../../../shared/services/tokens.service';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError({
      httpCode: HttpCode.UNAUTHORIZED,
      description: 'No token provided',
    });
  }

  const accessToken = authHeader.split(' ')[1];

  const decoded = tokenService.verifyAccessToken(accessToken);

  if (typeof decoded !== 'string' && 'id' in decoded) {
    res.locals.user = decoded.id;
    next();
  }
};

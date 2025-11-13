import { Request, Response, NextFunction } from 'express';
import { tokenService } from '../../../shared/services/tokens.service';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const accessToken = authHeader.split(' ')[1];

    const decoded = tokenService.verifyAccessToken(accessToken);

    if (typeof decoded !== 'string' && 'id' in decoded) {
      res.locals.user = decoded;
    }
  }

  next();
};

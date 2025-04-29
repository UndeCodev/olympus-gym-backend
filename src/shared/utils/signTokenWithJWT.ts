import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env';

export const signTokenWithJWT = (id: number) => {
  const token = jwt.sign({ id }, String(JWT_SECRET), { expiresIn: '1d' });

  return token;
};

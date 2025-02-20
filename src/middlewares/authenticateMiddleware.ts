import { Request, Response, NextFunction } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { JWT_SECRET } from '../config/config'
import { HttpCode } from '../enums'

interface AuthRequest extends Request {
  userId?: number
}

interface TokenPayload extends JwtPayload {
  userId: number
}

const authenticateMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const token = req.cookies?.access_token

  if (token === undefined || token === null || token.trim() === '') {
    res.status(HttpCode.UNAUTHORIZED).json({ message: 'Acceso denegado. No hay token.' })
    return
  }

  try {
    const decoded = jwt.verify(token, String(JWT_SECRET)) as TokenPayload

    res.locals.user = decoded.userId
    next()
  } catch (error) {
    res.status(HttpCode.FORBIDDEN).json({ message: 'Token inválido.' })
  }
}

export default authenticateMiddleware

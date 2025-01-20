import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config/config'

import { AppError } from '../exceptions/AppError'
import { HttpCode } from '../enums'

export const verifyToken = (req: Request, _response: Response, next: NextFunction): void => {
  const token = req.cookies.access_token ?? null

  if (token === null) {
    throw new AppError({
      name: 'TokenError',
      httpCode: HttpCode.UNAUTHORIZED,
      description: 'No token, no authorized'
    })
  }

  try {
    const data = jwt.verify(token, String(JWT_SECRET))

    console.log(data)
  } catch (error) { }

  next()
}

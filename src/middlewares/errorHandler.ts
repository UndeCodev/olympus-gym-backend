import { errorHandler } from '../exceptions/ErrorHandler'
import { AppError } from '../exceptions/AppError'
import { Request, Response, NextFunction } from 'express'

export const errorHandlerMiddleware = (err: Error | AppError, _req: Request, response: Response, next: NextFunction): void => {
  errorHandler.handleError(err, response)
  next()
}

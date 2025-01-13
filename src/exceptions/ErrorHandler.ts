import { Response } from 'express'
import { AppError } from './AppError'
import { HttpCode } from '../enums'

class ErrorHandler {
  private isTrustedError (error: Error): boolean {
    if (error instanceof AppError) return error.isOperational

    return false
  }

  public handleError (error: Error | AppError, response?: Response): void {
    if (this.isTrustedError(error) && response !== undefined) {
      this.handleTrustedError(error as AppError, response)
    } else {
      this.handleCriticalError(response)
    }
  }

  private handleTrustedError (error: AppError, response: Response): void {
    response.status(error.httpCode).json({ message: error.message })
  }

  private handleCriticalError (response?: Response): void {
    // TODO: Implement an error log file

    if (response !== undefined) {
      response
        .status(HttpCode.INTERNAL_SERVER_ERROR)
        .json({ message: 'Internal server error' })
    }

    console.log('Application encountered a critical error. Exiting')
    process.exit(1)
  }
}
export const errorHandler = new ErrorHandler()

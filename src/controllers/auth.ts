import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

import { validatePartialUser, validateUser } from '../schemas/Users'
import { UserModel } from '../models/user'
import { JWT_SECRET, NODE_ENV } from '../config/config'
import { HttpCode } from '../enums'
import { AppError } from '../exceptions/AppError'
import { sendEmail } from '../services/mailService'

// Validates user inputs
export class AuthController {
  static async createUser (req: Request, res: Response, next: NextFunction): Promise<void> {
    const resultValidationInputData = validateUser(req.body)

    if (!resultValidationInputData.success) {
      res.status(400).json({
        message: 'Validation error',
        errors: resultValidationInputData.error.format()
      })
      return
    }

    try {
      const userCreated = await UserModel.createUser(resultValidationInputData.data)

      if (!(userCreated instanceof AppError)) {
        await sendEmail('validateEmail', userCreated.email)

        res.status(HttpCode.CREATED).json({
          message: 'User created successfully'
        })
      }
    } catch (error) {
      next(error)
    }
  }

  static async loginUser (req: Request, res: Response, next: NextFunction): Promise<void> {
    const resultValidation = validatePartialUser(req.body)

    if (!resultValidation.success) {
      res.status(400).json({
        message: 'Validation error',
        errors: resultValidation.error.format()
      })
      return
    }

    try {
      // Call the model to login the user
      const user = await UserModel.loginUser(resultValidation.data)

      if (!(user instanceof AppError)) {
        const token = jwt.sign({ id: user.id, rol: user.role }, String(JWT_SECRET), {
          expiresIn: '1h'
        })

        res.cookie('access_token', token, {
          httpOnly: true,
          secure: NODE_ENV === 'production',
          sameSite: 'strict'
        }).status(200).send({
          user
        })
      }
    } catch (error) {
      next(error)
    }
  }

  static async logout (_req: Request, res: Response, _next: NextFunction): Promise<void> {
    res
      .clearCookie('access_token')
      .json({ message: 'logout successfull' })
  }
}

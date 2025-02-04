import { NextFunction, Request, Response } from 'express'

import { UserModel } from '../models/user'
import { HttpCode } from '../enums'
import { validateLoginUser, validateResendVerification, validateUser } from '../schemas/Users'
import { JWT_SECRET, NODE_ENV } from '../config/config'
import jwt from 'jsonwebtoken'
import { AppError } from '../exceptions/AppError'
import { sendEmail } from '../services/mailService'

// Validates user inputs
export class AuthController {
  static async createUser (req: Request, res: Response, next: NextFunction): Promise<void> {
    const resultValidationInputData = validateUser(req.body)

    if (!resultValidationInputData.success) {
      res.status(HttpCode.BAD_REQUEST).json({
        message: 'Validation error',
        errors: resultValidationInputData?.error?.format()
      })

      console.log(resultValidationInputData?.error?.format())
      return
    }

    const { birthDate } = resultValidationInputData.data

    try {
      const userCreated = await UserModel.createUser({ ...resultValidationInputData.data, birthDate: new Date(birthDate) })

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
    const resultValidation = validateLoginUser(req.body)

    if (!resultValidation.success) {
      res.status(HttpCode.BAD_REQUEST).json({
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

  static async resendVerificationEmail (req: Request, res: Response, next: NextFunction): Promise<void> {
    const resultValidation = validateResendVerification(req.body)

    if (!resultValidation.success) {
      res.status(HttpCode.BAD_REQUEST).json({
        message: 'Validation error',
        errors: resultValidation.error.format()
      })
      return
    }

    try {
      const { email } = resultValidation.data
      const userFound = await UserModel.findUserByEmail(email)

      if (userFound === null) {
        throw new AppError({
          name: 'AuthError',
          httpCode: HttpCode.NOT_FOUND,
          description: `El usuario con el correo ${email} no está registrado.`
        })
      }

      if (userFound.emailVerified !== false) {
        throw new AppError({
          name: 'AuthError',
          httpCode: HttpCode.BAD_REQUEST,
          description: `El usuario con el correo ${email} ya está verificado.`
        })
      }

      await sendEmail('validateEmail', email)

      res.status(HttpCode.OK).json({
        message: 'Correo de verificación enviado correctamente.'
      })
    } catch (error) {
      next(error)
    }
  }
}

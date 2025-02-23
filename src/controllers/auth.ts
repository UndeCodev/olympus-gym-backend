import { NextFunction, Request, Response } from 'express'

import * as UserModel from '../models/user'
import { HttpCode } from '../enums'
import {
  userSchema,
  loginSchema,
  justUserEmailSchema,
  tokenAndNewPasswordSchema
} from '../schemas/Users'
import { JWT_SECRET, NODE_ENV } from '../config/config'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { AppError } from '../exceptions/AppError'
import { sendEmail } from '../services/mailService'
import { zodValidationService } from '../services/zodValidationService'

interface TokenPayload extends JwtPayload {
  userId: number
}

// Validates user inputs
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const resultValidationInputData = zodValidationService(userSchema, req.body)

  if (!resultValidationInputData.success) {
    res.status(HttpCode.BAD_REQUEST).json({
      message: 'Validation error',
      errors: resultValidationInputData?.error?.format()
    })
    return
  }

  const { birthDate } = resultValidationInputData.data

  try {
    const userCreated = await UserModel.createUser({ ...resultValidationInputData.data, birthDate: new Date(birthDate) })

    await sendEmail('validateEmail', userCreated.email)

    res.status(HttpCode.CREATED).json({
      message: 'Usuario registrado correctamente.'
    })
  } catch (error) {
    next(error)
  }
}

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const resultValidation = zodValidationService(loginSchema, req.body)

  if (!resultValidation.success) {
    res.status(HttpCode.BAD_REQUEST).json({
      message: 'Validation error',
      errors: resultValidation.error.format()
    })
    return
  }

  try {
    const user = await UserModel.loginUser(resultValidation.data)

    const token = jwt.sign({ userId: user?.id }, String(JWT_SECRET), {
      expiresIn: '1h'
    })

    res
      .cookie('access_token', token, {
        httpOnly: true,
        secure: NODE_ENV === 'production',
        sameSite: 'strict'
      })
      .send({
        user
      })
  } catch (error) {
    next(error)
  }
}

export const logout = async (
  _req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> => {
  res.clearCookie('access_token').json({ message: 'logout successfull' })
}

export const resendVerificationEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const resultValidation = zodValidationService(justUserEmailSchema, req.body)

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
    if (userFound instanceof AppError) return

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

export const sendForgotPasswordEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const resultValidation = zodValidationService(justUserEmailSchema, req.body)

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

    // TODO: Implement return token
    await sendEmail('resetPassword', email)

    // TODO: Save reset token on database

    res.status(HttpCode.OK).json({
      message: 'Correo de recuperación enviado correctamente.'
    })
  } catch (error) {
    next(error)
  }
}

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const resultValidation = zodValidationService(tokenAndNewPasswordSchema, req.body)

  if (!resultValidation.success) {
    res.status(HttpCode.BAD_REQUEST).json({
      message: 'Validation error',
      errors: resultValidation.error.format()
    })
    return
  }

  const { token, newPassword } = resultValidation.data

  try {
    const { userId } = jwt.verify(token, String(JWT_SECRET)) as TokenPayload

    await UserModel.resetPassword(+userId, newPassword)

    res.json({
      message: 'Contraseña actualizada correctamente.'
    })
  } catch (error) {
    next(error)
  }
}

// Default
// const default = async(req: Request, res: Response, next: NextFunction): Promise<void> => { }

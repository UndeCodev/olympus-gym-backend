import { Request, Response, NextFunction } from 'express'
import { validateChangePassword } from '../schemas/ChangePassword'
import { HttpCode } from '../enums'
import * as ProfileModel from '../models/profile'

export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userId: number = res.locals?.user

  const resultValidation = validateChangePassword(req.body)

  if (!resultValidation.success) {
    res.status(HttpCode.BAD_REQUEST).json({
      message: 'Validation error',
      errors: resultValidation.error.format()
    })
    return
  }

  try {
    const { oldPassword, newPassword } = resultValidation.data

    await ProfileModel.changePassword(userId, oldPassword, newPassword)

    res.json({
      message: 'Contraseña actualizada correctamente.'
    })
  } catch (error) {
    next(error)
  }
}

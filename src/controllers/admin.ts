import { NextFunction, Request, Response } from 'express'
import { validateEmailType } from '../schemas/EmailType'
import * as AdminModel from '../models/admin'
import { AppError } from '../exceptions/AppError'
import { HttpCode } from '../enums'

export const getAllEmailTypes = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const emailTypes = await AdminModel.getAllEmailTypes()

    res.json({
      emailTypes
    })
  } catch (error) {
    next(error)
  }
}

export const createEmailType = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const resultValidation = validateEmailType(req.body)

  if (!resultValidation.success) {
    res.status(400).json({
      message: 'Validation error',
      errors: resultValidation.error.format()
    })
    return
  }

  try {
    const emailTypeCreated = await AdminModel.createEmailType(resultValidation.data)

    if (!(emailTypeCreated instanceof AppError)) {
      res.status(HttpCode.CREATED).json({
        message: 'Email Type created successfully'
      })
    }
  } catch (error) {
    next(error)
  }
}

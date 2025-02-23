import { NextFunction, Request, Response } from 'express'
import { emailTypeSchema } from '../schemas/EmailType'
import * as AdminModel from '../models/admin'
import { AppError } from '../exceptions/AppError'
import { HttpCode } from '../enums'
import { companyProfileSchema } from '../schemas/CompanyProfile'
import { zodValidationService } from '../services/zodValidationService'
import { uploadImageToCloudinary } from '../utils/cloudinary'

export const getAllEmailTypes = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const emailTypes = await AdminModel.getAllEmailTypes()

    res.json({
      emailTypes
    })
  } catch (error) {
    next(error)
  }
}

export const createEmailType = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const resultValidation = zodValidationService(emailTypeSchema, req.body)

  if (!resultValidation.success) {
    res.status(HttpCode.BAD_REQUEST).json({
      message: 'Validation error',
      errors: resultValidation.error.format()
    })
    return
  }

  try {
    const emailTypeCreated = await AdminModel.createEmailType(
      resultValidation.data
    )

    if (!(emailTypeCreated instanceof AppError)) {
      res.status(HttpCode.CREATED).json({
        message: 'Email Type created successfully'
      })
    }
  } catch (error) {
    next(error)
  }
}

export const getCompanyProfile = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const companyProfile = await AdminModel.getCompanyProfile()

    res.json({
      companyProfile
    })
  } catch (error) {
    next(error)
  }
}

export const updateCompanyProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const tempFile = req.file
  const resultValidation = zodValidationService(companyProfileSchema, req.body)

  if (!resultValidation.success) {
    res.status(HttpCode.BAD_REQUEST).json({
      message: 'Validation error',
      errors: resultValidation.error.format()
    })
    return
  }

  try {
    let logoURL: string | undefined

    if (tempFile !== undefined) {
      const tempFilePath = tempFile.path

      const { url } = await uploadImageToCloudinary(tempFilePath, 'logos')

      logoURL = url
    }

    const companyProfileUpdated = await AdminModel.updateCompanyProfile({ ...resultValidation.data, logo: logoURL })

    res.json({
      companyProfileUpdated
    })
  } catch (error) {
    next(error)
  }
}

// Default
// export const default = async(req: Request, res: Response, next: NextFunction): Promise<void> => {}

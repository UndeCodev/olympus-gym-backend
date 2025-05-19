import { Request, Response, NextFunction } from 'express';
import { MulterError } from 'multer';
import { AppError } from '../../core/errors/AppError';
import { HttpCode } from '../interfaces/HttpCode';

// Dictionary of error messages
const MULTER_ERROR_MESSAGES = {
  LIMIT_FILE_SIZE: 'El archivo es demasiado grande',
  LIMIT_FILE_COUNT: 'Demasiados archivos subidos',
  LIMIT_UNEXPECTED_FILE: (field: string) =>
    `El campo de archivo es inesperado ${field} o hay más archivos de los permitidos.`,
  LIMIT_PART_COUNT: 'Demasiadas partes en el formulario',
  LIMIT_FIELD_KEY: 'Nombre de campo demasiado largo',
  LIMIT_FIELD_VALUE: 'Valor de campo demasiado largo',
  LIMIT_FIELD_COUNT: 'Demasiados campos en el formulario',
  DEFAULT: 'Error al subir archivos',
};

export const multerErrorHandler = (err: Error, _: Request, __: Response, next: NextFunction) => {
  if (err instanceof MulterError) {
    const errorValue = MULTER_ERROR_MESSAGES[err.code];
    const errorMessage = errorValue
      ? typeof errorValue === 'function'
        ? errorValue((err as MulterError).field || '')
        : errorValue
      : MULTER_ERROR_MESSAGES.DEFAULT;

    throw new AppError({
      httpCode: HttpCode.BAD_REQUEST,
      description: errorMessage,
    });
  }

  next(err);
};

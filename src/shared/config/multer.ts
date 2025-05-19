import multer from 'multer';
import { Request } from 'express';
import { AppError } from '../../core/errors/AppError';
import { HttpCode } from '../interfaces/HttpCode';

const storage = multer.memoryStorage();

const fileFilter = (_: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(
      new AppError({
        httpCode: HttpCode.BAD_REQUEST,
        description: 'Solo se permiten imágenes',
      }),
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

export default upload;

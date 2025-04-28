import { AnyZodObject, z } from 'zod';
import { AppError, HttpCode } from '../../core/errors/AppError';

export const validateSchema = async <T extends AnyZodObject>(schema: T, data: unknown): Promise<z.infer<T>> => {
  const result = await schema.safeParseAsync(data);

  if (!result.success) {
    const errors = result.error.errors.map((err) => ({
      path: err.path.join(': '),
      message: err.message,
    }));

    throw new AppError({
      httpCode: HttpCode.BAD_REQUEST,
      description: 'Validation error',
      details: {
        errors,
      },
    });
  }

  return result.data;
};

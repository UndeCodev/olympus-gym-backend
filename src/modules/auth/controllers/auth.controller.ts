import { Request, Response } from 'express';
import { validateSchema } from '../../../shared/utils/zodSchemaValidator';
import { createUserSchema } from '../schemas/auth.schemas';
import { AuthModel } from '../models/auth.model';

export class AuthController {
  static async register(req: Request, res: Response) {
    const { firstName, lastName, phoneNumber, birthDate, email, password } = await validateSchema(
      createUserSchema,
      req.body,
    );

    await AuthModel.createUser({ firstName, lastName, phoneNumber, birthDate, email, password });

    // TODO: Send verification email

    res.json({
      message: 'Usuario registrado correctamente. Por favor, revisa tu correo electrónico para verificar tu cuenta.',
    });
  }
}

import { Request, Response } from 'express';
import { validateSchema } from '../../../shared/utils/zodSchemaValidator';
import { createUserSchema, loginSchema } from '../schemas/auth.schemas';
import { AuthModel } from '../models/auth.model';

import { NODE_ENV } from '../../../shared/config/env';
import { signTokenWithJWT } from '../../../shared/utils/signTokenWithJWT';

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

  static async login(req: Request, res: Response) {
    const { email, password } = await validateSchema(loginSchema, req.body);

    const user = await AuthModel.login(email, password);

    const token = signTokenWithJWT(user.id);

    res
      .cookie('access_token', token, {
        httpOnly: true,
        secure: NODE_ENV === 'production',
        sameSite: 'lax',
      })
      .json(user);
  }
}

import { Request, Response } from 'express';
import { validateSchema } from '../../../shared/utils/zodSchemaValidator';
import { createUserSchema, loginSchema, verifyTokenSchema } from '../schemas/auth.schemas';
import { AuthModel } from '../models/auth.model';

import { HttpCode } from '../../../shared/interfaces/HttpCode';
import { tokenService } from '../../../shared/services/tokens.service';
import jwt from 'jsonwebtoken';
import { JWT_SECRET_REFRESH, NODE_ENV } from '../../../shared/config/env';
import { JwtPayload } from '../../../shared/interfaces/JwtPayload';
import { createAccountService } from '../services/createAccount.service';
import { verifyEmailService } from '../services/verifyEmail.service';

export class AuthController {
  static async register(req: Request, res: Response) {
    const userValidated = await validateSchema(createUserSchema, req.body);

    await createAccountService(userValidated);

    res.sendStatus(HttpCode.CREATED);
  }

  static async login(req: Request, res: Response) {
    const { email, password } = await validateSchema(loginSchema, req.body);

    const user = await AuthModel.login(email, password);

    if (req.cookies.refreshToken) {
      res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'lax', secure: NODE_ENV === 'production' });
    }

    const payload = { id: user.id, rol: user.rol };

    const accessToken = tokenService.generateAccessToken(payload);
    const newRefreshToken = tokenService.generateRefreshToken(payload);

    await tokenService.storeRefreshToken(newRefreshToken, user.id);

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      accessToken,
      user,
    });
  }

  static async logout(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      res.sendStatus(HttpCode.NO_CONTENT);
      return;
    }

    const foundUser = await tokenService.findRefreshToken(refreshToken);

    if (!foundUser) {
      res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'lax', secure: NODE_ENV === 'production' });
      res.sendStatus(HttpCode.NO_CONTENT);
      return;
    }

    await tokenService.deleteRefreshToken(foundUser.id);

    res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'lax', secure: NODE_ENV === 'production' });

    res.sendStatus(HttpCode.NO_CONTENT);
  }

  static async getCurrentUser(_: Request, res: Response) {
    const userId = res.locals.user;

    const user = await AuthModel.findUserByIdWithouSensitiveData(userId);

    res.json({
      user,
    });
  }

  static async refreshToken(req: Request, res: Response) {
    // TODO: agent detection (web or app mobile)

    const refreshTokenCookie = req.cookies.refreshToken;

    // 401 -> no cookie
    if (!refreshTokenCookie) {
      res.sendStatus(HttpCode.UNAUTHORIZED);
      return;
    }

    res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'lax', secure: NODE_ENV === 'production' });

    // Verify if token is in the database
    const refreshTokenFound = await tokenService.findRefreshToken(refreshTokenCookie);

    // Detected refresh token reuse
    if (!refreshTokenFound) {
      jwt.verify(
        refreshTokenCookie,
        String(JWT_SECRET_REFRESH),
        async (err: jwt.VerifyErrors | null, decoded: unknown) => {
          if (err) {
            res.sendStatus(HttpCode.FORBIDDEN);
            return;
          }

          // Remove refresh token from "hacked" user
          const { id } = decoded as JwtPayload;
          await tokenService.deleteRefreshToken(id);
        },
      );

      res.sendStatus(HttpCode.FORBIDDEN);
      return;
    }

    // Evaluate refresh token
    jwt.verify(
      refreshTokenCookie,
      String(JWT_SECRET_REFRESH),
      async (err: jwt.VerifyErrors | null, decoded: unknown) => {
        // Expired refresh token or invalid token
        if (err) {
          await tokenService.deleteRefreshToken(refreshTokenFound.id);
        }

        if (err || refreshTokenFound.id !== (decoded as JwtPayload).id) {
          res.sendStatus(HttpCode.FORBIDDEN);
          return;
        }

        // Refresh token was still valid
        const { id, rol } = decoded as JwtPayload;

        const newAccessToken = tokenService.generateAccessToken({ id, rol });
        const newRefreshToken = tokenService.generateRefreshToken({ id, rol });

        await tokenService.storeRefreshToken(newRefreshToken, id);

        res.cookie('refreshToken', newRefreshToken, {
          httpOnly: true,
          sameSite: 'lax',
          secure: true,
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.json({
          accessToken: newAccessToken,
        });
      },
    );
  }

  static async verifyEmail(req: Request, res: Response) {
    const { token } = await validateSchema(verifyTokenSchema, { token: req.params.token });

    console.log(req.params.token);

    await verifyEmailService(token);

    res.status(HttpCode.OK).json({
      message: 'Correo electrónico verificado correctamente',
    });
  }
}

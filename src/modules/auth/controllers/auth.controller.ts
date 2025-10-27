import { Request, Response } from 'express';
import { validateSchema } from '../../../shared/utils/zodSchemaValidator';
import {
  createUserSchema,
  emailSchema,
  loginSchema,
  refreshTokenSchema,
  resetPasswordSchema,
  verifyTokenSchema,
} from '../schemas/auth.schemas';
import { AuthModel } from '../models/auth.model';

import { HttpCode } from '../../../shared/interfaces/HttpCode';
import { tokenService } from '../../../shared/services/tokens.service';
import jwt from 'jsonwebtoken';
import { JWT_SECRET_REFRESH, NODE_ENV } from '../../../shared/config/env';
import { JwtPayload } from '../../../shared/interfaces/JwtPayload';
import { createAccountService } from '../services/createAccount.service';
import { verifyEmailService } from '../services/verifyEmail.service';
import { sendVerificationEmailService } from '../services/sendEmailVerification.service';
import { requestPasswordResetService } from '../services/requestPasswordReset.service';
import { resetPasswordService } from '../services/resetPassword.service';
import { loginService } from '../services/login.service';
import { isMobileApp } from '../../../shared/utils/clientDetector';
import { AppError } from '../../../core/errors/AppError';

export class AuthController {
  static async register(req: Request, res: Response) {
    const userValidated = await validateSchema(createUserSchema, req.body);

    await createAccountService(userValidated);

    res.sendStatus(HttpCode.CREATED);
  }

  static async login(req: Request, res: Response) {
    const { email, password } = await validateSchema(loginSchema, req.body);

    const mobileApp = isMobileApp(req);

    if (req.cookies.refreshToken && !mobileApp) {
      res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'none', secure: NODE_ENV === 'production' });
    }

    const { accessToken, newRefreshToken, user } = await loginService(email, password);

    if (mobileApp) {
      res.json({
        accessToken,
        refreshToken: newRefreshToken,
        user,
      });
    } else {
      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        sameSite: 'none',
        secure: NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({
        accessToken,
        user,
      });
    }
  }

  static async logout(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      res.sendStatus(HttpCode.NO_CONTENT);
      return;
    }

    const foundUser = await tokenService.findRefreshToken(refreshToken);

    if (!foundUser) {
      res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'none', secure: NODE_ENV === 'production' });
      res.sendStatus(HttpCode.NO_CONTENT);
      return;
    }

    await tokenService.deleteRefreshToken(foundUser.id);

    res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'none', secure: NODE_ENV === 'production' });

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
    const mobileApp = isMobileApp(req);
    let refreshToken = '';

    if (mobileApp) {
      const { refreshToken: token } = await validateSchema(refreshTokenSchema, req.body);
      refreshToken = token;
    } else {
      refreshToken = req.cookies.refreshToken;
    }

    // 401 -> no cookie
    if (!refreshToken) {
      throw new AppError({
        httpCode: HttpCode.UNAUTHORIZED,
        description: 'Refresh token required',
      });
    }

    res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'none', secure: NODE_ENV === 'production' });

    // Verify if token is in the database
    const refreshTokenFound = await tokenService.findRefreshToken(refreshToken);

    // Detected refresh token reuse
    if (refreshTokenFound === null) {
      jwt.verify(refreshToken, String(JWT_SECRET_REFRESH), async (err: jwt.VerifyErrors | null, decoded: unknown) => {
        if (err) {
          res.sendStatus(HttpCode.FORBIDDEN);
          return;
        }

        // Remove refresh token from "hacked" user
        const { id } = decoded as JwtPayload;
        await tokenService.deleteRefreshToken(id);
      });

      throw new AppError({
        httpCode: HttpCode.FORBIDDEN,
        description: 'Invalid refresh token',
      });
    }

    // Evaluate refresh token
    jwt.verify(refreshToken, String(JWT_SECRET_REFRESH), async (err: jwt.VerifyErrors | null, decoded: unknown) => {
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

      const user = await AuthModel.findUserByIdWithouSensitiveData(id);

      if (mobileApp) {
        res.json({
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
          user,
        })
      } else {
        res.cookie('refreshToken', newRefreshToken, {
          httpOnly: true,
          sameSite: 'none',
          secure: true,
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.json({
          accessToken: newAccessToken,
          user,
        });
      }
    });
  }

  static async verifyEmail(req: Request, res: Response) {
    const { token } = await validateSchema(verifyTokenSchema, { token: req.params.token });

    await verifyEmailService(token);

    res.status(HttpCode.OK).json({
      message: 'Correo electrónico verificado correctamente',
    });
  }

  static async sendVerificationEmail(req: Request, res: Response) {
    const { email } = await validateSchema(emailSchema, req.body);

    await sendVerificationEmailService(email);

    res.json({ message: 'Correo electrónico enviado correctamente' });
  }

  static async requestPasswordReset(req: Request, res: Response) {
    const { email } = await validateSchema(emailSchema, req.body);

    await requestPasswordResetService(email);

    res.json({ message: 'Correo electrónico enviado correctamente' });
  }

  static async resetPassword(req: Request, res: Response) {
    const { token, newPassword } = await validateSchema(resetPasswordSchema, req.body);

    await resetPasswordService(token, newPassword);

    res.json({ message: 'Contraseña cambiada correctamente' });
  }
}

import { Request, Response, NextFunction } from 'express';
import { HttpCode } from '../../../shared/interfaces/HttpCode';
import { UserMembershipModel } from '../models/user_membership.model';

export const requireMembership = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    if (!res.locals.user || !res.locals.user.id) {
      res.status(HttpCode.UNAUTHORIZED).json({
        message: 'No autorizado. Inicie sesión.',
      });

      return;
    }

    // 2. Buscar membresía activa
    const membership = await UserMembershipModel.findLatestActive(res.locals.user.id);
    const now = new Date();

    // 3. Validar estado
    if (!membership || membership.status !== 'ACTIVE' || membership.endDate < now) {
      res.status(HttpCode.FORBIDDEN).json({
        message: 'Tu membresía ha vencido o no está activa. Por favor renueva para continuar.',
        code: 'MEMBERSHIP_REQUIRED', 
      });

      return;
    }

    // 4. Todo bien, pasar al siguiente controlador
    next();
  } catch (error) {
    console.error('Error en requireMembership middleware', error);
    res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
      message: 'Error verificando la membresía',
    });
  }
};

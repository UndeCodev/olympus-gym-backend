import jwt from 'jsonwebtoken';
import { AppError } from '../../../core/errors/AppError';
import { HttpCode } from '../../../shared/interfaces/HttpCode';
import { UserMembershipModel } from '../../memberships/models/user_membership.model';
import { ValidateQrBody } from '../interfaces/validate_qr_body.interface';
import { AccessResult } from '../interfaces/access_result.interface';
import prisma from '../../../shared/utils/prismaInstance';
import { JWT_SECRET } from '../../../shared/config/env';

export const validateQrService = async (body: ValidateQrBody): Promise<AccessResult> => {
  const { qrToken } = body;

  // 1. Verificar la firma del token y expiración (24h)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let decoded: any;
  try {
    decoded = jwt.verify(qrToken, JWT_SECRET || 'secret');
  } catch {
    // Token manipulado o expirado
    throw new AppError({
      httpCode: HttpCode.UNAUTHORIZED,
      description: 'Código QR inválido o expirado. Genere uno nuevo.',
    });
  }

  const userId = decoded.uid;

  // 2. Doble verificación en Base de Datos (Real-time)
  // Aunque el token sea válido, el usuario podría haber cancelado su plan hace 5 minutos.
  const membership = await UserMembershipModel.findLatestActive(userId);
  const now = new Date();

  if (!membership) {
    return {
      accessGranted: false,
      message: 'ACCESO DENEGADO: Usuario sin membresía activa.',
    };
  }

  // Verificar vigencia y estado
  if (membership.status !== 'ACTIVE' || membership.endDate < now) {
    return {
      accessGranted: false,
      message: `ACCESO DENEGADO: Membresía vencida el ${membership.endDate.toLocaleDateString()}`,
    };
  }

  // 3. Obtener datos del usuario para mostrar en pantalla al guardia
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, firstName: true, profilePictureUrl: true }, 
  });

  return {
    accessGranted: true,
    message: 'ACCESO PERMITIDO',
    user: {
      id: user!.id,
      name: user!.firstName,
    },
    plan: membership.plan.name,
  };
};

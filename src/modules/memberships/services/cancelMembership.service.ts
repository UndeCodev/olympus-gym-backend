import { AppError } from '../../../core/errors/AppError';
import { HttpCode } from '../../../shared/interfaces/HttpCode';
import prisma from '../../../shared/utils/prismaInstance';
import { CancelMembershipBody } from '../interfaces/cancel_membership_body.interface';
import { UserMembershipModel } from '../models/user_membership.model';

export const cancelMembershipService = async (body: CancelMembershipBody) => {
  const { userId } = body;

  // 1. Buscar la membresía activa
  const activeMembership = await UserMembershipModel.findLatestActive(userId);

  if (!activeMembership || activeMembership.status !== 'ACTIVE') {
    throw new AppError({
      httpCode: HttpCode.BAD_REQUEST,
      description: 'El usuario no tiene ninguna membresía activa para cancelar.',
    });
  }

  // 2. Actualizar estado a CANCELLED
  const cancelledMembership = await UserMembershipModel.update(activeMembership.id, {
    status: 'CANCELLED',
  });

  // (Opcional) Degradar rol a USER si ya no queremos que sea MEMBER
  await prisma.user.update({ where: { id: userId }, data: { rol: 'USER' } });

  return cancelledMembership;
};

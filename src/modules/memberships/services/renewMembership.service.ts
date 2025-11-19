import { AppError } from '../../../core/errors/AppError';
import { HttpCode } from '../../../shared/interfaces/HttpCode';
import { RenewMembershipBody } from '../interfaces/renew_membership_body.interface';
import { UserMembershipModel } from '../models/user_membership.model';

function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

export const renewMembershipService = async (body: RenewMembershipBody) => {
  const { userId, monthsToExtend } = body;

  // 1. Buscar la membresía activa para extenderla
  const activeMembership = await UserMembershipModel.findLatestActive(userId);

  if (!activeMembership || activeMembership.status !== 'ACTIVE') {
    throw new AppError({
      httpCode: HttpCode.BAD_REQUEST,
      description: 'El usuario no tiene una membresía activa para extender. Usa "Asignar" para crear una nueva.',
    });
  }

  // 2. Calcular nueva fecha
  const currentEndDate = new Date(activeMembership.endDate);
  const newEndDate = addMonths(currentEndDate, monthsToExtend);

  // 3. Actualizar
  const updatedMembership = await UserMembershipModel.update(activeMembership.id, {
    endDate: newEndDate,
  });

  return updatedMembership;
};

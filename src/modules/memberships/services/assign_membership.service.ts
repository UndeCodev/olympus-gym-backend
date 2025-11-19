// src/modules/memberships/services/assignMembership.service.ts
import { AppError } from '../../../core/errors/AppError';
import { HttpCode } from '../../../shared/interfaces/HttpCode';
import prisma from '../../../shared/utils/prismaInstance';
import { AssignMembershipBody } from '../interfaces/assign_membership_body.interface';
import { UserMembershipModel } from '../models/user_membership.model';

// Helper simple para sumar meses a una fecha
function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

export const assignMembershipService = async (body: AssignMembershipBody) => {
  const { userId, planId, paymentRef, startDate: startDateStr } = body;

  // 1. Validar Usuario
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError({
      httpCode: HttpCode.NOT_FOUND,
      description: 'Usuario no encontrado',
    });
  }

  // 2. Validar Plan (y obtener precio/duración)
  const plan = await prisma.membership_plan.findUnique({ where: { id: planId } });
  if (!plan || !plan.isActive) {
    throw new AppError({
      httpCode: HttpCode.BAD_REQUEST,
      description: 'El plan especificado no existe o no está activo',
    });
  }

  // 3. Calcular Fecha de Inicio (Lógica de Apilamiento)
  let startDate: Date;
  const now = new Date();

  if (startDateStr) {
    // A. Fecha manual forzada por el admin
    startDate = new Date(startDateStr + 'T00:00:00Z');
  } else {
    // B. Cálculo automático
    // Buscar si ya tiene una membresía vigente
    const lastMembership = await UserMembershipModel.findLatestActive(userId);
    
    if (lastMembership && lastMembership.endDate > now) {
      // Si tiene una activa que termina en el futuro, la nueva empieza
      // al día siguiente de que termine la actual.
      startDate = new Date(lastMembership.endDate);
      startDate.setDate(startDate.getDate() + 1); // +1 día
    } else {
      // Si no tiene, o ya venció, empieza hoy.
      startDate = now;
    }
  }

  // 4. Calcular Fecha de Fin
  const endDate = addMonths(startDate, plan.durationMonths);

  // 5. Crear Membresía
  const newMembership = await UserMembershipModel.create({
    userId,
    planId,
    startDate,
    endDate,
    pricePaid: Number(plan.price), // Guardamos el precio histórico (convertido de Decimal)
    paymentRef,
  });

  return {
    ...newMembership,
    planName: plan.name,
  };
};
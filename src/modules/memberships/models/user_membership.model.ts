import prisma from '../../../shared/utils/prismaInstance';
import { CreateMembershipData } from '../interfaces/create_membership_data.interface';

export class UserMembershipModel {
  /**
   * Crea la membresía y actualiza el rol del usuario a MEMBER en una transacción.
   */
  static async create(data: CreateMembershipData) {
    return await prisma.$transaction(async (tx) => {
      // 1. Crear el registro de membresía
      const membership = await tx.user_membership.create({
        data: {
          userId: data.userId,
          planId: data.planId,
          startDate: data.startDate,
          endDate: data.endDate,
          pricePaid: data.pricePaid,
          paymentRef: data.paymentRef,
          status: 'ACTIVE',
        },
      });

      // 2. Asegurar que el usuario tenga el rol de MEMBER
      await tx.user.update({
        where: { id: data.userId },
        data: {
          rol: {
            set: 'MEMBER',
          },
        },
      });

      return membership;
    });
  }

  /**
   * Busca la última membresía activa o futura del usuario.
   * Sirve para saber cuándo debe empezar la siguiente (apilamiento).
   */
  static async findLatestActive(userId: number) {
    return await prisma.user_membership.findFirst({
      where: {
        userId: userId,
        status: { in: ['ACTIVE', 'PENDING'] },
      },
      orderBy: {
        endDate: 'desc',
      },
      include: {
        plan: true,
      },
    });
  }

  /**
   * Busca TODAS las membresías de un usuario (Historial).
   */
  static async findAllByUserId(userId: number) {
    return await prisma.user_membership.findMany({
      where: { userId },
      include: {
        plan: { select: { name: true } },
      },
      orderBy: { startDate: 'desc' },
    });
  }

  /**
   * Actualiza una membresía por ID.
   */
  static async update(id: number, data: { endDate?: Date; status?: 'CANCELLED' | 'ACTIVE' }) {
    return await prisma.user_membership.update({
      where: { id },
      data,
    });
  }
}

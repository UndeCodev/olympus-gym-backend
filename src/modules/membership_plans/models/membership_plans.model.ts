import prisma from '../../../shared/utils/prismaInstance';
import { CreatePlanBody } from '../interfaces/create_plan_body.interface';
import { UpdatePlanBody } from '../interfaces/update_plan_body.interface';

export class MembershipPlanModel {
  static async create(data: CreatePlanBody) {
    return await prisma.membership_plan.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        durationMonths: data.durationMonths,
        isActive: true,
      },
    });
  }

  static async findAll(onlyActive: boolean = true) {
    return await prisma.membership_plan.findMany({
      where: onlyActive ? { isActive: true } : {},
      orderBy: { price: 'asc' },
    });
  }

  static async findById(id: number) {
    return await prisma.membership_plan.findUnique({
      where: { id },
    });
  }

  static async findByName(name: string) {
    return await prisma.membership_plan.findUnique({
      where: { name },
    });
  }

  static async update(id: number, data: UpdatePlanBody) {
    return await prisma.membership_plan.update({
      where: { id },
      data: {
        ...data,
      },
    });
  }

  static async softDelete(id: number) {
    return await prisma.membership_plan.update({
      where: { id },
      data: { isActive: false },
    });
  }
}

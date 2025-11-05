import { Prisma, PrismaClient } from '../../../../generated/prisma';

import { CreateMuscleGroupInput } from '../interfaces/create_muscle_group_input.interface';
import { GetMuscleGroupQuery } from '../interfaces/get_muscle_groups_query.interface';
import { UpdateMuscleGroupBody } from '../interfaces/update_muscle_group_body.interface';

const prisma = new PrismaClient();

export class MuscleGroupModel {
  static async create(data: CreateMuscleGroupInput) {
    const newMuscleGroup = await prisma.muscle_group.create({
      data: {
        name: data.name,
      },
    });

    return newMuscleGroup;
  }

  static async findByName(name: string) {
    const muscleGroup = await prisma.muscle_group.findUnique({
      where: {
        name,
      },
    });

    return muscleGroup;
  }

  static async findAll(query: GetMuscleGroupQuery) {
    const whereClause: Prisma.muscle_groupWhereInput = {};

    if (query.search) {
      whereClause.name = {
        contains: query.search,
      };
    }

    return await prisma.muscle_group.findMany({
      where: whereClause,
      orderBy: {
        name: 'asc',
      },
    });
  }

  static async findById(id: number) {
    return await prisma.muscle_group.findUnique({
      where: {
        id: id,
      },
    });
  }

  static async update(id: number, data: UpdateMuscleGroupBody) {
    return await prisma.muscle_group.update({
      where: {
        id: id,
      },
      data: {
        name: data.name,
      },
    });
  }

  static async delete(id: number) {
    return await prisma.muscle_group.delete({
      where: {
        id: id,
      },
    });
  }
}

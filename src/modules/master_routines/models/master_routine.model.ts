import { Prisma, PrismaClient } from '../../../../generated/prisma';
import { CreateMasterRoutineBody } from '../interfaces/create_master_routine_body.interface';
import { GetMasterRoutinesQuery } from '../interfaces/get_master_routines_query.interface';
import { UpdateMasterRoutineBody } from '../interfaces/update_master_routine_body.interface';

const prisma = new PrismaClient();

export class MasterRoutineModel {
  private static readonly includes = {
    exercisesInRoutine: {
      orderBy: { orderInRoutine: 'asc' as const },
      include: {
        exercise: true, // Incluye los detalles del ejercicio
      },
    },
  };

  static async create(data: CreateMasterRoutineBody) {
    const { name, daysOfTheWeek, estimatedTimeMinutes, exercises } = data;

    const daysString = daysOfTheWeek.join(',');

    return await prisma.master_routine.create({
      data: {
        name,
        estimatedTimeMinutes,
        daysOfTheWeek: daysString,

        exercisesInRoutine: {
          createMany: {
            data: exercises.map((ex) => ({
              exerciseId: ex.exerciseId,
              orderInRoutine: ex.orderInRoutine,
            })),
          },
        },
      },
      include: {
        exercisesInRoutine: {
          orderBy: { orderInRoutine: 'asc' },
          include: {
            exercise: true, // Incluye los detalles del ejercicio
          },
        },
      },
    });
  }

  static async findByName(name: string) {
    return await prisma.master_routine.findFirst({
      where: {
        name: name,
      },
    });
  }

  static async findAll(query: GetMasterRoutinesQuery) {
    const whereClause: Prisma.master_routineWhereInput = {};

    if (query.search) {
      whereClause.name = { contains: query.search };
    }

    return await prisma.master_routine.findMany({
      where: whereClause,
      include: this.includes,
      orderBy: { name: 'asc' },
    });
  }

  static async findById(id: number) {
    return await prisma.master_routine.findUnique({
      where: { id },
      include: this.includes,
    });
  }

  static async update(id: number, data: UpdateMasterRoutineBody) {
    const { exercises, daysOfTheWeek, ...routineData } = data;

    // Convertir array de días a string, si se proporcionó
    const daysString = daysOfTheWeek ? daysOfTheWeek.join(',') : undefined;

    return await prisma.$transaction(async (tx) => {
      // 1. Actualizar los campos simples
      await tx.master_routine.update({
        where: { id },
        data: {
          ...routineData,
          daysOfTheWeek: daysString, // Actualiza el string de días
        },
      });

      // 2. Si se proporcionó un nuevo array de ejercicios, reemplazarlos
      if (exercises) {
        // Borrar los antiguos
        await tx.routine_exercise_master.deleteMany({
          where: { masterRoutineId: id },
        });

        // Crear los nuevos
        await tx.routine_exercise_master.createMany({
          data: exercises.map((ex) => ({
            masterRoutineId: id,
            exerciseId: ex.exerciseId,
            orderInRoutine: ex.orderInRoutine,
          })),
        });
      }

      // 3. Devolver la rutina actualizada completa
      return await tx.master_routine.findUnique({
        where: { id },
        include: MasterRoutineModel.includes,
      });
    });
  }

  static async delete(id: number) {
    return await prisma.$transaction(async (tx) => {
      // 1. Borrar relaciones en la tabla pivote N:M
      await tx.routine_exercise_master.deleteMany({
        where: { masterRoutineId: id },
      });

      // 2. Borrar la rutina maestra
      return await tx.master_routine.delete({
        where: { id },
      });
    });
  }
}

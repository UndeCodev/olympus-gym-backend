import { Prisma, PrismaClient } from '../../../../generated/prisma';
import { CreateExerciseBody } from '../interfaces/create_exercise_body.interface';
import { GetExercisesQuery } from '../interfaces/get_exercises_query.interface';
import { UpdateExerciseBody } from '../interfaces/update_exercise_body.interface';

const prisma = new PrismaClient();

export class ExerciseModel {
  private static readonly includes = {
    muscleGroups: { include: { muscleGroup: true } },
    instructions: {
      include: {
        difficultyLevel: true,
        stepByStepInstructions: { orderBy: { order: 'asc' as Prisma.SortOrder } },
        importantTips: true,
      },
      orderBy: { difficultyLevelId: 'asc' as Prisma.SortOrder },
    },
  };

  static async create(data: CreateExerciseBody) {
    const { name, description, imageUrl, muscleGroupIds, instructions } = data;

    return await prisma.exercise.create({
      data: {
        name,
        description,
        imageUrl,

        // 1. Crear las relaciones N:M en ExerciseGroup
        muscleGroups: {
          create: muscleGroupIds.map((id) => ({
            muscleGroup: {
              connect: { id: id },
            },
          })),
        },

        // 2. Crear las instrucciones 1:N (y sus anidados)
        instructions: {
          create: instructions.map((instr) => ({
            sets: instr.sets,
            repetitionsMin: instr.repetitionsMin,
            repetitionsMax: instr.repetitionsMax,
            restTimeSeconds: instr.restTimeSeconds,
            difficultyLevel: {
              connect: { id: instr.difficultyLevelId },
            },

            // 2a. Crear los pasos
            stepByStepInstructions: {
              createMany: {
                data: instr.stepByStepInstructions,
              },
            },

            // 2b. Crear los consejos (si existen)
            importantTips: instr.importantTips
              ? {
                  createMany: {
                    data: instr.importantTips,
                  },
                }
              : undefined,
          })),
        },
      },
      include: {
        muscleGroups: { include: { muscleGroup: true } },
        instructions: {
          include: {
            difficultyLevel: true,
            stepByStepInstructions: true,
            importantTips: true,
          },
        },
      },
    });
  }

  static async findByName(name: string) {
    return await prisma.exercise.findUnique({
      where: { name },
    });
  }

  static async findById(id: number) {
    return await prisma.exercise.findUnique({
      where: { id },
      include: this.includes,
    });
  }

  static async findAll(query: GetExercisesQuery) {
    const whereClause: Prisma.exerciseWhereInput = {};

    if (query.search) {
      whereClause.name = { contains: query.search };
    }
    if (query.muscleGroupId) {
      whereClause.muscleGroups = {
        some: { muscleGroupId: query.muscleGroupId },
      };
    }
    if (query.difficultyLevelId) {
      whereClause.instructions = {
        some: { difficultyLevelId: query.difficultyLevelId },
      };
    }

    return await prisma.exercise.findMany({
      where: whereClause,
      include: this.includes,
      orderBy: { name: 'asc' },
    });
  }
  static async update(id: number, data: UpdateExerciseBody) {
    const { muscleGroupIds, ...exerciseData } = data;

    // El update requiere una transacción si se actualiza la relación N:M
    return await prisma.$transaction(async (tx) => {
      // 1. Actualizar campos directos del Exercise
      await tx.exercise.update({
        where: { id },
        data: exerciseData,
      });

      if (muscleGroupIds) {
        // 2. Actualizar relación N:M (MuscleGroups)
        // a. Borrar todas las relaciones existentes
        await tx.exercise_group.deleteMany({
          where: { exerciseId: id },
        });

        // b. Crear las nuevas relaciones
        if (muscleGroupIds.length > 0) {
          await tx.exercise_group.createMany({
            data: muscleGroupIds.map((mgId) => ({
              exerciseId: id,
              muscleGroupId: mgId,
            })),
          });
        }
      }

      // 3. Devolver el ejercicio completo (con las relaciones actualizadas)
      return await tx.exercise.findUnique({
        where: { id },
        include: ExerciseModel.includes,
      });
    });
  }

  static async delete(id: number) {
    return await prisma.exercise.delete({
      where: { id },
    });
  }
}

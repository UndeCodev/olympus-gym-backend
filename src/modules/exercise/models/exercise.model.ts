import { PrismaClient } from '../../../../generated/prisma';
import { CreateExerciseBody } from '../interfaces/create_exercise_body.interface';

const prisma = new PrismaClient();

export class ExerciseModel {
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
              connect: { id: id }, // Conecta con el MuscleGroup existente
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
              // Conecta con el DifficultyLevel existente
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
      // Incluir todos los datos creados en la respuesta
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
}


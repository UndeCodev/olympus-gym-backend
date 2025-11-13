// src/modules/exerciseLogs/models/exercise_log.model.ts
import { PrismaClient } from '../../../../generated/prisma';
import { MarkExerciseBody } from '../interfaces/mark_exercise_body.interface';

const prisma = new PrismaClient();

export class ExerciseLogModel {
  static async upsertLog(userId: number, data: MarkExerciseBody, logDate: Date) {
    const { exerciseId, completed } = data;

    return await prisma.exercise_log.upsert({
      where: {
        // La restricción unique definida en schema.prisma
        userId_exerciseId_date: {
          userId: userId,
          exerciseId: exerciseId,
          date: logDate, // El objeto Date (Prisma/MySQL lo manejará como @db.Date)
        },
      },
      update: {
        completed: completed, // Si ya existe, solo actualiza 'completed'
      },
      create: {
        userId: userId,
        exerciseId: exerciseId,
        date: logDate,
        completed: completed,
        // setsCompleted puede ser 0 por defecto, o podrías añadirlo al body
      },
    });
  }
}

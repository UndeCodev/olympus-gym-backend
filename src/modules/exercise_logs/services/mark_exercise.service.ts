import { PrismaClient } from "../../../../generated/prisma";
import { AppError } from "../../../core/errors/AppError";
import { HttpCode } from "../../../shared/interfaces/HttpCode";
import { MarkExerciseBody } from "../interfaces/mark_exercise_body.interface";
import { ExerciseLogModel } from "../models/exercise_log.model";

const prisma = new PrismaClient();

export const markExerciseService = async (userId: number, body: MarkExerciseBody) => {
  const { exerciseId, date } = body;

  // 1. Validar que el Ejercicio (Exercise) exista
  const exercise = await prisma.exercise.findUnique({
    where: { id: exerciseId },
    select: { id: true },
  });

  if (!exercise) {
    throw new AppError({
      httpCode: HttpCode.NOT_FOUND,
      description: 'El ejercicio que intentas marcar no existe',
    });
  }

  // 2. Preparar la fecha
  // Si se provee una fecha (YYYY-MM-DD), se debe convertir a un objeto Date
  // asegurándose de que la zona horaria no afecte la fecha (usar UTC).
  // Si no se provee, se usa la fecha actual.

  let logDate: Date;

  if (date) {
    // Convertir 'YYYY-MM-DD' string a un objeto Date en UTC
    // (Ej: '2025-11-13' se convierte a 2025-11-13T00:00:00.000Z)
    logDate = new Date(date + 'T00:00:00Z');
  } else {
    // Usar la fecha actual (importante: resetear la hora a 00:00:00)
    logDate = new Date();
    logDate.setHours(0, 0, 0, 0);
    // Nota: Esto usa la zona horaria del servidor.
    // Para consistencia global, es mejor manejar UTC.
    // Una mejor forma si 'date' no se provee:
    // const todayUTC = new Date().toISOString().split('T')[0];
    // logDate = new Date(todayUTC + 'T00:00:00Z');
  }

  // 3. Llamar al modelo para hacer upsert
  return await ExerciseLogModel.upsertLog(userId, body, logDate);
};

// src/modules/myRoutine/services/getMyRoutine.service.ts
import { PrismaClient } from '../../../../generated/prisma';
import { AppError } from '../../../core/errors/AppError';
import { HttpCode } from '../../../shared/interfaces/HttpCode';
import { GetMyRoutineQuery } from '../interfaces/get_my_routine_query.interface';
import { MyRoutineResponse } from '../interfaces/my_routine_response.interface';

const prisma = new PrismaClient();

function getDayName(date: Date, locale: string = 'es-MX') {
  const day = date.toLocaleDateString(locale, {
    weekday: 'long',
    timeZone: 'UTC',
  });

  console.log({ day });
  return day.charAt(0).toUpperCase() + day.slice(1);
}

/**
 * Lógica de negocio para obtener el dashboard de rutinas del miembro.
 * @param userId ID del usuario autenticado (del token).
 * @param userDifficultyLevelId ID del nivel del usuario (del token).
 * @param query Query params validados (contiene 'date?').
 */
export const getMyRoutineService = async (userId: number, userDifficultyLevelId: number, query: GetMyRoutineQuery) => {
  // 1. Determinar la fecha de consulta
  const queryDateStr = query.date || new Date().toISOString().split('T')[0];
  const queryDate = new Date(queryDateStr + 'T00:00:00Z'); // Fecha en UTC

  console.log({ queryDate });
  const dayNameToday = getDayName(queryDate); // "Jueves"

  console.log({ dayNameToday });

  if (!userDifficultyLevelId) {
    throw new AppError({
      httpCode: HttpCode.BAD_REQUEST,
      description: 'No se pudo determinar el nivel de dificultad del usuario.',
    });
  }

  // 2. Obtener los ejercicios completados por el usuario para esa fecha
  const completedLogs = await prisma.exercise_log.findMany({
    where: {
      userId: userId,
      date: queryDate,
      completed: true,
    },
    select: { exerciseId: true },
  });
  const completedExerciseIds = new Set(completedLogs.map((log) => log.exerciseId));

  // 3. LA GRAN CONSULTA: Obtener todas las asignaciones del usuario,
  // e incluir las rutinas, los ejercicios, y LAS INSTRUCCIONES
  // específicas para el nivel del usuario.
  const assignments = await prisma.user_routine_assignment.findMany({
    where: { userId: userId },
    include: {
      masterRoutine: {
        include: {
          exercisesInRoutine: {
            // -> RoutineExerciseMaster
            orderBy: { orderInRoutine: 'asc' },
            include: {
              exercise: {
                // -> Exercise
                include: {
                  muscleGroups: {
                    // -> ExerciseGroup
                    include: {
                      muscleGroup: true, // -> MuscleGroup
                    },
                  },
                  instructions: {
                    // -> ExerciseInstruction
                    where: {
                      difficultyLevelId: userDifficultyLevelId,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  // 4. Transformar los datos crudos en la respuesta de la UI
  const response: MyRoutineResponse[] = assignments.map((assignment) => {
    const routine = assignment.masterRoutine;
    const days = routine.daysOfTheWeek.split(','); // "Lunes,Jueves" -> ["Lunes", "Jueves"]
    const totalExercises = routine.exercisesInRoutine.length;
    let completedCount = 0;
    const allMuscleGroups = new Set<string>();

    const exercisesList = routine.exercisesInRoutine.map((exInRoutine) => {
      const exercise = exInRoutine.exercise;
      const isCompleted = completedExerciseIds.has(exercise.id);
      if (isCompleted) completedCount++;

      // Añadir grupos musculares al Set
      exercise.muscleGroups.forEach((mg) => allMuscleGroups.add(mg.muscleGroup.name));

      // Obtener la instrucción específica (debería haber solo una)
      const instruction = exercise.instructions[0];
      const specs = instruction
        ? `${instruction.sets} series x ${instruction.repetitionsMin}-${instruction.repetitionsMax} reps`
        : 'Instrucciones no definidas';

      return {
        exerciseId: exercise.id,
        name: exercise.name,
        order: exInRoutine.orderInRoutine,
        isCompleted: isCompleted,
        specs: specs,
      };
    });

    return {
      assignmentId: assignment.id,
      routineName: routine.name,
      days: days,
      isToday: days.includes(dayNameToday),
      estimatedTime: routine.estimatedTimeMinutes,
      progress: `${completedCount}/${totalExercises} ejercicios completados`,
      targetMuscles: Array.from(allMuscleGroups).join(', '), // "Pecho, Tríceps"
      exercises: exercisesList,
    };
  });

  // (Opcional: puedes ordenar las rutinas, ej. poner las de 'isToday' primero)
  return response;
};

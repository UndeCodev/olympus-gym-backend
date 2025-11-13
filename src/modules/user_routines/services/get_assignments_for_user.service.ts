import { PrismaClient } from '../../../../generated/prisma';
import { AppError } from '../../../core/errors/AppError';
import { HttpCode } from '../../../shared/interfaces/HttpCode';
import { GetAssignmentsForUserParams } from '../interfaces/get_assignments_for_user_params.interface';
import { UserRoutineModel } from '../models/user_routine.model';

const prisma = new PrismaClient();

export const getAssignmentsForUserService = async (params: GetAssignmentsForUserParams) => {
  const { userId } = params;

  // 1. Validar que el usuario exista
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });

  if (!user) {
    throw new AppError({
      httpCode: HttpCode.NOT_FOUND,
      description: 'El usuario especificado no existe',
    });
  }

  // 2. Obtener las asignaciones
  const assignments = await UserRoutineModel.findByUserId(userId);

  // 3. Transformar los días de la semana (de string a array)
  // (Este paso es crucial para que el frontend lo consuma fácilmente)
  const transformedAssignments = assignments.map((assignment) => {
    return {
      ...assignment,
      masterRoutine: {
        ...assignment.masterRoutine,
        daysOfTheWeek: assignment.masterRoutine.daysOfTheWeek.split(','),
      },
    };
  });

  return transformedAssignments;
};

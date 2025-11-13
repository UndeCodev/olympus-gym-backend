import { PrismaClient } from '../../../../generated/prisma';
import { AppError } from '../../../core/errors/AppError';
import { HttpCode } from '../../../shared/interfaces/HttpCode';
import { AssignRoutineBody } from '../interfaces/assign_routine_body.interface';
import { UserRoutineModel } from '../models/user_routine.model';

const prisma = new PrismaClient();

export const assignRoutineService = async (body: AssignRoutineBody) => {
  const { userId, masterRoutineId } = body;

  // 1. Regla de negocio: Validar que el usuario (miembro) exista
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError({
      httpCode: HttpCode.NOT_FOUND,
      description: 'El usuario (miembro) especificado no existe',
    });
  }

  // (Opcional) Regla de negocio: Asegurarse de que solo se asignen rutinas a Miembros/Usuarios
  if (user.rol !== 'MEMBER' && user.rol !== 'USER') {
    throw new AppError({
      httpCode: HttpCode.BAD_REQUEST,
      description: 'Solo se pueden asignar rutinas a usuarios con rol MIEMBRO o USUARIO',
    });
  }

  // 2. Regla de negocio: Validar que la rutina maestra exista
  const masterRoutine = await prisma.master_routine.findUnique({
    where: { id: masterRoutineId },
    select: { id: true }, // Solo necesitamos saber si existe
  });

  if (!masterRoutine) {
    throw new AppError({
      httpCode: HttpCode.NOT_FOUND,
      description: 'La rutina maestra especificada no existe',
    });
  }

  // 3. Regla de negocio: Validar que la asignación no exista ya (@@unique)
  const existingAssignment = await UserRoutineModel.findByUserAndRoutine(body);
  if (existingAssignment) {
    throw new AppError({
      httpCode: HttpCode.CONFLICT, // 409
      description: 'Este usuario ya tiene asignada esta rutina maestra',
    });
  }

  // 4. Llamar al modelo para crear la asignación
  return await UserRoutineModel.create(body);
};

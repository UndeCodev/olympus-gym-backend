import { PrismaClient } from "../../../../generated/prisma";
import { AppError } from "../../../core/errors/AppError";
import { HttpCode } from "../../../shared/interfaces/HttpCode";
import { CreateMasterRoutineBody } from "../interfaces/create_master_routine_body.interface";
import { MasterRoutineModel } from "../models/master_routine.model";

const prisma = new PrismaClient();

export const createMasterRoutineService = async (
  body: CreateMasterRoutineBody
) => {
  const { name, exercises } = body;

  // 1. Validar nombre duplicado
  const existingRoutine = await MasterRoutineModel.findByName(name);
  if (existingRoutine) {
    throw new AppError({
      httpCode: HttpCode.CONFLICT,
      description: 'Ya existe una rutina maestra con este nombre',
    });
  }

  // 2. Validar que todos los IDs de Ejercicios existan
  const exerciseIds = exercises.map(e => e.exerciseId);
  const existingExercises = await prisma.exercise.findMany({
    where: { id: { in: exerciseIds } },
    select: { id: true }, // Solo necesitamos los IDs para verificar
  });

  if (existingExercises.length !== exerciseIds.length) {
    throw new AppError({
      httpCode: HttpCode.BAD_REQUEST,
      description: 'Uno o más IDs de Ejercicios no son válidos',
    });
  }

  // 3. Validar que los 'orderInRoutine' no estén duplicados
  const orders = new Set(exercises.map(e => e.orderInRoutine));
  if (orders.size !== exercises.length) {
    throw new AppError({
      httpCode: HttpCode.BAD_REQUEST,
      description: 'Los números de "orderInRoutine" no pueden estar duplicados en la misma rutina',
    });
  }

  // 4. Llamar al modelo para la transacción
  return await MasterRoutineModel.create(body);
};
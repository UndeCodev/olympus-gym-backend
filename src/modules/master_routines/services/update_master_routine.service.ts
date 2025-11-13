import { PrismaClient } from "../../../../generated/prisma";
import { AppError } from "../../../core/errors/AppError";
import { HttpCode } from "../../../shared/interfaces/HttpCode";
import { MasterRoutineParams } from "../interfaces/master_routine_params.interface";
import { UpdateMasterRoutineBody } from "../interfaces/update_master_routine_body.interface";
import { MasterRoutineModel } from "../models/master_routine.model";
import { transformRoutine } from "../utils/transformRoutine";

const prisma = new PrismaClient();

export const updateMasterRoutineService = async (
  params: MasterRoutineParams,
  body: UpdateMasterRoutineBody
) => {
  const { id } = params;
  const { name, exercises } = body;

  // 1. Validar que la rutina exista
  const existingRoutine = await MasterRoutineModel.findById(id);
  if (!existingRoutine) {
    throw new AppError({
      httpCode: HttpCode.NOT_FOUND,
      description: 'Rutina maestra no encontrada',
    });
  }

  // 2. Validar nombre duplicado (si se está cambiando)
  if (name) {
    const existingName = await MasterRoutineModel.findByName(name);
    if (existingName && existingName.id !== id) {
      throw new AppError({
        httpCode: HttpCode.CONFLICT,
        description: 'Ya existe otra rutina maestra con este nombre',
      });
    }
  }

  // 3. Validar IDs y Orden de ejercicios (si se están cambiando)
  if (exercises) {
    // Validar IDs
    const exerciseIds = exercises.map(e => e.exerciseId);
    const existingExercises = await prisma.exercise.findMany({
      where: { id: { in: exerciseIds } }, select: { id: true },
    });
    if (existingExercises.length !== exerciseIds.length) {
      throw new AppError({
        httpCode: HttpCode.BAD_REQUEST,
        description: 'Uno o más IDs de Ejercicios no son válidos',
      });
    }
    // Validar Orden
    const orders = new Set(exercises.map(e => e.orderInRoutine));
    if (orders.size !== exercises.length) {
      throw new AppError({
        httpCode: HttpCode.BAD_REQUEST,
        description: 'Los números de "orderInRoutine" no pueden estar duplicados',
      });
    }
  }

  // 4. Llamar al modelo para actualizar
  const updatedRoutine = await MasterRoutineModel.update(id, body);

  // 5. Transformar la respuesta
  // ¡Aserción de tipo necesaria porque el modelo devuelve la inclusión completa!
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return transformRoutine(updatedRoutine as any); 
};
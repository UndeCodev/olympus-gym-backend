import { Prisma } from "../../../../generated/prisma";
import { AppError } from "../../../core/errors/AppError";
import { HttpCode } from "../../../shared/interfaces/HttpCode";
import { ExerciseParams } from "../interfaces/exercise_params.interface";
import { ExerciseModel } from "../models/exercise.model";

export const deleteExerciseService = async (params: ExerciseParams) => {
    const { id } = params;

    // 1. Verificar existencia
    const existingExercise = await ExerciseModel.findById(id);
    if (!existingExercise) {
        throw new AppError({
            httpCode: HttpCode.NOT_FOUND,
            description: 'Ejercicio no encontrado',
        });
    }

    // 2. Intentar eliminar y manejar Foreign Key (si está en un log o rutina)
    try {
        await ExerciseModel.delete(id);
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
            throw new AppError({
                httpCode: HttpCode.CONFLICT,
                description: 'No se puede eliminar el ejercicio porque está asignado a una rutina o tiene registros de entrenamiento.',
            });
        }
        throw error;
    }
};
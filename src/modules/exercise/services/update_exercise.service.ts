import { PrismaClient } from "../../../../generated/prisma";
import { AppError } from "../../../core/errors/AppError";
import { HttpCode } from "../../../shared/interfaces/HttpCode";
import { ExerciseParams } from "../interfaces/exercise_params.interface";
import { UpdateExerciseBody } from "../interfaces/update_exercise_body.interface";
import { ExerciseModel } from "../models/exercise.model";

const prisma = new PrismaClient();

export const updateExerciseService = async (params: ExerciseParams, body: UpdateExerciseBody) => {
    const { id } = params;
    const { name, muscleGroupIds } = body;

    // 1. Verificar existencia
    const existingExercise = await ExerciseModel.findById(id);
    if (!existingExercise) {
        throw new AppError({
            httpCode: HttpCode.NOT_FOUND,
            description: 'Ejercicio no encontrado',
        });
    }

    // 2. Verificar conflicto de nombre (solo si se cambia el nombre)
    if (name) {
        const existingName = await ExerciseModel.findByName(name);
        if (existingName && existingName.id !== id) {
            throw new AppError({
                httpCode: HttpCode.CONFLICT,
                description: 'Ya existe otro ejercicio con este nombre',
            });
        }
    }
    
    // 3. Validar IDs de grupos musculares (si se envían para actualizar N:M)
    if (muscleGroupIds) {
        const muscleGroups = await prisma.muscle_group.findMany({
            where: { id: { in: muscleGroupIds } },
        });
        if (muscleGroups.length !== muscleGroupIds.length) {
            throw new AppError({
                httpCode: HttpCode.BAD_REQUEST,
                description: 'Uno o más IDs de Grupos Musculares proporcionados no son válidos',
            });
        }
    }

    // 4. Actualizar
    return await ExerciseModel.update(id, body);
};
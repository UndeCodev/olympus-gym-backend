import { AppError } from "../../../core/errors/AppError";
import { HttpCode } from "../../../shared/interfaces/HttpCode";
import { ExerciseParams } from "../interfaces/exercise_params.interface";
import { ExerciseModel } from "../models/exercise.model";

export const getExerciseByIdService = async (params: ExerciseParams) => {
    const exercise = await ExerciseModel.findById(params.id);

    if (!exercise) {
        throw new AppError({
            httpCode: HttpCode.NOT_FOUND,
            description: 'Ejercicio no encontrado',
        });
    }
    return exercise;
};
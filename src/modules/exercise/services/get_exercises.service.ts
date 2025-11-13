import { GetExercisesQuery } from "../interfaces/get_exercises_query.interface";
import { ExerciseModel } from "../models/exercise.model";

export const getExercisesService = async (query: GetExercisesQuery) => {
    return await ExerciseModel.findAll(query);
};
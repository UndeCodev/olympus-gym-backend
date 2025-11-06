import { GetDifficultyLevelsQuery } from "../interfaces/get_difficulty_level_query.interface";
import { DifficultyLevelModel } from "../models/difficulty_level.model";

export const getDifficultyLevelsService = async (query: GetDifficultyLevelsQuery) => {
    return await DifficultyLevelModel.findAll(query);
};
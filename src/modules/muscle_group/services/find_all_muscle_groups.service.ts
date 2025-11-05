import { GetMuscleGroupQuery } from '../interfaces/get_muscle_groups_query.interface';
import { MuscleGroupModel } from '../models/muscle_group.model';

export const findAllMuscleGroupsService = async (query: GetMuscleGroupQuery) => {
  const groups = await MuscleGroupModel.findAll(query);

  return groups;
};

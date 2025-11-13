import { GetMasterRoutinesQuery } from "../interfaces/get_master_routines_query.interface";
import { MasterRoutineModel } from "../models/master_routine.model";
import { transformRoutine } from "../utils/transformRoutine";

export const getMasterRoutinesService = async (query: GetMasterRoutinesQuery) => {
  const routines = await MasterRoutineModel.findAll(query);
  return routines.map(transformRoutine);
};
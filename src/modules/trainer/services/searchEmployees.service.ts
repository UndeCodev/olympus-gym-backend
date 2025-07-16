import { SearchEmployeeOptions } from "../interfaces/searchEmployeeOptions";
import { TrainerModel } from "../models/trainer.model";

export const searchEmployees = async (options: SearchEmployeeOptions) => {
  const employees = await TrainerModel.searchEmployees(options);

  return employees;
};
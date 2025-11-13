import { ValidDay } from "./create_master_routine_body.interface";
import { RoutineExerciseBody } from "./routine_exercise_body.interface";

export interface UpdateMasterRoutineBody {
  name?: string;
  daysOfTheWeek?: ValidDay[];
  estimatedTimeMinutes?: number;
  exercises?: RoutineExerciseBody[];
}
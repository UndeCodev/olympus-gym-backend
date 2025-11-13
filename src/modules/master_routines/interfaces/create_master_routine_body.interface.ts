import { RoutineExerciseBody } from "./routine_exercise_body.interface";

export type ValidDay = 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado' | 'Domingo';

export interface CreateMasterRoutineBody {
  name: string;
  daysOfTheWeek: ValidDay[];
  estimatedTimeMinutes: number;
  exercises: RoutineExerciseBody[];
}
import { MyRoutineExercise } from "./my_routine_exercise.interface";

export interface MyRoutineResponse {
  assignmentId: number; // ID de UserRoutineAssignment
  routineName: string;
  days: string[]; // ["Lunes", "Jueves"]
  isToday: boolean; // ¿Esta rutina toca hoy?
  estimatedTime: number;
  /** "3/5 ejercicios completados" */
  progress: string;
  /** "Pecho, Tríceps, Hombro" */
  targetMuscles: string;
  exercises: MyRoutineExercise[];
}
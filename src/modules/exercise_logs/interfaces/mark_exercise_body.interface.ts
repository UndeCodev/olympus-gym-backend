export interface MarkExerciseBody {
  exerciseId: number;
  completed: boolean;
  date?: string; // YYYY-MM-DD
}
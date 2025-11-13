export interface UpdateExerciseBody {
  name?: string;
  description?: string;
  imageUrl?: string | null;
  muscleGroupIds?: number[];
}
interface ImportantTipBody {
  tipText: string;
}

interface StepByStepInstructionBody {
  order: number;
  instructionText: string;
}

export interface ExerciseInstructionBody {
  difficultyLevelId: number;
  sets: number;
  repetitionsMin: number;
  repetitionsMax: number;
  restTimeSeconds: number;
  stepByStepInstructions: StepByStepInstructionBody[];
  importantTips?: ImportantTipBody[];
}

export interface CreateExerciseBody {
  name: string;
  description?: string;
  imageUrl?: string;
  muscleGroupIds: number[];
  instructions: ExerciseInstructionBody[];
}
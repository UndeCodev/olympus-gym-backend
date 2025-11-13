import { master_routine, routine_exercise_master, exercise } from "../../../../generated/prisma";

type RoutineWithExercises = master_routine & {
  exercisesInRoutine: (routine_exercise_master & {
    exercise: exercise;
  })[];
};

export const transformRoutine = (routine: RoutineWithExercises) => {
  return {
    ...routine,
    daysOfTheWeek: routine.daysOfTheWeek.split(','),
  };
};
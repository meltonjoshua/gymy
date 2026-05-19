import { ExerciseDifficulty } from './exercise';

export interface WorkoutSet {
  id: string;
  exerciseId: string;
  setNumber: number;
  reps: number;
  weight: number;
  completed: boolean;
}

export interface WorkoutExercise {
  id: string;
  exerciseId: string;
  order: number;
  sets: WorkoutSet[];
  restSeconds: number;
  notes: string;
}

export interface Workout {
  id: string;
  name: string;
  description: string;
  exercises: WorkoutExercise[];
  estimatedDurationMinutes: number;
  difficulty: ExerciseDifficulty;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

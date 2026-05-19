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

export interface CompletedSet {
  exerciseId: string;
  setNumber: number;
  reps: number;
  weight: number;
}

export interface CompletedExercise {
  exerciseId: string;
  exerciseName: string;
  sets: CompletedSet[];
}

export interface CompletedWorkout {
  id: string;
  name: string;
  exercises: CompletedExercise[];
  totalVolume: number;
  durationMinutes: number;
  completedAt: string;
}

export interface WeeklyStats {
  totalVolume: number;
  workoutsCompleted: number;
  totalMinutes: number;
  previousVolume: number;
  previousWorkouts: number;
}

export interface PersonalRecord {
  exerciseId: string;
  exerciseName: string;
  weight: number;
  reps: number;
  estimated1RM: number;
  date: string;
}

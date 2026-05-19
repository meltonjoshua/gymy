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

export interface CompletedWorkout {
  id: string;
  workoutId: string;
  name: string;
  exercises: WorkoutExercise[];
  startTime: string;
  endTime: string;
  durationSeconds: number;
  totalVolume: number;
  personalRecords: PersonalRecord[];
}

export interface PersonalRecord {
  exerciseId: string;
  exerciseName: string;
  weight: number;
  reps: number;
  estimated1RM: number;
  date: string;
}

export interface WeeklyStats {
  totalVolume: number;
  workoutsCompleted: number;
  totalMinutes: number;
  previousVolume: number;
  previousWorkouts: number;
}
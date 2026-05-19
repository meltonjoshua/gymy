import { ExerciseCategory, MuscleGroup } from './exercise';

export interface CompletedSet {
  exerciseId: string;
  setNumber: number;
  reps: number;
  weight: number;
  completed: boolean;
}

export interface CompletedExercise {
  exerciseId: string;
  sets: CompletedSet[];
  restSeconds: number;
}

export interface CompletedWorkout {
  id: string;
  name: string;
  exercises: CompletedExercise[];
  startedAt: string;
  completedAt: string;
  durationMinutes: number;
}

export interface BodyMeasurement {
  id: string;
  date: string;
  weight: number;
  bodyFat: number;
  arms?: number;
  chest?: number;
  waist?: number;
  thighs?: number;
  custom?: Record<string, number>;
}

export interface PersonalRecord {
  exerciseId: string;
  exerciseName: string;
  estimated1RM: number;
  weight: number;
  reps: number;
  date: string;
  category: ExerciseCategory;
}

export interface VolumeDataPoint {
  date: string;
  volume: number;
}

export interface StrengthDataPoint {
  date: string;
  estimated1RM: number;
  exerciseId: string;
  exerciseName: string;
}

export interface FrequencyDataPoint {
  date: string;
  count: number;
}

export interface BodyPartVolumeData {
  name: string;
  value: number;
  color: string;
}

export interface StreakData {
  current: number;
  longest: number;
  average: number;
}

export interface DurationDataPoint {
  date: string;
  duration: number;
}

export const BODY_PART_COLORS: Record<string, string> = {
  chest: '#10b981',
  back: '#f97316',
  shoulders: '#8b5cf6',
  arms: '#ec4899',
  legs: '#3b82f6',
  core: '#eab308',
  cardio: '#ef4444',
};

export const MUSCLE_TO_CATEGORY: Record<MuscleGroup, ExerciseCategory> = {
  chest: 'chest',
  'upper chest': 'chest',
  back: 'back',
  'upper back': 'back',
  lats: 'back',
  traps: 'back',
  shoulders: 'shoulders',
  'front delts': 'shoulders',
  'side delts': 'shoulders',
  'rear delts': 'shoulders',
  biceps: 'arms',
  triceps: 'arms',
  forearms: 'arms',
  quads: 'legs',
  hamstrings: 'legs',
  glutes: 'legs',
  calves: 'legs',
  hips: 'legs',
  'hip flexors': 'legs',
  legs: 'legs',
  core: 'core',
  abs: 'core',
  obliques: 'core',
  'lower back': 'core',
  cardio: 'cardio',
  'full body': 'cardio',
};

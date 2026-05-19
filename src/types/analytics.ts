import { ExerciseCategory } from './exercise';
import { CompletedWorkout, PersonalRecord } from './workout';
import { BodyMeasurement } from './body-stats';

export type { CompletedWorkout, PersonalRecord, BodyMeasurement };

export interface AnalyticsPersonalRecord extends PersonalRecord {
  category: ExerciseCategory;
}

export interface ExtendedBodyMeasurement extends BodyMeasurement {
  custom?: Record<string, number>;
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

export const MUSCLE_TO_CATEGORY: Record<string, ExerciseCategory> = {
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
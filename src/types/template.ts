import { ExerciseDifficulty } from './exercise';

export interface WorkoutTemplate {
  id: string;
  name: string;
  description: string;
  difficulty: ExerciseDifficulty;
  exercises: {
    id: string;
    exerciseId: string;
    order: number;
    sets: {
      id: string;
      exerciseId: string;
      setNumber: number;
      reps: number;
      weight: number;
      completed: boolean;
    }[];
    restSeconds: number;
    notes: string;
  }[];
  estimatedDurationMinutes: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProgramDay {
  day: number;
  label: string;
  templateId: string;
  isRest: boolean;
}

export interface Program {
  id: string;
  name: string;
  description: string;
  difficulty: ExerciseDifficulty;
  weeks: number;
  daysPerWeek: number;
  schedule: ProgramDay[][];
}

export interface ProgramProgress {
  programId: string;
  currentWeek: number;
  currentDay: number;
  completedDays: string[];
  startedAt: string;
}
export type ExerciseCategory = 'chest' | 'back' | 'shoulders' | 'arms' | 'legs' | 'core' | 'cardio';

export type ExerciseEquipment =
  | 'barbell'
  | 'dumbbell'
  | 'machine'
  | 'cable'
  | 'bodyweight'
  | 'kettlebell'
  | 'band';

export type ExerciseDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  muscleGroups: string[];
  equipment: ExerciseEquipment;
  difficulty: ExerciseDifficulty;
  instructions: string[];
  tips: string[];
  defaultSets: number;
  defaultReps: number;
  restSeconds: number;
}

export interface ExerciseFilters {
  category?: ExerciseCategory;
  equipment?: ExerciseEquipment;
  difficulty?: ExerciseDifficulty;
  muscleGroup?: string;
}

export type ExerciseCategory = 'chest' | 'back' | 'shoulders' | 'arms' | 'legs' | 'core' | 'cardio';
export type ExerciseEquipment = 'barbell' | 'dumbbell' | 'machine' | 'cable' | 'bodyweight' | 'kettlebell' | 'band';
export type ExerciseDifficulty = 'beginner' | 'intermediate' | 'advanced';

export type MuscleGroup =
  | 'chest' | 'upper chest' | 'lower chest'
  | 'back' | 'upper back' | 'lower back' | 'lats' | 'traps'
  | 'shoulders' | 'side delts' | 'rear delts'
  | 'biceps' | 'triceps' | 'forearms'
  | 'quads' | 'hamstrings' | 'glutes' | 'calves' | 'hips' | 'hip flexors'
  | 'core' | 'abs' | 'obliques'
  | 'cardio' | 'full body';

export const MUSCLE_GROUP_TO_CATEGORY: Record<MuscleGroup, ExerciseCategory> = {
  'chest': 'chest', 'upper chest': 'chest', 'lower chest': 'chest',
  'back': 'back', 'upper back': 'back', 'lower back': 'back', 'lats': 'back', 'traps': 'shoulders',
  'shoulders': 'shoulders', 'side delts': 'shoulders', 'rear delts': 'shoulders',
  'biceps': 'arms', 'triceps': 'arms', 'forearms': 'arms',
  'quads': 'legs', 'hamstrings': 'legs', 'glutes': 'legs', 'calves': 'legs', 'hips': 'legs', 'hip flexors': 'legs',
  'core': 'core', 'abs': 'core', 'obliques': 'core',
  'cardio': 'cardio', 'full body': 'cardio',
};

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  muscleGroups: MuscleGroup[];
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
  query?: string;
}
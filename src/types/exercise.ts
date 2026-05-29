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

export type MuscleGroup =
  | 'chest'
  | 'upper chest'
  | 'back'
  | 'upper back'
  | 'lats'
  | 'traps'
  | 'shoulders'
  | 'front delts'
  | 'side delts'
  | 'rear delts'
  | 'biceps'
  | 'triceps'
  | 'forearms'
  | 'quads'
  | 'hamstrings'
  | 'glutes'
  | 'calves'
  | 'hips'
  | 'hip flexors'
  | 'legs'
  | 'core'
  | 'abs'
  | 'obliques'
  | 'lower back'
  | 'cardio'
  | 'full body';

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

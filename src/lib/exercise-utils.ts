import { Exercise, ExerciseFilters, MuscleGroup } from '@/types/exercise';
import { exercises } from '@/data/exercises';

const muscleAliases: Record<string, MuscleGroup[]> = {
  'chest': ['chest', 'upper chest'],
  'shoulders': ['shoulders', 'front delts', 'side delts', 'rear delts'],
  'back': ['back', 'upper back', 'lats', 'traps'],
  'arms': ['biceps', 'triceps', 'forearms'],
  'legs': ['quads', 'hamstrings', 'glutes', 'calves', 'hips', 'hip flexors', 'legs'],
  'core': ['core', 'abs', 'obliques', 'lower back'],
  'cardio': ['cardio', 'full body'],
};

export function searchExercises(query: string): Exercise[] {
  const q = query.toLowerCase().trim();
  if (!q) return exercises;
  return exercises.filter(
    (e) =>
      e.name.toLowerCase().includes(q) ||
      e.muscleGroups.some((m) => m.toLowerCase().includes(q)) ||
      e.category.toLowerCase().includes(q)
  );
}

export function filterExercises(filters: ExerciseFilters): Exercise[] {
  return exercises.filter((e) => {
    if (filters.category && e.category !== filters.category) return false;
    if (filters.equipment && e.equipment !== filters.equipment) return false;
    if (filters.difficulty && e.difficulty !== filters.difficulty) return false;
    if (filters.query) {
      const q = filters.query.toLowerCase();
      return e.name.toLowerCase().includes(q) ||
        e.muscleGroups.some((m) => m.toLowerCase().includes(q)) ||
        e.category.toLowerCase().includes(q);
    }
    return true;
  });
}

export function getExercisesByMuscle(muscle: string): Exercise[] {
  const key = muscle.toLowerCase();
  const aliases = muscleAliases[key];
  return exercises.filter((e) => {
    if (aliases) {
      return e.muscleGroups.some((m) => aliases.includes(m));
    }
    return e.muscleGroups.some((m) => m.toLowerCase().includes(key));
  });
}

export function getRandomExercise(): Exercise {
  if (exercises.length === 0) {
    throw new Error('No exercises available');
  }
  return exercises[Math.floor(Math.random() * exercises.length)]!;
}

export function getExerciseById(id: string): Exercise | undefined {
  return exercises.find((e) => e.id === id);
}

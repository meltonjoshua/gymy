import { Exercise, ExerciseCategory, ExerciseFilters, MuscleGroup, MUSCLE_GROUP_TO_CATEGORY } from '@/types/exercise';
import { exercises } from '@/data/exercises';

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
    if (filters.query) {
      const q = filters.query.toLowerCase().trim();
      const matchesQuery =
        e.name.toLowerCase().includes(q) ||
        e.muscleGroups.some((m) => m.toLowerCase().includes(q)) ||
        e.category.toLowerCase().includes(q);
      if (!matchesQuery) return false;
    }
    if (filters.category && e.category !== filters.category) return false;
    if (filters.equipment && e.equipment !== filters.equipment) return false;
    if (filters.difficulty && e.difficulty !== filters.difficulty) return false;
    return true;
  });
}

export function getExercisesByMuscle(muscle: MuscleGroup): Exercise[] {
  const category = MUSCLE_GROUP_TO_CATEGORY[muscle];
  return exercises.filter(
    (e) => e.muscleGroups.includes(muscle) || (category !== undefined && e.category === category)
  );
}

export function getExercisesByCategory(category: ExerciseCategory): Exercise[] {
  return exercises.filter((e) => e.category === category);
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

import { Workout, WorkoutExercise, WorkoutSet } from '@/types/workout';
import { ExerciseDifficulty } from '@/types/exercise';

let counter = 0;
function uid(): string {
  counter += 1;
  return `${Date.now()}-${counter}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createSet(exerciseId: string, setNumber: number, defaultReps: number): WorkoutSet {
  return {
    id: uid(),
    exerciseId,
    setNumber,
    reps: defaultReps,
    weight: 0,
    completed: false,
  };
}

export function createWorkoutExercise(
  exerciseId: string,
  order: number,
  defaultSets: number,
  defaultReps: number,
  restSeconds: number
): WorkoutExercise {
  const sets: WorkoutSet[] = [];
  for (let i = 1; i <= defaultSets; i++) {
    sets.push(createSet(exerciseId, i, defaultReps));
  }
  return {
    id: uid(),
    exerciseId,
    order,
    sets,
    restSeconds,
    notes: '',
  };
}

export function createWorkout(
  name: string,
  description: string,
  workoutExercises: WorkoutExercise[],
  difficulty: ExerciseDifficulty,
  tags: string[] = []
): Workout {
  const totalSets = workoutExercises.reduce((sum, e) => sum + e.sets.length, 0);
  const estMinutes = totalSets * 2 + workoutExercises.reduce((sum, e) => sum + (e.sets.length - 1) * (e.restSeconds / 60), 0);
  return {
    id: uid(),
    name,
    description,
    exercises: workoutExercises,
    estimatedDurationMinutes: Math.round(estMinutes),
    difficulty,
    tags,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function estimate1RM(weight: number, reps: number): number {
  if (reps === 1) return weight;
  if (weight === 0) return 0;
  return Math.round(weight * (1 + reps / 30));
}

export function calculateVolume(sets: WorkoutSet[]): number {
  return sets
    .filter((s) => s.completed)
    .reduce((sum, s) => sum + s.reps * s.weight, 0);
}

export function formatDuration(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hrs > 0) return `${hrs}h ${mins}m`;
  return `${mins}m ${secs}s`;
}

export function formatRestTimer(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
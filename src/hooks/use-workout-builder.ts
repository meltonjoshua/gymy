'use client';

import { useState, useCallback, useMemo } from 'react';
import { WorkoutSet, WorkoutExercise, Workout } from '@/types/workout';
import { ExerciseDifficulty } from '@/types/exercise';
import { getExerciseById } from '@/lib/exercise-utils';

function generateId(): string {
  return Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
}

function createSets(
  exerciseId: string,
  setCount: number,
  defaultReps: number,
  defaultWeight: number
): WorkoutSet[] {
  return Array.from({ length: setCount }, (_, i) => ({
    id: generateId(),
    exerciseId,
    setNumber: i + 1,
    reps: defaultReps,
    weight: defaultWeight,
    completed: false,
  }));
}

function calculateDuration(exercises: WorkoutExercise[]): number {
  const secondsPerRep = 3;
  const setupTimeMinutes = 1;
  let totalMinutes = 0;

  for (const we of exercises) {
    const setsCount = we.sets.length;
    const avgReps = we.sets.reduce((sum, s) => sum + s.reps, 0) / (setsCount || 1);
    totalMinutes += (setsCount * avgReps * secondsPerRep) / 60;
    totalMinutes += (setsCount - 1) * (we.restSeconds / 60);
    totalMinutes += setupTimeMinutes;
  }

  return Math.max(1, Math.round(totalMinutes));
}

function determineDifficulty(exercises: WorkoutExercise[]): ExerciseDifficulty {
  if (exercises.length === 0) return 'beginner';
  const difficulties = exercises.map((we) => {
    const exercise = getExerciseById(we.exerciseId);
    return exercise?.difficulty ?? 'beginner';
  });
  const hasAdvanced = difficulties.includes('advanced');
  const hasIntermediate = difficulties.includes('intermediate');
  if (hasAdvanced) return 'advanced';
  if (hasIntermediate) return 'intermediate';
  return 'beginner';
}

export interface WorkoutBuilderState {
  name: string;
  description: string;
  exercises: WorkoutExercise[];
  tags: string[];
}

export function useWorkoutBuilder() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [exercises, setExercises] = useState<WorkoutExercise[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  const addExercise = useCallback(
    (exerciseId: string) => {
      const exercise = getExerciseById(exerciseId);
      if (!exercise) return;

      const workoutExercise: WorkoutExercise = {
        id: generateId(),
        exerciseId,
        order: exercises.length,
        sets: createSets(exerciseId, exercise.defaultSets, exercise.defaultReps, 0),
        restSeconds: exercise.restSeconds,
        notes: '',
      };

      setExercises((prev) => [...prev, workoutExercise]);
    },
    [exercises.length]
  );

  const removeExercise = useCallback((exerciseWorkoutId: string) => {
    setExercises((prev) =>
      prev.filter((we) => we.id !== exerciseWorkoutId).map((we, idx) => ({ ...we, order: idx }))
    );
  }, []);

  const reorderExercises = useCallback((reordered: WorkoutExercise[]) => {
    setExercises(reordered.map((we, idx) => ({ ...we, order: idx })));
  }, []);

  const moveExercise = useCallback((fromIndex: number, toIndex: number) => {
    setExercises((prev) => {
      const result = [...prev];
      const movedEl = result[fromIndex];
      if (!movedEl) return prev;
      result.splice(fromIndex, 1);
      result.splice(toIndex, 0, movedEl);
      return result.map((we, idx) => ({ ...we, order: idx }));
    });
  }, []);

  const updateExerciseSets = useCallback((exerciseWorkoutId: string, sets: WorkoutSet[]) => {
    setExercises((prev) =>
      prev.map((we) =>
        we.id === exerciseWorkoutId
          ? { ...we, sets: sets.map((s, i) => ({ ...s, setNumber: i + 1 })) }
          : we
      )
    );
  }, []);

  const addSet = useCallback((exerciseWorkoutId: string) => {
    setExercises((prev) =>
      prev.map((we) => {
        if (we.id !== exerciseWorkoutId) return we;
        const lastSet = we.sets[we.sets.length - 1];
        const newSet: WorkoutSet = {
          id: generateId(),
          exerciseId: we.exerciseId,
          setNumber: we.sets.length + 1,
          reps: lastSet?.reps ?? 10,
          weight: lastSet?.weight ?? 0,
          completed: false,
        };
        return { ...we, sets: [...we.sets, newSet] };
      })
    );
  }, []);

  const removeSet = useCallback((exerciseWorkoutId: string, setId: string) => {
    setExercises((prev) =>
      prev.map((we) => {
        if (we.id !== exerciseWorkoutId) return we;
        if (we.sets.length <= 1) return we;
        return {
          ...we,
          sets: we.sets.filter((s) => s.id !== setId).map((s, i) => ({ ...s, setNumber: i + 1 })),
        };
      })
    );
  }, []);

  const updateSetReps = useCallback((exerciseWorkoutId: string, setId: string, reps: number) => {
    setExercises((prev) =>
      prev.map((we) => {
        if (we.id !== exerciseWorkoutId) return we;
        return {
          ...we,
          sets: we.sets.map((s) => (s.id === setId ? { ...s, reps } : s)),
        };
      })
    );
  }, []);

  const updateSetWeight = useCallback(
    (exerciseWorkoutId: string, setId: string, weight: number) => {
      setExercises((prev) =>
        prev.map((we) => {
          if (we.id !== exerciseWorkoutId) return we;
          return {
            ...we,
            sets: we.sets.map((s) => (s.id === setId ? { ...s, weight } : s)),
          };
        })
      );
    },
    []
  );

  const updateRestSeconds = useCallback((exerciseWorkoutId: string, restSeconds: number) => {
    setExercises((prev) =>
      prev.map((we) => (we.id === exerciseWorkoutId ? { ...we, restSeconds } : we))
    );
  }, []);

  const updateNotes = useCallback((exerciseWorkoutId: string, notes: string) => {
    setExercises((prev) => prev.map((we) => (we.id === exerciseWorkoutId ? { ...we, notes } : we)));
  }, []);

  const toggleSetCompleted = useCallback((exerciseWorkoutId: string, setId: string) => {
    setExercises((prev) =>
      prev.map((we) => {
        if (we.id !== exerciseWorkoutId) return we;
        return {
          ...we,
          sets: we.sets.map((s) => (s.id === setId ? { ...s, completed: !s.completed } : s)),
        };
      })
    );
  }, []);

  const estimatedDuration = useMemo(() => calculateDuration(exercises), [exercises]);

  const difficulty = useMemo(() => determineDifficulty(exercises), [exercises]);

  const totalSets = useMemo(
    () => exercises.reduce((sum, we) => sum + we.sets.length, 0),
    [exercises]
  );

  const isValid = exercises.length > 0;

  const reset = useCallback(() => {
    setName('');
    setDescription('');
    setExercises([]);
    setTags([]);
  }, []);

  const buildWorkout = useCallback((): Workout => {
    const now = new Date().toISOString();
    return {
      id: generateId(),
      name: name || 'Untitled Workout',
      description,
      exercises: exercises.map((we, idx) => ({ ...we, order: idx })),
      estimatedDurationMinutes: estimatedDuration,
      difficulty,
      tags,
      createdAt: now,
      updatedAt: now,
    };
  }, [name, description, exercises, estimatedDuration, difficulty, tags]);

  return {
    name,
    setName,
    description,
    setDescription,
    exercises,
    tags,
    setTags,
    addExercise,
    removeExercise,
    reorderExercises,
    moveExercise,
    updateExerciseSets,
    addSet,
    removeSet,
    updateSetReps,
    updateSetWeight,
    updateRestSeconds,
    updateNotes,
    toggleSetCompleted,
    estimatedDuration,
    difficulty,
    totalSets,
    isValid,
    reset,
    buildWorkout,
  };
}

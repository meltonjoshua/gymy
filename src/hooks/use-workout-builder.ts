'use client';

import { useState, useCallback } from 'react';
import { WorkoutExercise, Workout } from '@/types/workout';
import { exercises } from '@/data/exercises';
import { createWorkoutExercise, createWorkout } from '@/lib/workout-utils';

export function useWorkoutBuilder() {
  const [workoutExercises, setWorkoutExercises] = useState<WorkoutExercise[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const addExercise = useCallback((exerciseId: string) => {
    const ex = exercises.find((e) => e.id === exerciseId);
    if (!ex) return;
    const order = workoutExercises.length + 1;
    const we = createWorkoutExercise(ex.id, order, ex.defaultSets, ex.defaultReps, ex.restSeconds);
    setWorkoutExercises((prev) => [...prev, we]);
  }, [workoutExercises.length]);

  const removeExercise = useCallback((id: string) => {
    setWorkoutExercises((prev) => {
      const filtered = prev.filter((e) => e.id !== id);
      return filtered.map((e, i) => ({ ...e, order: i + 1 }));
    });
  }, []);

  const reorderExercises = useCallback((newOrder: WorkoutExercise[]) => {
    setWorkoutExercises(newOrder.map((e, i) => ({ ...e, order: i + 1 })));
  }, []);

  const updateExercise = useCallback((id: string, updates: Partial<WorkoutExercise>) => {
    setWorkoutExercises((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
  }, []);

  const updateSet = useCallback((exerciseId: string, setId: string, updates: Partial<{ reps: number; weight: number; completed: boolean }>) => {
    setWorkoutExercises((prev) =>
      prev.map((e) =>
        e.id === exerciseId
          ? { ...e, sets: e.sets.map((s) => (s.id === setId ? { ...s, ...updates } : s)) }
          : e
      )
    );
  }, []);

  const addSet = useCallback((exerciseId: string) => {
    setWorkoutExercises((prev) =>
      prev.map((e) => {
        if (e.id !== exerciseId) return e;
        const newSetNumber = e.sets.length + 1;
        const lastSet = e.sets[e.sets.length - 1];
        return {
          ...e,
          sets: [...e.sets, { id: `ws-${Date.now()}`, exerciseId, setNumber: newSetNumber, reps: lastSet?.reps ?? 10, weight: lastSet?.weight ?? 0, completed: false }],
        };
      })
    );
  }, []);

  const removeSet = useCallback((exerciseId: string, setId: string) => {
    setWorkoutExercises((prev) =>
      prev.map((e) => {
        if (e.id !== exerciseId) return e;
        const filtered = e.sets.filter((s) => s.id !== setId);
        return { ...e, sets: filtered.map((s, i) => ({ ...s, setNumber: i + 1 })) };
      })
    );
  }, []);

  const reset = useCallback(() => {
    setWorkoutExercises([]);
    setName('');
    setDescription('');
  }, []);

  const isValid = workoutExercises.length > 0;

  const buildWorkout = useCallback((): Workout => {
    return createWorkout(name || 'Custom Workout', description, workoutExercises, 'intermediate', []);
  }, [name, description, workoutExercises]);

  return {
    workoutExercises,
    name,
    setName,
    description,
    setDescription,
    addExercise,
    removeExercise,
    reorderExercises,
    updateExercise,
    updateSet,
    addSet,
    removeSet,
    reset,
    isValid,
    buildWorkout,
  };
}
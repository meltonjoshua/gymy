'use client';

import { useState, useCallback } from 'react';
import { WorkoutExercise, CompletedWorkout, PersonalRecord } from '@/types/workout';
import { calculateVolume, estimate1RM } from '@/lib/workout-utils';
import { exercises } from '@/data/exercises';

export function useWorkoutSession() {
  const [sessionExercises, setSessionExercises] = useState<WorkoutExercise[]>([]);
  const [startTime, setStartTime] = useState<string>('');
  const [isComplete, setIsComplete] = useState(false);

  const initSession = useCallback((workoutExercises: WorkoutExercise[]) => {
    const initialized = workoutExercises.map((e) => ({
      ...e,
      sets: e.sets.map((s) => ({ ...s, weight: 0, completed: false })),
    }));
    setSessionExercises(initialized);
    setStartTime(new Date().toISOString());
    setIsComplete(false);
  }, []);

  const completeSet = useCallback(
    (exerciseId: string, setId: string, weight: number, reps: number) => {
      setSessionExercises((prev) =>
        prev.map((e) =>
          e.id === exerciseId
            ? {
                ...e,
                sets: e.sets.map((s) =>
                  s.id === setId ? { ...s, weight, reps, completed: true } : s
                ),
              }
            : e
        )
      );
    },
    []
  );

  const uncompleteSet = useCallback((exerciseId: string, setId: string) => {
    setSessionExercises((prev) =>
      prev.map((e) =>
        e.id === exerciseId
          ? { ...e, sets: e.sets.map((s) => (s.id === setId ? { ...s, completed: false } : s)) }
          : e
      )
    );
  }, []);

  const totalVolume = sessionExercises.reduce((sum, e) => sum + calculateVolume(e.sets), 0);
  const totalSets = sessionExercises.reduce((sum, e) => sum + e.sets.length, 0);
  const completedSets = sessionExercises.reduce(
    (sum, e) => sum + e.sets.filter((s) => s.completed).length,
    0
  );
  const progressPercent = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;

  const personalRecords: PersonalRecord[] = sessionExercises
    .flatMap((e) =>
      e.sets
        .filter((s) => s.completed && s.weight > 0)
        .map((s) => ({
          exerciseId: e.exerciseId,
          exerciseName: exercises.find((ex) => ex.id === e.exerciseId)?.name ?? e.exerciseId,
          weight: s.weight,
          reps: s.reps,
          estimated1RM: estimate1RM(s.weight, s.reps),
          date: new Date().toISOString(),
        }))
    )
    .sort((a, b) => b.estimated1RM - a.estimated1RM)
    .slice(0, 5);

  const completeWorkout = useCallback((): CompletedWorkout => {
    const completed: CompletedWorkout = {
      id: `cw-${Date.now()}`,
      name: 'Workout',
      exercises: sessionExercises.map((se) => ({
        exerciseId: se.exerciseId,
        exerciseName: se.exerciseId,
        sets: se.sets.map((s) => ({
          exerciseId: s.exerciseId,
          setNumber: s.setNumber,
          reps: s.reps,
          weight: s.weight,
        })),
      })),
      totalVolume,
      durationMinutes: startTime
        ? Math.round((Date.now() - new Date(startTime).getTime()) / 60000)
        : 0,
      completedAt: new Date().toISOString(),
    };
    setIsComplete(true);
    return completed;
  }, [sessionExercises, startTime, totalVolume]);

  return {
    sessionExercises,
    isComplete,
    totalVolume,
    completedSets,
    totalSets,
    progressPercent,
    personalRecords,
    initSession,
    completeSet,
    uncompleteSet,
    completeWorkout,
  };
}

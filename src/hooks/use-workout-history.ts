'use client';

import { useState, useCallback, useMemo } from 'react';
import { CompletedWorkout, CompletedExercise, WeeklyStats, PersonalRecord } from '@/types/workout';

const STORAGE_KEY = 'gymy_workouts';

function loadWorkouts(): CompletedWorkout[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveWorkouts(workouts: CompletedWorkout[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(workouts));
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
}

function getStartOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getStartOfPreviousWeek(date: Date): Date {
  const start = getStartOfWeek(date);
  start.setDate(start.getDate() - 7);
  return start;
}

function filterWorkoutsByDateRange(
  workouts: CompletedWorkout[],
  start: Date,
  end: Date
): CompletedWorkout[] {
  return workouts.filter((w) => {
    const d = new Date(w.completedAt);
    return d >= start && d <= end;
  });
}

export function useWorkoutHistory() {
  const [workouts, setWorkouts] = useState<CompletedWorkout[]>(loadWorkouts);

  const addWorkout = useCallback(
    (workout: {
      name: string;
      exercises: {
        exerciseId: string;
        exerciseName: string;
        sets: { reps: number; weight: number }[];
      }[];
      durationMinutes: number;
    }) => {
      const completedExercises: CompletedExercise[] = workout.exercises.map((e) => ({
        exerciseId: e.exerciseId,
        exerciseName: e.exerciseName,
        sets: e.sets.map((s, i) => ({
          exerciseId: e.exerciseId,
          setNumber: i + 1,
          reps: s.reps,
          weight: s.weight,
        })),
      }));

      const totalVolume = completedExercises.reduce(
        (sum, ex) => sum + ex.sets.reduce((s, set) => s + set.reps * set.weight, 0),
        0
      );

      const completed: CompletedWorkout = {
        id: generateId(),
        name: workout.name,
        exercises: completedExercises,
        totalVolume,
        durationMinutes: workout.durationMinutes,
        completedAt: new Date().toISOString(),
      };

      setWorkouts((prev) => {
        const updated = [completed, ...prev];
        saveWorkouts(updated);
        return updated;
      });
    },
    []
  );

  const deleteWorkout = useCallback((id: string) => {
    setWorkouts((prev) => {
      const updated = prev.filter((w) => w.id !== id);
      saveWorkouts(updated);
      return updated;
    });
  }, []);

  const weeklyStats = useMemo((): WeeklyStats => {
    const now = new Date();
    const thisWeekStart = getStartOfWeek(now);
    const thisWeekEnd = new Date(thisWeekStart);
    thisWeekEnd.setDate(thisWeekEnd.getDate() + 7);

    const prevWeekStart = getStartOfPreviousWeek(now);
    const prevWeekEnd = new Date(prevWeekStart);
    prevWeekEnd.setDate(prevWeekEnd.getDate() + 7);

    const thisWeekWorkouts = filterWorkoutsByDateRange(workouts, thisWeekStart, thisWeekEnd);
    const prevWeekWorkouts = filterWorkoutsByDateRange(workouts, prevWeekStart, prevWeekEnd);

    return {
      totalVolume: thisWeekWorkouts.reduce((sum, w) => sum + w.totalVolume, 0),
      workoutsCompleted: thisWeekWorkouts.length,
      totalMinutes: thisWeekWorkouts.reduce((sum, w) => sum + w.durationMinutes, 0),
      previousVolume: prevWeekWorkouts.reduce((sum, w) => sum + w.totalVolume, 0),
      previousWorkouts: prevWeekWorkouts.length,
    };
  }, [workouts]);

  const currentStreak = useMemo((): number => {
    if (workouts.length === 0) return 0;

    const workoutDates = new Set<string>();
    workouts.forEach((w) => {
      const d = new Date(w.completedAt);
      workoutDates.add(d.toISOString().split('T')[0]!);
    });

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const checkDate = new Date(today);

    if (!workoutDates.has(checkDate.toISOString().split('T')[0]!)) {
      checkDate.setDate(checkDate.getDate() - 1);
    }

    while (workoutDates.has(checkDate.toISOString().split('T')[0]!)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }

    return streak;
  }, [workouts]);

  const personalRecords = useMemo((): PersonalRecord[] => {
    const prMap = new Map<string, PersonalRecord>();

    workouts.forEach((w) => {
      w.exercises.forEach((ex) => {
        ex.sets.forEach((set) => {
          const key = ex.exerciseId;
          const current = prMap.get(key);
          const maxWeight = set.weight;
          if (!current || maxWeight > current.weight) {
            prMap.set(key, {
              exerciseId: ex.exerciseId,
              exerciseName: ex.exerciseName,
              weight: maxWeight,
              reps: set.reps,
              date: w.completedAt,
            });
          }
        });
      });
    });

    return Array.from(prMap.values()).sort((a, b) => b.weight - a.weight);
  }, [workouts]);

  return {
    workouts,
    addWorkout,
    deleteWorkout,
    weeklyStats,
    currentStreak,
    personalRecords,
  };
}

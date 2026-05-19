'use client';

import { useState, useCallback } from 'react';
import { CompletedWorkout, WeeklyStats, PersonalRecord } from '@/types/workout';

const STORAGE_KEY = 'gymy_workouts';

function getStoredWorkouts(): CompletedWorkout[] {
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

export function useWorkoutHistory() {
  const [workouts, setWorkouts] = useState<CompletedWorkout[]>([]);
  const [loaded, setLoaded] = useState(false);

  if (!loaded && typeof window !== 'undefined') {
    setWorkouts(getStoredWorkouts());
    setLoaded(true);
  }

  const addWorkout = useCallback((workout: CompletedWorkout) => {
    setWorkouts((prev) => {
      const updated = [workout, ...prev];
      saveWorkouts(updated);
      return updated;
    });
  }, []);

  const deleteWorkout = useCallback((id: string) => {
    setWorkouts((prev) => {
      const updated = prev.filter((w) => w.id !== id);
      saveWorkouts(updated);
      return updated;
    });
  }, []);

  const getWorkoutsByDateRange = useCallback((start: string, end: string) => {
    return workouts.filter((w) => w.startTime >= start && w.startTime <= end);
  }, [workouts]);

  const getWeeklyStats = useCallback((): WeeklyStats => {
    const now = new Date();
    const thisWeekStart = getStartOfWeek(now);
    const thisWeekEnd = new Date(thisWeekStart);
    thisWeekEnd.setDate(thisWeekEnd.getDate() + 7);
    const thisWeekStartStr = thisWeekStart.toISOString();
    const thisWeekEndStr = thisWeekEnd.toISOString();

    const prevWeekStart = getStartOfPreviousWeek(now);
    const prevWeekEnd = new Date(prevWeekStart);
    prevWeekEnd.setDate(prevWeekEnd.getDate() + 7);
    const prevWeekStartStr = prevWeekStart.toISOString();
    const prevWeekEndStr = prevWeekEnd.toISOString();

    const thisWeekWorkouts = workouts.filter(
      (w) => w.startTime >= thisWeekStartStr && w.startTime < thisWeekEndStr
    );
    const prevWeekWorkouts = workouts.filter(
      (w) => w.startTime >= prevWeekStartStr && w.startTime < prevWeekEndStr
    );

    return {
      totalVolume: thisWeekWorkouts.reduce((sum, w) => sum + w.totalVolume, 0),
      workoutsCompleted: thisWeekWorkouts.length,
      totalMinutes: Math.round(thisWeekWorkouts.reduce((sum, w) => sum + w.durationSeconds, 0) / 60),
      previousVolume: prevWeekWorkouts.reduce((sum, w) => sum + w.totalVolume, 0),
      previousWorkouts: prevWeekWorkouts.length,
    };
  }, [workouts]);

  const getCurrentStreak = useCallback((): number => {
    if (workouts.length === 0) return 0;
    const dates = [...new Set(workouts.map((w) => w.startTime.split('T')[0]!))].sort().reverse();
    let streak = 0;
    const today = new Date().toISOString().split('T')[0]!;
    const checkDate = new Date(today);
    if (!dates.includes(today)) {
      checkDate.setDate(checkDate.getDate() - 1);
    }
    while (dates.includes(checkDate.toISOString().split('T')[0]!)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }
    return streak;
  }, [workouts]);

  const getPersonalRecords = useCallback((): PersonalRecord[] => {
    const allPRs = workouts.flatMap((w) => w.personalRecords);
    const bestByExercise = new Map<string, PersonalRecord>();
    allPRs.forEach((pr) => {
      const existing = bestByExercise.get(pr.exerciseId);
      if (!existing || pr.estimated1RM > existing.estimated1RM) {
        bestByExercise.set(pr.exerciseId, pr);
      }
    });
    return Array.from(bestByExercise.values()).sort((a, b) => b.estimated1RM - a.estimated1RM);
  }, [workouts]);

  return {
    workouts,
    addWorkout,
    deleteWorkout,
    getWorkoutsByDateRange,
    getWeeklyStats,
    getCurrentStreak,
    getPersonalRecords,
  };
}
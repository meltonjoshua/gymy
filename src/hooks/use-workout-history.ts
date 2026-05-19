'use client';

import { useState, useCallback } from 'react';
import { CompletedWorkout } from '@/types/workout';

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

  const getWorkoutsByDateRange = useCallback((start: string, end: string) => {
    return workouts.filter((w) => w.startTime >= start && w.startTime <= end);
  }, [workouts]);

  const getWeeklyStats = useCallback(() => {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);
    const weekStr = weekStart.toISOString();
    const weekWorkouts = workouts.filter((w) => w.startTime >= weekStr);
    return {
      totalVolume: weekWorkouts.reduce((sum, w) => sum + w.totalVolume, 0),
      workoutsCompleted: weekWorkouts.length,
      totalTimeMinutes: Math.round(weekWorkouts.reduce((sum, w) => sum + w.durationSeconds, 0) / 60),
    };
  }, [workouts]);

  const getCurrentStreak = useCallback(() => {
    if (workouts.length === 0) return 0;
    const dates = [...new Set(workouts.map((w) => w.startTime.split('T')[0]))].sort().reverse();
    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    const checkDate = new Date(today);
    for (let i = 0; i < 365; i++) {
      const dateStr = checkDate.toISOString().split('T')[0];
      if (dates.includes(dateStr)) {
        streak++;
      } else if (i === 0) {
        checkDate.setDate(checkDate.getDate() - 1);
        continue;
      } else {
        break;
      }
      checkDate.setDate(checkDate.getDate() - 1);
    }
    return streak;
  }, [workouts]);

  const getPersonalRecords = useCallback(() => {
    const allPRs = workouts.flatMap((w) => w.personalRecords);
    const bestByExercise = new Map<string, CompletedWorkout['personalRecords'][0]>();
    allPRs.forEach((pr) => {
      const existing = bestByExercise.get(pr.exerciseId);
      if (!existing || pr.estimated1RM > existing.estimated1RM) {
        bestByExercise.set(pr.exerciseId, pr);
      }
    });
    return Array.from(bestByExercise.values());
  }, [workouts]);

  return {
    workouts,
    addWorkout,
    getWorkoutsByDateRange,
    getWeeklyStats,
    getCurrentStreak,
    getPersonalRecords,
  };
}
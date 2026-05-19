'use client';

import { useMemo } from 'react';
import { CompletedWorkout } from '@/types/workout';

export interface WeeklyVolumeData {
  day: string;
  volume: number;
}

export interface FrequencyData {
  day: string;
  workouts: number;
}

export interface ExerciseUsage {
  exerciseName: string;
  count: number;
}

export interface MonthlyPRCount {
  month: string;
  prs: number;
}

export function useStats(workouts: CompletedWorkout[]) {
  const weeklyVolumeData = useMemo((): WeeklyVolumeData[] => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const now = new Date();
    const startOfWeek = new Date(now);
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);

    const volumeByDay = new Map<string, number>();
    days.forEach((d) => volumeByDay.set(d, 0));

    workouts.forEach((w) => {
      const d = new Date(w.startTime);
      if (d >= startOfWeek) {
        const dayIndex = d.getDay();
        const dayName = days[dayIndex === 0 ? 6 : dayIndex - 1]!;
        volumeByDay.set(dayName, (volumeByDay.get(dayName) ?? 0) + w.totalVolume);
      }
    });

    return days.map((d) => ({ day: d, volume: volumeByDay.get(d) ?? 0 }));
  }, [workouts]);

  const frequencyData = useMemo((): FrequencyData[] => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const dayIndexMap: Record<number, number> = { 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 0: 6 };
    const counts: number[] = [0, 0, 0, 0, 0, 0, 0];

    workouts.forEach((w) => {
      const jsDay = new Date(w.startTime).getDay();
      const idx = dayIndexMap[jsDay] ?? 0;
      counts[idx] = (counts[idx] ?? 0) + 1;
    });

    return days.map((d, i) => ({ day: d, workouts: counts[i] ?? 0 }));
  }, [workouts]);

  const mostUsedExercises = useMemo((): ExerciseUsage[] => {
    const countMap = new Map<string, number>();
    workouts.forEach((w) => {
      w.exercises.forEach((ex) => {
        const name = (ex as unknown as { exerciseName?: string }).exerciseName ?? ex.exerciseId;
        countMap.set(name, (countMap.get(name) ?? 0) + 1);
      });
    });

    return Array.from(countMap.entries())
      .map(([exerciseName, count]) => ({ exerciseName, count }))
      .sort((a, b) => b.count - a.count);
  }, [workouts]);

  const monthlyPRCount = useMemo((): MonthlyPRCount[] => {
    const prMap = new Map<string, { weight: number; reps: number }>();
    const monthPRs = new Map<string, number>();

    workouts.forEach((w) => {
      const month = w.startTime.substring(0, 7);
      w.personalRecords.forEach((pr) => {
        const key = pr.exerciseId;
        const prev = prMap.get(key);
        if (!prev || pr.weight > prev.weight) {
          if (prev !== undefined) {
            monthPRs.set(month, (monthPRs.get(month) ?? 0) + 1);
          }
          prMap.set(key, { weight: pr.weight, reps: pr.reps });
        }
      });
    });

    return Array.from(monthPRs.entries())
      .map(([month, prs]) => ({ month, prs }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }, [workouts]);

  return {
    weeklyVolumeData,
    frequencyData,
    mostUsedExercises,
    monthlyPRCount,
  };
}
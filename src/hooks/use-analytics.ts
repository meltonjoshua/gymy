'use client';

import { useMemo, useCallback, useState, useSyncExternalStore } from 'react';
import {
  CompletedWorkout,
  VolumeDataPoint,
  StrengthDataPoint,
  BodyPartVolumeData,
  StreakData,
  DurationDataPoint,
  PersonalRecord,
  BODY_PART_COLORS,
  MUSCLE_TO_CATEGORY,
} from '@/types/analytics';
import { getExerciseById } from '@/lib/exercise-utils';

const STORAGE_KEY = 'gymy_workouts';

function loadWorkouts(): CompletedWorkout[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveWorkouts(workouts: CompletedWorkout[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(workouts));
}

function subscribe() {
  return () => {};
}

function getSnapshot(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(STORAGE_KEY) ?? '';
}

function getServerSnapshot(): string {
  return '';
}

function computeVolumeOverTime(workouts: CompletedWorkout[]): VolumeDataPoint[] {
  const map = new Map<string, number>();
  for (const w of workouts) {
    const day = w.completedAt.slice(0, 10);
    let vol = 0;
    for (const ex of w.exercises) {
      for (const s of ex.sets) {
        if (s.completed) vol += s.weight * s.reps;
      }
    }
    map.set(day, (map.get(day) || 0) + vol);
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, volume]) => ({ date, volume }));
}

function computeWeeklyVolume(workouts: CompletedWorkout[]): VolumeDataPoint[] {
  const map = new Map<string, number>();
  for (const w of workouts) {
    const d = new Date(w.completedAt);
    const weekStart = new Date(d);
    weekStart.setDate(d.getDate() - d.getDay());
    const key = weekStart.toISOString().slice(0, 10);
    let vol = 0;
    for (const ex of w.exercises) {
      for (const s of ex.sets) {
        if (s.completed) vol += s.weight * s.reps;
      }
    }
    map.set(key, (map.get(key) || 0) + vol);
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, volume]) => ({ date, volume }));
}

function computeMonthlyVolume(workouts: CompletedWorkout[]): VolumeDataPoint[] {
  const map = new Map<string, number>();
  for (const w of workouts) {
    const key = w.completedAt.slice(0, 7);
    let vol = 0;
    for (const ex of w.exercises) {
      for (const s of ex.sets) {
        if (s.completed) vol += s.weight * s.reps;
      }
    }
    map.set(key, (map.get(key) || 0) + vol);
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, volume]) => ({ date, volume }));
}

function computeStrength(workouts: CompletedWorkout[]): StrengthDataPoint[] {
  const points: StrengthDataPoint[] = [];
  for (const w of workouts) {
    for (const ex of w.exercises) {
      let best1RM = 0;
      for (const s of ex.sets) {
        if (!s.completed) continue;
        const e1rm = s.weight * (1 + s.reps / 30);
        if (e1rm > best1RM) {
          best1RM = e1rm;
        }
      }
      if (best1RM > 0) {
        const exercise = getExerciseById(ex.exerciseId);
        points.push({
          date: w.completedAt.slice(0, 10),
          estimated1RM: Math.round(best1RM * 10) / 10,
          exerciseId: ex.exerciseId,
          exerciseName: exercise?.name ?? ex.exerciseId,
        });
      }
    }
  }
  return points.sort((a, b) => a.date.localeCompare(b.date));
}

function computeBodyPartVolume(workouts: CompletedWorkout[]): BodyPartVolumeData[] {
  const map = new Map<string, number>();
  for (const w of workouts) {
    for (const ex of w.exercises) {
      const exercise = getExerciseById(ex.exerciseId);
      if (!exercise) continue;
      let vol = 0;
      for (const s of ex.sets) {
        if (s.completed) vol += s.weight * s.reps;
      }
      const categories = new Set<string>();
      for (const m of exercise.muscleGroups) {
        const cat = MUSCLE_TO_CATEGORY[m];
        if (cat) categories.add(cat);
      }
      for (const cat of categories) {
        map.set(cat, (map.get(cat) || 0) + vol);
      }
    }
  }
  return Array.from(map.entries())
    .map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      color: BODY_PART_COLORS[name] ?? '#6b7280',
    }))
    .sort((a, b) => b.value - a.value);
}

function computeFrequency(workouts: CompletedWorkout[]): { date: string; count: number }[] {
  const map = new Map<string, number>();
  for (const w of workouts) {
    const day = w.completedAt.slice(0, 10);
    map.set(day, (map.get(day) || 0) + 1);
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }));
}

function computeAvgDuration(workouts: CompletedWorkout[]): DurationDataPoint[] {
  const map = new Map<string, { total: number; count: number }>();
  for (const w of workouts) {
    const day = w.completedAt.slice(0, 10);
    const existing = map.get(day);
    if (existing) {
      existing.total += w.durationMinutes;
      existing.count += 1;
    } else {
      map.set(day, { total: w.durationMinutes, count: 1 });
    }
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, { total, count }]) => ({
      date,
      duration: Math.round((total / count) * 10) / 10,
    }));
}

function computeStreak(
  workouts: CompletedWorkout[],
  todayStr: string,
  yesterdayStr: string
): StreakData {
  if (workouts.length === 0) return { current: 0, longest: 0, average: 0 };
  const days = new Set<string>();
  for (const w of workouts) {
    days.add(w.completedAt.slice(0, 10));
  }
  const sortedDays = Array.from(days).sort();
  let current = 0;
  let longest = 0;
  let tempStreak = 1;

  for (let i = 1; i < sortedDays.length; i++) {
    const prev = new Date(sortedDays[i - 1]!);
    const curr = new Date(sortedDays[i]!);
    const diff = (curr.getTime() - prev.getTime()) / 86400000;
    if (diff === 1) {
      tempStreak++;
    } else {
      longest = Math.max(longest, tempStreak);
      tempStreak = 1;
    }
  }
  longest = Math.max(longest, tempStreak);

  let currentStreak = 0;
  if (days.has(todayStr) || days.has(yesterdayStr)) {
    let checkDate = days.has(todayStr) ? todayStr : yesterdayStr;
    while (days.has(checkDate)) {
      currentStreak++;
      const d = new Date(checkDate);
      d.setDate(d.getDate() - 1);
      checkDate = d.toISOString().slice(0, 10);
    }
  }
  current = currentStreak;

  const totalDays = sortedDays.length;
  if (totalDays <= 1) {
    return { current, longest, average: 0 };
  }
  const firstDate = new Date(sortedDays[0]!);
  const lastDate = new Date(sortedDays[sortedDays.length - 1]!);
  const span = (lastDate.getTime() - firstDate.getTime()) / 86400000;
  const weeks = span / 7;
  const average = weeks > 0 ? Math.round((totalDays / weeks) * 10) / 10 : 0;

  return { current, longest, average };
}

function computePRs(workouts: CompletedWorkout[]): PersonalRecord[] {
  const prMap = new Map<string, PersonalRecord>();
  for (const w of workouts) {
    for (const ex of w.exercises) {
      let best1RM = 0;
      let bestWeight = 0;
      let bestReps = 0;
      for (const s of ex.sets) {
        if (!s.completed) continue;
        const e1rm = s.weight * (1 + s.reps / 30);
        if (e1rm > best1RM) {
          best1RM = e1rm;
          bestWeight = s.weight;
          bestReps = s.reps;
        }
      }
      if (best1RM > 0) {
        const existing = prMap.get(ex.exerciseId);
        if (!existing || best1RM > existing.estimated1RM) {
          const exercise = getExerciseById(ex.exerciseId);
          prMap.set(ex.exerciseId, {
            exerciseId: ex.exerciseId,
            exerciseName: exercise?.name ?? ex.exerciseId,
            estimated1RM: Math.round(best1RM * 10) / 10,
            weight: bestWeight,
            reps: bestReps,
            date: w.completedAt.slice(0, 10),
            category: exercise?.category ?? 'core',
          });
        }
      }
    }
  }
  return Array.from(prMap.values()).sort((a, b) => b.estimated1RM - a.estimated1RM);
}

export function useAnalytics() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [version, setVersion] = useState(0);

  const workouts = useMemo((): CompletedWorkout[] => {
    void snapshot;
    void version;
    return loadWorkouts();
  }, [snapshot, version]);

  const todayStr = useMemo(() => {
    if (typeof window === 'undefined') return '';
    return new Date().toISOString().slice(0, 10);
  }, []);

  const yesterdayStr = useMemo(() => {
    if (typeof window === 'undefined') return '';
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().slice(0, 10);
  }, []);

  const refresh = useCallback(() => {
    setVersion((v) => v + 1);
    return loadWorkouts();
  }, []);

  const volumeOverTime = useMemo(
    (): VolumeDataPoint[] => computeVolumeOverTime(workouts),
    [workouts]
  );
  const weeklyVolume = useMemo((): VolumeDataPoint[] => computeWeeklyVolume(workouts), [workouts]);
  const monthlyVolume = useMemo(
    (): VolumeDataPoint[] => computeMonthlyVolume(workouts),
    [workouts]
  );
  const strengthProgression = useMemo(
    (): StrengthDataPoint[] => computeStrength(workouts),
    [workouts]
  );
  const bodyPartVolume = useMemo(
    (): BodyPartVolumeData[] => computeBodyPartVolume(workouts),
    [workouts]
  );
  const workoutFrequency = useMemo(
    (): { date: string; count: number }[] => computeFrequency(workouts),
    [workouts]
  );
  const averageDurationOverTime = useMemo(
    (): DurationDataPoint[] => computeAvgDuration(workouts),
    [workouts]
  );
  const streak = useMemo(
    (): StreakData => computeStreak(workouts, todayStr, yesterdayStr),
    [workouts, todayStr, yesterdayStr]
  );
  const personalRecords = useMemo((): PersonalRecord[] => computePRs(workouts), [workouts]);

  const addWorkout = useCallback((workout: CompletedWorkout) => {
    const current = loadWorkouts();
    current.push(workout);
    saveWorkouts(current);
    setVersion((v) => v + 1);
  }, []);

  return {
    workouts,
    refresh,
    volumeOverTime,
    weeklyVolume,
    monthlyVolume,
    strengthProgression,
    bodyPartVolume,
    workoutFrequency,
    averageDurationOverTime,
    streak,
    personalRecords,
    addWorkout,
  };
}

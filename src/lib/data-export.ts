'use client';

import { CompletedWorkout } from '@/types/workout';

export function exportAllData(): string {
  const workouts = localStorage.getItem('gymy_workouts') || '[]';
  const settings = localStorage.getItem('gymy_settings') || '{}';
  const profile = localStorage.getItem('gymy_profile') || '{}';
  const bodyStats = localStorage.getItem('gymy_body_stats') || '[]';

  return JSON.stringify({
    version: 1,
    exportedAt: new Date().toISOString(),
    workouts: JSON.parse(workouts),
    settings: JSON.parse(settings),
    profile: JSON.parse(profile),
    bodyStats: JSON.parse(bodyStats),
  }, null, 2);
}

export function importData(json: string): boolean {
  try {
    const data = JSON.parse(json);
    if (!data.version) return false;

    if (data.workouts) localStorage.setItem('gymy_workouts', JSON.stringify(data.workouts));
    if (data.settings) localStorage.setItem('gymy_settings', JSON.stringify(data.settings));
    if (data.profile) localStorage.setItem('gymy_profile', JSON.stringify(data.profile));
    if (data.bodyStats) localStorage.setItem('gymy_body_stats', JSON.stringify(data.bodyStats));

    return true;
  } catch {
    return false;
  }
}

export function exportWorkoutsCSV(): string {
  const workouts: CompletedWorkout[] = JSON.parse(localStorage.getItem('gymy_workouts') || '[]');
  if (workouts.length === 0) return '';

  const rows = workouts.map((w) =>
    `${w.startTime},${w.name},${w.exercises.length},${w.durationSeconds},${w.totalVolume}`
  );
  return ['Date,Name,Exercises,Duration(s),Volume', ...rows].join('\n');
}
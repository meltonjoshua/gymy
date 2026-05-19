'use client';

import { useSyncExternalStore, useCallback } from 'react';

export interface Achievement {
  id: string;
  label: string;
  icon: string;
  earnedAt: string;
}

export interface Profile {
  displayName: string;
  joinDate: string;
  totalWorkouts: number;
  totalVolumeLifted: number;
  longestStreak: number;
  achievements: Achievement[];
}

const STORAGE_KEY = 'gymy_profile';

const DEFAULT_PROFILE: Profile = {
  displayName: 'Gymy User',
  joinDate: new Date().toISOString().split('T')[0]!,
  totalWorkouts: 0,
  totalVolumeLifted: 0,
  longestStreak: 0,
  achievements: [],
};

let listeners: Array<() => void> = [];

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(listener: () => void) {
  listeners = [...listeners, listener];
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function getSnapshot(): string {
  return localStorage.getItem(STORAGE_KEY) ?? JSON.stringify(DEFAULT_PROFILE);
}

function getServerSnapshot(): string {
  return JSON.stringify(DEFAULT_PROFILE);
}

function parseProfile(raw: string): Profile {
  try {
    const parsed = JSON.parse(raw) as Partial<Profile>;
    return { ...DEFAULT_PROFILE, ...parsed };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function useProfile() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const profile = parseProfile(raw);

  const updateProfile = useCallback(<K extends keyof Profile>(key: K, value: Profile[K]) => {
    const current = parseProfile(localStorage.getItem(STORAGE_KEY) ?? '');
    const updated = { ...current, [key]: value };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    emitChange();
  }, []);

  const addAchievement = useCallback((achievement: Achievement) => {
    const current = parseProfile(localStorage.getItem(STORAGE_KEY) ?? '');
    if (current.achievements.some((a) => a.id === achievement.id)) return;
    const updated = { ...current, achievements: [...current.achievements, achievement] };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    emitChange();
  }, []);

  const incrementWorkouts = useCallback(() => {
    const current = parseProfile(localStorage.getItem(STORAGE_KEY) ?? '');
    const updated = { ...current, totalWorkouts: current.totalWorkouts + 1 };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    emitChange();
  }, []);

  const addVolume = useCallback((volume: number) => {
    const current = parseProfile(localStorage.getItem(STORAGE_KEY) ?? '');
    const updated = { ...current, totalVolumeLifted: current.totalVolumeLifted + volume };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    emitChange();
  }, []);

  const updateLongestStreak = useCallback((currentStreak: number) => {
    const current = parseProfile(localStorage.getItem(STORAGE_KEY) ?? '');
    if (currentStreak <= current.longestStreak) return;
    const updated = { ...current, longestStreak: currentStreak };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    emitChange();
  }, []);

  const resetProfile = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PROFILE));
    emitChange();
  }, []);

  return {
    profile,
    updateProfile,
    addAchievement,
    incrementWorkouts,
    addVolume,
    updateLongestStreak,
    resetProfile,
    loaded: true,
  };
}

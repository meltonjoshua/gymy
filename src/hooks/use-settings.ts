'use client';

import { useSyncExternalStore, useCallback } from 'react';

export type UnitSystem = 'metric' | 'imperial';
export type WeightIncrement = 2.5 | 5 | 10;
export type AccentColor = 'emerald' | 'blue' | 'purple' | 'orange' | 'pink' | 'cyan';

export interface Settings {
  unitSystem: UnitSystem;
  defaultRestTimerDuration: number;
  weeklyWorkoutGoal: number;
  defaultWeightIncrement: WeightIncrement;
  soundEffects: boolean;
  autoStartRestTimer: boolean;
  accentColor: AccentColor;
  notifications: boolean;
}

const STORAGE_KEY = 'gymy_settings';

const DEFAULT_SETTINGS: Settings = {
  unitSystem: 'metric',
  defaultRestTimerDuration: 90,
  weeklyWorkoutGoal: 4,
  defaultWeightIncrement: 2.5,
  soundEffects: true,
  autoStartRestTimer: false,
  accentColor: 'emerald',
  notifications: true,
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
  return localStorage.getItem(STORAGE_KEY) ?? JSON.stringify(DEFAULT_SETTINGS);
}

function getServerSnapshot(): string {
  return JSON.stringify(DEFAULT_SETTINGS);
}

function parseSettings(raw: string): Settings {
  try {
    const parsed = JSON.parse(raw) as Partial<Settings>;
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function useSettings() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const settings = parseSettings(raw);

  const updateSetting = useCallback(<K extends keyof Settings>(key: K, value: Settings[K]) => {
    const current = parseSettings(localStorage.getItem(STORAGE_KEY) ?? '');
    const updated = { ...current, [key]: value };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    emitChange();
  }, []);

  const resetSettings = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
    emitChange();
  }, []);

  return { settings, updateSetting, resetSettings, loaded: true };
}

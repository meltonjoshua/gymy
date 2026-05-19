'use client';

import { useState, useCallback } from 'react';
import { UserSettings, defaultSettings } from '@/types/settings';

const STORAGE_KEY = 'gymy_settings';

function loadSettings(): UserSettings {
  if (typeof window === 'undefined') return defaultSettings;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return { ...defaultSettings, ...JSON.parse(stored) };
  } catch {}
  return defaultSettings;
}

export function useSettings() {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [loaded, setLoaded] = useState(false);

  if (!loaded && typeof window !== 'undefined') {
    setSettings(loadSettings());
    setLoaded(true);
  }

  const updateSettings = useCallback((updates: Partial<UserSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...updates };
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      }
      return next;
    });
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSettings));
    }
  }, []);

  return { settings, updateSettings, resetSettings, loaded };
}
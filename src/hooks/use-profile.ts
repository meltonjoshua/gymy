'use client';

import { useState, useCallback } from 'react';
import { UserProfile } from '@/types/profile';

const STORAGE_KEY = 'gymy_profile';

const defaultProfile: UserProfile = {
  displayName: 'Gymy User',
  joinDate: new Date().toISOString(),
  achievements: [],
};

function loadProfile(): UserProfile {
  if (typeof window === 'undefined') return defaultProfile;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return defaultProfile;
}

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [loaded, setLoaded] = useState(false);

  if (!loaded && typeof window !== 'undefined') {
    setProfile(loadProfile());
    setLoaded(true);
  }

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...updates };
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      }
      return next;
    });
  }, []);

  return { profile, updateProfile };
}
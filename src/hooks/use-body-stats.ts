'use client';

import { useState, useCallback } from 'react';
import { BodyMeasurement } from '@/types/body-stats';

const STORAGE_KEY = 'gymy_body_stats';

function loadMeasurements(): BodyMeasurement[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return [];
}

export function useBodyStats() {
  const [measurements, setMeasurements] = useState<BodyMeasurement[]>([]);
  const [loaded, setLoaded] = useState(false);

  if (!loaded && typeof window !== 'undefined') {
    setMeasurements(loadMeasurements());
    setLoaded(true);
  }

  const addMeasurement = useCallback((measurement: Omit<BodyMeasurement, 'id'>) => {
    setMeasurements((prev) => {
      const newMeasurement: BodyMeasurement = { ...measurement, id: `bs-${Date.now()}` };
      const updated = [newMeasurement, ...prev].sort((a, b) => b.date.localeCompare(a.date));
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  const getLatestMeasurement = useCallback((): BodyMeasurement | undefined => {
    return measurements[0];
  }, [measurements]);

  const getWeightTrend = useCallback((): { dates: string[]; weights: number[] } => {
    const sorted = [...measurements].sort((a, b) => a.date.localeCompare(b.date));
    return {
      dates: sorted.map((m) => m.date.split('T')[0]),
      weights: sorted.map((m) => m.weight),
    };
  }, [measurements]);

  return { measurements, addMeasurement, getLatestMeasurement, getWeightTrend };
}
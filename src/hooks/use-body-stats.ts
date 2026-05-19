'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { ExtendedBodyMeasurement } from '@/types/analytics';

const STORAGE_KEY = 'gymy_body_stats';

function generateId(): string {
  return Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
}

function loadStats(): ExtendedBodyMeasurement[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStats(stats: ExtendedBodyMeasurement[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
}

export interface BodyStatsTrend {
  metric: string;
  currentValue: number;
  previousValue: number | null;
  change: number | null;
  changeRate: number | null;
}

export function useBodyStats() {
  const [stats, setStats] = useState<ExtendedBodyMeasurement[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded && typeof window !== 'undefined') {
      setStats(loadStats());
      setLoaded(true);
    }
  }, [loaded]);

  const refreshStats = useCallback(() => {
    setStats(loadStats());
  }, []);

  const addMeasurement = useCallback((measurement: Omit<ExtendedBodyMeasurement, 'id'>) => {
    const newMeasurement: ExtendedBodyMeasurement = {
      ...measurement,
      id: generateId(),
    };
    setStats((prev) => {
      const updated = [newMeasurement, ...prev].sort((a, b) => b.date.localeCompare(a.date));
      saveStats(updated);
      return updated;
    });
  }, []);

  const removeMeasurement = useCallback((id: string) => {
    setStats((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      saveStats(updated);
      return updated;
    });
  }, []);

  const updateMeasurement = useCallback((id: string, updates: Partial<ExtendedBodyMeasurement>) => {
    setStats((prev) => {
      const updated = prev.map((s) => (s.id === id ? { ...s, ...updates } : s));
      saveStats(updated);
      return updated;
    });
  }, []);

  const latestMeasurement = useMemo((): ExtendedBodyMeasurement | null => {
    if (stats.length === 0) return null;
    return stats[0] ?? null;
  }, [stats]);

  const trends = useMemo((): BodyStatsTrend[] => {
    if (stats.length < 2) {
      const latest = stats[0];
      if (!latest) return [];
      const result: BodyStatsTrend[] = [
        {
          metric: 'Weight',
          currentValue: latest.weight,
          previousValue: null,
          change: null,
          changeRate: null,
        },
      ];
      if (latest.bodyFatPercentage != null) {
        result.push({
          metric: 'Body Fat %',
          currentValue: latest.bodyFatPercentage,
          previousValue: null,
          change: null,
          changeRate: null,
        });
      }
      return result;
    }
    const latest = stats[0]!;
    const previous = stats[1]!;
    const daysDiff =
      (new Date(latest.date).getTime() - new Date(previous.date).getTime()) / 86400000;

    const result: BodyStatsTrend[] = [
      {
        metric: 'Weight',
        currentValue: latest.weight,
        previousValue: previous.weight,
        change: Math.round((latest.weight - previous.weight) * 10) / 10,
        changeRate:
          daysDiff > 0
            ? Math.round(((latest.weight - previous.weight) / daysDiff) * 1000) / 1000
            : null,
      },
    ];

    if (latest.bodyFatPercentage != null && previous.bodyFatPercentage != null) {
      result.push({
        metric: 'Body Fat %',
        currentValue: latest.bodyFatPercentage,
        previousValue: previous.bodyFatPercentage,
        change: Math.round((latest.bodyFatPercentage - previous.bodyFatPercentage) * 10) / 10,
        changeRate:
          daysDiff > 0
            ? Math.round(
                ((latest.bodyFatPercentage - previous.bodyFatPercentage) / daysDiff) * 1000
              ) / 1000
            : null,
      });
    }

    const customKeys = new Set<string>();
    for (const s of stats) {
      if (s.custom) {
        for (const key of Object.keys(s.custom)) {
          customKeys.add(key);
        }
      }
    }
    for (const key of customKeys) {
      const currVal = latest.custom?.[key] ?? 0;
      const prevVal = previous.custom?.[key] ?? 0;
      result.push({
        metric: key.charAt(0).toUpperCase() + key.slice(1),
        currentValue: currVal,
        previousValue: prevVal,
        change: Math.round((currVal - prevVal) * 10) / 10,
        changeRate:
          daysDiff > 0 ? Math.round(((currVal - prevVal) / daysDiff) * 1000) / 1000 : null,
      });
    }

    return result;
  }, [stats]);

  const weightChartData = useMemo(() => {
    return stats.map((s) => ({
      date: s.date.slice(0, 10),
      weight: s.weight,
      bodyFat: s.bodyFatPercentage ?? 0,
    }));
  }, [stats]);

  return {
    stats,
    refreshStats,
    addMeasurement,
    removeMeasurement,
    updateMeasurement,
    latestMeasurement,
    trends,
    weightChartData,
  };
}
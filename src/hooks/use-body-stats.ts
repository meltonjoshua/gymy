'use client';

import { useState, useCallback, useMemo } from 'react';
import { BodyMeasurement } from '@/types/analytics';

const STORAGE_KEY = 'gymy_body_stats';

function generateId(): string {
  return Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
}

function loadStats(): BodyMeasurement[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStats(stats: BodyMeasurement[]) {
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
  const [stats, setStats] = useState<BodyMeasurement[]>(() => loadStats());

  const refreshStats = useCallback(() => {
    setStats(loadStats());
  }, []);

  const addMeasurement = useCallback((measurement: Omit<BodyMeasurement, 'id'>) => {
    const newMeasurement: BodyMeasurement = {
      ...measurement,
      id: generateId(),
    };
    const current = loadStats();
    current.push(newMeasurement);
    current.sort((a, b) => a.date.localeCompare(b.date));
    saveStats(current);
    setStats(current);
  }, []);

  const removeMeasurement = useCallback((id: string) => {
    const current = loadStats().filter((s) => s.id !== id);
    saveStats(current);
    setStats(current);
  }, []);

  const updateMeasurement = useCallback((id: string, updates: Partial<BodyMeasurement>) => {
    const current = loadStats().map((s) => (s.id === id ? { ...s, ...updates } : s));
    saveStats(current);
    setStats(current);
  }, []);

  const latestMeasurement = useMemo((): BodyMeasurement | null => {
    if (stats.length === 0) return null;
    return stats[stats.length - 1] ?? null;
  }, [stats]);

  const trends = useMemo((): BodyStatsTrend[] => {
    if (stats.length < 2) {
      const latest = stats[stats.length - 1];
      if (!latest) return [];
      return [
        {
          metric: 'Weight',
          currentValue: latest.weight,
          previousValue: null,
          change: null,
          changeRate: null,
        },
        {
          metric: 'Body Fat %',
          currentValue: latest.bodyFat,
          previousValue: null,
          change: null,
          changeRate: null,
        },
      ];
    }
    const latest = stats[stats.length - 1]!;
    const previous = stats[stats.length - 2]!;
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
      {
        metric: 'Body Fat %',
        currentValue: latest.bodyFat,
        previousValue: previous.bodyFat,
        change: Math.round((latest.bodyFat - previous.bodyFat) * 10) / 10,
        changeRate:
          daysDiff > 0
            ? Math.round(((latest.bodyFat - previous.bodyFat) / daysDiff) * 1000) / 1000
            : null,
      },
    ];

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
    return stats.map((s) => ({ date: s.date.slice(0, 10), weight: s.weight, bodyFat: s.bodyFat }));
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

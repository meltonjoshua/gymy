'use client';

import { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { StrengthDataPoint } from '@/types/analytics';

interface StrengthChartProps {
  data: StrengthDataPoint[];
}

const EXERCISE_COLORS = [
  '#10b981',
  '#f97316',
  '#8b5cf6',
  '#ec4899',
  '#3b82f6',
  '#eab308',
  '#ef4444',
  '#14b8a6',
  '#a855f7',
  '#f43f5e',
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; dataKey: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 shadow-lg">
      <p className="text-xs text-gray-400">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-sm font-semibold" style={{ color: '#10b981' }}>
          {p.dataKey}: {p.value} lbs
        </p>
      ))}
    </div>
  );
}

export default function StrengthChart({ data }: StrengthChartProps) {
  const exerciseIds = useMemo(() => {
    const ids = new Set<string>();
    for (const d of data) ids.add(d.exerciseId);
    return Array.from(ids);
  }, [data]);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => {
    const initial = exerciseIds.slice(0, 5);
    return new Set(initial);
  });

  const exerciseNames = useMemo(() => {
    const map = new Map<string, string>();
    for (const d of data) {
      if (!map.has(d.exerciseId)) map.set(d.exerciseId, d.exerciseName);
    }
    return map;
  }, [data]);

  const chartData = useMemo(() => {
    const dates = new Set<string>();
    for (const d of data) {
      if (selectedIds.has(d.exerciseId)) dates.add(d.date);
    }
    const sortedDates = Array.from(dates).sort();
    return sortedDates.map((date) => {
      const point: Record<string, string | number> = { date };
      for (const d of data) {
        if (d.date === date && selectedIds.has(d.exerciseId)) {
          point[d.exerciseName] = d.estimated1RM;
        }
      }
      return point;
    });
  }, [data, selectedIds]);

  const visibleExercises = useMemo(() => {
    return exerciseIds
      .filter((id) => selectedIds.has(id))
      .map((id) => ({ id, name: exerciseNames.get(id) ?? id }));
  }, [exerciseIds, selectedIds, exerciseNames]);

  const toggleExercise = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 text-sm">
        No strength data yet. Complete a workout to track your 1RM!
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        {exerciseIds.map((id, i) => {
          const name = exerciseNames.get(id) ?? id;
          const isActive = selectedIds.has(id);
          return (
            <button
              key={id}
              onClick={() => toggleExercise(id)}
              className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                isActive
                  ? 'border-emerald-500/50 bg-emerald-500/20 text-emerald-400'
                  : 'border-gray-700 bg-gray-800/50 text-gray-500 hover:border-gray-600'
              }`}
              style={
                isActive
                  ? {
                      borderColor: `${EXERCISE_COLORS[i % EXERCISE_COLORS.length]}80`,
                      backgroundColor: `${EXERCISE_COLORS[i % EXERCISE_COLORS.length]}20`,
                      color: EXERCISE_COLORS[i % EXERCISE_COLORS.length],
                    }
                  : undefined
              }
            >
              {name}
            </button>
          );
        })}
      </div>
      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="date"
              stroke="#6b7280"
              tick={{ fill: '#6b7280', fontSize: 11 }}
              tickFormatter={(v: string) => v.slice(5)}
            />
            <YAxis
              stroke="#6b7280"
              tick={{ fill: '#6b7280', fontSize: 11 }}
              tickFormatter={(v: number) => `${v}`}
            />
            <Tooltip content={<CustomTooltip />} />
            {visibleExercises.map((ex) => (
              <Line
                key={ex.id}
                type="monotone"
                dataKey={ex.name}
                stroke={EXERCISE_COLORS[exerciseIds.indexOf(ex.id) % EXERCISE_COLORS.length]}
                strokeWidth={2}
                dot={{ r: 3, strokeWidth: 0 }}
                activeDot={{ r: 5, strokeWidth: 2, stroke: '#0c0a09' }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

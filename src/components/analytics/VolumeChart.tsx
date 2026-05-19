'use client';

import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
} from 'recharts';
import { VolumeDataPoint } from '@/types/analytics';

interface VolumeChartProps {
  data: VolumeDataPoint[];
  period?: 'daily' | 'weekly' | 'monthly';
}

function computeTrendLine(data: VolumeDataPoint[]): { trend: number }[] {
  if (data.length < 2) return data.map(() => ({ trend: 0 }));
  const n = data.length;
  let sumX = 0,
    sumY = 0,
    sumXY = 0,
    sumXX = 0;
  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += data[i]!.volume;
    sumXY += i * data[i]!.volume;
    sumXX += i * i;
  }
  const slope = n > 1 ? (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX) : 0;
  const intercept = (sumY - slope * sumX) / n;
  return data.map((_, i) => ({ trend: Math.round(slope * i + intercept) }));
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; name: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 shadow-lg">
      <p className="text-xs text-gray-400">{label}</p>
      {payload.map((p, i) => (
        <p
          key={i}
          className="text-sm font-semibold"
          style={{ color: p.name === 'Volume' ? '#10b981' : '#f97316' }}
        >
          {p.name}: {p.value.toLocaleString()} lbs
        </p>
      ))}
    </div>
  );
}

export default function VolumeChart({ data, period = 'daily' }: VolumeChartProps) {
  const trendData = computeTrendLine(data);
  const chartData = data.map((d, i) => ({
    ...d,
    trend: trendData[i]?.trend ?? 0,
  }));

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 text-sm">
        No volume data yet. Complete a workout to see your progress!
      </div>
    );
  }

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
          <defs>
            <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="date"
            stroke="#6b7280"
            tick={{ fill: '#6b7280', fontSize: 11 }}
            tickFormatter={(v: string) => {
              if (period === 'monthly') return v.slice(2);
              return v.slice(5);
            }}
          />
          <YAxis
            stroke="#6b7280"
            tick={{ fill: '#6b7280', fontSize: 11 }}
            tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="volume" fill="url(#volumeGradient)" stroke="none" />
          <Line
            type="monotone"
            dataKey="volume"
            stroke="#10b981"
            strokeWidth={2.5}
            dot={{ fill: '#10b981', r: 3, strokeWidth: 0 }}
            activeDot={{ fill: '#10b981', r: 5, strokeWidth: 2, stroke: '#0c0a09' }}
            name="Volume"
          />
          <Line
            type="monotone"
            dataKey="trend"
            stroke="#f97316"
            strokeWidth={1.5}
            strokeDasharray="6 4"
            dot={false}
            name="Trend"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
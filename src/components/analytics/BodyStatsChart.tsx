'use client';

import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

interface BodyStatsChartData {
  date: string;
  weight: number;
  bodyFat: number;
}

interface BodyStatsChartProps {
  data: BodyStatsChartData[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 shadow-lg">
      <p className="text-xs text-gray-400">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-sm font-semibold" style={{ color: p.color }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
}

export default function BodyStatsChart({ data }: BodyStatsChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 text-sm">
        No body stats recorded yet. Log your first measurement!
      </div>
    );
  }

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
          <defs>
            <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="bfGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="date"
            stroke="#6b7280"
            tick={{ fill: '#6b7280', fontSize: 11 }}
            tickFormatter={(v: string) => v.slice(5)}
          />
          <YAxis
            yAxisId="weight"
            stroke="#6b7280"
            tick={{ fill: '#6b7280', fontSize: 11 }}
            orientation="left"
          />
          <YAxis
            yAxisId="bodyFat"
            stroke="#6b7280"
            tick={{ fill: '#6b7280', fontSize: 11 }}
            orientation="right"
            tickFormatter={(v: number) => `${v}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: '11px' }}
            formatter={(value: string) => (
              <span style={{ color: value === 'Weight' ? '#10b981' : '#f97316' }}>{value}</span>
            )}
          />
          <Area
            yAxisId="weight"
            type="monotone"
            dataKey="weight"
            fill="url(#weightGradient)"
            stroke="none"
          />
          <Line
            yAxisId="weight"
            type="monotone"
            dataKey="weight"
            stroke="#10b981"
            strokeWidth={2.5}
            dot={{ fill: '#10b981', r: 3, strokeWidth: 0 }}
            activeDot={{ fill: '#10b981', r: 5, strokeWidth: 2, stroke: '#0c0a09' }}
            name="Weight"
          />
          <Area
            yAxisId="bodyFat"
            type="monotone"
            dataKey="bodyFat"
            fill="url(#bfGradient)"
            stroke="none"
          />
          <Line
            yAxisId="bodyFat"
            type="monotone"
            dataKey="bodyFat"
            stroke="#f97316"
            strokeWidth={2.5}
            dot={{ fill: '#f97316', r: 3, strokeWidth: 0 }}
            activeDot={{ fill: '#f97316', r: 5, strokeWidth: 2, stroke: '#0c0a09' }}
            name="Body Fat %"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
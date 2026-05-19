'use client';

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { BodyPartVolumeData } from '@/types/analytics';

interface BodyPartDistributionProps {
  data: BodyPartVolumeData[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: BodyPartVolumeData }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;
  const d = payload[0]!.payload;
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 shadow-lg">
      <p className="text-sm font-semibold" style={{ color: d.color }}>
        {d.name}
      </p>
      <p className="text-xs text-gray-400">{d.value.toLocaleString()} lbs volume</p>
    </div>
  );
}

function CustomLegend({ payload }: { payload?: Array<{ value: string; color: string }> }) {
  if (!payload) return null;
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 justify-center mt-2">
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-[11px] text-gray-400">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function BodyPartDistribution({ data }: BodyPartDistributionProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 text-sm">
        No body part data yet. Complete a workout to see distribution!
      </div>
    );
  }

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={60}
            outerRadius={95}
            paddingAngle={2}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} opacity={0.85} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
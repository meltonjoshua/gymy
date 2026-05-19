'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { WeeklyVolumeData } from '@/hooks/use-stats';

interface WeeklyChartProps {
  data: WeeklyVolumeData[];
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: WeeklyVolumeData }>;
}) {
  if (!active || !payload?.length) return null;
  const d = payload[0]!.payload;
  return (
    <div className="rounded-xl bg-gray-900/95 border border-white/10 px-3 py-2 text-xs shadow-xl">
      <p className="text-gray-400">{d.day}</p>
      <p className="text-emerald-400 font-semibold">{d.volume.toLocaleString()} kg</p>
    </div>
  );
}

export function WeeklyChart({ data }: WeeklyChartProps) {
  const maxVolume = Math.max(...data.map((d) => d.volume), 1);

  return (
    <div className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] p-5 transition-all duration-300 hover:border-white/[0.12]">
      <h3 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">
        Weekly Volume
      </h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barCategoryGap="20%">
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9ca3af', fontSize: 11 }}
            />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Bar dataKey="volume" radius={[6, 6, 0, 0]} maxBarSize={40}>
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={
                    entry.volume > 0
                      ? `rgba(16, 185, 129, ${0.3 + (entry.volume / maxVolume) * 0.7})`
                      : 'rgba(75, 85, 99, 0.2)'
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

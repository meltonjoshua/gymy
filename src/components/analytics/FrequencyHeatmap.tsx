'use client';

import { useMemo } from 'react';

interface FrequencyHeatmapProps {
  data: { date: string; count: number }[];
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getIntensity(count: number, max: number): string {
  if (count === 0) return '#1e293b';
  if (max === 0) return '#1e293b';
  const ratio = count / max;
  if (ratio <= 0.25) return '#065f46';
  if (ratio <= 0.5) return '#10b981';
  if (ratio <= 0.75) return '#34d399';
  return '#6ee7b7';
}

export default function FrequencyHeatmap({ data }: FrequencyHeatmapProps) {
  const heatmapData = useMemo(() => {
    const dateMap = new Map<string, number>();
    for (const d of data) {
      dateMap.set(d.date, d.count);
    }

    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 364);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    const weeks: { date: string; count: number; day: number }[][] = [];
    let currentWeek: { date: string; count: number; day: number }[] = [];
    let maxCount = 0;

    const d = new Date(startDate);
    while (d <= today) {
      const dateStr = d.toISOString().slice(0, 10);
      const count = dateMap.get(dateStr) ?? 0;
      if (count > maxCount) maxCount = count;
      currentWeek.push({ date: dateStr, count, day: d.getDay() });
      if (d.getDay() === 6) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      d.setDate(d.getDate() + 1);
    }
    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    return { weeks, maxCount };
  }, [data]);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-gray-500 text-sm">
        No workout frequency data yet. Start logging workouts!
      </div>
    );
  }

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex gap-1 mb-1 ml-10">
        {heatmapData.weeks.map((week, i) => {
          if (i % 4 === 0) {
            const firstDay = week[0];
            if (firstDay) {
              const d = new Date(firstDay.date);
              return (
                <div
                  key={i}
                  className="text-[10px] text-gray-500"
                  style={{ width: `${Math.min(4, heatmapData.weeks.length - i) * 15}px` }}
                >
                  {MONTHS[d.getMonth()]}
                </div>
              );
            }
          }
          return null;
        })}
      </div>
      <div className="flex gap-[3px]">
        <div className="flex flex-col gap-[3px] shrink-0">
          {DAYS.map((day, i) => (
            <div key={day} className="text-[10px] text-gray-500 h-[13px] flex items-center">
              {i % 2 === 1 ? day : ''}
            </div>
          ))}
        </div>
        {heatmapData.weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {Array.from({ length: 7 }, (_, di) => {
              const entry = week.find((e) => e.day === di);
              const count = entry?.count ?? 0;
              return (
                <div
                  key={di}
                  className="w-[13px] h-[13px] rounded-[2px] transition-colors"
                  style={{ backgroundColor: getIntensity(count, heatmapData.maxCount) }}
                  title={entry ? `${entry.date}: ${count} workout${count !== 1 ? 's' : ''}` : ''}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1.5 mt-3 text-[10px] text-gray-500">
        <span>Less</span>
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
          <div
            key={i}
            className="w-[13px] h-[13px] rounded-[2px]"
            style={{
              backgroundColor: getIntensity(
                Math.round(ratio * heatmapData.maxCount),
                heatmapData.maxCount
              ),
            }}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
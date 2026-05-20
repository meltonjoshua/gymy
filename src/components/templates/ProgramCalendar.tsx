'use client';

import Link from 'next/link';
import { workoutTemplates } from '@/data/workout-templates';
import { ProgramDay } from '@/types/template';

const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const dayFullLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

interface ProgramCalendarProps {
  schedule: ProgramDay[];
  weekNumber?: number;
}

export default function ProgramCalendar({ schedule, weekNumber }: ProgramCalendarProps) {
  return (
    <div>
      {weekNumber !== undefined && (
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-white">Weekly Schedule</h3>
          <span className="text-xs text-zinc-500">Week {weekNumber}</span>
        </div>
      )}
      {!weekNumber && (
        <h3 className="text-sm font-semibold text-white mb-3">Weekly Schedule</h3>
      )}
      <div className="grid grid-cols-7 gap-1.5">
        {dayLabels.map((day, i) => {
          const dayEntry = schedule.find((d) => d.day === i + 1);
          const isWorkout = dayEntry && !dayEntry.isRest;
          const isRest = dayEntry?.isRest;
          const template = isWorkout ? workoutTemplates.find((t) => t.id === dayEntry.templateId) : null;

          return (
            <div key={day} className="text-center">
              <div className="text-[10px] text-zinc-500 mb-1 font-medium">{day}</div>
              <div
                className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs transition-all ${
                  isWorkout
                    ? 'bg-emerald-500/10 border border-emerald-500/30 hover:border-emerald-500/50 cursor-pointer'
                    : isRest
                      ? 'bg-zinc-800/50 border border-zinc-700/50'
                      : 'bg-zinc-900 border border-zinc-800/50'
                }`}
              >
                {isWorkout ? (
                  <>
                    <span className="text-emerald-400 text-[10px] font-semibold">✓</span>
                    {template && (
                      <span className="text-[8px] text-emerald-400/70 mt-0.5 leading-none">
                        {dayEntry!.label.split(' ')[0]}
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-zinc-600">—</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 space-y-2">
        {schedule.filter((d) => !d.isRest).map((day) => {
          const template = workoutTemplates.find((t) => t.id === day.templateId);
          return (
            <div key={day.day} className="bg-zinc-900 rounded-xl border border-zinc-800 p-3 hover:border-zinc-700 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-medium text-zinc-500 uppercase w-8">{dayFullLabels[day.day - 1]?.slice(0, 3)}</span>
                    <div>
                      <div className="text-sm font-medium text-white">{day.label}</div>
                      <div className="text-xs text-zinc-500">
                        {template ? `${template.exercises.length} exercises · ~${template.estimatedDurationMinutes}m` : ''}
                      </div>
                    </div>
                  </div>
                </div>
                {template && (
                  <Link
                    href={`/templates/${template.id}`}
                    className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded-lg border border-emerald-500/20 transition-colors"
                  >
                    View
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
'use client';

import { Check, Trophy, ChevronRight } from 'lucide-react';
import { Program } from '@/types/template';

const STORAGE_KEY = 'gymy_program_progress';

interface ProgramProgressData {
  programId: string;
  currentWeek: number;
  completedDays: string[];
  startedAt: string;
}

function getProgress(programId: string): ProgramProgressData | null {
  if (typeof window === 'undefined') return null;
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as ProgramProgressData[];
    return all.find((p) => p.programId === programId) || null;
  } catch {
    return null;
  }
}

function saveProgress(data: ProgramProgressData) {
  if (typeof window === 'undefined') return;
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as ProgramProgressData[];
    const idx = all.findIndex((p) => p.programId === data.programId);
    if (idx >= 0) {
      all[idx] = data;
    } else {
      all.push(data);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch { /* ignore */ }
}

interface ProgramProgressProps {
  program: Program;
}

export default function ProgramProgress({ program }: ProgramProgressProps) {
  const progress = getProgress(program.id);
  const currentWeek = progress?.currentWeek || 1;
  const completedDays = progress?.completedDays || [];
  const schedule = program.schedule[0] || [];
  const totalWorkoutDays = schedule.filter((d) => !d.isRest).length;
  const totalDays = program.weeks * totalWorkoutDays;
  const completedCount = completedDays.length;
  const progressPercent = totalDays > 0 ? Math.round((completedCount / totalDays) * 100) : 0;

  const handleCompleteDay = (week: number, day: number) => {
    const dayKey = `w${week}-d${day}`;
    if (completedDays.includes(dayKey)) return;
    const newCompleted = [...completedDays, dayKey];
    const newWeek = week + 1 > program.weeks ? program.weeks : week;
    const updated: ProgramProgressData = {
      programId: program.id,
      currentWeek: newWeek,
      completedDays: newCompleted,
      startedAt: progress?.startedAt || new Date().toISOString(),
    };
    saveProgress(updated);
  };

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="space-y-4">
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-white">Progress</h3>
          <span className="text-xs text-emerald-400 font-medium">{progressPercent}% complete</span>
        </div>
        <div className="w-full bg-zinc-800 rounded-full h-2 mb-3">
          <div
            className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs text-zinc-500">
          <span>Week {currentWeek} of {program.weeks}</span>
          <span>{completedCount} of {totalDays} workouts</span>
        </div>
      </div>

      <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4">
        <h3 className="text-sm font-semibold text-white mb-3">Week {currentWeek}</h3>
        <div className="space-y-2">
          {schedule.map((day) => {
            if (day.isRest) return null;
            const dayKey = `w${currentWeek}-d${day.day}`;
            const isCompleted = completedDays.includes(dayKey);

            return (
              <button
                key={day.day}
                onClick={() => handleCompleteDay(currentWeek, day.day)}
                className={`w-full flex items-center gap-3 p-2.5 rounded-lg transition-all text-left ${
                  isCompleted
                    ? 'bg-emerald-500/10 border border-emerald-500/20'
                    : 'bg-zinc-800 border border-zinc-700 hover:border-zinc-600'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isCompleted ? 'bg-emerald-500' : 'border-2 border-zinc-600'
                }`}>
                  {isCompleted && <Check className="w-3.5 h-3.5 text-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-medium ${isCompleted ? 'text-emerald-400' : 'text-white'}`}>
                    {weekDays[day.day - 1]}: {day.label}
                  </div>
                  <div className="text-[10px] text-zinc-500">
                    {isCompleted ? 'Completed' : 'Tap to mark complete'}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-600" />
              </button>
            );
          })}
        </div>
      </div>

      {progressPercent >= 100 && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-center">
          <Trophy className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
          <h4 className="text-sm font-semibold text-emerald-400">Program Complete!</h4>
          <p className="text-xs text-zinc-400 mt-1">Congratulations on finishing {program.name}!</p>
        </div>
      )}
    </div>
  );
}
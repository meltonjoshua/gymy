'use client';

import { Dumbbell, Clock, Flame } from 'lucide-react';

interface WorkoutSummaryProps {
  exerciseCount: number;
  totalSets: number;
  estimatedMinutes: number;
  difficulty: string;
}

export default function WorkoutSummary({ exerciseCount, totalSets, estimatedMinutes, difficulty }: WorkoutSummaryProps) {
  const difficultyColors: Record<string, string> = {
    beginner: 'bg-emerald-500',
    intermediate: 'bg-amber-500',
    advanced: 'bg-red-500',
  };

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2">
          <Dumbbell className="w-4 h-4 text-emerald-400" />
          <div>
            <div className="text-sm font-bold text-white">{exerciseCount}</div>
            <div className="text-[10px] text-zinc-500">Exercises</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-orange-400" />
          <div>
            <div className="text-sm font-bold text-white">{totalSets}</div>
            <div className="text-[10px] text-zinc-500">Total Sets</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-400" />
          <div>
            <div className="text-sm font-bold text-white">~{estimatedMinutes}m</div>
            <div className="text-[10px] text-zinc-500">Est. Time</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${difficultyColors[difficulty] || 'bg-zinc-500'}`} />
          <div>
            <div className="text-sm font-bold text-white capitalize">{difficulty}</div>
            <div className="text-[10px] text-zinc-500">Level</div>
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';

import { Trophy } from 'lucide-react';

interface PersonalRecordsProps {
  records: {
    exerciseId: string;
    exerciseName: string;
    estimated1RM: number;
    weight: number;
    reps: number;
    date: string;
  }[];
}

export default function PersonalRecords({ records }: PersonalRecordsProps) {
  if (records.length === 0) {
    return (
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 text-center">
        <Trophy className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
        <p className="text-zinc-500 text-sm">No personal records yet</p>
        <p className="text-zinc-600 text-xs">Complete a workout to start tracking PRs</p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4">
      <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
        <Trophy className="w-4 h-4 text-amber-400" />
        Personal Records
      </h3>
      <div className="space-y-2">
        {records.slice(0, 5).map((r, i) => (
          <div key={r.exerciseId} className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-400">#{i + 1}</span>
              <span className="text-sm text-white">{r.exerciseName}</span>
            </div>
            <div className="text-sm font-medium text-emerald-400">
              {r.estimated1RM} kg (est. 1RM)
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
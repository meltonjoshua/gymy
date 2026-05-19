'use client';

import { PersonalRecord } from '@/types/workout';
import { Trophy } from 'lucide-react';

interface PersonalRecordsProps {
  records: PersonalRecord[];
}

export function PersonalRecords({ records }: PersonalRecordsProps) {
  const top5 = records.slice(0, 5);

  if (top5.length === 0) {
    return (
      <div className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] p-5">
        <h3 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">
          Personal Records
        </h3>
        <div className="flex flex-col items-center justify-center py-8 text-gray-500">
          <Trophy className="w-8 h-8 mb-2 opacity-40" />
          <p className="text-sm">No PRs yet</p>
          <p className="text-xs text-gray-600 mt-1">Hit a new max to see it here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] p-5 transition-all duration-300 hover:border-white/[0.12]">
      <h3 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">
        Personal Records
      </h3>
      <div className="space-y-3">
        {top5.map((pr) => (
          <div
            key={pr.exerciseId}
            className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors"
          >
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Trophy className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{pr.exerciseName}</p>
              <p className="text-xs text-gray-400">
                {pr.reps} rep{pr.reps !== 1 ? 's' : ''} @ {pr.weight} kg
              </p>
            </div>
            <div className="text-sm font-medium text-emerald-400">
              {pr.estimated1RM} kg
              <span className="text-xs text-gray-500 ml-1">est. 1RM</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
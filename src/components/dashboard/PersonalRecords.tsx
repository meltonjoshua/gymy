'use client';

import { PersonalRecord } from '@/types/workout';
import { Trophy } from 'lucide-react';

interface PersonalRecordsProps {
  records: PersonalRecord[];
}

export function PersonalRecords({ records }: PersonalRecordsProps) {
  const top3 = records.slice(0, 3);

  if (top3.length === 0) {
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

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] p-5 transition-all duration-300 hover:border-white/[0.12]">
      <h3 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">
        Personal Records
      </h3>
      <div className="space-y-3">
        {top3.map((pr, i) => (
          <div
            key={pr.exerciseId}
            className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors"
          >
            <span className="text-xl">{medals[i]}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{pr.exerciseName}</p>
              <p className="text-xs text-gray-400">
                {pr.reps} rep{pr.reps !== 1 ? 's' : ''} @ {pr.weight} kg
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

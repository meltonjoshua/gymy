'use client';

import { useMemo } from 'react';
import { PersonalRecord } from '@/types/analytics';

interface PersonalRecordListProps {
  records: PersonalRecord[];
}

const CATEGORY_COLORS: Record<string, string> = {
  chest: 'text-emerald-400 bg-emerald-500/20',
  back: 'text-orange-400 bg-orange-500/20',
  shoulders: 'text-purple-400 bg-purple-500/20',
  arms: 'text-pink-400 bg-pink-500/20',
  legs: 'text-blue-400 bg-blue-500/20',
  core: 'text-yellow-400 bg-yellow-500/20',
  cardio: 'text-red-400 bg-red-500/20',
};

export default function PersonalRecordList({ records }: PersonalRecordListProps) {
  const sortedRecords = useMemo(() => {
    return [...records].sort((a, b) => b.estimated1RM - a.estimated1RM);
  }, [records]);

  if (records.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-gray-500 text-sm">
        No personal records yet. Complete a workout to set your first PR!
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-700/50">
            <th className="text-left text-[10px] text-gray-500 uppercase tracking-wider pb-3 pr-4">
              Exercise
            </th>
            <th className="text-right text-[10px] text-gray-500 uppercase tracking-wider pb-3 px-4">
              Est. 1RM
            </th>
            <th className="text-right text-[10px] text-gray-500 uppercase tracking-wider pb-3 px-4">
              Weight
            </th>
            <th className="text-right text-[10px] text-gray-500 uppercase tracking-wider pb-3 px-4">
              Reps
            </th>
            <th className="text-right text-[10px] text-gray-500 uppercase tracking-wider pb-3 pl-4">
              Date
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedRecords.map((pr) => {
            const colorClass = CATEGORY_COLORS[pr.category] ?? 'text-gray-400 bg-gray-500/20';
            return (
              <tr
                key={pr.exerciseId}
                className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors"
              >
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${colorClass}`}>
                      {pr.category}
                    </span>
                    <span className="font-medium text-gray-200">{pr.exerciseName}</span>
                  </div>
                </td>
                <td className="text-right py-3 px-4">
                  <span className="font-bold text-emerald-400">{pr.estimated1RM}</span>
                  <span className="text-gray-500 text-xs ml-1">lbs</span>
                </td>
                <td className="text-right py-3 px-4 text-gray-300">
                  {pr.weight}
                  <span className="text-gray-500 text-xs ml-1">lbs</span>
                </td>
                <td className="text-right py-3 px-4 text-gray-300">{pr.reps}</td>
                <td className="text-right py-3 pl-4 text-gray-500 text-xs">{pr.date}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

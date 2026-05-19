'use client';

import { CompletedWorkout } from '@/types/workout';
import { Clock, Dumbbell, Weight } from 'lucide-react';

interface RecentWorkoutListProps {
  workouts: CompletedWorkout[];
}

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function RecentWorkoutList({ workouts }: RecentWorkoutListProps) {
  const recent = workouts.slice(0, 5);

  if (recent.length === 0) {
    return (
      <div className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] p-5">
        <h3 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">
          Recent Workouts
        </h3>
        <div className="flex flex-col items-center justify-center py-8 text-gray-500">
          <Dumbbell className="w-8 h-8 mb-2 opacity-40" />
          <p className="text-sm">No workouts yet</p>
          <p className="text-xs text-gray-600 mt-1">Complete a workout to see it here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] p-5 transition-all duration-300 hover:border-white/[0.12]">
      <h3 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">
        Recent Workouts
      </h3>
      <div className="space-y-3">
        {recent.map((w) => (
          <div
            key={w.id}
            className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{w.name}</p>
              <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {w.durationMinutes}m
                </span>
                <span className="flex items-center gap-1">
                  <Weight className="w-3 h-3" />
                  {w.totalVolume.toLocaleString()} kg
                </span>
                <span className="flex items-center gap-1">
                  <Dumbbell className="w-3 h-3" />
                  {w.exercises.length}
                </span>
              </div>
            </div>
            <span className="text-xs text-gray-500 ml-3 whitespace-nowrap">
              {formatRelativeTime(w.completedAt)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

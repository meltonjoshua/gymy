'use client';

import Link from 'next/link';
import { Clock, Dumbbell } from 'lucide-react';
import { formatDuration } from '@/lib/workout-utils';

interface RecentWorkoutListProps {
  workouts: {
    id: string;
    name: string;
    startTime: string;
    durationSeconds: number;
    totalVolume: number;
    exercises: { exerciseId: string }[];
  }[];
}

export default function RecentWorkoutList({ workouts }: RecentWorkoutListProps) {
  if (workouts.length === 0) {
    return (
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 text-center">
        <Dumbbell className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
        <p className="text-zinc-500 text-sm">No workouts yet</p>
        <Link href="/workout/builder" className="text-emerald-400 text-sm hover:underline mt-1 inline-block">
          Start your first workout
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4">
      <h3 className="text-sm font-semibold text-white mb-3">Recent Workouts</h3>
      <div className="space-y-2">
        {workouts.slice(0, 5).map((w) => (
          <div key={w.id} className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-0">
            <div>
              <div className="text-sm font-medium text-white">{w.name}</div>
              <div className="text-xs text-zinc-500">
                {new Date(w.startTime).toLocaleDateString()} · {w.exercises.length} exercises
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-emerald-400">
                {w.totalVolume > 0 ? `${(w.totalVolume / 1000).toFixed(1)}k` : '0'} kg
              </div>
              <div className="flex items-center gap-1 text-xs text-zinc-500">
                <Clock className="w-3 h-3" />
                {formatDuration(w.durationSeconds)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
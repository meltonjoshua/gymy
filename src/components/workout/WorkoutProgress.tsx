'use client';

interface WorkoutProgressProps {
  completed: number;
  total: number;
}

export default function WorkoutProgress({ completed, total }: WorkoutProgressProps) {
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-zinc-500">Progress</span>
        <span className="text-xs font-medium text-emerald-400">{completed}/{total} sets</span>
      </div>
      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
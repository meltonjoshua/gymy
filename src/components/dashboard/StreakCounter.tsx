'use client';

interface StreakCounterProps {
  days: number;
}

export default function StreakCounter({ days }: StreakCounterProps) {
  return (
    <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl border border-orange-500/30 p-4 text-center">
      <div className="text-4xl mb-1">🔥</div>
      <div className="text-3xl font-bold text-white">{days}</div>
      <div className="text-sm text-zinc-400">
        {days === 1 ? 'day' : 'days'} streak
      </div>
    </div>
  );
}
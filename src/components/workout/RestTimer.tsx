'use client';

import { Pause, Play, SkipForward } from 'lucide-react';

interface RestTimerProps {
  seconds: number;
  maxSeconds: number;
  isPaused: boolean;
  onSkip: () => void;
  onPause: () => void;
  onResume: () => void;
}

export default function RestTimer({ seconds, maxSeconds, isPaused, onSkip, onPause, onResume }: RestTimerProps) {
  if (seconds <= 0) return null;
  const progress = maxSeconds > 0 ? seconds / maxSeconds : 1;
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference * (1 - progress);
  const pctRemaining = Math.round((seconds / maxSeconds) * 100);

  return (
    <div className="flex flex-col items-center gap-3 p-4 bg-zinc-900 rounded-xl border border-emerald-500/30">
      <div className="text-xs text-emerald-400 font-medium uppercase tracking-wider">Rest Timer</div>
      <div className="relative w-32 h-32">
        <svg className="transform -rotate-90 w-32 h-32" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" fill="none" stroke="#27272a" strokeWidth="6" />
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="#10b981"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-white">{Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, '0')}</span>
          <span className="text-xs text-zinc-500">{pctRemaining}%</span>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={isPaused ? onResume : onPause}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-800 text-white hover:bg-zinc-700"
        >
          {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
        </button>
        <button
          onClick={onSkip}
          className="flex items-center gap-1.5 px-4 py-2 bg-zinc-800 text-white rounded-full text-sm hover:bg-zinc-700"
        >
          <SkipForward className="w-4 h-4" />
          Skip
        </button>
      </div>
    </div>
  );
}
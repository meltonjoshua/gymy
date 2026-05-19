'use client';

import { Trophy, Clock, Flame, Dumbbell } from 'lucide-react';
import { formatDuration } from '@/lib/workout-utils';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';

interface WorkoutCompleteProps {
  name: string;
  durationSeconds: number;
  totalVolume: number;
  exercisesCompleted: number;
  personalRecords: { exerciseName: string; estimated1RM: number }[];
  onDone: () => void;
}

export default function WorkoutComplete({
  name,
  durationSeconds,
  totalVolume,
  exercisesCompleted,
  personalRecords,
  onDone,
}: WorkoutCompleteProps) {
  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 p-6 text-center">
      <div className="text-6xl mb-4">🎉</div>
      <h1 className="text-3xl font-bold text-white mb-2">Workout Complete!</h1>
      <p className="text-zinc-400 mb-8">{name}</p>

      <div className="grid grid-cols-3 gap-4 mb-8 w-full max-w-sm">
        <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
          <Clock className="w-5 h-5 text-blue-400 mx-auto mb-1" />
          <div className="text-lg font-bold text-white">{formatDuration(durationSeconds)}</div>
          <div className="text-[10px] text-zinc-500">Duration</div>
        </div>
        <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
          <Flame className="w-5 h-5 text-orange-400 mx-auto mb-1" />
          <div className="text-lg font-bold text-white">{(totalVolume / 1000).toFixed(1)}k</div>
          <div className="text-[10px] text-zinc-500">Volume (kg)</div>
        </div>
        <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
          <Dumbbell className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
          <div className="text-lg font-bold text-white">{exercisesCompleted}</div>
          <div className="text-[10px] text-zinc-500">Exercises</div>
        </div>
      </div>

      {personalRecords.length > 0 && (
        <div className="bg-zinc-900 rounded-xl border border-amber-500/30 p-4 mb-8 w-full max-w-sm">
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-semibold text-amber-400">New PRs!</span>
          </div>
          {personalRecords.map((pr, i) => (
            <div key={i} className="flex justify-between py-1 text-sm">
              <span className="text-zinc-300">{pr.exerciseName}</span>
              <span className="text-amber-400 font-medium">{pr.estimated1RM} kg</span>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-3">
        <Link
          href="/"
          className="px-6 py-3 bg-zinc-800 text-white rounded-xl font-medium hover:bg-zinc-700 transition-colors"
        >
          Dashboard
        </Link>
        <button
          onClick={onDone}
          className="px-6 py-3 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  );
}
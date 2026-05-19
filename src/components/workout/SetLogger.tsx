'use client';

import { useState } from 'react';

interface SetLoggerProps {
  setNumber: number;
  weight: number;
  reps: number;
  completed: boolean;
  onComplete: (weight: number, reps: number) => void;
  onUncomplete: () => void;
  weightIncrement?: number;
}

export default function SetLogger({
  setNumber,
  weight,
  reps,
  completed,
  onComplete,
  onUncomplete,
  weightIncrement = 2.5,
}: SetLoggerProps) {
  const [currentWeight, setCurrentWeight] = useState(weight);
  const [currentReps, setCurrentReps] = useState(reps);

  if (completed) {
    return (
      <button
        onClick={onUncomplete}
        className="flex items-center gap-3 px-3 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg w-full"
      >
        <span className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold">
          ✓
        </span>
        <span className="text-sm text-emerald-400">
          {currentWeight} kg × {currentReps} reps
        </span>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg">
      <span className="text-xs text-zinc-500 w-6">{setNumber}</span>
      <div className="flex-1 flex items-center gap-2">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentWeight((w) => Math.max(0, w - weightIncrement))}
            className="w-7 h-7 flex items-center justify-center bg-zinc-800 rounded text-xs text-zinc-400 hover:bg-zinc-700"
          >
            −
          </button>
          <input
            type="number"
            value={currentWeight || ''}
            onChange={(e) => setCurrentWeight(Number(e.target.value) || 0)}
            className="w-14 text-center bg-zinc-800 border border-zinc-700 rounded py-1 text-sm text-white focus:outline-none focus:border-emerald-500/50"
            placeholder="0"
          />
          <button
            onClick={() => setCurrentWeight((w) => w + weightIncrement)}
            className="w-7 h-7 flex items-center justify-center bg-zinc-800 rounded text-xs text-zinc-400 hover:bg-zinc-700"
          >
            +
          </button>
          <span className="text-xs text-zinc-600">kg</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentReps((r) => Math.max(0, r - 1))}
            className="w-7 h-7 flex items-center justify-center bg-zinc-800 rounded text-xs text-zinc-400 hover:bg-zinc-700"
          >
            −
          </button>
          <input
            type="number"
            value={currentReps || ''}
            onChange={(e) => setCurrentReps(Number(e.target.value) || 0)}
            className="w-12 text-center bg-zinc-800 border border-zinc-700 rounded py-1 text-sm text-white focus:outline-none focus:border-emerald-500/50"
            placeholder="0"
          />
          <button
            onClick={() => setCurrentReps((r) => r + 1)}
            className="w-7 h-7 flex items-center justify-center bg-zinc-800 rounded text-xs text-zinc-400 hover:bg-zinc-700"
          >
            +
          </button>
          <span className="text-xs text-zinc-600">reps</span>
        </div>
      </div>
      <button
        onClick={() => onComplete(currentWeight, currentReps)}
        className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-zinc-700 hover:border-emerald-500 transition-colors"
      />
    </div>
  );
}
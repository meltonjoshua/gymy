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
  isActive?: boolean;
  previousWeight?: number;
}

const QUICK_INCREMENTS = [2.5, 5, 10];

export default function SetLogger({
  setNumber,
  weight,
  reps,
  completed,
  onComplete,
  onUncomplete,
  weightIncrement = 2.5,
  isActive = true,
  previousWeight = 0,
}: SetLoggerProps) {
  const initialWeight = weight > 0 ? weight : previousWeight;
  const [currentWeight, setCurrentWeight] = useState(initialWeight);
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

  if (!isActive) {
    return (
      <div className="flex items-center gap-3 px-3 py-2 bg-zinc-900/50 border border-zinc-800/50 rounded-lg w-full opacity-50">
        <span className="w-6 h-6 rounded-full border border-zinc-700 flex items-center justify-center text-xs text-zinc-600">
          {setNumber}
        </span>
        <span className="text-sm text-zinc-600">
          {initialWeight || 0} kg × {currentReps} reps
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 px-3 py-3 bg-zinc-900 border border-emerald-500/30 rounded-lg">
      <div className="flex items-center gap-2">
        <span className="text-xs text-zinc-500 w-6 shrink-0">{setNumber}</span>
        <div className="flex-1 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
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
          <span className="text-zinc-700">×</span>
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
      </div>
      <div className="flex items-center gap-1.5 pl-7">
        <span className="text-[10px] text-zinc-600 mr-1">+kg</span>
        {QUICK_INCREMENTS.map((inc) => (
          <button
            key={inc}
            onClick={() => setCurrentWeight((w) => w + inc)}
            className="px-2 py-0.5 bg-zinc-800 rounded text-[10px] text-zinc-400 hover:bg-zinc-700 hover:text-emerald-400 transition-colors"
          >
            +{inc}
          </button>
        ))}
      </div>
      <button
        onClick={() => onComplete(currentWeight, currentReps)}
        className="w-full py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors"
      >
        Complete Set
      </button>
    </div>
  );
}
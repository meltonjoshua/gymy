'use client';

import Link from 'next/link';
import { Exercise } from '@/types/exercise';

const categoryColors: Record<string, string> = {
  chest: 'bg-red-500/20 text-red-400',
  back: 'bg-blue-500/20 text-blue-400',
  shoulders: 'bg-purple-500/20 text-purple-400',
  arms: 'bg-pink-500/20 text-pink-400',
  legs: 'bg-amber-500/20 text-amber-400',
  core: 'bg-green-500/20 text-green-400',
  cardio: 'bg-cyan-500/20 text-cyan-400',
};

const difficultyColors: Record<string, string> = {
  beginner: 'bg-emerald-500',
  intermediate: 'bg-amber-500',
  advanced: 'bg-red-500',
};

interface ExerciseCardProps {
  exercise: Exercise;
  onAdd?: () => void;
}

export default function ExerciseCard({ exercise, onAdd }: ExerciseCardProps) {
  return (
    <Link
      href={`/exercises/${exercise.id}`}
      className="block bg-zinc-900 rounded-xl border border-zinc-800 p-4 hover:border-emerald-500/30 hover:bg-zinc-900/80 transition-all group"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">
          {exercise.name}
        </h3>
        <div className={`w-2 h-2 rounded-full ${difficultyColors[exercise.difficulty]}`} title={exercise.difficulty} />
      </div>
      <div className="flex flex-wrap gap-1.5 mb-3">
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${categoryColors[exercise.category]}`}>
          {exercise.category}
        </span>
        {exercise.muscleGroups.slice(0, 2).map((m) => (
          <span key={m} className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">
            {m}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-500">
          {exercise.defaultSets}×{exercise.defaultReps} · {exercise.equipment}
        </span>
        {onAdd && (
          <button
            onClick={(e) => { e.preventDefault(); onAdd(); }}
            className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-medium rounded-lg transition-colors"
          >
            + Add
          </button>
        )}
      </div>
    </Link>
  );
}
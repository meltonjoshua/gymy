'use client';

import Link from 'next/link';
import { Exercise, ExerciseDifficulty } from '@/types/exercise';

const DIFFICULTY_CONFIG: Record<
  ExerciseDifficulty,
  { label: string; dotColor: string; bgColor: string; textColor: string }
> = {
  beginner: {
    label: 'Beginner',
    dotColor: 'bg-emerald-500',
    bgColor: 'bg-emerald-500/15',
    textColor: 'text-emerald-400',
  },
  intermediate: {
    label: 'Intermediate',
    dotColor: 'bg-orange-500',
    bgColor: 'bg-orange-500/15',
    textColor: 'text-orange-400',
  },
  advanced: {
    label: 'Advanced',
    dotColor: 'bg-red-500',
    bgColor: 'bg-red-500/15',
    textColor: 'text-red-400',
  },
};

const EQUIPMENT_LABELS: Record<string, string> = {
  barbell: 'Barbell',
  dumbbell: 'Dumbbell',
  machine: 'Machine',
  cable: 'Cable',
  bodyweight: 'Bodyweight',
  kettlebell: 'Kettlebell',
  band: 'Band',
};

interface ExerciseCardProps {
  exercise: Exercise;
  onQuickAdd?: (exerciseId: string) => void;
}

export default function ExerciseCard({ exercise, onQuickAdd }: ExerciseCardProps) {
  const diff = DIFFICULTY_CONFIG[exercise.difficulty];

  return (
    <Link href={`/exercises/${exercise.id}`} className="group block">
      <div className="relative bg-gray-800/60 border border-gray-700/50 rounded-xl p-4 hover:border-emerald-500/30 hover:bg-gray-800/80 transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/5 cursor-pointer">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-gray-100 group-hover:text-emerald-400 transition-colors truncate">
              {exercise.name}
            </h3>
            <div className="flex items-center gap-1.5 mt-1">
              <span className={`w-2 h-2 rounded-full ${diff.dotColor} flex-shrink-0`} />
              <span className={`text-xs ${diff.textColor}`}>{diff.label}</span>
              <span className="text-gray-600 text-xs">·</span>
              <span className="text-xs text-gray-500">
                {EQUIPMENT_LABELS[exercise.equipment] ?? exercise.equipment}
              </span>
            </div>
          </div>

          {onQuickAdd && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQuickAdd(exercise.id);
              }}
              className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500 hover:text-gray-950 transition-all duration-200 opacity-0 group-hover:opacity-100"
              title="Add to workout"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-1 mt-2.5">
          {exercise.muscleGroups.slice(0, 3).map((muscle) => (
            <span
              key={muscle}
              className="inline-block px-2 py-0.5 text-[10px] font-medium rounded-full bg-gray-700/60 text-gray-300 border border-gray-600/30"
            >
              {muscle}
            </span>
          ))}
          {exercise.muscleGroups.length > 3 && (
            <span className="inline-block px-2 py-0.5 text-[10px] font-medium rounded-full bg-gray-700/60 text-gray-400">
              +{exercise.muscleGroups.length - 3}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 mt-3 pt-2.5 border-t border-gray-700/30">
          <span className="text-xs text-gray-500">
            {exercise.defaultSets} × {exercise.defaultReps} reps
          </span>
          {exercise.restSeconds > 0 && (
            <>
              <span className="text-gray-700 text-xs">·</span>
              <span className="text-xs text-gray-500">
                {Math.floor(exercise.restSeconds / 60)}:
                {(exercise.restSeconds % 60).toString().padStart(2, '0')} rest
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}

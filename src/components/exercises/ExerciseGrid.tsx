'use client';

import { Exercise } from '@/types/exercise';
import ExerciseCard from './ExerciseCard';

interface ExerciseGridProps {
  exercises: Exercise[];
  onQuickAdd?: (exerciseId: string) => void;
}

export default function ExerciseGrid({ exercises, onQuickAdd }: ExerciseGridProps) {
  if (exercises.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <svg
          className="w-16 h-16 text-gray-700 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="text-lg font-medium text-gray-400">No exercises found</h3>
        <p className="text-sm text-gray-600 mt-1">Try adjusting your filters or search terms</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {exercises.map((exercise) => (
        <ExerciseCard key={exercise.id} exercise={exercise} onQuickAdd={onQuickAdd} />
      ))}
    </div>
  );
}

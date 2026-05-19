'use client';

import { useState, useMemo } from 'react';
import { exercises } from '@/data/exercises';
import { Exercise, ExerciseCategory } from '@/types/exercise';

const CATEGORIES: { key: ExerciseCategory | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'chest', label: 'Chest' },
  { key: 'back', label: 'Back' },
  { key: 'shoulders', label: 'Shoulders' },
  { key: 'arms', label: 'Arms' },
  { key: 'legs', label: 'Legs' },
  { key: 'core', label: 'Core' },
  { key: 'cardio', label: 'Cardio' },
];

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'bg-emerald-500/20 text-emerald-400',
  intermediate: 'bg-orange-500/20 text-orange-400',
  advanced: 'bg-red-500/20 text-red-400',
};

interface ExercisePickerProps {
  onAddExercise: (exerciseId: string) => void;
  addedExerciseIds: string[];
}

export default function ExercisePicker({ onAddExercise, addedExerciseIds }: ExercisePickerProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<ExerciseCategory | 'all'>('all');

  const filtered = useMemo(() => {
    let result: Exercise[] = exercises;
    if (category !== 'all') {
      result = result.filter((e) => e.category === category);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.muscleGroups.some((m) => m.toLowerCase().includes(q))
      );
    }
    return result;
  }, [search, category]);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search exercises..."
          className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-track-slate-800">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setCategory(cat.key)}
            className={`whitespace-nowrap px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
              category === cat.key
                ? 'bg-emerald-500 text-gray-950'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
        {filtered.map((exercise) => {
          const isAdded = addedExerciseIds.includes(exercise.id);
          return (
            <div
              key={exercise.id}
              className="flex items-center justify-between bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2.5 hover:bg-gray-800 transition-colors"
            >
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-sm font-medium text-gray-100 truncate">{exercise.name}</span>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${DIFFICULTY_COLORS[exercise.difficulty] ?? ''}`}
                  >
                    {exercise.difficulty}
                  </span>
                  <span className="text-[10px] text-gray-500">
                    {exercise.defaultSets}×{exercise.defaultReps}
                  </span>
                </div>
              </div>
              <button
                onClick={() => onAddExercise(exercise.id)}
                disabled={isAdded}
                className={`ml-2 flex-shrink-0 px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                  isAdded
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-gray-950'
                }`}
              >
                {isAdded ? 'Added' : '+ Add'}
              </button>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-gray-500 text-sm text-center py-6">No exercises found</p>
        )}
      </div>
    </div>
  );
}

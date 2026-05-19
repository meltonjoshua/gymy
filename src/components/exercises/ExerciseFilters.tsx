'use client';

import { ExerciseCategory, ExerciseEquipment, ExerciseDifficulty } from '@/types/exercise';
import { useState } from 'react';

const CATEGORIES: { key: ExerciseCategory; label: string; icon: string }[] = [
  { key: 'chest', label: 'Chest', icon: '💪' },
  { key: 'back', label: 'Back', icon: '🔙' },
  { key: 'shoulders', label: 'Shoulders', icon: '🏋' },
  { key: 'arms', label: 'Arms', icon: '💪' },
  { key: 'legs', label: 'Legs', icon: '🦵' },
  { key: 'core', label: 'Core', icon: '🎯' },
  { key: 'cardio', label: 'Cardio', icon: '❤' },
];

const EQUIPMENT: { key: ExerciseEquipment; label: string }[] = [
  { key: 'barbell', label: 'Barbell' },
  { key: 'dumbbell', label: 'Dumbbell' },
  { key: 'machine', label: 'Machine' },
  { key: 'cable', label: 'Cable' },
  { key: 'bodyweight', label: 'Bodyweight' },
  { key: 'kettlebell', label: 'Kettlebell' },
  { key: 'band', label: 'Band' },
];

const DIFFICULTIES: { key: ExerciseDifficulty; label: string; color: string }[] = [
  { key: 'beginner', label: 'Beginner', color: 'bg-emerald-500' },
  { key: 'intermediate', label: 'Intermediate', color: 'bg-orange-500' },
  { key: 'advanced', label: 'Advanced', color: 'bg-red-500' },
];

interface ExerciseFiltersProps {
  selectedCategory: ExerciseCategory | 'all';
  onCategoryChange: (category: ExerciseCategory | 'all') => void;
  selectedEquipment: ExerciseEquipment | null;
  onEquipmentChange: (equipment: ExerciseEquipment | null) => void;
  selectedDifficulty: ExerciseDifficulty | null;
  onDifficultyChange: (difficulty: ExerciseDifficulty | null) => void;
  activeMuscleGroup: string | null;
  onMuscleGroupChange: (muscle: string | null) => void;
}

export default function ExerciseFilters({
  selectedCategory,
  onCategoryChange,
  selectedEquipment,
  onEquipmentChange,
  selectedDifficulty,
  onDifficultyChange,
  activeMuscleGroup,
  onMuscleGroupChange,
}: ExerciseFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasActiveFilters = selectedEquipment !== null || selectedDifficulty !== null;

  const clearAll = () => {
    onCategoryChange('all');
    onEquipmentChange(null);
    onDifficultyChange(null);
    onMuscleGroupChange(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-track-slate-800">
        <button
          onClick={() => {
            onCategoryChange('all');
            onMuscleGroupChange(null);
          }}
          className={`whitespace-nowrap px-4 py-2 text-sm font-medium rounded-full transition-all ${
            selectedCategory === 'all' && !activeMuscleGroup
              ? 'bg-emerald-500 text-gray-950 shadow-lg shadow-emerald-500/25'
              : 'bg-gray-800/80 text-gray-400 hover:bg-gray-700 hover:text-gray-300'
          }`}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => {
              onCategoryChange(cat.key);
              onMuscleGroupChange(null);
            }}
            className={`whitespace-nowrap px-4 py-2 text-sm font-medium rounded-full transition-all ${
              selectedCategory === cat.key && !activeMuscleGroup
                ? 'bg-emerald-500 text-gray-950 shadow-lg shadow-emerald-500/25'
                : 'bg-gray-800/80 text-gray-400 hover:bg-gray-700 hover:text-gray-300'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {activeMuscleGroup && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Filtered by muscle:</span>
          <button
            onClick={() => onMuscleGroupChange(null)}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25 transition-colors"
          >
            {activeMuscleGroup}
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-300 transition-colors"
      >
        <svg
          className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
        <span>More Filters</span>
        {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
      </button>

      {isExpanded && (
        <div className="space-y-4 p-4 bg-gray-800/40 border border-gray-700/40 rounded-xl backdrop-blur-sm">
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Equipment
            </h4>
            <div className="flex flex-wrap gap-2">
              {EQUIPMENT.map((eq) => (
                <button
                  key={eq.key}
                  onClick={() => onEquipmentChange(selectedEquipment === eq.key ? null : eq.key)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    selectedEquipment === eq.key
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-gray-800 text-gray-400 border border-gray-700/50 hover:border-gray-600 hover:text-gray-300'
                  }`}
                >
                  {eq.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Difficulty
            </h4>
            <div className="flex gap-2">
              {DIFFICULTIES.map((diff) => (
                <button
                  key={diff.key}
                  onClick={() =>
                    onDifficultyChange(selectedDifficulty === diff.key ? null : diff.key)
                  }
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    selectedDifficulty === diff.key
                      ? `${diff.color}/20 text-${diff.key === 'beginner' ? 'emerald' : diff.key === 'intermediate' ? 'orange' : 'red'}-400 border border-${diff.key === 'beginner' ? 'emerald' : diff.key === 'intermediate' ? 'orange' : 'red'}-500/40`
                      : 'bg-gray-800 text-gray-400 border border-gray-700/50 hover:border-gray-600 hover:text-gray-300'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${diff.color}`} />
                  {diff.label}
                </button>
              ))}
            </div>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearAll}
              className="text-xs text-gray-500 hover:text-gray-300 underline transition-colors"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}

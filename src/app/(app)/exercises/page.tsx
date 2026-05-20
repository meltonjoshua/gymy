'use client';

import { useState } from 'react';
import { searchExercises, filterExercises } from '@/lib/exercise-utils';
import { ExerciseCategory, ExerciseEquipment, ExerciseDifficulty } from '@/types/exercise';
import ExerciseCard from '@/components/exercises/ExerciseCard';
import ExerciseSearchBar from '@/components/exercises/ExerciseSearchBar';
import ExerciseFilters from '@/components/exercises/ExerciseFilters';

export default function ExercisesPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<ExerciseCategory | 'all'>('all');
  const [equipment, setEquipment] = useState<ExerciseEquipment | null>(null);
  const [difficulty, setDifficulty] = useState<ExerciseDifficulty | null>(null);
  const [activeMuscleGroup, setActiveMuscleGroup] = useState<string | null>(null);

  const filtered = filterExercises({
    category: category === 'all' ? undefined : category,
    equipment: equipment ?? undefined,
    difficulty: difficulty ?? undefined,
  });
  const results = search
    ? searchExercises(search).filter((e) => {
        if (category !== 'all' && e.category !== category) return false;
        if (equipment && e.equipment !== equipment) return false;
        if (difficulty && e.difficulty !== difficulty) return false;
        return true;
      })
    : filtered;

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Exercises</h1>
        <span className="text-sm text-zinc-500">{results.length} exercises</span>
      </div>

      <ExerciseSearchBar onSearch={setSearch} />

      <ExerciseFilters
        selectedCategory={category}
        selectedEquipment={equipment}
        selectedDifficulty={difficulty}
        onCategoryChange={setCategory}
        onEquipmentChange={setEquipment}
        onDifficultyChange={setDifficulty}
        activeMuscleGroup={activeMuscleGroup}
        onMuscleGroupChange={setActiveMuscleGroup}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {results.map((exercise) => (
          <ExerciseCard key={exercise.id} exercise={exercise} />
        ))}
      </div>

      {results.length === 0 && (
        <div className="text-center py-12 text-zinc-500">
          <p>No exercises found. Try adjusting your filters.</p>
        </div>
      )}
    </div>
  );
}

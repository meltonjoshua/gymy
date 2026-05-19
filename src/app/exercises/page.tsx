'use client';

import { useState, useMemo } from 'react';
import { ExerciseCategory, ExerciseDifficulty, ExerciseEquipment } from '@/types/exercise';
import { exercises } from '@/data/exercises';
import { getExercisesByMuscle } from '@/lib/exercise-utils';
import ExerciseSearchBar from '@/components/exercises/ExerciseSearchBar';
import ExerciseFilters from '@/components/exercises/ExerciseFilters';
import ExerciseGrid from '@/components/exercises/ExerciseGrid';
import MuscleMap from '@/components/exercises/MuscleMap';

const MUSCLE_TO_CATEGORY: Record<string, ExerciseCategory> = {
  chest: 'chest',
  'upper chest': 'chest',
  shoulders: 'shoulders',
  'front delts': 'shoulders',
  'side delts': 'shoulders',
  'rear delts': 'shoulders',
  back: 'back',
  'upper back': 'back',
  lats: 'back',
  traps: 'back',
  biceps: 'arms',
  triceps: 'arms',
  forearms: 'arms',
  quads: 'legs',
  hamstrings: 'legs',
  glutes: 'legs',
  calves: 'legs',
  hips: 'legs',
  'hip flexors': 'legs',
  legs: 'legs',
  core: 'core',
  abs: 'core',
  obliques: 'core',
  'lower back': 'core',
  cardio: 'cardio',
  'full body': 'cardio',
};

const MUSCLE_MAP_REGIONS: Record<string, string> = {
  chest: 'chest',
  'upper-chest': 'upper chest',
  shoulders: 'shoulders',
  'front-delts': 'front delts',
  'rear-delts': 'rear delts',
  biceps: 'biceps',
  'forearms-front': 'forearms',
  'forearms-back': 'forearms',
  triceps: 'triceps',
  abs: 'abs',
  'obliques-front': 'obliques',
  'lower-back': 'lower back',
  traps: 'traps',
  'upper-back': 'upper back',
  lats: 'lats',
  quads: 'quads',
  'hip-flexors': 'hip flexors',
  'front-tibialis': 'legs',
  glutes: 'glutes',
  hamstrings: 'hamstrings',
  calves: 'calves',
};

export default function ExercisesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ExerciseCategory | 'all'>('all');
  const [selectedEquipment, setSelectedEquipment] = useState<ExerciseEquipment | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<ExerciseDifficulty | null>(null);
  const [activeMuscleGroup, setActiveMuscleGroup] = useState<string | null>(null);
  const [showMuscleMap, setShowMuscleMap] = useState(false);

  const filteredExercises = useMemo(() => {
    let result = exercises;

    if (activeMuscleGroup) {
      result = getExercisesByMuscle(activeMuscleGroup);
    } else if (selectedCategory !== 'all') {
      result = result.filter((e) => e.category === selectedCategory);
    }

    if (selectedEquipment) {
      result = result.filter((e) => e.equipment === selectedEquipment);
    }

    if (selectedDifficulty) {
      result = result.filter((e) => e.difficulty === selectedDifficulty);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.muscleGroups.some((m) => m.toLowerCase().includes(q)) ||
          e.category.toLowerCase().includes(q) ||
          e.equipment.toLowerCase().includes(q)
      );
    }

    return result;
  }, [searchQuery, selectedCategory, selectedEquipment, selectedDifficulty, activeMuscleGroup]);

  const handleMuscleMapSelect = (muscleId: string) => {
    const muscleName = MUSCLE_MAP_REGIONS[muscleId] ?? muscleId;
    if (activeMuscleGroup === muscleName) {
      setActiveMuscleGroup(null);
      setSelectedCategory('all');
    } else {
      setActiveMuscleGroup(muscleName);
      const cat = MUSCLE_TO_CATEGORY[muscleName];
      if (cat) {
        setSelectedCategory(cat);
      }
    }
  };

  const handleCategoryChange = (category: ExerciseCategory | 'all') => {
    setSelectedCategory(category);
    if (category !== 'all') {
      setActiveMuscleGroup(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-100">Exercise Library</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {filteredExercises.length} exercise{filteredExercises.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={() => setShowMuscleMap(!showMuscleMap)}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl transition-all ${
              showMuscleMap || activeMuscleGroup
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'bg-gray-800 text-gray-400 border border-gray-700/50 hover:border-gray-600 hover:text-gray-300'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            Muscle Map
          </button>
        </div>

        <div className="space-y-4">
          <ExerciseSearchBar onSearch={setSearchQuery} />

          {showMuscleMap && (
            <div className="bg-gray-800/40 border border-gray-700/40 rounded-xl p-4 backdrop-blur-sm">
              <MuscleMap
                onMuscleSelect={handleMuscleMapSelect}
                activeMuscle={
                  activeMuscleGroup
                    ? (Object.entries(MUSCLE_MAP_REGIONS).find(
                        ([, v]) => v === activeMuscleGroup
                      )?.[0] ?? null)
                    : null
                }
              />
            </div>
          )}

          <ExerciseFilters
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            selectedEquipment={selectedEquipment}
            onEquipmentChange={setSelectedEquipment}
            selectedDifficulty={selectedDifficulty}
            onDifficultyChange={setSelectedDifficulty}
            activeMuscleGroup={activeMuscleGroup}
            onMuscleGroupChange={(muscle) => {
              setActiveMuscleGroup(muscle);
              if (muscle) {
                const category = MUSCLE_TO_CATEGORY[muscle];
                if (category) {
                  setSelectedCategory(category);
                }
              }
            }}
          />

          <ExerciseGrid exercises={filteredExercises} />
        </div>
      </div>
    </div>
  );
}

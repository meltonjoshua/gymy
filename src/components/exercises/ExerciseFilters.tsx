'use client';

import { ExerciseCategory, ExerciseEquipment, ExerciseDifficulty } from '@/types/exercise';

interface ExerciseFiltersProps {
  selectedCategory: ExerciseCategory | '';
  selectedEquipment: ExerciseEquipment | '';
  selectedDifficulty: ExerciseDifficulty | '';
  onCategoryChange: (cat: ExerciseCategory | '') => void;
  onEquipmentChange: (eq: ExerciseEquipment | '') => void;
  onDifficultyChange: (diff: ExerciseDifficulty | '') => void;
}

const categories: { value: ExerciseCategory | ''; label: string }[] = [
  { value: '', label: 'All' },
  { value: 'chest', label: 'Chest' },
  { value: 'back', label: 'Back' },
  { value: 'shoulders', label: 'Shoulders' },
  { value: 'arms', label: 'Arms' },
  { value: 'legs', label: 'Legs' },
  { value: 'core', label: 'Core' },
  { value: 'cardio', label: 'Cardio' },
];

const equipment: { value: ExerciseEquipment | ''; label: string }[] = [
  { value: '', label: 'All' },
  { value: 'barbell', label: 'Barbell' },
  { value: 'dumbbell', label: 'Dumbbell' },
  { value: 'machine', label: 'Machine' },
  { value: 'cable', label: 'Cable' },
  { value: 'bodyweight', label: 'Bodyweight' },
  { value: 'kettlebell', label: 'Kettlebell' },
  { value: 'band', label: 'Band' },
];

const difficulties: { value: ExerciseDifficulty | ''; label: string }[] = [
  { value: '', label: 'All' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

export default function ExerciseFilters({
  selectedCategory,
  selectedEquipment,
  selectedDifficulty,
  onCategoryChange,
  onEquipmentChange,
  onDifficultyChange,
}: ExerciseFiltersProps) {
  return (
    <div className="space-y-3">
      <div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => onCategoryChange(cat.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat.value
                  ? 'bg-emerald-500 text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:text-zinc-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-3">
        <select
          value={selectedEquipment}
          onChange={(e) => onEquipmentChange(e.target.value as ExerciseEquipment | '')}
          className="bg-zinc-800 text-zinc-300 text-xs rounded-lg px-3 py-1.5 border border-zinc-700"
        >
          {equipment.map((eq) => (
            <option key={eq.value} value={eq.value}>{eq.label} Equipment</option>
          ))}
        </select>
        <select
          value={selectedDifficulty}
          onChange={(e) => onDifficultyChange(e.target.value as ExerciseDifficulty | '')}
          className="bg-zinc-800 text-zinc-300 text-xs rounded-lg px-3 py-1.5 border border-zinc-700"
        >
          {difficulties.map((d) => (
            <option key={d.value} value={d.value}>{d.label} Level</option>
          ))}
        </select>
      </div>
    </div>
  );
}
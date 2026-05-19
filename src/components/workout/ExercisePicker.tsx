'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { exercises } from '@/data/exercises';
import { ExerciseCategory } from '@/types/exercise';
import ExerciseCard from '@/components/exercises/ExerciseCard';

interface ExercisePickerProps {
  onSelect: (exerciseId: string) => void;
  onClose: () => void;
}

const categoryOptions: { value: ExerciseCategory | ''; label: string }[] = [
  { value: '', label: 'All' },
  { value: 'chest', label: 'Chest' },
  { value: 'back', label: 'Back' },
  { value: 'shoulders', label: 'Shoulders' },
  { value: 'arms', label: 'Arms' },
  { value: 'legs', label: 'Legs' },
  { value: 'core', label: 'Core' },
  { value: 'cardio', label: 'Cardio' },
];

export default function ExercisePicker({ onSelect, onClose }: ExercisePickerProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<ExerciseCategory | ''>('');

  const filtered = exercises.filter((e) => {
    const matchesSearch = !search || e.name.toLowerCase().includes(search.toLowerCase()) || e.muscleGroups.some((m) => m.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = !category || e.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/80 overflow-y-auto">
      <div className="min-h-screen bg-zinc-950">
        <div className="sticky top-0 bg-zinc-950/95 backdrop-blur-sm p-4 border-b border-zinc-800">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-white">Add Exercise</h2>
            <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search exercises..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50"
            />
          </div>
          <div className="flex gap-1.5 overflow-x-auto">
            {categoryOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setCategory(opt.value)}
                className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  category === opt.value ? 'bg-emerald-500 text-white' : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map((exercise) => (
            <div key={exercise.id} onClick={() => { onSelect(exercise.id); onClose(); }} className="cursor-pointer">
              <ExerciseCard exercise={exercise} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
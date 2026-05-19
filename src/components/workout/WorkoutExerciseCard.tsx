'use client';

import { GripVertical, Trash2, Plus, Minus } from 'lucide-react';
import { WorkoutExercise } from '@/types/workout';
import { exercises } from '@/data/exercises';

interface WorkoutExerciseCardProps {
  exercise: WorkoutExercise;
  onRemove: () => void;
  onUpdateSet: (setId: string, updates: { reps?: number; weight?: number; completed?: boolean }) => void;
  onAddSet: () => void;
  onRemoveSet: (setId: string) => void;
  dragHandleProps?: Record<string, unknown>;
}

export default function WorkoutExerciseCard({
  exercise,
  onRemove,
  onUpdateSet,
  onAddSet,
  onRemoveSet,
  dragHandleProps,
}: WorkoutExerciseCardProps) {
  const ex = exercises.find((e) => e.id === exercise.exerciseId);
  if (!ex) return null;

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
      <div className="flex items-center gap-3 p-3 border-b border-zinc-800">
        {dragHandleProps && (
          <button {...dragHandleProps} className="cursor-grab text-zinc-600 hover:text-zinc-400">
            <GripVertical className="w-5 h-5" />
          </button>
        )}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-white truncate">{ex.name}</h4>
          <p className="text-xs text-zinc-500">{ex.muscleGroups.join(', ')} · {ex.equipment}</p>
        </div>
        <button onClick={onRemove} className="p-1.5 text-zinc-600 hover:text-red-400 transition-colors">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      <div className="p-3">
        <div className="grid grid-cols-[2rem_1fr_1fr_2rem] gap-2 mb-2 text-[10px] font-medium text-zinc-500 uppercase tracking-wider">
          <span>Set</span>
          <span>Weight (kg)</span>
          <span>Reps</span>
          <span />
        </div>
        <div className="space-y-2">
          {exercise.sets.map((set) => (
            <div key={set.id} className="grid grid-cols-[2rem_1fr_1fr_2rem] gap-2 items-center">
              <span className="text-xs text-zinc-400 text-center">{set.setNumber}</span>
              <input
                type="number"
                value={set.weight || ''}
                onChange={(e) => onUpdateSet(set.id, { weight: Number(e.target.value) || 0 })}
                className="bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1 text-sm text-white w-full focus:outline-none focus:border-emerald-500/50"
                placeholder="0"
              />
              <input
                type="number"
                value={set.reps || ''}
                onChange={(e) => onUpdateSet(set.id, { reps: Number(e.target.value) || 0 })}
                className="bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1 text-sm text-white w-full focus:outline-none focus:border-emerald-500/50"
                placeholder="0"
              />
              {exercise.sets.length > 1 && (
                <button onClick={() => onRemoveSet(set.id)} className="p-1 text-zinc-600 hover:text-red-400">
                  <Minus className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          onClick={onAddSet}
          className="mt-2 flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          <Plus className="w-3 h-3" />
          Add set
        </button>
      </div>
      {exercise.restSeconds > 0 && (
        <div className="px-3 pb-3">
          <span className="text-[10px] text-zinc-600">Rest: {exercise.restSeconds}s between sets</span>
        </div>
      )}
    </div>
  );
}
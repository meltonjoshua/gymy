'use client';

import { WorkoutSet, WorkoutExercise } from '@/types/workout';
import { getExerciseById } from '@/lib/exercise-utils';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';

interface WorkoutExerciseCardProps {
  workoutExercise: WorkoutExercise;
  onRemove: (id: string) => void;
  onAddSet: (id: string) => void;
  onRemoveSet: (exerciseId: string, setId: string) => void;
  onUpdateReps: (exerciseId: string, setId: string, reps: number) => void;
  onUpdateWeight: (exerciseId: string, setId: string, weight: number) => void;
  onUpdateRest: (exerciseId: string, seconds: number) => void;
  onUpdateNotes: (exerciseId: string, notes: string) => void;
}

function SetRow({
  setItem,
  exerciseId,
  onUpdateReps,
  onUpdateWeight,
  onRemoveSet,
  canRemove,
}: {
  setItem: WorkoutSet;
  exerciseId: string;
  onUpdateReps: (exerciseId: string, setId: string, reps: number) => void;
  onUpdateWeight: (exerciseId: string, setId: string, weight: number) => void;
  onRemoveSet: (exerciseId: string, setId: string) => void;
  canRemove: boolean;
}) {
  return (
    <div className="flex items-center gap-2 group">
      <span className="w-6 text-center text-xs text-gray-500 font-medium">{setItem.setNumber}</span>
      <div className="flex-1 flex items-center gap-2">
        <div className="flex items-center gap-1">
          <button
            onClick={() => onUpdateReps(exerciseId, setItem.id, Math.max(1, setItem.reps - 1))}
            className="w-6 h-6 flex items-center justify-center bg-gray-700 rounded text-xs text-gray-400 hover:bg-gray-600 transition-colors"
          >
            −
          </button>
          <div className="w-10 text-center">
            <input
              type="number"
              value={setItem.reps}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (!isNaN(val) && val >= 0) onUpdateReps(exerciseId, setItem.id, val);
              }}
              className="w-full bg-transparent text-center text-sm font-medium text-gray-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 rounded"
            />
          </div>
          <button
            onClick={() => onUpdateReps(exerciseId, setItem.id, setItem.reps + 1)}
            className="w-6 h-6 flex items-center justify-center bg-gray-700 rounded text-xs text-gray-400 hover:bg-gray-600 transition-colors"
          >
            +
          </button>
        </div>
        <span className="text-[10px] text-gray-500 uppercase tracking-wider">reps</span>
        <div className="flex items-center gap-1">
          <button
            onClick={() =>
              onUpdateWeight(exerciseId, setItem.id, Math.max(0, setItem.weight - 2.5))
            }
            className="w-6 h-6 flex items-center justify-center bg-gray-700 rounded text-xs text-gray-400 hover:bg-gray-600 transition-colors"
          >
            −
          </button>
          <div className="w-12 text-center">
            <input
              type="number"
              value={setItem.weight}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (!isNaN(val) && val >= 0) onUpdateWeight(exerciseId, setItem.id, val);
              }}
              className="w-full bg-transparent text-center text-sm font-medium text-gray-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 rounded"
            />
          </div>
          <button
            onClick={() => onUpdateWeight(exerciseId, setItem.id, setItem.weight + 2.5)}
            className="w-6 h-6 flex items-center justify-center bg-gray-700 rounded text-xs text-gray-400 hover:bg-gray-600 transition-colors"
          >
            +
          </button>
        </div>
        <span className="text-[10px] text-gray-500">lbs</span>
      </div>
      {canRemove && (
        <button
          onClick={() => onRemoveSet(exerciseId, setItem.id)}
          className="opacity-0 group-hover:opacity-100 w-5 h-5 flex items-center justify-center text-red-400 hover:text-red-300 transition-opacity"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
}

export default function WorkoutExerciseCard({
  workoutExercise,
  onRemove,
  onAddSet,
  onRemoveSet,
  onUpdateReps,
  onUpdateWeight,
  onUpdateRest,
  onUpdateNotes,
}: WorkoutExerciseCardProps) {
  const exercise = getExerciseById(workoutExercise.exerciseId);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: workoutExercise.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  if (!exercise) return null;

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
      className="bg-gray-800/80 border border-gray-700/60 rounded-xl overflow-hidden"
    >
      <div className="flex items-center gap-2 px-3 py-2.5 bg-gray-800 border-b border-gray-700/50">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 text-gray-500 hover:text-gray-300 transition-colors touch-none"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M7 2a2 2 0 10.001 4.001A2 2 0 007 2zm0 6a2 2 0 10.001 4.001A2 2 0 007 8zm0 6a2 2 0 10.001 4.001A2 2 0 007 14zm6-8a2 2 0 10-.001-4.001A2 2 0 0013 6zm0 2a2 2 0 10.001 4.001A2 2 0 0013 8zm0 6a2 2 0 10.001 4.001A2 2 0 0013 14z" />
          </svg>
        </button>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-100 truncate">{exercise.name}</h3>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] text-gray-500">
              {exercise.category} · {exercise.muscleGroups.slice(0, 2).join(', ')}
            </span>
          </div>
        </div>

        <button
          onClick={() => onRemove(workoutExercise.id)}
          className="p-1.5 text-gray-500 hover:text-red-400 transition-colors"
          aria-label="Remove exercise"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>

      <div className="px-3 py-2 space-y-1">
        <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase tracking-wider mb-1 pl-6">
          <span className="w-6 text-center">#</span>
          <span className="flex-1 flex items-center gap-2">
            <span className="w-10 text-center">Reps</span>
            <span className="w-12 text-center">Weight</span>
          </span>
        </div>
        {workoutExercise.sets.map((set) => (
          <SetRow
            key={set.id}
            setItem={set}
            exerciseId={workoutExercise.id}
            onUpdateReps={onUpdateReps}
            onUpdateWeight={onUpdateWeight}
            onRemoveSet={onRemoveSet}
            canRemove={workoutExercise.sets.length > 1}
          />
        ))}
      </div>

      <div className="px-3 py-2 flex flex-wrap items-center gap-2 border-t border-gray-700/50">
        <button
          onClick={() => onAddSet(workoutExercise.id)}
          className="px-2.5 py-1 text-[11px] font-medium bg-emerald-500/15 text-emerald-400 rounded-md hover:bg-emerald-500/25 transition-colors"
        >
          + Add Set
        </button>

        <div className="flex items-center gap-1.5 text-[11px]">
          <span className="text-gray-500">Rest:</span>
          <select
            value={workoutExercise.restSeconds}
            onChange={(e) => onUpdateRest(workoutExercise.id, parseInt(e.target.value))}
            className="bg-gray-700 text-gray-200 rounded px-1.5 py-0.5 text-[11px] border border-gray-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value={0}>None</option>
            <option value={30}>30s</option>
            <option value={45}>45s</option>
            <option value={60}>60s</option>
            <option value={90}>90s</option>
            <option value={120}>120s</option>
            <option value={150}>150s</option>
            <option value={180}>180s</option>
            <option value={240}>240s</option>
            <option value={300}>300s</option>
          </select>
        </div>

        <input
          type="text"
          placeholder="Notes..."
          value={workoutExercise.notes}
          onChange={(e) => onUpdateNotes(workoutExercise.id, e.target.value)}
          className="flex-1 min-w-[80px] bg-gray-700/50 border border-gray-600/50 rounded px-2 py-0.5 text-[11px] text-gray-300 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
      </div>
    </motion.div>
  );
}

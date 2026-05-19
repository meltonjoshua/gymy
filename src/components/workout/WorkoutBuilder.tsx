'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { AnimatePresence } from 'framer-motion';
import { useWorkoutBuilder } from '@/hooks/use-workout-builder';
import { getExerciseById } from '@/lib/exercise-utils';
import ExercisePicker from './ExercisePicker';
import WorkoutExerciseCard from './WorkoutExerciseCard';
import WorkoutSummary from './WorkoutSummary';

export default function WorkoutBuilder() {
  const builder = useWorkoutBuilder();
  const [showPicker, setShowPicker] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const templateId = searchParams.get('template');
    if (!templateId || builder.exercises.length > 0) return;

    try {
      const stored = localStorage.getItem('gymy_templates');
      if (!stored) return;
      const templates = JSON.parse(stored);
      const template = templates.find((t: { id: string }) => t.id === templateId);
      if (!template) return;

      builder.setName(template.name);
      for (const ex of template.exercises) {
        builder.addExercise(ex.exerciseId);
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only run on mount / searchParams change
  }, [searchParams]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = builder.exercises.findIndex((e) => e.id === active.id);
    const newIndex = builder.exercises.findIndex((e) => e.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(builder.exercises, oldIndex, newIndex);
    builder.reorderExercises(reordered);
  }

  return (
    <div className="max-w-lg mx-auto px-4 pb-8">
      <div className="space-y-4">
        <input
          type="text"
          value={builder.name}
          onChange={(e) => builder.setName(e.target.value)}
          placeholder="Workout Name"
          className="w-full bg-transparent text-2xl font-bold text-gray-100 placeholder-gray-600 focus:outline-none"
        />
        <textarea
          value={builder.description}
          onChange={(e) => builder.setDescription(e.target.value)}
          placeholder="Add a description (optional)"
          rows={2}
          className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none"
        />

        {builder.exercises.length > 0 && (
          <WorkoutSummary
            exerciseCount={builder.exercises.length}
            totalSets={builder.totalSets}
            estimatedDuration={builder.estimatedDuration}
            difficulty={builder.difficulty}
          />
        )}

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={builder.exercises.map((e) => e.id)}
            strategy={verticalListSortingStrategy}
          >
            <AnimatePresence mode="popLayout">
              {builder.exercises.map((workoutExercise) => (
                <div key={workoutExercise.id} className="mb-3">
                  <WorkoutExerciseCard
                    workoutExercise={workoutExercise}
                    onRemove={builder.removeExercise}
                    onAddSet={builder.addSet}
                    onRemoveSet={builder.removeSet}
                    onUpdateReps={builder.updateSetReps}
                    onUpdateWeight={builder.updateSetWeight}
                    onUpdateRest={builder.updateRestSeconds}
                    onUpdateNotes={builder.updateNotes}
                  />
                </div>
              ))}
            </AnimatePresence>
          </SortableContext>
        </DndContext>

        {builder.exercises.length === 0 && !showPicker && (
          <div className="text-center py-12">
            <div className="text-gray-600 mb-2">
              <svg
                className="w-12 h-12 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <p className="text-gray-500 text-sm">No exercises added yet</p>
            <p className="text-gray-600 text-xs mt-1">Tap below to browse exercises</p>
          </div>
        )}

        <button
          onClick={() => setShowPicker(!showPicker)}
          className={`w-full py-3 rounded-xl font-medium text-sm transition-all ${
            showPicker
              ? 'bg-gray-800 text-gray-300 border border-gray-700'
              : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25'
          }`}
        >
          {showPicker ? 'Close Exercise Browser' : '+ Add Exercises'}
        </button>

        {showPicker && (
          <ExercisePicker
            onAddExercise={(exerciseId) => {
              builder.addExercise(exerciseId);
            }}
            addedExerciseIds={builder.exercises.map((e) => e.exerciseId)}
          />
        )}

        {builder.exercises.length > 0 && (
          <div className="flex gap-3 pt-2">
            <button
              onClick={builder.reset}
              className="flex-1 py-3 rounded-xl font-medium text-sm bg-gray-800 text-gray-400 border border-gray-700 hover:bg-gray-700 hover:text-gray-300 transition-all"
            >
              Reset
            </button>
            <button
              onClick={() => {
                const payload = builder.exercises.map((we) => {
                  const exercise = getExerciseById(we.exerciseId);
                  return {
                    exerciseId: we.exerciseId,
                    name: exercise?.name ?? we.exerciseId,
                    sets: we.sets.map((s) => ({ weight: s.weight, reps: s.reps })),
                  };
                });
                const encoded = encodeURIComponent(JSON.stringify(payload));
                router.push(`/workout/active?data=${encoded}`);
              }}
              className="flex-1 py-3 rounded-xl font-medium text-sm bg-emerald-500 text-gray-950 hover:bg-emerald-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!builder.isValid}
            >
              Start Workout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

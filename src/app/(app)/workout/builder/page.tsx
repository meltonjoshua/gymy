'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWorkoutBuilder } from '@/hooks/use-workout-builder';
import WorkoutExerciseCard from '@/components/workout/WorkoutExerciseCard';
import WorkoutSummary from '@/components/workout/WorkoutSummary';
import ExercisePicker from '@/components/workout/ExercisePicker';
import { Plus, Play } from 'lucide-react';

export default function WorkoutBuilderPage() {
  const router = useRouter();
  const {
    name,
    setName,
    description,
    setDescription,
    exercises,
    addExercise,
    removeExercise,
    addSet,
    removeSet,
    updateSetReps,
    updateSetWeight,
    updateRestSeconds,
    updateNotes,
    estimatedDuration,
    difficulty,
    totalSets,
    isValid,
    buildWorkout,
  } = useWorkoutBuilder();

  const [showPicker, setShowPicker] = useState(false);
  const addedExerciseIds = exercises.map((we) => we.exerciseId);

  const handleStart = () => {
    const workout = buildWorkout();
    sessionStorage.setItem('gymy_active_workout', JSON.stringify(workout));
    router.push(`/workout/active/${workout.id}`);
  };

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto space-y-4">
      {showPicker && (
        <ExercisePicker
          onAddExercise={(exerciseId) => addExercise(exerciseId)}
          addedExerciseIds={addedExerciseIds}
        />
      )}

      <div>
        <h1 className="text-2xl font-bold text-white">Workout Builder</h1>
        <p className="text-sm text-zinc-500 mt-1">Create your custom workout</p>
      </div>

      <div className="space-y-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Workout name"
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50"
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50"
        />
      </div>

      {exercises.length > 0 && (
        <div className="space-y-3">
          {exercises.map((we) => (
            <WorkoutExerciseCard
              key={we.id}
              workoutExercise={we}
              onRemove={removeExercise}
              onAddSet={addSet}
              onRemoveSet={removeSet}
              onUpdateReps={updateSetReps}
              onUpdateWeight={updateSetWeight}
              onUpdateRest={updateRestSeconds}
              onUpdateNotes={updateNotes}
            />
          ))}
        </div>
      )}

      <button
        onClick={() => setShowPicker(true)}
        className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-zinc-700 rounded-xl text-zinc-400 hover:border-emerald-500/50 hover:text-emerald-400 transition-colors"
      >
        <Plus className="w-5 h-5" />
        Add Exercise
      </button>

      {exercises.length > 0 && (
        <WorkoutSummary
          exerciseCount={exercises.length}
          totalSets={totalSets}
          estimatedDuration={estimatedDuration}
          difficulty={difficulty}
        />
      )}

      <button
        onClick={handleStart}
        disabled={!isValid}
        className="w-full flex items-center justify-center gap-2 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Play className="w-5 h-5" />
        Start Workout
      </button>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWorkoutBuilder } from '@/hooks/use-workout-builder';
import WorkoutExerciseCard from '@/components/workout/WorkoutExerciseCard';
import WorkoutSummary from '@/components/workout/WorkoutSummary';
import ExercisePicker from '@/components/workout/ExercisePicker';
import { Plus, Play } from 'lucide-react';
import { exercises } from '@/data/exercises';

export default function WorkoutBuilderPage() {
  const router = useRouter();
  const {
    workoutExercises,
    name,
    setName,
    description,
    setDescription,
    addExercise,
    removeExercise,
    updateSet,
    addSet,
    removeSet,
    isValid,
    buildWorkout,
  } = useWorkoutBuilder();

  const [showPicker, setShowPicker] = useState(false);

  const totalSets = workoutExercises.reduce((sum, e) => sum + e.sets.length, 0);
  const estMinutes = totalSets * 2 + workoutExercises.reduce((sum, e) => sum + (e.sets.length - 1) * (e.restSeconds / 60), 0);

  const handleStart = () => {
    const workout = buildWorkout();
    sessionStorage.setItem('gymy_active_workout', JSON.stringify(workout));
    router.push(`/workout/active/${workout.id}`);
  };

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto space-y-4">
      {showPicker && (
        <ExercisePicker
          onSelect={(id) => addExercise(id)}
          onClose={() => setShowPicker(false)}
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

      {workoutExercises.length > 0 && (
        <div className="space-y-3">
          {workoutExercises.map((we) => {
            const ex = exercises.find((e) => e.id === we.exerciseId);
            if (!ex) return null;
            return (
              <WorkoutExerciseCard
                key={we.id}
                exercise={we}
                onRemove={() => removeExercise(we.id)}
                onUpdateSet={(setId, updates) => updateSet(we.id, setId, updates)}
                onAddSet={() => addSet(we.id)}
                onRemoveSet={(setId) => removeSet(we.id, setId)}
              />
            );
          })}
        </div>
      )}

      <button
        onClick={() => setShowPicker(true)}
        className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-zinc-700 rounded-xl text-zinc-400 hover:border-emerald-500/50 hover:text-emerald-400 transition-colors"
      >
        <Plus className="w-5 h-5" />
        Add Exercise
      </button>

      {workoutExercises.length > 0 && (
        <WorkoutSummary
          exerciseCount={workoutExercises.length}
          totalSets={totalSets}
          estimatedMinutes={Math.round(estMinutes)}
          difficulty="intermediate"
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
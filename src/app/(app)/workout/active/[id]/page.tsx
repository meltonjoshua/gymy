'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Pause, Play } from 'lucide-react';
import { Workout } from '@/types/workout';
import { exercises } from '@/data/exercises';
import { useWorkoutTimer } from '@/hooks/use-workout-timer';
import { useWorkoutSession } from '@/hooks/use-workout-session';
import { useWorkoutHistory } from '@/hooks/use-workout-history';
import { useSettings } from '@/hooks/use-settings';
import WorkoutProgress from '@/components/workout/WorkoutProgress';
import RestTimer from '@/components/workout/RestTimer';
import Link from 'next/link';

export default function ActiveWorkoutPage() {
  const router = useRouter();
  const { settings } = useSettings();
  const timer = useWorkoutTimer(settings.defaultRestTimer, settings.soundEffects);
  const session = useWorkoutSession();
  const history = useWorkoutHistory();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [initialized, setInitialized] = useState(false);

  if (typeof window !== 'undefined' && !initialized) {
    const stored = sessionStorage.getItem('gymy_active_workout');
    if (stored) {
      const parsed = JSON.parse(stored) as Workout;
      setWorkout(parsed);
      session.initSession(parsed.exercises);
      timer.startWorkout();
      setInitialized(true);
    }
  }

  if (!workout || !initialized) {
    return (
      <div className="px-4 py-12 text-center text-zinc-500">
        <p>No active workout</p>
        <Link href="/workout/builder" className="text-emerald-400 hover:underline mt-2 inline-block">
          Create a workout
        </Link>
      </div>
    );
  }

  const currentEx = session.sessionExercises[currentExerciseIndex];
  const currentExData = currentEx ? exercises.find((e) => e.id === currentEx.exerciseId) : null;

  const handleCompleteSet = () => {
    if (!currentEx) return;
    const currentSet = currentEx.sets[currentSetIndex];
    if (!currentSet) return;
    const exData = exercises.find((e) => e.id === currentEx.exerciseId);
    session.completeSet(currentEx.id, currentSet.id, currentSet.weight || 0, currentSet.reps || exData?.defaultReps || 0);
    if (settings.autoStartRestTimer && currentEx.restSeconds > 0) {
      timer.startRest(currentEx.restSeconds);
    }
    const nextSet = currentSetIndex + 1;
    if (nextSet < currentEx.sets.length) {
      setCurrentSetIndex(nextSet);
    } else {
      const nextExercise = currentExerciseIndex + 1;
      if (nextExercise < session.sessionExercises.length) {
        setCurrentExerciseIndex(nextExercise);
        setCurrentSetIndex(0);
      } else {
        handleFinish();
      }
    }
  };

  const handleFinish = () => {
    const completed = session.completeWorkout();
    history.addWorkout(completed);
    sessionStorage.setItem('gymy_completed_workout', JSON.stringify(completed));
    timer.stopWorkout();
    router.push(`/workout/complete/${completed.id}`);
  };

  const handlePrevSet = () => {
    if (currentSetIndex > 0) {
      setCurrentSetIndex(currentSetIndex - 1);
    } else if (currentExerciseIndex > 0) {
      const prevIdx = currentExerciseIndex - 1;
      setCurrentExerciseIndex(prevIdx);
      setCurrentSetIndex(session.sessionExercises[prevIdx].sets.length - 1);
    }
  };

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <button onClick={() => { timer.stopWorkout(); router.back(); }} className="p-2 text-zinc-400 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <h1 className="text-lg font-bold text-white">{workout.name}</h1>
          <p className="text-xs text-zinc-500">
            {Math.floor(timer.elapsedSeconds / 60)}:{(timer.elapsedSeconds % 60).toString().padStart(2, '0')} elapsed
          </p>
        </div>
        <button
          onClick={timer.isPaused ? timer.resume : timer.pause}
          className="p-2 text-zinc-400 hover:text-white"
        >
          {timer.isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
        </button>
      </div>

      <WorkoutProgress completed={session.completedSets} total={session.totalSets} />

      {timer.isResting && timer.restSeconds > 0 && (
        <RestTimer
          seconds={timer.restSeconds}
          isPaused={timer.isPaused}
          onSkip={timer.skipRest}
          onPause={timer.pause}
          onResume={timer.resume}
        />
      )}

      {currentExData && currentEx && (
        <div className="space-y-4">
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-white">{currentExData.name}</h2>
              <span className="text-xs text-zinc-500">
                Exercise {currentExerciseIndex + 1}/{session.sessionExercises.length}
              </span>
            </div>
            <p className="text-xs text-zinc-500">{currentExData.muscleGroups.join(', ')}</p>
            <div className="mt-3 space-y-2">
              {currentEx.sets.map((set, si) => {
                const isCurrent = si === currentSetIndex;
                return (
                  <div
                    key={set.id}
                    onClick={() => { setCurrentSetIndex(si); }}
                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                      isCurrent ? 'bg-emerald-500/10 border border-emerald-500/30' : set.completed ? 'bg-zinc-800/50' : 'bg-zinc-800'
                    }`}
                  >
                    <span className="text-xs text-zinc-400">Set {set.setNumber}</span>
                    {set.completed ? (
                      <span className="text-xs text-emerald-400">✓ {set.weight}kg × {set.reps}</span>
                    ) : (
                      <span className="text-xs text-zinc-500">{currentExData.defaultReps} reps</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handlePrevSet}
              disabled={currentExerciseIndex === 0 && currentSetIndex === 0}
              className="flex-1 py-3 bg-zinc-800 text-white rounded-xl font-medium hover:bg-zinc-700 transition-colors disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={handleCompleteSet}
              className="flex-1 py-3 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition-colors"
            >
              Complete Set
            </button>
          </div>
        </div>
      )}

      <button
        onClick={handleFinish}
        className="w-full py-3 bg-zinc-800 text-orange-400 border border-orange-500/30 rounded-xl font-medium hover:bg-zinc-700 transition-colors"
      >
        Finish Workout
      </button>
    </div>
  );
}
'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Pause, Play, ChevronRight, ChevronLeft, X } from 'lucide-react';
import { Workout } from '@/types/workout';
import { exercises } from '@/data/exercises';
import { useWorkoutTimer } from '@/hooks/use-workout-timer';
import { useWorkoutSession } from '@/hooks/use-workout-session';
import { useWorkoutHistory } from '@/hooks/use-workout-history';
import { useSettings } from '@/hooks/use-settings';
import WorkoutProgress from '@/components/workout/WorkoutProgress';
import RestTimer from '@/components/workout/RestTimer';
import SetLogger from '@/components/workout/SetLogger';

interface ActiveWorkoutProps {
  workout: Workout;
}

export default function ActiveWorkout({ workout }: ActiveWorkoutProps) {
  const router = useRouter();
  const { settings } = useSettings();
  const timer = useWorkoutTimer(settings.defaultRestTimer, settings.soundEffects);
  const session = useWorkoutSession();
  const history = useWorkoutHistory();
  const [started, setStarted] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [showConfirmFinish, setShowConfirmFinish] = useState(false);

  if (!started) {
    session.initSession(workout.exercises);
    timer.startWorkout();
    setStarted(true);
  }

  const currentEx = session.sessionExercises[currentExerciseIndex];
  const currentExData = currentEx ? exercises.find((e) => e.id === currentEx.exerciseId) : null;

  const getPreviousWeight = useCallback(
    (exerciseId: string, setIndex: number) => {
      const ex = session.sessionExercises.find((e) => e.exerciseId === exerciseId);
      if (!ex) return 0;
      const previousInExercise = setIndex > 0 ? ex.sets[setIndex - 1]?.weight : 0;
      if (previousInExercise > 0) return previousInExercise;
      const prevExIdx = session.sessionExercises.findIndex((e) => e.exerciseId === exerciseId);
      if (prevExIdx > 0) {
        const prevEx = session.sessionExercises[prevExIdx - 1];
        const lastSet = prevEx.sets.filter((s) => s.completed).pop();
        return lastSet?.weight ?? 0;
      }
      return 0;
    },
    [session.sessionExercises]
  );

  const handleCompleteSet = useCallback(
    (weight: number, reps: number) => {
      if (!currentEx) return;
      const currentSet = currentEx.sets[currentSetIndex];
      if (!currentSet) return;
      session.completeSet(currentEx.id, currentSet.id, weight, reps);

      const nextSet = currentSetIndex + 1;
      if (nextSet < currentEx.sets.length) {
        setCurrentSetIndex(nextSet);
      } else {
        const nextExercise = currentExerciseIndex + 1;
        if (nextExercise < session.sessionExercises.length) {
          setCurrentExerciseIndex(nextExercise);
          setCurrentSetIndex(0);
        }
      }

      if (settings.autoStartRestTimer && currentEx.restSeconds > 0) {
        timer.startRest(currentEx.restSeconds);
      }
    },
    [currentEx, currentSetIndex, session, currentExerciseIndex, settings.autoStartRestTimer, timer]
  );

  const handleUncompleteSet = useCallback(
    (exerciseId: string, setId: string) => {
      session.uncompleteSet(exerciseId, setId);
    },
    [session]
  );

  const handleNextExercise = useCallback(() => {
    if (currentExerciseIndex < session.sessionExercises.length - 1) {
      setCurrentExerciseIndex((i) => i + 1);
      setCurrentSetIndex(0);
    }
  }, [currentExerciseIndex, session.sessionExercises.length]);

  const handlePrevExercise = useCallback(() => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex((i) => i - 1);
      setCurrentSetIndex(0);
    }
  }, [currentExerciseIndex]);

  const handleFinish = useCallback(() => {
    const completed = session.completeWorkout();
    history.addWorkout(completed);
    sessionStorage.setItem('gymy_completed_workout', JSON.stringify(completed));
    timer.stopWorkout();
    router.push(`/workout/complete/${completed.id}`);
  }, [session, history, timer, router]);

  const isLastSet =
    currentExerciseIndex === session.sessionExercises.length - 1 &&
    currentSetIndex >= (currentEx?.sets.length ?? 1) - 1;

  return (
    <div className="px-4 py-4 max-w-2xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <button onClick={() => setShowConfirmFinish(true)} className="p-2 text-zinc-400 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <h1 className="text-lg font-bold text-white">{workout.name}</h1>
          <p className="text-xs text-zinc-500">
            {Math.floor(timer.elapsedSeconds / 60)}:{(timer.elapsedSeconds % 60).toString().padStart(2, '0')} elapsed · {session.completedSets}/{session.totalSets} sets
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
          maxSeconds={timer.restTotalSeconds}
          isPaused={timer.isPaused}
          onSkip={timer.skipRest}
          onPause={timer.pause}
          onResume={timer.resume}
        />
      )}

      {currentExData && currentEx && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevExercise}
              disabled={currentExerciseIndex === 0}
              className="p-1.5 text-zinc-500 hover:text-white disabled:opacity-30"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="text-center">
              <h2 className="text-xl font-bold text-white">{currentExData.name}</h2>
              <p className="text-xs text-zinc-500">
                {currentExData.muscleGroups.join(', ')} · Exercise {currentExerciseIndex + 1}/{session.sessionExercises.length}
              </p>
            </div>
            <button
              onClick={handleNextExercise}
              disabled={currentExerciseIndex >= session.sessionExercises.length - 1}
              className="p-1.5 text-zinc-500 hover:text-white disabled:opacity-30"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-2">
            {currentEx.sets.map((set, si) => (
              <SetLogger
                key={set.id}
                setNumber={set.setNumber}
                weight={set.weight}
                reps={set.reps}
                completed={set.completed}
                onComplete={(w, r) => handleCompleteSet(w, r)}
                onUncomplete={() => handleUncompleteSet(currentEx.id, set.id)}
                isActive={si === currentSetIndex && !set.completed}
                previousWeight={getPreviousWeight(currentEx.exerciseId, si)}
              />
            ))}
          </div>

          <button
            onClick={handleNextExercise}
            disabled={currentExerciseIndex >= session.sessionExercises.length - 1}
            className="w-full py-2 bg-zinc-800 text-zinc-300 rounded-xl font-medium hover:bg-zinc-700 transition-colors disabled:opacity-30 text-sm"
          >
            Next Exercise →
          </button>
        </div>
      )}

      {isLastSet && (
        <button
          onClick={handleFinish}
          className="w-full py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-colors"
        >
          Finish Workout
        </button>
      )}

      {!isLastSet && (
        <button
          onClick={() => setShowConfirmFinish(true)}
          className="w-full py-3 bg-zinc-800 text-orange-400 border border-orange-500/30 rounded-xl font-medium hover:bg-zinc-700 transition-colors"
        >
          End Workout Early
        </button>
      )}

      {showConfirmFinish && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 max-w-sm w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">End Workout?</h3>
              <button onClick={() => setShowConfirmFinish(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-zinc-400 mb-4">
              You&apos;ve completed {session.completedSets} of {session.totalSets} sets. Are you sure you want to end this workout?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmFinish(false)}
                className="flex-1 py-2 bg-zinc-800 text-white rounded-lg font-medium hover:bg-zinc-700"
              >
                Continue
              </button>
              <button
                onClick={handleFinish}
                className="flex-1 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600"
              >
                End Workout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
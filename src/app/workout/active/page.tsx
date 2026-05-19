'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SkipForward, Timer, Trophy } from 'lucide-react';
import SetCheckmark from '@/components/ui/SetCheckmark';
import { useConfetti } from '@/hooks/use-confetti';
import { useSettings } from '@/hooks/use-settings';
import Link from 'next/link';

interface ActiveSet {
  weight: number;
  reps: number;
  completed: boolean;
}

interface ActiveExercise {
  exerciseId: string;
  name: string;
  sets: ActiveSet[];
}

const DEMO_WORKOUT: ActiveExercise[] = [
  {
    exerciseId: 'bench-press',
    name: 'Bench Press',
    sets: [
      { weight: 135, reps: 10, completed: false },
      { weight: 155, reps: 8, completed: false },
      { weight: 175, reps: 6, completed: false },
    ],
  },
  {
    exerciseId: 'squat',
    name: 'Barbell Squat',
    sets: [
      { weight: 185, reps: 10, completed: false },
      { weight: 205, reps: 8, completed: false },
      { weight: 225, reps: 6, completed: false },
    ],
  },
  {
    exerciseId: 'deadlift',
    name: 'Deadlift',
    sets: [
      { weight: 225, reps: 8, completed: false },
      { weight: 275, reps: 5, completed: false },
    ],
  },
];

export default function ActiveWorkoutPage() {
  const [exercises, setExercises] = useState<ActiveExercise[]>(DEMO_WORKOUT);
  const [restTimer, setRestTimer] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const { fire } = useConfetti();
  const { settings } = useSettings();

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isResting || restTimer <= 0) return;
    const interval = setInterval(() => {
      setRestTimer((s) => {
        if (s <= 1) {
          setIsResting(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isResting, restTimer]);

  const toggleSet = useCallback(
    (exerciseIndex: number, setIndex: number) => {
      setExercises((prev) => {
        const updated = prev.map((ex, ei) => {
          if (ei !== exerciseIndex) return ex;
          return {
            ...ex,
            sets: ex.sets.map((s, si) => {
              if (si !== setIndex) return s;
              const newCompleted = !s.completed;
              if (newCompleted && settings.autoStartRestTimer) {
                setRestTimer(settings.defaultRestTimerDuration);
                setIsResting(true);
              }
              return { ...s, completed: newCompleted };
            }),
          };
        });

        const allComplete = updated.every((ex) => ex.sets.every((s) => s.completed));
        if (allComplete) {
          setIsComplete(true);
          setTimeout(() => fire(), 300);
        }

        return updated;
      });
    },
    [settings, fire]
  );

  const skipRest = useCallback(() => {
    setRestTimer(0);
    setIsResting(false);
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const totalSets = exercises.reduce((a, e) => a + e.sets.length, 0);
  const completedSets = exercises.reduce((a, e) => a + e.sets.filter((s) => s.completed).length, 0);

  if (exercises.length === 0) {
    return (
      <div className="page-container flex items-center justify-center min-h-[50vh]">
        <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="page-container">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card text-center py-12"
        >
          <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-100 mb-2">Workout Complete!</h2>
          <p className="text-gray-400 text-sm mb-2">Great job crushing that session</p>
          <p className="text-gray-500 text-xs mb-6">
            {completedSets} sets completed in {formatTime(elapsedSeconds)}
          </p>
          <Link href="/" className="btn-primary inline-flex">
            Back to Home
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Active Workout</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {formatTime(elapsedSeconds)} · {completedSets}/{totalSets} sets
          </p>
        </div>
        <Link href="/" className="btn-ghost text-xs">
          Finish
        </Link>
      </div>

      <div className="w-full h-1.5 bg-gray-800 rounded-full mb-6 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
          animate={{ width: totalSets > 0 ? `${(completedSets / totalSets) * 100}%` : '0%' }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <AnimatePresence>
        {isResting && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="card mb-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Timer
                className={`w-5 h-5 text-orange-400 ${isResting ? 'animate-pulse-rest' : ''}`}
              />
              <div>
                <p className="text-xs text-gray-400">Rest Timer</p>
                <p className="text-lg font-bold text-orange-400 tabular-nums">
                  {formatTime(restTimer)}
                </p>
              </div>
            </div>
            <button
              onClick={skipRest}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-200 transition-colors min-h-[44px]"
            >
              <SkipForward className="w-4 h-4" />
              Skip
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {exercises.map((exercise, exerciseIndex) => (
          <motion.div
            key={exercise.exerciseId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: exerciseIndex * 0.05 }}
            className="card"
          >
            <h3 className="text-sm font-semibold text-gray-100 mb-3">{exercise.name}</h3>
            <div className="space-y-2">
              {exercise.sets.map((set, setIndex) => (
                <div
                  key={setIndex}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    set.completed ? 'bg-emerald-500/10' : 'bg-gray-800/40'
                  }`}
                >
                  <SetCheckmark
                    completed={set.completed}
                    onClick={() => toggleSet(exerciseIndex, setIndex)}
                  />
                  <div className="flex items-center gap-4 flex-1 text-sm tabular-nums">
                    <span
                      className={`font-semibold ${set.completed ? 'text-emerald-400' : 'text-gray-300'}`}
                    >
                      {set.weight} lbs
                    </span>
                    <span className="text-gray-500">×</span>
                    <span
                      className={`font-semibold ${set.completed ? 'text-emerald-400' : 'text-gray-300'}`}
                    >
                      {set.reps} reps
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

'use client';

import { useParams, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import Link from 'next/link';
import { getExerciseById } from '@/lib/exercise-utils';
import { exercises } from '@/data/exercises';
import { ExerciseDifficulty } from '@/types/exercise';

const DIFFICULTY_CONFIG: Record<
  ExerciseDifficulty,
  { label: string; color: string; bgColor: string; textColor: string }
> = {
  beginner: {
    label: 'Beginner',
    color: 'bg-emerald-500',
    bgColor: 'bg-emerald-500/15',
    textColor: 'text-emerald-400',
  },
  intermediate: {
    label: 'Intermediate',
    color: 'bg-orange-500',
    bgColor: 'bg-orange-500/15',
    textColor: 'text-orange-400',
  },
  advanced: {
    label: 'Advanced',
    color: 'bg-red-500',
    bgColor: 'bg-red-500/15',
    textColor: 'text-red-400',
  },
};

const EQUIPMENT_LABELS: Record<string, string> = {
  barbell: 'Barbell',
  dumbbell: 'Dumbbell',
  machine: 'Machine',
  cable: 'Cable',
  bodyweight: 'Bodyweight',
  kettlebell: 'Kettlebell',
  band: 'Band',
};

const CATEGORY_LABELS: Record<string, string> = {
  chest: 'Chest',
  back: 'Back',
  shoulders: 'Shoulders',
  arms: 'Arms',
  legs: 'Legs',
  core: 'Core',
  cardio: 'Cardio',
};

export default function ExerciseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const exerciseId = params.id as string;

  const exercise = useMemo(() => getExerciseById(exerciseId), [exerciseId]);

  const relatedExercises = useMemo(() => {
    if (!exercise) return [];
    return exercises
      .filter(
        (e) => e.id !== exercise.id && e.muscleGroups.some((m) => exercise.muscleGroups.includes(m))
      )
      .slice(0, 4);
  }, [exercise]);

  const personalRecord = useMemo(() => {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem('gymy_workouts');
      if (!stored) return null;
      const workouts = JSON.parse(stored);
      let bestWeight = 0;
      let bestReps = 0;
      let prDate = '';

      for (const workout of workouts) {
        for (const we of workout.exercises ?? []) {
          if (we.exerciseId !== exerciseId) continue;
          for (const set of we.sets ?? []) {
            if (set.weight > bestWeight) {
              bestWeight = set.weight;
              prDate = workout.createdAt ?? '';
            }
            if (set.reps > bestReps) {
              bestReps = set.reps;
            }
          }
        }
      }

      if (bestWeight === 0) return null;
      return { weight: bestWeight, reps: bestReps, date: prDate };
    } catch {
      return null;
    }
  }, [exerciseId]);

  if (!exercise) {
    return (
      <div className="page-container flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-100">Exercise not found</h2>
          <p className="text-gray-500 mt-2">
            The exercise you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/exercises"
            className="inline-block mt-4 px-6 py-2 bg-emerald-500 text-gray-950 rounded-xl font-medium text-sm hover:bg-emerald-400 transition-colors"
          >
            Browse Exercises
          </Link>
        </div>
      </div>
    );
  }

  const diff = DIFFICULTY_CONFIG[exercise.difficulty];

  return (
    <div className="page-container">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-300 transition-colors mb-6"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Library
      </button>

      <div className="space-y-6">
        <div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-100">{exercise.name}</h1>
              <div className="flex items-center gap-2 mt-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${diff.bgColor} ${diff.textColor}`}
                >
                  <span className={`w-2 h-2 rounded-full ${diff.color}`} />
                  {diff.label}
                </span>
                <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-gray-800 text-gray-400 border border-gray-700/50">
                  {CATEGORY_LABELS[exercise.category] ?? exercise.category}
                </span>
                <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-gray-800 text-gray-400 border border-gray-700/50">
                  {EQUIPMENT_LABELS[exercise.equipment] ?? exercise.equipment}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 mt-3">
            {exercise.muscleGroups.map((muscle) => (
              <span
                key={muscle}
                className="px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              >
                {muscle}
              </span>
            ))}
          </div>
        </div>

        {personalRecord && (
          <div className="bg-gradient-to-r from-orange-500/10 to-emerald-500/10 border border-orange-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <svg className="w-5 h-5 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.08 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <h3 className="text-sm font-semibold text-orange-400">Personal Record</h3>
            </div>
            <div className="flex items-baseline gap-4 mt-1">
              <div>
                <span className="text-2xl font-bold text-gray-100">{personalRecord.weight}</span>
                <span className="text-sm text-gray-400 ml-1">lbs</span>
              </div>
              <div className="text-gray-500">|</div>
              <div>
                <span className="text-lg font-semibold text-gray-300">{personalRecord.reps}</span>
                <span className="text-sm text-gray-400 ml-1">reps</span>
              </div>
              {personalRecord.date && (
                <>
                  <div className="text-gray-500">|</div>
                  <span className="text-xs text-gray-500">
                    {new Date(personalRecord.date).toLocaleDateString()}
                  </span>
                </>
              )}
            </div>
          </div>
        )}

        <div className="bg-gray-800/40 border border-gray-700/40 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <svg
              className="w-4 h-4 text-emerald-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="text-sm font-semibold text-gray-200">Default Set/Rep Scheme</h3>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-400">{exercise.defaultSets}</div>
              <div className="text-xs text-gray-500 mt-1">Sets</div>
            </div>
            <div className="text-2xl text-gray-600">×</div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-400">{exercise.defaultReps}</div>
              <div className="text-xs text-gray-500 mt-1">Reps</div>
            </div>
            {exercise.restSeconds > 0 && (
              <>
                <div className="text-2xl text-gray-600 ml-4">|</div>
                <div className="text-center ml-4">
                  <div className="text-3xl font-bold text-orange-400">
                    {Math.floor(exercise.restSeconds / 60)}:
                    {(exercise.restSeconds % 60).toString().padStart(2, '0')}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Rest</div>
                </div>
              </>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <svg
              className="w-4 h-4 text-emerald-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <h3 className="text-sm font-semibold text-gray-200">Step-by-Step Instructions</h3>
          </div>
          <ol className="space-y-3">
            {exercise.instructions.map((instruction, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-bold">
                  {i + 1}
                </span>
                <p className="text-sm text-gray-300 pt-0.5">{instruction}</p>
              </li>
            ))}
          </ol>
        </div>

        {exercise.tips.length > 0 && (
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <svg
                className="w-4 h-4 text-amber-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
              <h3 className="text-sm font-semibold text-amber-400">Pro Tips</h3>
            </div>
            <ul className="space-y-2">
              {exercise.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400/60 flex-shrink-0 mt-1.5" />
                  <p className="text-sm text-gray-300">{tip}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Link
          href="/workout/builder"
          className="w-full py-3.5 rounded-xl font-semibold text-sm bg-emerald-500 text-gray-950 hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.97] block text-center min-h-[44px]"
        >
          Add to Workout
        </Link>

        {relatedExercises.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-200 mb-3">Related Exercises</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {relatedExercises.map((related) => {
                const relatedDiff = DIFFICULTY_CONFIG[related.difficulty];
                return (
                  <Link
                    key={related.id}
                    href={`/exercises/${related.id}`}
                    className="flex items-center gap-3 bg-gray-800/40 border border-gray-700/40 rounded-lg p-3 hover:border-emerald-500/30 hover:bg-gray-800/60 transition-all"
                  >
                    <span
                      className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${relatedDiff.color}`}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-200 truncate">{related.name}</p>
                      <p className="text-xs text-gray-500">
                        {CATEGORY_LABELS[related.category] ?? related.category} ·{' '}
                        {relatedDiff.label}
                      </p>
                    </div>
                    <svg
                      className="w-4 h-4 text-gray-600 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

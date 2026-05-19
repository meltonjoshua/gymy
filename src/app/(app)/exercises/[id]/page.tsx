'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Clock, BarChart3 } from 'lucide-react';
import { getExerciseById } from '@/lib/exercise-utils';
import { exercises } from '@/data/exercises';

const categoryColors: Record<string, string> = {
  chest: 'bg-red-500/20 text-red-400',
  back: 'bg-blue-500/20 text-blue-400',
  shoulders: 'bg-purple-500/20 text-purple-400',
  arms: 'bg-pink-500/20 text-pink-400',
  legs: 'bg-amber-500/20 text-amber-400',
  core: 'bg-green-500/20 text-green-400',
  cardio: 'bg-cyan-500/20 text-cyan-400',
};

const difficultyColors: Record<string, string> = {
  beginner: 'bg-emerald-500',
  intermediate: 'bg-amber-500',
  advanced: 'bg-red-500',
};

export default function ExerciseDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const exercise = getExerciseById(id);

  if (!exercise) {
    return (
      <div className="px-4 py-12 text-center text-zinc-500">
        <p>Exercise not found</p>
        <Link href="/exercises" className="text-emerald-400 hover:underline mt-2 inline-block">Back to exercises</Link>
      </div>
    );
  }

  const relatedExercises = exercises.filter((e) => e.category === exercise.category && e.id !== exercise.id).slice(0, 4);

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto space-y-6">
      <Link href="/exercises" className="flex items-center gap-1 text-sm text-zinc-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to exercises
      </Link>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColors[exercise.category]}`}>
            {exercise.category}
          </span>
          <span className={`w-2 h-2 rounded-full ${difficultyColors[exercise.difficulty]}`} />
          <span className="text-xs text-zinc-500 capitalize">{exercise.difficulty}</span>
        </div>
        <h1 className="text-2xl font-bold text-white">{exercise.name}</h1>
        <p className="text-sm text-zinc-500 mt-1">
          {exercise.muscleGroups.join(' · ')} · {exercise.equipment}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-3 text-center">
          <BarChart3 className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
          <div className="text-lg font-bold text-white">{exercise.defaultSets}×{exercise.defaultReps}</div>
          <div className="text-[10px] text-zinc-500">Sets × Reps</div>
        </div>
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-3 text-center">
          <Clock className="w-4 h-4 text-blue-400 mx-auto mb-1" />
          <div className="text-lg font-bold text-white">{exercise.restSeconds}s</div>
          <div className="text-[10px] text-zinc-500">Rest</div>
        </div>
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-3 text-center">
          <div className="text-lg font-bold text-white">{exercise.equipment}</div>
          <div className="text-[10px] text-zinc-500">Equipment</div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-white mb-3">Instructions</h3>
        <ol className="space-y-2">
          {exercise.instructions.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="w-6 h-6 flex-shrink-0 flex items-center justify-center bg-emerald-500/10 rounded-full text-xs font-bold text-emerald-400">
                {i + 1}
              </span>
              <span className="text-sm text-zinc-300 pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {exercise.tips.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-white mb-3">Pro Tips</h3>
          <div className="space-y-2">
            {exercise.tips.map((tip, i) => (
              <div key={i} className="flex gap-2 bg-amber-500/5 border border-amber-500/20 rounded-lg p-3">
                <span className="text-amber-400 text-sm">💡</span>
                <span className="text-sm text-zinc-300">{tip}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <Link
        href={`/workout/builder?exercise=${exercise.id}`}
        className="flex items-center justify-center gap-2 w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add to Workout
      </Link>

      {relatedExercises.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-white mb-3">Related Exercises</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {relatedExercises.map((ex) => (
              <Link
                key={ex.id}
                href={`/exercises/${ex.id}`}
                className="block bg-zinc-900 rounded-xl border border-zinc-800 p-3 hover:border-emerald-500/30 transition-colors"
              >
                <div className="text-sm font-medium text-white">{ex.name}</div>
                <div className="text-xs text-zinc-500">{ex.muscleGroups.join(', ')}</div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
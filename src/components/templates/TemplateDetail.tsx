'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Play, Clock, Dumbbell, SlidersHorizontal, Tag } from 'lucide-react';
import { Workout } from '@/types/workout';
import { exercises } from '@/data/exercises';

const difficultyConfig: Record<string, { bg: string; text: string; border: string; label: string }> = {
  beginner: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', label: 'Beginner' },
  intermediate: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', label: 'Intermediate' },
  advanced: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', label: 'Advanced' },
};

interface TemplateDetailProps {
  template: Workout;
  onStart?: (workout: Workout) => void;
  onCustomize?: (workout: Workout) => void;
  showBackLink?: boolean;
}

export default function TemplateDetail({ template, onStart, onCustomize, showBackLink = true }: TemplateDetailProps) {
  const router = useRouter();
  const diff = difficultyConfig[template.difficulty] || difficultyConfig.beginner;
  const totalSets = template.exercises.reduce((s, e) => s + e.sets.length, 0);

  const handleStart = () => {
    if (onStart) {
      onStart(template);
      return;
    }
    const now = Date.now();
    const workoutExercises = template.exercises.map((e, i) => ({
      ...e,
      id: `we-${now}-${i}`,
    }));
    const workout = {
      ...template,
      id: `w-${now}`,
      name: template.name,
      description: template.description,
      exercises: workoutExercises,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    sessionStorage.setItem('gymy_active_workout', JSON.stringify(workout));
    router.push(`/workout/active/${workout.id}`);
  };

  const handleCustomize = () => {
    if (onCustomize) {
      onCustomize(template);
      return;
    }
    sessionStorage.setItem('gymy_custom_workout', JSON.stringify(template));
    router.push('/workout/builder');
  };

  return (
    <div className="space-y-6">
      {showBackLink && (
        <Link href="/templates" className="flex items-center gap-1 text-sm text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to templates
        </Link>
      )}

      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${diff.bg} ${diff.text} ${diff.border}`}>
            {diff.label}
          </span>
        </div>
        <h1 className="text-2xl font-bold text-white">{template.name}</h1>
        <p className="text-sm text-zinc-400 mt-1 leading-relaxed">{template.description}</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-3 text-center">
          <Dumbbell className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
          <div className="text-lg font-bold text-white">{template.exercises.length}</div>
          <div className="text-[10px] text-zinc-500">Exercises</div>
        </div>
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-3 text-center">
          <Clock className="w-4 h-4 text-blue-400 mx-auto mb-1" />
          <div className="text-lg font-bold text-white">~{template.estimatedDurationMinutes}m</div>
          <div className="text-[10px] text-zinc-500">Duration</div>
        </div>
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-3 text-center">
          <SlidersHorizontal className="w-4 h-4 text-amber-400 mx-auto mb-1" />
          <div className="text-lg font-bold text-white">{totalSets}</div>
          <div className="text-[10px] text-zinc-500">Total Sets</div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-white mb-3">Exercises</h3>
        <div className="space-y-2">
          {template.exercises.map((we, i) => {
            const ex = exercises.find((e) => e.id === we.exerciseId);
            if (!ex) return null;
            return (
              <div key={i} className="bg-zinc-900 rounded-xl border border-zinc-800 p-3 hover:border-zinc-700 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-zinc-600 w-5">{i + 1}</span>
                      <div>
                        <div className="text-sm font-medium text-white">{ex.name}</div>
                        <div className="text-xs text-zinc-500">{ex.muscleGroups.join(', ')}</div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-emerald-400">{we.sets.length}×{we.sets[0]?.reps || ex.defaultReps}</div>
                    <div className="text-[10px] text-zinc-500">{we.restSeconds}s rest</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {template.tags.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-zinc-400 mb-2 flex items-center gap-1">
            <Tag className="w-3 h-3" />
            Tags
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {template.tags.map((tag) => (
              <span key={tag} className="text-xs px-2.5 py-1 bg-zinc-800 text-zinc-400 rounded-full border border-zinc-700">{tag}</span>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3 pt-2">
        <button
          onClick={handleStart}
          className="w-full flex items-center justify-center gap-2 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors active:scale-[0.98]"
        >
          <Play className="w-5 h-5" />
          Start Workout
        </button>
        <button
          onClick={handleCustomize}
          className="w-full flex items-center justify-center gap-2 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium rounded-xl border border-zinc-700 transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Customize Workout
        </button>
      </div>
    </div>
  );
}
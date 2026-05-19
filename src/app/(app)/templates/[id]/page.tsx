'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Play, Clock, Dumbbell } from 'lucide-react';
import { workoutTemplates } from '@/data/workout-templates';
import { exercises } from '@/data/exercises';

export default function TemplateDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const template = workoutTemplates.find((t) => t.id === params.id);

  if (!template) {
    return (
      <div className="px-4 py-12 text-center text-zinc-500">
        <p>Template not found</p>
        <Link href="/templates" className="text-emerald-400 hover:underline mt-2 inline-block">Back to templates</Link>
      </div>
    );
  }

  const handleStart = () => {
    // eslint-disable-next-line react-hooks/purity -- Date.now in event handler is fine
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

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto space-y-6">
      <Link href="/templates" className="flex items-center gap-1 text-sm text-zinc-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to templates
      </Link>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            template.difficulty === 'beginner' ? 'bg-emerald-500/10 text-emerald-400' :
            template.difficulty === 'intermediate' ? 'bg-amber-500/10 text-amber-400' :
            'bg-red-500/10 text-red-400'
          }`}>
            {template.difficulty}
          </span>
        </div>
        <h1 className="text-2xl font-bold text-white">{template.name}</h1>
        <p className="text-sm text-zinc-500 mt-1">{template.description}</p>
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
          <div className="text-lg font-bold text-white">
            {template.exercises.reduce((s, e) => s + e.sets.length, 0)}
          </div>
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
              <div key={i} className="bg-zinc-900 rounded-xl border border-zinc-800 p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-white">{ex.name}</div>
                    <div className="text-xs text-zinc-500">{ex.muscleGroups.join(', ')}</div>
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
        <div className="flex flex-wrap gap-1.5">
          {template.tags.map((tag) => (
            <span key={tag} className="text-xs px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded-full">{tag}</span>
          ))}
        </div>
      )}

      <button
        onClick={handleStart}
        className="w-full flex items-center justify-center gap-2 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-colors"
      >
        <Play className="w-5 h-5" />
        Start Workout
      </button>
    </div>
  );
}
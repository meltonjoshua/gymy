'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Play } from 'lucide-react';
import { programs } from '@/data/programs';
import { workoutTemplates } from '@/data/workout-templates';

import { useRouter } from 'next/navigation';

const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function ProgramDetailPage() {
  const params = useParams();
  const router = useRouter();
  const programId = params.id as string;
  const program = programs.find((p) => p.id === programId);

  if (!program) {
    return (
      <div className="px-4 py-12 text-center text-zinc-500">
        <p>Program not found</p>
        <Link href="/programs" className="text-emerald-400 hover:underline mt-2 inline-block">Back to programs</Link>
      </div>
    );
  }

  const schedule = program.schedule[0] || [];

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto space-y-6">
      <Link href="/programs" className="flex items-center gap-1 text-sm text-zinc-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to programs
      </Link>

      <div>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
          program.difficulty === 'beginner' ? 'bg-emerald-500/10 text-emerald-400' :
          program.difficulty === 'intermediate' ? 'bg-amber-500/10 text-amber-400' :
          'bg-red-500/10 text-red-400'
        }`}>
          {program.difficulty}
        </span>
        <h1 className="text-2xl font-bold text-white mt-1">{program.name}</h1>
        <p className="text-sm text-zinc-500 mt-1">{program.description}</p>
        <div className="flex items-center gap-4 mt-2 text-xs text-zinc-500">
          <span>{program.weeks} weeks</span>
          <span>{program.daysPerWeek}x/week</span>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-white mb-3">Weekly Schedule</h3>
        <div className="grid grid-cols-7 gap-1">
          {dayLabels.map((day, i) => {
            const dayEntry = schedule.find((d) => d.day === i + 1);
            return (
              <div key={day} className="text-center">
                <div className="text-xs text-zinc-500 mb-1">{day}</div>
                <div className={`aspect-square rounded-lg flex items-center justify-center text-xs ${
                  dayEntry?.isRest ? 'bg-zinc-800 text-zinc-600' : dayEntry ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-zinc-900 text-zinc-600'
                }`}>
                  {dayEntry?.isRest ? '—' : dayEntry ? '✓' : '—'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-white mb-3">Workout Days</h3>
        <div className="space-y-2">
          {schedule.filter((d) => !d.isRest).map((day) => {
            const template = workoutTemplates.find((t) => t.id === day.templateId);
            return (
              <div key={day.day} className="bg-zinc-900 rounded-xl border border-zinc-800 p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-white">{day.label}</div>
                    <div className="text-xs text-zinc-500">{template ? template.exercises.length : 0} exercises</div>
                  </div>
                  {template && (
                    <Link
                      href={`/templates/${template.id}`}
                      className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-medium rounded-lg transition-colors"
                    >
                      View
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <button
        onClick={() => {
          const firstWorkoutDay = schedule.find((d) => !d.isRest);
          if (firstWorkoutDay) {
            const template = workoutTemplates.find((t) => t.id === firstWorkoutDay.templateId);
            if (template) {
              const workout = {
                ...template,
                id: `w-${Date.now()}`,
                name: `[${program.name}] ${template.name}`,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              };
              sessionStorage.setItem('gymy_active_workout', JSON.stringify(workout));
              router.push(`/workout/active/${workout.id}`);
            }
          }
        }}
        className="w-full flex items-center justify-center gap-2 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-colors"
      >
        <Play className="w-5 h-5" />
        Start Program
      </button>
    </div>
  );
}
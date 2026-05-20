'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Play, Calendar, TrendingUp, Clock, Zap } from 'lucide-react';
import { programs } from '@/data/programs';
import { workoutTemplates } from '@/data/workout-templates';
import ProgramCalendar from '@/components/templates/ProgramCalendar';
import ProgramProgress from '@/components/templates/ProgramProgress';

const difficultyConfig: Record<string, { bg: string; text: string; border: string; icon: string; label: string }> = {
  beginner: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', icon: '🌱', label: 'Beginner' },
  intermediate: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', icon: '🔥', label: 'Intermediate' },
  advanced: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', icon: '⚡', label: 'Advanced' },
};

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
  const workoutDays = schedule.filter((d) => !d.isRest);
  const totalWorkouts = program.weeks * workoutDays.length;
  const diff = difficultyConfig[program.difficulty] || difficultyConfig.beginner;

  const handleStart = () => {
    const firstWorkoutDay = workoutDays[0];
    if (!firstWorkoutDay) return;
    const template = workoutTemplates.find((t) => t.id === firstWorkoutDay.templateId);
    if (!template) return;
    const now = Date.now();
    const workoutExercises = template.exercises.map((e, i) => ({
      ...e,
      id: `we-${now}-${i}`,
    }));
    const workout = {
      ...template,
      id: `w-${now}`,
      name: `[${program.name}] ${template.name}`,
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
      <Link href="/programs" className="flex items-center gap-1 text-sm text-zinc-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to programs
      </Link>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${diff.bg} ${diff.text} ${diff.border}`}>
            {diff.icon} {diff.label}
          </span>
        </div>
        <h1 className="text-2xl font-bold text-white">{program.name}</h1>
        <p className="text-sm text-zinc-400 mt-1 leading-relaxed">{program.description}</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-3 text-center">
          <Calendar className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
          <div className="text-lg font-bold text-white">{program.weeks}</div>
          <div className="text-[10px] text-zinc-500">Weeks</div>
        </div>
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-3 text-center">
          <TrendingUp className="w-4 h-4 text-blue-400 mx-auto mb-1" />
          <div className="text-lg font-bold text-white">{program.daysPerWeek}x</div>
          <div className="text-[10px] text-zinc-500">Per Week</div>
        </div>
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-3 text-center">
          <Clock className="w-4 h-4 text-amber-400 mx-auto mb-1" />
          <div className="text-lg font-bold text-white">{totalWorkouts}</div>
          <div className="text-[10px] text-zinc-500">Workouts</div>
        </div>
      </div>

      <ProgramCalendar schedule={schedule} />

      <ProgramProgress program={program} />

      <button
        onClick={handleStart}
        className="w-full flex items-center justify-center gap-2 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors active:scale-[0.98]"
      >
        <Play className="w-5 h-5" />
        Start Program
      </button>
    </div>
  );
}
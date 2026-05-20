'use client';

import { programs } from '@/data/programs';
import { workoutTemplates } from '@/data/workout-templates';
import Link from 'next/link';
import { Calendar, TrendingUp, Zap } from 'lucide-react';

const difficultyStyles: Record<string, { bg: string; text: string; border: string; accent: string; gradient: string }> = {
  beginner: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', accent: 'from-emerald-500/20', gradient: 'from-emerald-500/5 to-transparent' },
  intermediate: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', accent: 'from-amber-500/20', gradient: 'from-amber-500/5 to-transparent' },
  advanced: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', accent: 'from-red-500/20', gradient: 'from-red-500/5 to-transparent' },
};

export default function ProgramsPage() {
  return (
    <div className="px-4 py-6 max-w-2xl mx-auto space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-white">Programs</h1>
        <p className="text-sm text-zinc-500 mt-1">Structured multi-week training plans to transform your physique</p>
      </div>

      <div className="space-y-3">
        {programs.map((program) => {
          const schedule = program.schedule[0] || [];
          const workoutDays = schedule.filter((d) => !d.isRest);
          const totalWorkouts = program.weeks * workoutDays.length;
          const style = difficultyStyles[program.difficulty] || difficultyStyles.beginner;
          const firstTemplate = workoutDays[0] ? workoutTemplates.find((t) => t.id === workoutDays[0].templateId) : null;

          return (
            <Link
              key={program.id}
              href={`/programs/${program.id}`}
              className={`block bg-zinc-900 rounded-xl border border-zinc-800 p-4 hover:border-emerald-500/30 transition-all group overflow-hidden relative`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">{program.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${style.bg} ${style.text} ${style.border}`}>
                    {program.difficulty}
                  </span>
                </div>
                <p className="text-sm text-zinc-500 mb-3 line-clamp-2">{program.description}</p>
                <div className="flex items-center gap-4 text-xs text-zinc-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{program.weeks} weeks</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>{program.daysPerWeek}x/week</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    <span>{totalWorkouts} workouts</span>
                  </div>
                </div>
                {firstTemplate && (
                  <div className="mt-2 pt-2 border-t border-zinc-800">
                    <div className="text-[10px] text-zinc-600 uppercase font-medium mb-1">First workout</div>
                    <div className="text-xs text-zinc-400">{firstTemplate.name} · {firstTemplate.exercises.length} exercises · ~{firstTemplate.estimatedDurationMinutes}m</div>
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
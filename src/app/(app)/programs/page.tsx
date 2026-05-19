'use client';

import { programs } from '@/data/programs';
import Link from 'next/link';

export default function ProgramsPage() {
  return (
    <div className="px-4 py-6 max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-white">Programs</h1>
      <p className="text-sm text-zinc-500">Structured multi-week training plans</p>

      <div className="space-y-3">
        {programs.map((program) => (
          <Link
            key={program.id}
            href={`/programs/${program.id}`}
            className="block bg-zinc-900 rounded-xl border border-zinc-800 p-4 hover:border-emerald-500/30 transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-white">{program.name}</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                program.difficulty === 'beginner' ? 'bg-emerald-500/10 text-emerald-400' :
                program.difficulty === 'intermediate' ? 'bg-amber-500/10 text-amber-400' :
                'bg-red-500/10 text-red-400'
              }`}>
                {program.difficulty}
              </span>
            </div>
            <p className="text-sm text-zinc-500 mb-2">{program.description}</p>
            <div className="flex items-center gap-3 text-xs text-zinc-500">
              <span>{program.weeks} weeks</span>
              <span>{program.daysPerWeek}x/week</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
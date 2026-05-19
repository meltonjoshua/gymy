'use client';

import { Clock, Dumbbell } from 'lucide-react';
import Link from 'next/link';

interface TemplateCardProps {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  exerciseCount: number;
  estimatedMinutes: number;
  tags?: string[];
}

const difficultyColors: Record<string, string> = {
  beginner: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  intermediate: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  advanced: 'bg-red-500/10 text-red-400 border-red-500/20',
};

export default function TemplateCard({ id, name, description, difficulty, exerciseCount, estimatedMinutes, tags }: TemplateCardProps) {
  return (
    <Link href={`/templates/${id}`} className="block bg-zinc-900 rounded-xl border border-zinc-800 p-4 hover:border-emerald-500/30 transition-all group">
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">{name}</h3>
        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${difficultyColors[difficulty]}`}>
          {difficulty}
        </span>
      </div>
      <p className="text-xs text-zinc-500 mb-3 line-clamp-2">{description}</p>
      <div className="flex items-center gap-4 text-xs text-zinc-500">
        <div className="flex items-center gap-1">
          <Dumbbell className="w-3 h-3" />
          {exerciseCount} exercises
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          ~{estimatedMinutes}m
        </div>
      </div>
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-zinc-800 text-zinc-400 rounded">{tag}</span>
          ))}
        </div>
      )}
    </Link>
  );
}
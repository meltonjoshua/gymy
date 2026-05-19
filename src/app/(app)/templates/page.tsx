'use client';

import { useState } from 'react';
import { workoutTemplates } from '@/data/workout-templates';
import TemplateCard from '@/components/templates/TemplateCard';

export default function TemplatesPage() {
  const [difficulty, setDifficulty] = useState<string>('');

  const filtered = difficulty
    ? workoutTemplates.filter((t) => t.difficulty === difficulty)
    : workoutTemplates;

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-white">Workout Templates</h1>
      <p className="text-sm text-zinc-500">Pre-built workouts for every goal and fitness level</p>

      <div className="flex gap-2">
        {['', 'beginner', 'intermediate', 'advanced'].map((d) => (
          <button
            key={d}
            onClick={() => setDifficulty(d)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              difficulty === d ? 'bg-emerald-500 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-zinc-300'
            }`}
          >
            {d || 'All'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filtered.map((template) => (
          <TemplateCard
            key={template.id}
            id={template.id}
            name={template.name}
            description={template.description}
            difficulty={template.difficulty}
            exerciseCount={template.exercises.length}
            estimatedMinutes={template.estimatedDurationMinutes}
            tags={template.tags}
          />
        ))}
      </div>
    </div>
  );
}
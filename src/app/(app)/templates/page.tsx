'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { workoutTemplates } from '@/data/workout-templates';
import TemplateCard from '@/components/templates/TemplateCard';

const difficulties = ['', 'beginner', 'intermediate', 'advanced'] as const;
const tags = [...new Set(workoutTemplates.flatMap((t) => t.tags))].sort();

export default function TemplatesPage() {
  const [difficulty, setDifficulty] = useState<string>('');
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  const filtered = workoutTemplates.filter((t) => {
    if (difficulty && t.difficulty !== difficulty) return false;
    if (selectedTag && !t.tags.includes(selectedTag)) return false;
    if (search) {
      const q = search.toLowerCase();
      return t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.tags.some((tag) => tag.toLowerCase().includes(q));
    }
    return true;
  });

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-white">Workout Templates</h1>
        <p className="text-sm text-zinc-500 mt-1">Pre-built workouts for every goal and fitness level</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input
          type="text"
          placeholder="Search templates..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {difficulties.map((d) => (
          <button
            key={d}
            onClick={() => setDifficulty(d)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
              difficulty === d ? 'bg-emerald-500 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-zinc-300'
            }`}
          >
            {d || 'All'}
          </button>
        ))}
      </div>

      {selectedTag ? (
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500">Filtered by:</span>
          <button
            onClick={() => setSelectedTag('')}
            className="text-xs px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
          >
            {selectedTag} ✕
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {tags.slice(0, 10).map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className="text-[10px] px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded hover:text-zinc-300 transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-zinc-500 text-sm">No templates match your filters</p>
          <button
            onClick={() => { setDifficulty(''); setSearch(''); setSelectedTag(''); }}
            className="text-emerald-400 text-sm mt-2 hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
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
      )}
    </div>
  );
}
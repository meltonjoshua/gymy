'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Play, Clock, Dumbbell, Plus, Trash2 } from 'lucide-react';

interface WorkoutTemplate {
  id: string;
  name: string;
  exercises: { exerciseId: string; name: string; sets: number }[];
  createdAt: string;
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<WorkoutTemplate[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem('gymy_templates');
      if (stored) return JSON.parse(stored);
    } catch {}
    return [];
  });

  const deleteTemplate = (id: string) => {
    const updated = templates.filter((t) => t.id !== id);
    setTemplates(updated);
    localStorage.setItem('gymy_templates', JSON.stringify(updated));
  };

  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold">
          <span className="bg-gradient-to-r from-emerald-400 to-orange-400 bg-clip-text text-transparent">
            Workout Templates
          </span>
        </h1>
        <p className="text-sm text-gray-500 mt-1">Quick-start your favorite routines</p>
      </motion.div>

      {templates.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card text-center py-12"
        >
          <Dumbbell className="w-12 h-12 text-gray-700 mx-auto mb-3" />
          <p className="text-gray-400 text-sm font-medium">No templates yet</p>
          <p className="text-gray-600 text-xs mt-1">
            Create a workout in the builder and save it as a template
          </p>
          <Link href="/workout/builder" className="btn-primary inline-flex mt-6">
            <Plus className="w-4 h-4" />
            Create Workout
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {templates.map((template, i) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card-hover"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-100">{template.name}</h3>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Dumbbell className="w-3 h-3" />
                      {template.exercises.length} exercises
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      {template.exercises.reduce((a, e) => a + e.sets, 0)} sets
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => deleteTemplate(template.id)}
                    className="flex items-center justify-center w-9 h-9 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors min-w-[44px] min-h-[44px]"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <Link
                    href={`/workout/builder?template=${template.id}`}
                    className="flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/25 transition-colors min-w-[44px] min-h-[44px]"
                  >
                    <Play className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="mt-8">
        <Link href="/workout/builder" className="btn-primary w-full">
          <Plus className="w-4 h-4" />
          Build New Workout
        </Link>
      </div>
    </div>
  );
}

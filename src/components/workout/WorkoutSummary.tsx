'use client';

import { ExerciseDifficulty } from '@/types/exercise';
import { motion } from 'framer-motion';

const DIFFICULTY_CONFIG: Record<ExerciseDifficulty, { label: string; color: string; bg: string }> =
  {
    beginner: {
      label: 'Beginner',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/20 border-emerald-500/30',
    },
    intermediate: {
      label: 'Intermediate',
      color: 'text-orange-400',
      bg: 'bg-orange-500/20 border-orange-500/30',
    },
    advanced: { label: 'Advanced', color: 'text-red-400', bg: 'bg-red-500/20 border-red-500/30' },
  };

interface WorkoutSummaryProps {
  exerciseCount: number;
  totalSets: number;
  estimatedDuration: number;
  difficulty: ExerciseDifficulty;
}

export default function WorkoutSummary({
  exerciseCount,
  totalSets,
  estimatedDuration,
  difficulty,
}: WorkoutSummaryProps) {
  const diff = DIFFICULTY_CONFIG[difficulty];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-4 space-y-3"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-200">Workout Summary</h3>
        <span
          className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${diff.bg} ${diff.color}`}
        >
          {diff.label}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="text-center">
          <div className="text-xl font-bold text-emerald-400">{exerciseCount}</div>
          <div className="text-[10px] text-gray-500 uppercase tracking-wider">Exercises</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-emerald-400">{totalSets}</div>
          <div className="text-[10px] text-gray-500 uppercase tracking-wider">Total Sets</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-emerald-400">~{estimatedDuration}</div>
          <div className="text-[10px] text-gray-500 uppercase tracking-wider">Min</div>
        </div>
      </div>
    </motion.div>
  );
}

'use client';

import { motion } from 'framer-motion';

interface ProgressRingsProps {
  percentage: number;
  label: string;
  color?: string;
}

export function ProgressRings({ percentage, label, color = '#10b981' }: ProgressRingsProps) {
  const clampedPercent = Math.min(100, Math.max(0, percentage));
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clampedPercent / 100) * circumference;

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex flex-col items-center gap-2"
    >
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="8"
          />
          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-white">{Math.round(clampedPercent)}%</span>
        </div>
      </div>
      <span className="text-xs text-gray-400 font-medium uppercase tracking-wider text-center">
        {label}
      </span>
    </motion.div>
  );
}

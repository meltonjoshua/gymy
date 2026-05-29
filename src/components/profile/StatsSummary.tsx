'use client';

import { motion } from 'framer-motion';

interface StatItem {
  label: string;
  value: string | number;
  color?: string;
}

interface StatsSummaryProps {
  stats: StatItem[];
}

export default function StatsSummary({ stats }: StatsSummaryProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="bg-gray-900/60 border border-gray-800/60 rounded-2xl p-4 text-center"
        >
          <p className={`text-2xl font-bold ${stat.color ?? 'text-gray-100'}`}>{stat.value}</p>
          <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
}

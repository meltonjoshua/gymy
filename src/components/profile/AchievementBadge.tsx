'use client';

import { motion } from 'framer-motion';

interface AchievementBadgeProps {
  icon: string;
  label: string;
  earnedAt?: string;
  index?: number;
}

export default function AchievementBadge({
  icon,
  label,
  earnedAt,
  index = 0,
}: AchievementBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05, type: 'spring', stiffness: 300, damping: 20 }}
      className="flex flex-col items-center gap-1.5 p-3"
    >
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-orange-500/20 border border-emerald-500/30 flex items-center justify-center text-2xl shadow-inner">
        {icon}
      </div>
      <p className="text-xs font-medium text-gray-300 text-center leading-tight">{label}</p>
      {earnedAt && (
        <p className="text-[10px] text-gray-600">{new Date(earnedAt).toLocaleDateString()}</p>
      )}
    </motion.div>
  );
}

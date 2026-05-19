'use client';

import { motion } from 'framer-motion';

interface StreakCounterProps {
  streak: number;
}

export function StreakCounter({ streak }: StreakCounterProps) {
  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500/15 to-red-500/10 backdrop-blur-xl border border-white/[0.06] p-5 transition-all duration-300 hover:border-white/[0.12]"
    >
      <div className="absolute inset-0 bg-white/[0.02] backdrop-blur-sm" />
      <div className="relative z-10 flex items-center gap-4">
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="text-4xl"
        >
          🔥
        </motion.div>
        <div>
          <div className="text-3xl font-bold text-white">{streak}</div>
          <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">
            Day{streak !== 1 ? 's' : ''} Streak
          </div>
        </div>
      </div>
      {streak >= 7 && (
        <div className="relative z-10 mt-2 text-xs text-orange-400 font-medium">
          🔥 On fire! Keep it going!
        </div>
      )}
    </motion.div>
  );
}

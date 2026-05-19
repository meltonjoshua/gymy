'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface SetCheckmarkProps {
  completed: boolean;
  onClick?: () => void;
}

export default function SetCheckmark({ completed, onClick }: SetCheckmarkProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-center min-w-[44px] min-h-[44px] rounded-lg border-2 transition-all ${
        completed
          ? 'bg-emerald-500 border-emerald-500 text-white'
          : 'bg-transparent border-gray-600 text-transparent hover:border-emerald-500/50'
      }`}
    >
      {completed && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        >
          <Check className="w-4 h-4" />
        </motion.div>
      )}
    </button>
  );
}

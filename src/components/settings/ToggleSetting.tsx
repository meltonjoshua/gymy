'use client';

import { motion } from 'framer-motion';

interface ToggleSettingProps {
  label: string;
  description?: string;
  enabled: boolean;
  onToggle: (value: boolean) => void;
}

export default function ToggleSetting({
  label,
  description,
  enabled,
  onToggle,
}: ToggleSettingProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3.5">
      <div className="flex-1 mr-3">
        <p className="text-sm font-medium text-gray-200">{label}</p>
        {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
      </div>
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={() => onToggle(!enabled)}
        className={`relative w-12 h-7 rounded-full transition-colors duration-200 ${
          enabled ? 'bg-emerald-500' : 'bg-gray-700'
        }`}
        aria-label={label}
      >
        <motion.div
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md ${
            enabled ? 'left-[22px]' : 'left-0.5'
          }`}
        />
      </motion.button>
    </div>
  );
}

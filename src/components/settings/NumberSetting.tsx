'use client';

import { motion } from 'framer-motion';

interface NumberSettingProps {
  label: string;
  description?: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
}

export default function NumberSetting({
  label,
  description,
  value,
  min,
  max,
  step = 1,
  unit,
  onChange,
}: NumberSettingProps) {
  function decrement() {
    const next = Math.round((value - step) * 100) / 100;
    if (min !== undefined && next < min) return;
    onChange(next);
  }

  function increment() {
    const next = Math.round((value + step) * 100) / 100;
    if (max !== undefined && next > max) return;
    onChange(next);
  }

  return (
    <div className="flex items-center justify-between px-4 py-3.5">
      <div className="flex-1 mr-3">
        <p className="text-sm font-medium text-gray-200">{label}</p>
        {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
      </div>
      <div className="flex items-center gap-2">
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={decrement}
          className="w-8 h-8 rounded-lg bg-gray-800 border border-gray-700 text-gray-400 flex items-center justify-center hover:bg-gray-700 hover:text-gray-200 transition-colors"
          aria-label="Decrease"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </motion.button>
        <div className="w-14 text-center">
          <span className="text-sm font-semibold text-gray-100">{value}</span>
          {unit && <span className="text-xs text-gray-500 ml-0.5">{unit}</span>}
        </div>
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={increment}
          className="w-8 h-8 rounded-lg bg-gray-800 border border-gray-700 text-gray-400 flex items-center justify-center hover:bg-gray-700 hover:text-gray-200 transition-colors"
          aria-label="Increase"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </motion.button>
      </div>
    </div>
  );
}

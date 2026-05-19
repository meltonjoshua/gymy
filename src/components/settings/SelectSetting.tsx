'use client';

import { motion } from 'framer-motion';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectSettingProps {
  label: string;
  description?: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
}

export default function SelectSetting({
  label,
  description,
  value,
  options,
  onChange,
}: SelectSettingProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3.5">
      <div className="flex-1 mr-3">
        <p className="text-sm font-medium text-gray-200">{label}</p>
        {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
      </div>
      <motion.div whileTap={{ scale: 0.97 }}>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-gray-800 border border-gray-700 text-gray-200 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 appearance-none cursor-pointer pr-7"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: 'right 0.25rem center',
            backgroundSize: '1.25em 1.25em',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </motion.div>
    </div>
  );
}

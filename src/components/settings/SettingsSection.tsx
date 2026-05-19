'use client';

import { motion } from 'framer-motion';

interface SettingsSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export default function SettingsSection({ title, description, children }: SettingsSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-6"
    >
      <div className="mb-3">
        <h2 className="text-lg font-semibold text-gray-100">{title}</h2>
        {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
      </div>
      <div className="bg-gray-900/60 border border-gray-800/60 rounded-2xl overflow-hidden divide-y divide-gray-800/40">
        {children}
      </div>
    </motion.section>
  );
}

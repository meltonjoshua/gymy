'use client';

import { useCallback, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '@/hooks/use-settings';
import { useProfile } from '@/hooks/use-profile';
import SettingsSection from '@/components/settings/SettingsSection';
import ToggleSetting from '@/components/settings/ToggleSetting';
import SelectSetting from '@/components/settings/SelectSetting';
import NumberSetting from '@/components/settings/NumberSetting';
import {
  exportAllData,
  downloadJson,
  importData,
  exportWorkoutsCsv,
  downloadCsv,
  type ImportResult,
} from '@/lib/data-export';

const ACCENT_COLORS = [
  { value: 'emerald', label: 'Emerald', color: '#10b981' },
  { value: 'blue', label: 'Blue', color: '#3b82f6' },
  { value: 'purple', label: 'Purple', color: '#8b5cf6' },
  { value: 'orange', label: 'Orange', color: '#f97316' },
  { value: 'pink', label: 'Pink', color: '#ec4899' },
  { value: 'cyan', label: 'Cyan', color: '#06b6d4' },
] as const;

export default function SettingsPage() {
  const { settings, updateSetting, resetSettings, loaded } = useSettings();
  const { resetProfile } = useProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleExport = useCallback(() => {
    const data = exportAllData();
    downloadJson(data);
  }, []);

  const handleExportCsv = useCallback(() => {
    const csv = exportWorkoutsCsv();
    if (csv) {
      downloadCsv(csv);
    }
  }, []);

  const handleImport = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text === 'string') {
        const result = importData(text);
        setImportResult(result);
        if (result.success) {
          setTimeout(() => setImportResult(null), 3000);
        }
      }
    };
    reader.readAsText(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  if (!loaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="page-container">
      <motion.h1
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-gray-100 pt-6 pb-6"
      >
        Settings
      </motion.h1>

      <SettingsSection title="Units" description="Measurement system for weights and distances">
        <SelectSetting
          label="Unit System"
          description="Affects weight and distance display"
          value={settings.unitSystem}
          options={[
            { value: 'metric', label: 'Metric (kg, km)' },
            { value: 'imperial', label: 'Imperial (lbs, mi)' },
          ]}
          onChange={(v) => updateSetting('unitSystem', v as 'metric' | 'imperial')}
        />
      </SettingsSection>

      <SettingsSection title="Timer" description="Rest timer between sets">
        <NumberSetting
          label="Rest Duration"
          description="Default rest period between sets"
          value={settings.defaultRestTimerDuration}
          min={15}
          max={300}
          step={15}
          unit="sec"
          onChange={(v) => updateSetting('defaultRestTimerDuration', v)}
        />
        <ToggleSetting
          label="Auto-Start Rest Timer"
          description="Automatically begin rest timer after completing a set"
          enabled={settings.autoStartRestTimer}
          onToggle={(v) => updateSetting('autoStartRestTimer', v)}
        />
        <ToggleSetting
          label="Sound Effects"
          description="Play sounds when timer ends"
          enabled={settings.soundEffects}
          onToggle={(v) => updateSetting('soundEffects', v)}
        />
      </SettingsSection>

      <SettingsSection title="Workout" description="Default workout preferences">
        <NumberSetting
          label="Weekly Goal"
          description="Target workouts per week"
          value={settings.weeklyWorkoutGoal}
          min={3}
          max={6}
          step={1}
          unit="days"
          onChange={(v) => updateSetting('weeklyWorkoutGoal', v)}
        />
        <SelectSetting
          label="Weight Increment"
          description="Default weight jump when increasing load"
          value={String(settings.defaultWeightIncrement)}
          options={[
            { value: '2.5', label: '2.5 kg / 5 lbs' },
            { value: '5', label: '5 kg / 10 lbs' },
            { value: '10', label: '10 kg / 25 lbs' },
          ]}
          onChange={(v) => updateSetting('defaultWeightIncrement', Number(v) as 2.5 | 5 | 10)}
        />
        <ToggleSetting
          label="Notifications"
          description="Reminders for workout days and goals"
          enabled={settings.notifications}
          onToggle={(v) => updateSetting('notifications', v)}
        />
      </SettingsSection>

      <SettingsSection title="Appearance" description="Customize the look and feel">
        <div className="px-4 py-3.5">
          <p className="text-sm font-medium text-gray-200 mb-0.5">Accent Color</p>
          <p className="text-xs text-gray-500 mb-3">Choose your accent color theme</p>
          <div className="flex gap-3">
            {ACCENT_COLORS.map((color) => (
              <motion.button
                key={color.value}
                whileTap={{ scale: 0.85 }}
                whileHover={{ scale: 1.1 }}
                onClick={() =>
                  updateSetting('accentColor', color.value as typeof settings.accentColor)
                }
                className={`w-9 h-9 rounded-full border-2 transition-all ${
                  settings.accentColor === color.value
                    ? 'border-white scale-110 shadow-lg'
                    : 'border-transparent hover:border-gray-600'
                }`}
                style={{ backgroundColor: color.color }}
                aria-label={color.label}
              />
            ))}
          </div>
        </div>
      </SettingsSection>

      <SettingsSection title="Data" description="Export and import your Gymy data">
        <div className="px-4 py-3.5 space-y-3">
          <div className="flex gap-3">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleExport}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25 transition-colors"
            >
              Export All Data
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleExportCsv}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700 transition-colors"
            >
              Export CSV
            </motion.button>
          </div>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-2.5 rounded-xl text-sm font-medium bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700 transition-colors"
          >
            Import Data
          </motion.button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />

          <AnimatePresence>
            {importResult && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`p-3 rounded-xl text-sm ${
                  importResult.success
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'bg-red-500/15 text-red-400 border border-red-500/30'
                }`}
              >
                {importResult.success
                  ? 'Data imported successfully!'
                  : `Import failed: ${importResult.errors.join(', ')}`}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </SettingsSection>

      <SettingsSection title="Danger Zone" description="Irreversible actions">
        <div className="px-4 py-3.5">
          {!showResetConfirm ? (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowResetConfirm(true)}
              className="w-full py-2.5 rounded-xl text-sm font-medium bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25 transition-colors"
            >
              Reset All Data
            </motion.button>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
              <p className="text-sm text-red-400">
                This will permanently delete all your data. Are you sure?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    resetSettings();
                    resetProfile();
                    setShowResetConfirm(false);
                  }}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-red-500 text-white hover:bg-red-400 transition-colors"
                >
                  Confirm Reset
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </SettingsSection>

      <div className="text-center mt-8 text-xs text-gray-700">
        Gymy v0.1.0 &middot; Made with 💪
      </div>
    </div>
  );
}

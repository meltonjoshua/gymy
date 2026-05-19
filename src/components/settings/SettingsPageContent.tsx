'use client';

import { ToggleSetting, SelectSetting, NumberSetting, SettingsSection } from '@/components/settings/SettingsComponents';
import { useSettings } from '@/hooks/use-settings';
import { UserSettings } from '@/types/settings';

export default function SettingsPage() {
  const { settings, updateSettings } = useSettings();

  return (
    <div className="space-y-6">
      <SettingsSection title="Units">
        <SelectSetting
          label="Unit System"
          description="Choose between metric (kg) and imperial (lbs)"
          value={settings.unitSystem}
          options={[
            { value: 'metric', label: 'Metric (kg)' },
            { value: 'imperial', label: 'Imperial (lbs)' },
          ]}
          onChange={(v) => updateSettings({ unitSystem: v as UserSettings['unitSystem'] })}
        />
      </SettingsSection>

      <SettingsSection title="Timer">
        <NumberSetting
          label="Default Rest Timer"
          description="Rest timer duration in seconds"
          value={settings.defaultRestTimer}
          min={15}
          max={300}
          step={15}
          unit="sec"
          onChange={(v) => updateSettings({ defaultRestTimer: v })}
        />
        <ToggleSetting
          label="Auto-start Rest Timer"
          description="Automatically start rest timer after completing a set"
          value={settings.autoStartRestTimer}
          onChange={(v) => updateSettings({ autoStartRestTimer: v })}
        />
        <ToggleSetting
          label="Sound Effects"
          description="Play beep sound when rest timer completes"
          value={settings.soundEffects}
          onChange={(v) => updateSettings({ soundEffects: v })}
        />
      </SettingsSection>

      <SettingsSection title="Workout">
        <NumberSetting
          label="Weekly Workout Goal"
          description="Number of workouts per week"
          value={settings.weeklyWorkoutGoal}
          min={1}
          max={7}
          step={1}
          unit="days"
          onChange={(v) => updateSettings({ weeklyWorkoutGoal: v })}
        />
        <SelectSetting
          label="Default Weight Increment"
          description="Weight increment for set logger +/- buttons"
          value={String(settings.defaultWeightIncrement)}
          options={[
            { value: '2.5', label: '2.5 kg' },
            { value: '5', label: '5 kg' },
            { value: '10', label: '10 kg' },
          ]}
          onChange={(v) => updateSettings({ defaultWeightIncrement: Number(v) as 2.5 | 5 | 10 })}
        />
      </SettingsSection>

      <SettingsSection title="Appearance">
        <SelectSetting
          label="Accent Color"
          description="Theme accent color"
          value={settings.themeAccentColor}
          options={[
            { value: 'emerald', label: 'Emerald' },
            { value: 'blue', label: 'Blue' },
            { value: 'orange', label: 'Orange' },
            { value: 'purple', label: 'Purple' },
          ]}
          onChange={(v) => updateSettings({ themeAccentColor: v })}
        />
      </SettingsSection>
    </div>
  );
}
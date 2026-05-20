'use client';

import {
  ToggleSetting,
  SelectSetting,
  NumberSetting,
  SettingsSection,
} from '@/components/settings/SettingsComponents';
import { useSettings, AccentColor } from '@/hooks/use-settings';
import { UnitSystem, WeightIncrement } from '@/types/settings';

export default function SettingsPageContent() {
  const { settings, updateSetting } = useSettings();

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
          onChange={(v) => updateSetting('unitSystem', v as UnitSystem)}
        />
      </SettingsSection>

      <SettingsSection title="Timer">
        <NumberSetting
          label="Default Rest Timer"
          description="Rest timer duration in seconds"
          value={settings.defaultRestTimerDuration}
          min={15}
          max={300}
          step={15}
          unit="sec"
          onChange={(v) => updateSetting('defaultRestTimerDuration', v)}
        />
        <ToggleSetting
          label="Auto-start Rest Timer"
          description="Automatically start rest timer after completing a set"
          value={settings.autoStartRestTimer}
          onChange={(v) => updateSetting('autoStartRestTimer', v)}
        />
        <ToggleSetting
          label="Sound Effects"
          description="Play beep sound when rest timer completes"
          value={settings.soundEffects}
          onChange={(v) => updateSetting('soundEffects', v)}
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
          onChange={(v) => updateSetting('weeklyWorkoutGoal', v)}
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
          onChange={(v) => updateSetting('defaultWeightIncrement', Number(v) as WeightIncrement)}
        />
      </SettingsSection>

      <SettingsSection title="Appearance">
        <SelectSetting
          label="Accent Color"
          description="Theme accent color"
          value={settings.accentColor}
          options={[
            { value: 'emerald', label: 'Emerald' },
            { value: 'blue', label: 'Blue' },
            { value: 'orange', label: 'Orange' },
            { value: 'purple', label: 'Purple' },
          ]}
          onChange={(v) => updateSetting('accentColor', v as AccentColor)}
        />
      </SettingsSection>
    </div>
  );
}

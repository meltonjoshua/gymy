export type UnitSystem = 'metric' | 'imperial';
export type WeightIncrement = 2.5 | 5 | 10;

export interface UserSettings {
  unitSystem: UnitSystem;
  defaultRestTimer: number;
  weeklyWorkoutGoal: number;
  defaultWeightIncrement: WeightIncrement;
  soundEffects: boolean;
  autoStartRestTimer: boolean;
  themeAccentColor: string;
  notifications: boolean;
}

export const defaultSettings: UserSettings = {
  unitSystem: 'metric',
  defaultRestTimer: 90,
  weeklyWorkoutGoal: 4,
  defaultWeightIncrement: 2.5,
  soundEffects: true,
  autoStartRestTimer: true,
  themeAccentColor: 'emerald',
  notifications: true,
};
'use client';

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

export function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-3">{title}</h2>
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 divide-y divide-zinc-800">
        {children}
      </div>
    </div>
  );
}

interface ToggleSettingProps {
  label: string;
  description: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

export function ToggleSetting({ label, description, value, onChange }: ToggleSettingProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div>
        <div className="text-sm text-white">{label}</div>
        <div className="text-xs text-zinc-500">{description}</div>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`w-11 h-6 rounded-full transition-colors relative ${value ? 'bg-emerald-500' : 'bg-zinc-700'}`}
      >
        <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${value ? 'translate-x-5.5' : 'translate-x-0.5'}`}
          style={{ transform: value ? 'translateX(22px)' : 'translateX(2px)' }}
        />
      </button>
    </div>
  );
}

interface SelectSettingProps {
  label: string;
  description: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}

export function SelectSetting({ label, description, value, options, onChange }: SelectSettingProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div>
        <div className="text-sm text-white">{label}</div>
        <div className="text-xs text-zinc-500">{description}</div>
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-zinc-800 text-zinc-300 text-sm rounded-lg px-3 py-1.5 border border-zinc-700"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

interface NumberSettingProps {
  label: string;
  description: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (value: number) => void;
}

export function NumberSetting({ label, description, value, min, max, step, unit, onChange }: NumberSettingProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div>
        <div className="text-sm text-white">{label}</div>
        <div className="text-xs text-zinc-500">{description}</div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange(Math.max(min, value - step))}
          className="w-8 h-8 flex items-center justify-center bg-zinc-800 rounded-lg text-zinc-400 hover:bg-zinc-700"
        >
          −
        </button>
        <span className="w-12 text-center text-sm text-white font-medium">{value}{unit ? ` ${unit}` : ''}</span>
        <button
          onClick={() => onChange(Math.min(max, value + step))}
          className="w-8 h-8 flex items-center justify-center bg-zinc-800 rounded-lg text-zinc-400 hover:bg-zinc-700"
        >
          +
        </button>
      </div>
    </div>
  );
}
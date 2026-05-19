'use client';

import { useState } from 'react';
import { ExtendedBodyMeasurement } from '@/types/analytics';

interface BodyStatsFormProps {
  onSubmit: (measurement: Omit<ExtendedBodyMeasurement, 'id'>) => void;
  initialData?: ExtendedBodyMeasurement | null;
}

export default function BodyStatsForm({ onSubmit, initialData }: BodyStatsFormProps) {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [weight, setWeight] = useState(initialData?.weight?.toString() ?? '');
  const [bodyFatPercentage, setBodyFatPercentage] = useState(initialData?.bodyFatPercentage?.toString() ?? '');
  const [arms, setArms] = useState(initialData?.arms?.toString() ?? '');
  const [chest, setChest] = useState(initialData?.chest?.toString() ?? '');
  const [waist, setWaist] = useState(initialData?.waist?.toString() ?? '');
  const [thighs, setThighs] = useState(initialData?.thighs?.toString() ?? '');
  const [showCustom, setShowCustom] = useState(false);
  const [customKey, setCustomKey] = useState('');
  const [customValue, setCustomValue] = useState('');
  const [customMeasurements, setCustomMeasurements] = useState<Record<string, number>>(
    initialData?.custom ?? {}
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const measurement: Omit<ExtendedBodyMeasurement, 'id'> = {
      date,
      weight: parseFloat(weight) || 0,
      bodyFatPercentage: bodyFatPercentage ? parseFloat(bodyFatPercentage) : undefined,
      arms: arms ? parseFloat(arms) : undefined,
      chest: chest ? parseFloat(chest) : undefined,
      waist: waist ? parseFloat(waist) : undefined,
      thighs: thighs ? parseFloat(thighs) : undefined,
      custom: Object.keys(customMeasurements).length > 0 ? customMeasurements : undefined,
    };
    onSubmit(measurement);
    setWeight('');
    setBodyFatPercentage('');
    setArms('');
    setChest('');
    setWaist('');
    setThighs('');
    setCustomMeasurements({});
  };

  const addCustomMeasurement = () => {
    if (!customKey.trim() || !customValue) return;
    setCustomMeasurements((prev) => ({
      ...prev,
      [customKey.trim().toLowerCase()]: parseFloat(customValue) || 0,
    }));
    setCustomKey('');
    setCustomValue('');
  };

  const removeCustomMeasurement = (key: string) => {
    setCustomMeasurements((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs text-gray-400 mb-1.5">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-200 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-gray-400 mb-1.5">Weight (lbs)</label>
          <input
            type="number"
            step="0.1"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="185"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-200 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1.5">Body Fat %</label>
          <input
            type="number"
            step="0.1"
            value={bodyFatPercentage}
            onChange={(e) => setBodyFatPercentage(e.target.value)}
            placeholder="15"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-200 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors"
          />
        </div>
      </div>

      <div>
        <h4 className="text-xs text-gray-500 uppercase tracking-wider mb-2">
          Measurements (inches)
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Arms</label>
            <input
              type="number"
              step="0.1"
              value={arms}
              onChange={(e) => setArms(e.target.value)}
              placeholder="14"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-200 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Chest</label>
            <input
              type="number"
              step="0.1"
              value={chest}
              onChange={(e) => setChest(e.target.value)}
              placeholder="42"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-200 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Waist</label>
            <input
              type="number"
              step="0.1"
              value={waist}
              onChange={(e) => setWaist(e.target.value)}
              placeholder="32"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-200 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Thighs</label>
            <input
              type="number"
              step="0.1"
              value={thighs}
              onChange={(e) => setThighs(e.target.value)}
              placeholder="24"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-200 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors"
            />
          </div>
        </div>
      </div>

      <div>
        <button
          type="button"
          onClick={() => setShowCustom(!showCustom)}
          className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          {showCustom ? 'Hide' : 'Add'} custom measurements
        </button>
        {showCustom && (
          <div className="mt-2 space-y-2">
            {Object.entries(customMeasurements).map(([key, val]) => (
              <div key={key} className="flex items-center gap-2">
                <span className="text-xs text-gray-400 capitalize flex-1">
                  {key}: {val}
                </span>
                <button
                  type="button"
                  onClick={() => removeCustomMeasurement(key)}
                  className="text-red-400 hover:text-red-300 text-xs"
                >
                  Remove
                </button>
              </div>
            ))}
            <div className="flex gap-2">
              <input
                type="text"
                value={customKey}
                onChange={(e) => setCustomKey(e.target.value)}
                placeholder="Measurement name"
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-gray-200 text-xs focus:border-emerald-500 outline-none transition-colors"
              />
              <input
                type="number"
                step="0.1"
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                placeholder="Value"
                className="w-20 bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-gray-200 text-xs focus:border-emerald-500 outline-none transition-colors"
              />
              <button
                type="button"
                onClick={addCustomMeasurement}
                className="text-xs px-2 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        )}
      </div>

      <button
        type="submit"
        className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-lg font-semibold text-sm hover:from-emerald-500 hover:to-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
      >
        Log Measurements
      </button>
    </form>
  );
}
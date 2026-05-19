'use client';

import { useState } from 'react';
import { useBodyStats } from '@/hooks/use-body-stats';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

export default function BodyStatsPage() {
  const { measurements, addMeasurement, getWeightTrend } = useBodyStats();
  const [weight, setWeight] = useState('');
  const [bodyFat, setBodyFat] = useState('');

  const trend = getWeightTrend();

  const handleAdd = () => {
    if (!weight) return;
    addMeasurement({
      date: new Date().toISOString(),
      weight: Number(weight),
      bodyFatPercentage: bodyFat ? Number(bodyFat) : undefined,
    });
    setWeight('');
    setBodyFat('');
  };

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white">Body Stats</h1>

      <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4">
        <h3 className="text-sm font-semibold text-white mb-3">Log Measurement</h3>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Weight (kg)"
            className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50"
          />
          <input
            type="number"
            value={bodyFat}
            onChange={(e) => setBodyFat(e.target.value)}
            placeholder="Body Fat % (optional)"
            className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50"
          />
        </div>
        <button
          onClick={handleAdd}
          disabled={!weight}
          className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
        >
          Save Measurement
        </button>
      </div>

      {trend.dates.length > 1 && (
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4">
          <h3 className="text-sm font-semibold text-white mb-4">Weight Trend</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend.dates.map((d: string, i: number) => ({ date: d, weight: trend.weights[i] }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="date" stroke="#71717a" fontSize={12} />
                <YAxis stroke="#71717a" fontSize={12} />
                <Line type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div>
        <h3 className="text-sm font-semibold text-white mb-3">Recent Measurements</h3>
        <div className="space-y-2">
          {measurements.slice(0, 10).map((m) => (
            <div key={m.id} className="bg-zinc-900 rounded-xl border border-zinc-800 p-3 flex items-center justify-between">
              <div>
                <div className="text-sm text-white">{m.weight} kg</div>
                {m.bodyFatPercentage && <div className="text-xs text-zinc-500">{m.bodyFatPercentage}% body fat</div>}
              </div>
              <div className="text-xs text-zinc-500">{new Date(m.date).toLocaleDateString()}</div>
            </div>
          ))}
          {measurements.length === 0 && (
            <p className="text-center text-zinc-500 text-sm py-4">No measurements yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
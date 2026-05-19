'use client';

import { motion } from 'framer-motion';
import { useBodyStats } from '@/hooks/use-body-stats';
import BodyStatsForm from '@/components/analytics/BodyStatsForm';
import BodyStatsChart from '@/components/analytics/BodyStatsChart';
import { BodyMeasurement } from '@/types/analytics';
import Link from 'next/link';

export default function BodyStatsPage() {
  const { stats, addMeasurement, removeMeasurement, trends, weightChartData, latestMeasurement } =
    useBodyStats();

  const handleSubmit = (measurement: Omit<BodyMeasurement, 'id'>) => {
    addMeasurement(measurement);
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <Link href="/analytics" className="text-gray-500 hover:text-gray-300 transition-colors">
              ← Analytics
            </Link>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-orange-400 bg-clip-text text-transparent">
            Body Stats
          </h1>
          <p className="text-sm text-gray-500 mt-1">Track your body measurements and composition</p>
        </motion.div>

        {latestMeasurement && trends.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="grid grid-cols-2 gap-3 mb-6"
          >
            <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-3">
              <div className="text-xs text-gray-500 mb-1">Weight</div>
              <div className="text-xl font-bold text-emerald-400">
                {latestMeasurement.weight} <span className="text-xs font-normal">lbs</span>
              </div>
              {trends[0]?.change !== null && trends[0]?.change !== undefined && (
                <div
                  className={`text-[11px] mt-1 ${trends[0].change < 0 ? 'text-emerald-400' : 'text-orange-400'}`}
                >
                  {trends[0].change > 0 ? '+' : ''}
                  {trends[0].change} lbs
                </div>
              )}
            </div>
            <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-3">
              <div className="text-xs text-gray-500 mb-1">Body Fat</div>
              <div className="text-xl font-bold text-orange-400">
                {latestMeasurement.bodyFat} <span className="text-xs font-normal">%</span>
              </div>
              {trends[1]?.change !== null && trends[1]?.change !== undefined && (
                <div
                  className={`text-[11px] mt-1 ${trends[1].change < 0 ? 'text-emerald-400' : 'text-orange-400'}`}
                >
                  {trends[1].change > 0 ? '+' : ''}
                  {trends[1].change}%
                </div>
              )}
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-4 mb-4"
        >
          <h3 className="text-sm font-semibold text-gray-200 mb-4">Log Measurements</h3>
          <BodyStatsForm onSubmit={handleSubmit} />
        </motion.div>

        {weightChartData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-4 mb-4"
          >
            <h3 className="text-sm font-semibold text-gray-200 mb-4">
              Weight & Body Fat Over Time
            </h3>
            <BodyStatsChart data={weightChartData} />
          </motion.div>
        )}

        {stats.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-4"
          >
            <h3 className="text-sm font-semibold text-gray-200 mb-4">History</h3>
            <div className="space-y-2">
              {[...stats].reverse().map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between bg-gray-900/50 rounded-lg px-3 py-2.5 border border-gray-700/30"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500">{s.date.slice(0, 10)}</span>
                      <span className="text-sm text-emerald-400 font-semibold">{s.weight} lbs</span>
                      <span className="text-sm text-orange-400 font-semibold">{s.bodyFat}%</span>
                    </div>
                    {(s.arms || s.chest || s.waist || s.thighs) && (
                      <div className="flex gap-2 mt-1">
                        {s.arms && (
                          <span className="text-[10px] text-gray-500">Arms: {s.arms}&quot;</span>
                        )}
                        {s.chest && (
                          <span className="text-[10px] text-gray-500">Chest: {s.chest}&quot;</span>
                        )}
                        {s.waist && (
                          <span className="text-[10px] text-gray-500">Waist: {s.waist}&quot;</span>
                        )}
                        {s.thighs && (
                          <span className="text-[10px] text-gray-500">
                            Thighs: {s.thighs}&quot;
                          </span>
                        )}
                      </div>
                    )}
                    {s.custom && Object.keys(s.custom).length > 0 && (
                      <div className="flex gap-2 mt-1">
                        {Object.entries(s.custom).map(([k, v]) => (
                          <span key={k} className="text-[10px] text-gray-500 capitalize">
                            {k}: {v}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => removeMeasurement(s.id)}
                    className="text-red-400/60 hover:text-red-400 text-xs transition-colors ml-2"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

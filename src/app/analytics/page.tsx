'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAnalytics } from '@/hooks/use-analytics';
import VolumeChart from '@/components/analytics/VolumeChart';
import StrengthChart from '@/components/analytics/StrengthChart';
import FrequencyHeatmap from '@/components/analytics/FrequencyHeatmap';
import BodyPartDistribution from '@/components/analytics/BodyPartDistribution';
import PersonalRecordList from '@/components/analytics/PersonalRecordList';
import { VolumeDataPoint } from '@/types/analytics';
import Link from 'next/link';

type Tab = 'volume' | 'strength' | 'body' | 'frequency';
type VolumePeriod = 'daily' | 'weekly' | 'monthly';

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: 'volume', label: 'Volume', icon: '📊' },
  { key: 'strength', label: 'Strength', icon: '💪' },
  { key: 'body', label: 'Body', icon: '🏃' },
  { key: 'frequency', label: 'Frequency', icon: '🔥' },
];

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('volume');
  const [volumePeriod, setVolumePeriod] = useState<VolumePeriod>('weekly');

  const analytics = useAnalytics();

  const volumeData: VolumeDataPoint[] =
    volumePeriod === 'daily'
      ? analytics.volumeOverTime
      : volumePeriod === 'weekly'
        ? analytics.weeklyVolume
        : analytics.monthlyVolume;

  const hasAnyData = analytics.workouts.length > 0;

  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-orange-400 bg-clip-text text-transparent">
          Analytics
        </h1>
        <p className="text-sm text-gray-500 mt-1">Track your progress and crush your goals</p>
      </motion.div>

      {hasAnyData && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-3 text-center"
          >
            <div className="text-xl font-bold text-emerald-400">{analytics.streak.current}</div>
            <div className="text-[10px] text-gray-500 uppercase tracking-wider">Current Streak</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-3 text-center"
          >
            <div className="text-xl font-bold text-orange-400">{analytics.streak.longest}</div>
            <div className="text-[10px] text-gray-500 uppercase tracking-wider">Longest Streak</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-3 text-center"
          >
            <div className="text-xl font-bold text-purple-400">{analytics.workouts.length}</div>
            <div className="text-[10px] text-gray-500 uppercase tracking-wider">Total Workouts</div>
          </motion.div>
        </div>
      )}

      <div className="flex gap-1 bg-gray-800/40 border border-gray-700/50 rounded-xl p-1 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-emerald-500/20 text-emerald-400 shadow-sm'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <span className="mr-1">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === 'volume' && (
          <div className="space-y-4">
            <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-200">Volume Over Time</h3>
                <div className="flex gap-1 bg-gray-900/50 rounded-lg p-0.5">
                  {(['daily', 'weekly', 'monthly'] as VolumePeriod[]).map((p) => (
                    <button
                      key={p}
                      onClick={() => setVolumePeriod(p)}
                      className={`text-[10px] px-2.5 py-1 rounded-md transition-all capitalize ${
                        volumePeriod === p
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'text-gray-500 hover:text-gray-300'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <VolumeChart data={volumeData} period={volumePeriod} />
            </div>

            <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-200 mb-4">
                Body Part Volume Distribution
              </h3>
              <BodyPartDistribution data={analytics.bodyPartVolume} />
            </div>
          </div>
        )}

        {activeTab === 'strength' && (
          <div className="space-y-4">
            <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-200 mb-4">
                Estimated 1RM Progression
              </h3>
              <StrengthChart data={analytics.strengthProgression} />
            </div>

            <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-200 mb-4">Personal Records</h3>
              <PersonalRecordList records={analytics.personalRecords} />
            </div>
          </div>
        )}

        {activeTab === 'body' && (
          <div className="space-y-4">
            <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-200">Body Stats</h3>
                <Link
                  href="/analytics/body"
                  className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  View detailed tracking →
                </Link>
              </div>
              <p className="text-xs text-gray-500">
                Track your weight, body fat, and measurements over time.
              </p>
            </div>

            <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-200 mb-3">Average Workout Duration</h3>
              {analytics.averageDurationOverTime.length > 0 ? (
                <div className="space-y-2">
                  {analytics.averageDurationOverTime.slice(-5).map((d) => (
                    <div key={d.date} className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">{d.date}</span>
                      <span className="text-gray-300">{d.duration} min</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500">No duration data yet.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'frequency' && (
          <div className="space-y-4">
            <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-200 mb-4">Workout Frequency</h3>
              <FrequencyHeatmap data={analytics.workoutFrequency} />
            </div>

            {analytics.streak.average > 0 && (
              <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-gray-200 mb-3">Streak Analysis</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center">
                    <div className="text-lg font-bold text-emerald-400">
                      {analytics.streak.current}
                    </div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider">
                      Current
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-orange-400">
                      {analytics.streak.longest}
                    </div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider">
                      Longest
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-400">
                      {analytics.streak.average}
                    </div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider">
                      Avg/Week
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}

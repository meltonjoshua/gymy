'use client';

import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { useProfile } from '@/hooks/use-profile';
import ProfileHeader from '@/components/profile/ProfileHeader';
import AchievementBadge from '@/components/profile/AchievementBadge';
import StatsSummary from '@/components/profile/StatsSummary';
import Link from 'next/link';

const DEFAULT_ACHIEVEMENTS = [
  { id: 'first-workout', label: 'First Workout', icon: '🏋️' },
  { id: 'streak-7', label: '7-Day Streak', icon: '🔥' },
  { id: 'streak-30', label: '30-Day Streak', icon: '🔥' },
  { id: 'volume-10k', label: '10k Volume', icon: '💪' },
  { id: 'volume-100k', label: '100k Volume', icon: '🏆' },
  { id: 'workouts-50', label: '50 Workouts', icon: '⭐' },
  { id: 'workouts-100', label: '100 Workouts', icon: '💎' },
  { id: 'pr-5', label: '5 PRs Hit', icon: '📈' },
];

export default function ProfilePage() {
  const { profile, updateProfile, loaded } = useProfile();

  const handleEditName = useCallback(
    (name: string) => {
      updateProfile('displayName', name);
    },
    [updateProfile]
  );

  if (!loaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const formattedVolume =
    profile.totalVolumeLifted >= 1000000
      ? `${(profile.totalVolumeLifted / 1000000).toFixed(1)}M`
      : profile.totalVolumeLifted >= 1000
        ? `${(profile.totalVolumeLifted / 1000).toFixed(1)}k`
        : String(profile.totalVolumeLifted);

  const earnedIds = new Set(profile.achievements.map((a) => a.id));

  return (
    <div className="page-container">
      <div className="flex items-center justify-between pt-6 pb-2">
        <motion.h1
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-100"
        >
          Profile
        </motion.h1>
        <Link
          href="/settings"
          className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
        >
          Settings →
        </Link>
      </div>

      <div className="bg-gray-900/40 border border-gray-800/50 rounded-2xl mt-4">
        <ProfileHeader profile={profile} onEditName={handleEditName} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mt-6"
      >
        <h2 className="text-lg font-semibold text-gray-100 mb-3">Lifetime Stats</h2>
        <StatsSummary
          stats={[
            { label: 'Total Workouts', value: profile.totalWorkouts, color: 'text-emerald-400' },
            {
              label: 'Total Volume',
              value: `${formattedVolume} kg`,
              color: 'text-orange-400',
            },
            {
              label: 'Longest Streak',
              value: `${profile.longestStreak} days`,
              color: 'text-yellow-400',
            },
            {
              label: 'Achievements',
              value: `${profile.achievements.length}/${DEFAULT_ACHIEVEMENTS.length}`,
              color: 'text-purple-400',
            },
          ]}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="mt-6"
      >
        <h2 className="text-lg font-semibold text-gray-100 mb-3">Achievements</h2>
        {profile.achievements.length === 0 ? (
          <div className="bg-gray-900/40 border border-gray-800/50 rounded-2xl p-8 text-center">
            <p className="text-gray-500 text-sm">No achievements yet</p>
            <p className="text-gray-600 text-xs mt-1">Complete workouts to start earning badges!</p>
          </div>
        ) : (
          <div className="bg-gray-900/40 border border-gray-800/50 rounded-2xl p-2">
            <div className="grid grid-cols-4">
              {profile.achievements.map((achievement, i) => (
                <AchievementBadge
                  key={achievement.id}
                  icon={achievement.icon}
                  label={achievement.label}
                  earnedAt={achievement.earnedAt}
                  index={i}
                />
              ))}
            </div>
          </div>
        )}

        {profile.achievements.length < DEFAULT_ACHIEVEMENTS.length && (
          <div className="mt-4">
            <p className="text-xs text-gray-600 mb-2">Locked</p>
            <div className="bg-gray-900/40 border border-gray-800/50 rounded-2xl p-2">
              <div className="grid grid-cols-4">
                {DEFAULT_ACHIEVEMENTS.filter((a) => !earnedIds.has(a.id)).map((a, i) => (
                  <AchievementBadge key={a.id} icon={`🔒`} label={a.label} index={i} />
                ))}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

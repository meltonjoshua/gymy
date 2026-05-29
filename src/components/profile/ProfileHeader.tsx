'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { Profile } from '@/hooks/use-profile';

interface ProfileHeaderProps {
  profile: Profile;
  onEditName: (name: string) => void;
}

export default function ProfileHeader({ profile, onEditName }: ProfileHeaderProps) {
  const initials = profile.displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const daysSinceJoin = useMemo(() => {
    const joinMs = new Date(profile.joinDate).getTime();
    const nowMs = new Date().getTime();
    return Math.max(1, Math.floor((nowMs - joinMs) / (1000 * 60 * 60 * 24)));
  }, [profile.joinDate]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center text-center pt-6 pb-4"
    >
      <div className="relative mb-4">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-orange-500 flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-emerald-500/20">
          {initials}
        </div>
        <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-gray-950 border-2 border-gray-950 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 400 }}
            className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-xs"
          >
            ✓
          </motion.div>
        </div>
      </div>

      <div className="group relative">
        <h1 className="text-2xl font-bold text-gray-100">{profile.displayName}</h1>
        <input
          type="text"
          value={profile.displayName}
          onChange={(e) => onEditName(e.target.value)}
          className="absolute inset-0 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 bg-gray-800 border border-gray-700 rounded-lg px-2 text-center text-lg font-bold text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-opacity"
          aria-label="Edit display name"
        />
      </div>

      <p className="text-sm text-gray-500 mt-1">
        Joined {profile.joinDate} &middot; {daysSinceJoin} days
      </p>

      <div className="flex gap-6 mt-4">
        <div className="text-center">
          <p className="text-xl font-bold text-emerald-400">{profile.totalWorkouts}</p>
          <p className="text-xs text-gray-500">Workouts</p>
        </div>
        <div className="w-px bg-gray-800" />
        <div className="text-center">
          <p className="text-xl font-bold text-orange-400">
            {profile.totalVolumeLifted >= 1000
              ? `${(profile.totalVolumeLifted / 1000).toFixed(1)}k`
              : profile.totalVolumeLifted}
          </p>
          <p className="text-xs text-gray-500">Volume (kg)</p>
        </div>
        <div className="w-px bg-gray-800" />
        <div className="text-center">
          <p className="text-xl font-bold text-yellow-400">{profile.longestStreak}</p>
          <p className="text-xs text-gray-500">Best Streak</p>
        </div>
      </div>
    </motion.div>
  );
}

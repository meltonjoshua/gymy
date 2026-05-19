'use client';

import { useProfile } from '@/hooks/use-profile';
import { useWorkoutHistory } from '@/hooks/use-workout-history';
import { Flame, Dumbbell, Weight } from 'lucide-react';

export default function ProfileHeader() {
  const { profile } = useProfile();
  const { workouts, getCurrentStreak } = useWorkoutHistory();
  const streak = getCurrentStreak();
  const totalWorkouts = workouts.length;
  const totalVolume = workouts.reduce((sum, w) => sum + w.totalVolume, 0);

  return (
    <div className="text-center mb-6">
      <div className="w-20 h-20 mx-auto mb-3 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-3xl font-bold text-white">
        {profile.displayName.charAt(0).toUpperCase()}
      </div>
      <h2 className="text-xl font-bold text-white">{profile.displayName}</h2>
      <p className="text-xs text-zinc-500 mt-1">Member since {new Date(profile.joinDate).toLocaleDateString()}</p>
      <div className="grid grid-cols-3 gap-3 mt-4">
        <div className="bg-zinc-900 rounded-xl p-3 border border-zinc-800">
          <Dumbbell className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
          <div className="text-lg font-bold text-white">{totalWorkouts}</div>
          <div className="text-[10px] text-zinc-500">Workouts</div>
        </div>
        <div className="bg-zinc-900 rounded-xl p-3 border border-zinc-800">
          <Weight className="w-4 h-4 text-orange-400 mx-auto mb-1" />
          <div className="text-lg font-bold text-white">{(totalVolume / 1000).toFixed(1)}k</div>
          <div className="text-[10px] text-zinc-500">Volume (kg)</div>
        </div>
        <div className="bg-zinc-900 rounded-xl p-3 border border-zinc-800">
          <Flame className="w-4 h-4 text-red-400 mx-auto mb-1" />
          <div className="text-lg font-bold text-white">{streak}</div>
          <div className="text-[10px] text-zinc-500">Day Streak</div>
        </div>
      </div>
    </div>
  );
}
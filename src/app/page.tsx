'use client';

import { useWorkoutHistory } from '@/hooks/use-workout-history';
import { StatCard } from '@/components/dashboard/StatCard';
import { StreakCounter } from '@/components/dashboard/StreakCounter';
import { WeeklyChart } from '@/components/dashboard/WeeklyChart';
import { RecentWorkoutList } from '@/components/dashboard/RecentWorkoutList';
import { PersonalRecords } from '@/components/dashboard/PersonalRecords';
import { Dumbbell, Flame, Clock, Weight, Play, Plus } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 5) return 'Good night';
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  if (hour < 21) return 'Good evening';
  return 'Good night';
}

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

export default function Home() {
  const { workouts, getWeeklyStats, getCurrentStreak, getPersonalRecords } = useWorkoutHistory();
  const weeklyStats = getWeeklyStats();
  const currentStreak = getCurrentStreak();
  const personalRecords = getPersonalRecords();

  const volumeTrend: 'up' | 'down' | 'neutral' =
    weeklyStats.totalVolume > weeklyStats.previousVolume
      ? 'up'
      : weeklyStats.totalVolume < weeklyStats.previousVolume
        ? 'down'
        : 'neutral';

  const workoutTrend: 'up' | 'down' | 'neutral' =
    weeklyStats.workoutsCompleted > weeklyStats.previousWorkouts
      ? 'up'
      : weeklyStats.workoutsCompleted < weeklyStats.previousWorkouts
        ? 'down'
        : 'neutral';

  const volumeDiff =
    weeklyStats.previousVolume > 0
      ? `${Math.round(((weeklyStats.totalVolume - weeklyStats.previousVolume) / weeklyStats.previousVolume) * 100)}%`
      : undefined;

  const workoutDiff =
    weeklyStats.previousWorkouts > 0
      ? `${weeklyStats.workoutsCompleted - weeklyStats.previousWorkouts} vs last wk`
      : undefined;

  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weeklyVolumeData = dayNames.map((day) => ({ day, volume: 0 }));
  const now = new Date();
  const weekStart = new Date(now);
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  weekStart.setDate(diff);
  weekStart.setHours(0, 0, 0, 0);
  const weekStartStr = weekStart.toISOString();
  workouts.forEach((w) => {
    if (w.startTime >= weekStartStr) {
      const d = new Date(w.startTime);
      const jsDay = d.getDay();
      const dayIndex = jsDay === 0 ? 6 : jsDay - 1;
      weeklyVolumeData[dayIndex] = {
        ...weeklyVolumeData[dayIndex]!,
        volume: weeklyVolumeData[dayIndex]!.volume + w.totalVolume,
      };
    }
  });

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 pb-8">
      <div className="max-w-lg mx-auto px-4 pt-8">
        <motion.div {...fadeUp} transition={{ duration: 0.4 }} className="mb-8">
          <h1 className="text-3xl font-bold">
            <span className="bg-gradient-to-r from-emerald-400 to-orange-400 bg-clip-text text-transparent">
              {getGreeting()}
            </span>
          </h1>
          <p className="text-gray-400 mt-1 text-sm">Ready to crush it today?</p>
        </motion.div>

        <motion.div
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="flex gap-3 mb-8"
        >
          <Link
            href="/workout/builder"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-semibold text-sm hover:from-emerald-500 hover:to-emerald-400 transition-all active:scale-[0.98] shadow-lg shadow-emerald-500/20"
          >
            <Play className="w-4 h-4" />
            Start Workout
          </Link>
          <Link
            href="/exercises"
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.08] text-gray-300 font-semibold text-sm hover:bg-white/[0.1] transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            Explore
          </Link>
        </motion.div>

        <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.1 }} className="mb-6">
          <StreakCounter streak={currentStreak} />
        </motion.div>

        <motion.div
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="grid grid-cols-3 gap-3 mb-6"
        >
          <StatCard
            icon={<Weight className="w-4 h-4" />}
            value={
              weeklyStats.totalVolume > 0 ? `${(weeklyStats.totalVolume / 1000).toFixed(1)}k` : '0'
            }
            label="Volume (kg)"
            trend={volumeTrend}
            trendValue={volumeDiff}
            gradient="from-emerald-500/10 to-emerald-600/5"
          />
          <StatCard
            icon={<Dumbbell className="w-4 h-4" />}
            value={weeklyStats.workoutsCompleted}
            label="Workouts"
            trend={workoutTrend}
            trendValue={workoutDiff}
            gradient="from-blue-500/10 to-blue-600/5"
          />
          <StatCard
            icon={<Clock className="w-4 h-4" />}
            value={weeklyStats.totalMinutes}
            label="Minutes"
            gradient="from-purple-500/10 to-purple-600/5"
          />
        </motion.div>

        <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.2 }} className="mb-6">
          <WeeklyChart data={weeklyVolumeData} />
        </motion.div>

        <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.3 }} className="mb-6">
          <RecentWorkoutList workouts={workouts} />
        </motion.div>

        <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.35 }}>
          <PersonalRecords records={personalRecords} />
        </motion.div>

        <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.4 }} className="mt-6">
          <Link
            href="/analytics"
            className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-gray-400 text-sm font-medium hover:bg-white/[0.08] hover:text-gray-300 transition-all"
          >
            <Flame className="w-4 h-4" />
            View Full Analytics
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
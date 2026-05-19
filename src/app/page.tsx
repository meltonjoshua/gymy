'use client';

import { useWorkoutHistory } from '@/hooks/use-workout-history';
import { useStats } from '@/hooks/use-stats';
import { StatCard } from '@/components/dashboard/StatCard';
import { StreakCounter } from '@/components/dashboard/StreakCounter';
import { WeeklyChart } from '@/components/dashboard/WeeklyChart';
import { RecentWorkoutList } from '@/components/dashboard/RecentWorkoutList';
import { PersonalRecords } from '@/components/dashboard/PersonalRecords';
import { ProgressRings } from '@/components/dashboard/ProgressRings';
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

function getWorkoutGoalPercentage(): number {
  return 0;
}

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

export default function Home() {
  const { workouts, weeklyStats, currentStreak, personalRecords } = useWorkoutHistory();
  const { weeklyVolumeData } = useStats(workouts);

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

  const goalPct = getWorkoutGoalPercentage();

  return (
    <div className="page-container">
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
        <Link href="/workout/builder" className="btn-primary flex-1">
          <Play className="w-4 h-4" />
          Start Workout
        </Link>
        <Link href="/exercises" className="btn-secondary">
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
        className="grid grid-cols-3 gap-3 mb-6 lg:grid-cols-3"
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

      <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.25 }} className="mb-6">
        <div className="card">
          <h3 className="section-title mb-4">Weekly Goal</h3>
          <div className="flex justify-center">
            <ProgressRings percentage={goalPct} label="Workouts / Week" />
          </div>
        </div>
      </motion.div>

      <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.3 }} className="mb-6">
        <RecentWorkoutList workouts={workouts} />
      </motion.div>

      <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.35 }}>
        <PersonalRecords records={personalRecords} />
      </motion.div>

      <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.4 }} className="mt-6">
        <Link href="/dashboard" className="btn-ghost w-full">
          <Flame className="w-4 h-4" />
          View Full Dashboard
        </Link>
      </motion.div>
    </div>
  );
}

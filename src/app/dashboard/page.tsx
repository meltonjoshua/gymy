'use client';

import { useWorkoutHistory } from '@/hooks/use-workout-history';
import { useStats } from '@/hooks/use-stats';
import { StatCard } from '@/components/dashboard/StatCard';
import { StreakCounter } from '@/components/dashboard/StreakCounter';
import { WeeklyChart } from '@/components/dashboard/WeeklyChart';
import { RecentWorkoutList } from '@/components/dashboard/RecentWorkoutList';
import { PersonalRecords } from '@/components/dashboard/PersonalRecords';
import { ProgressRings } from '@/components/dashboard/ProgressRings';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Dumbbell, Clock, Weight, TrendingUp, Play } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const PIE_COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f97316', '#ef4444', '#06b6d4', '#eab308'];

function CustomPieTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number }>;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl bg-gray-900/95 border border-white/10 px-3 py-2 text-xs shadow-xl">
      <p className="text-gray-300 font-medium">{payload[0]!.name}</p>
      <p className="text-emerald-400 font-semibold">{payload[0]!.value} workouts</p>
    </div>
  );
}

function CustomBarTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: { day: string; workouts: number } }>;
}) {
  if (!active || !payload?.length) return null;
  const d = payload[0]!.payload;
  return (
    <div className="rounded-xl bg-gray-900/95 border border-white/10 px-3 py-2 text-xs shadow-xl">
      <p className="text-gray-400">{d.day}</p>
      <p className="text-emerald-400 font-semibold">
        {d.workouts} workout{d.workouts !== 1 ? 's' : ''}
      </p>
    </div>
  );
}

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const { workouts, weeklyStats, currentStreak, personalRecords } = useWorkoutHistory();
  const { weeklyVolumeData, frequencyData, mostUsedExercises } = useStats(workouts);

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

  const topExercisesPieData = mostUsedExercises.slice(0, 7).map((e) => ({
    name: e.exerciseName,
    value: e.count,
  }));

  const goalPct =
    weeklyStats.workoutsCompleted > 0
      ? Math.min(100, (weeklyStats.workoutsCompleted / 4) * 100)
      : 0;

  return (
    <div className="page-container">
      <motion.div {...fadeUp} transition={{ duration: 0.3 }} className="mb-8">
        <h1 className="text-2xl font-bold">
          <span className="bg-gradient-to-r from-emerald-400 to-orange-400 bg-clip-text text-transparent">
            Dashboard
          </span>
        </h1>
      </motion.div>

      <motion.div
        {...fadeUp}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="flex gap-3 mb-6"
      >
        <Link href="/workout/builder" className="btn-primary flex-1">
          <Play className="w-4 h-4" />
          Start Workout
        </Link>
        <Link href="/workout/templates" className="btn-secondary">
          Templates
        </Link>
      </motion.div>

      <motion.div
        {...fadeUp}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="grid grid-cols-2 gap-3 mb-6 sm:grid-cols-4"
      >
        <StatCard
          icon={<Weight className="w-4 h-4" />}
          value={
            weeklyStats.totalVolume > 0 ? `${(weeklyStats.totalVolume / 1000).toFixed(1)}k` : '0'
          }
          label="Volume (kg)"
          trend={volumeTrend}
          trendValue={volumeDiff}
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
        <StatCard
          icon={<TrendingUp className="w-4 h-4" />}
          value={currentStreak}
          label="Day Streak"
          gradient="from-orange-500/10 to-red-500/5"
        />
      </motion.div>

      <motion.div
        {...fadeUp}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-1 gap-6 mb-6 sm:grid-cols-2"
      >
        <StreakCounter streak={currentStreak} />
        <div className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] p-5">
          <h3 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">
            Weekly Goal
          </h3>
          <div className="flex justify-center">
            <ProgressRings
              percentage={goalPct}
              label={`${weeklyStats.workoutsCompleted}/4 Workouts`}
            />
          </div>
        </div>
      </motion.div>

      <motion.div
        {...fadeUp}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="grid grid-cols-1 gap-6 mb-6 sm:grid-cols-2"
      >
        <WeeklyChart data={weeklyVolumeData} />
        <div className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] p-5">
          <h3 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">
            Workout Frequency
          </h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={frequencyData} barCategoryGap="20%">
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9ca3af', fontSize: 11 }}
                />
                <YAxis hide />
                <Tooltip content={<CustomBarTooltip />} cursor={false} />
                <Bar
                  dataKey="workouts"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={40}
                  fill="rgba(59, 130, 246, 0.6)"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {topExercisesPieData.length > 0 && (
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="grid grid-cols-1 gap-6 mb-6 sm:grid-cols-2"
        >
          <div className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] p-5">
            <h3 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">
              Top Exercises
            </h3>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={topExercisesPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {topExercisesPieData.map((_, index) => (
                      <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]!} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {topExercisesPieData.map((ex, i) => (
                <div key={ex.name} className="flex items-center gap-1 text-xs text-gray-400">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                  />
                  <span className="truncate max-w-20">{ex.name}</span>
                </div>
              ))}
            </div>
          </div>
          <PersonalRecords records={personalRecords} />
        </motion.div>
      )}

      <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.25 }}>
        <RecentWorkoutList workouts={workouts} />
      </motion.div>
    </div>
  );
}

'use client';

import { useWorkoutHistory } from '@/hooks/use-workout-history';
import StatCard from '@/components/dashboard/StatCard';
import WeeklyChart from '@/components/dashboard/WeeklyChart';
import StreakCounter from '@/components/dashboard/StreakCounter';
import RecentWorkoutList from '@/components/dashboard/RecentWorkoutList';
import PersonalRecords from '@/components/dashboard/PersonalRecords';
import { Dumbbell, Flame, Clock, Target } from 'lucide-react';
import Link from 'next/link';

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function HomePage() {
  const { workouts, getWeeklyStats, getCurrentStreak, getPersonalRecords } = useWorkoutHistory();
  const stats = getWeeklyStats();
  const streak = getCurrentStreak();
  const prs = getPersonalRecords();

  const weeklyData = dayNames.map((day) => ({
    day,
    volume: 0,
  }));

  workouts.forEach((w) => {
    const d = new Date(w.startTime);
    const dayIndex = d.getDay();
    const startOfWeek = new Date(d);
    startOfWeek.setDate(d.getDate() - d.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    if (d >= startOfWeek) {
      weeklyData[dayIndex].volume += w.totalVolume;
    }
  });

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  })();

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">{greeting} 💪</h1>
        <p className="text-zinc-500 text-sm mt-1">Ready to crush it today?</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Link href="/workout/builder" className="flex items-center justify-center gap-2 p-4 bg-emerald-500 hover:bg-emerald-600 rounded-xl text-white font-medium transition-colors">
          <Dumbbell className="w-5 h-5" />
          Start Workout
        </Link>
        <Link href="/templates" className="flex items-center justify-center gap-2 p-4 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-white font-medium transition-colors border border-zinc-700">
          <Target className="w-5 h-5" />
          Templates
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon={<Flame className="w-4 h-4" />}
          value={stats.totalVolume > 0 ? `${(stats.totalVolume / 1000).toFixed(1)}k` : '0'}
          label="Weekly Volume (kg)"
          trend={stats.workoutsCompleted > 0 ? 'up' : undefined}
          trendValue={stats.workoutsCompleted > 0 ? `${stats.workoutsCompleted} workouts` : undefined}
        />
        <StatCard
          icon={<Clock className="w-4 h-4" />}
          value={stats.totalTimeMinutes > 0 ? `${stats.totalTimeMinutes}m` : '0'}
          label="Time This Week"
        />
      </div>

      <StreakCounter days={streak} />

      <WeeklyChart data={weeklyData} />

      <RecentWorkoutList workouts={workouts} />

      <PersonalRecords records={prs} />

      <Link href="/analytics" className="block text-center py-3 text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
        View Full Analytics →
      </Link>
    </div>
  );
}
'use client';

import { useWorkoutHistory } from '@/hooks/use-workout-history';
import VolumeChart from '@/components/analytics/VolumeChart';
import BodyPartDistribution from '@/components/analytics/BodyPartDistribution';
import PersonalRecords from '@/components/dashboard/PersonalRecords';
import { exercises } from '@/data/exercises';

export default function AnalyticsPage() {
  const { workouts, getPersonalRecords } = useWorkoutHistory();
  const prs = getPersonalRecords();

  const volumeData = workouts.slice(0, 30).reverse().map((w) => ({
    date: new Date(w.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    volume: Math.round(w.totalVolume / 10) / 100,
  }));

  const bodyPartData = (() => {
    const volumeByCategory = new Map<string, number>();
    workouts.forEach((w) => {
      w.exercises.forEach((we) => {
        const ex = exercises.find((e) => e.id === we.exerciseId);
        if (ex) {
          we.sets.filter((s) => s.completed).forEach((s) => {
            const current = volumeByCategory.get(ex.category) || 0;
            volumeByCategory.set(ex.category, current + s.weight * s.reps);
          });
        }
      });
    });
    return Array.from(volumeByCategory.entries())
      .map(([name, value]) => ({ name, value: Math.round(value) }))
      .sort((a, b) => b.value - a.value);
  })();

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white">Analytics</h1>

      {workouts.length === 0 ? (
        <div className="text-center py-12 text-zinc-500">
          <p>Complete some workouts to see your analytics</p>
        </div>
      ) : (
        <>
          <VolumeChart data={volumeData} />
          <BodyPartDistribution data={bodyPartData} />
          <PersonalRecords records={prs} />
        </>
      )}
    </div>
  );
}
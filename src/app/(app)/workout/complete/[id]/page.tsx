'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import WorkoutComplete from '@/components/workout/WorkoutComplete';
import { CompletedWorkout } from '@/types/workout';

export default function WorkoutCompletePage() {
  const router = useRouter();
  const [completed] = useState<CompletedWorkout | null>(() => {
    if (typeof window === 'undefined') return null;
    const stored = sessionStorage.getItem('gymy_completed_workout');
    if (stored) {
      return JSON.parse(stored) as CompletedWorkout;
    }
    return null;
  });

  if (!completed) {
    return (
      <div className="px-4 py-12 text-center text-zinc-500">
        <p>No completed workout data</p>
      </div>
    );
  }

  return (
    <WorkoutComplete
      name={completed.name}
      durationSeconds={completed.durationMinutes * 60}
      totalVolume={completed.totalVolume}
      exercisesCompleted={completed.exercises.length}
      personalRecords={completed.exercises.map((e) => ({
        exerciseName: e.exerciseName,
        estimated1RM: e.sets.reduce((max, s) => Math.max(max, s.weight), 0),
      }))}
      onDone={() => router.push('/')}
    />
  );
}

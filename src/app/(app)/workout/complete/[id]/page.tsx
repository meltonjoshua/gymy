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
      return JSON.parse(stored);
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
      durationSeconds={completed.durationSeconds}
      totalVolume={completed.totalVolume}
      exercisesCompleted={completed.exercises.length}
      personalRecords={completed.personalRecords}
      onDone={() => router.push('/')}
    />
  );
}
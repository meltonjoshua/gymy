'use client';

import { useState } from 'react';
import { Workout } from '@/types/workout';
import ActiveWorkout from '@/components/workout/ActiveWorkout';
import Link from 'next/link';

export default function ActiveWorkoutPage() {
  const [workout] = useState<Workout | null>(() => {
    if (typeof window === 'undefined') return null;
    const stored = sessionStorage.getItem('gymy_active_workout');
    if (stored) {
      return JSON.parse(stored);
    }
    return null;
  });

  if (!workout) {
    return (
      <div className="px-4 py-12 text-center text-zinc-500">
        <p>No active workout</p>
        <Link href="/workout/builder" className="text-emerald-400 hover:underline mt-2 inline-block">
          Create a workout
        </Link>
      </div>
    );
  }

  return <ActiveWorkout workout={workout} />;
}
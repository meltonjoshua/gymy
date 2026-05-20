import { Program, ProgramDay } from '@/types/template';

function restDay(day: number): ProgramDay {
  return { day, label: 'Rest', templateId: '', isRest: true };
}

function workoutDay(day: number, label: string, templateId: string): ProgramDay {
  return { day, label, templateId, isRest: false };
}

export const programs: Program[] = [
  {
    id: 'prog-zero-to-hero',
    name: 'Zero to Hero',
    description: 'The perfect starter program. Build a foundation of strength and fitness in 8 weeks with 3 sessions per week. Every rep counts — start where you are, progress far beyond where you thought possible.',
    difficulty: 'beginner',
    weeks: 8,
    daysPerWeek: 3,
    schedule: [
      [workoutDay(1, 'Full Body', 'tpl-full-body-basics'), restDay(2), workoutDay(3, 'Upper Body', 'tpl-upper-starter'), restDay(4), workoutDay(5, 'Lower Body + Core', 'tpl-lower-starter'), restDay(6), restDay(7)],
    ],
  },
  {
    id: 'prog-lean-strong',
    name: 'Lean & Strong',
    description: 'Build lean muscle and functional strength with a balanced push/pull/legs approach. Six weeks to a more powerful, confident you.',
    difficulty: 'intermediate',
    weeks: 6,
    daysPerWeek: 4,
    schedule: [
      [workoutDay(1, 'Push', 'tpl-push-day'), workoutDay(2, 'Pull', 'tpl-pull-day'), restDay(3), workoutDay(4, 'Legs', 'tpl-leg-day'), restDay(5), workoutDay(6, 'Upper/Lower', 'tpl-upper-lower'), restDay(7)],
    ],
  },
  {
    id: 'prog-powerlifting-prep',
    name: 'Powerlifting Prep',
    description: '12-week peaking program designed to maximize your squat, bench, and deadlift. Built for those who refuse to settle — this is where legends are forged.',
    difficulty: 'advanced',
    weeks: 12,
    daysPerWeek: 4,
    schedule: [
      [workoutDay(1, 'Squat Day', 'tpl-powerlifting-squat'), restDay(2), workoutDay(3, 'Bench Day', 'tpl-powerlifting-bench'), workoutDay(4, 'Deadlift Day', 'tpl-powerlifting-deadlift'), restDay(5), workoutDay(6, 'Full Strength', 'tpl-5x5-strength'), restDay(7)],
    ],
  },
  {
    id: 'prog-athletic-performance',
    name: 'Athletic Performance',
    description: 'Build explosive power and athletic conditioning for any sport. Strength, speed, and endurance — engineered for champions who want it all.',
    difficulty: 'intermediate',
    weeks: 8,
    daysPerWeek: 5,
    schedule: [
      [workoutDay(1, 'Push Strength', 'tpl-push-day'), workoutDay(2, 'Leg Strength', 'tpl-leg-day'), restDay(3), workoutDay(4, 'HIIT Circuit', 'tpl-hiit-circuit'), workoutDay(5, 'Full Body', 'tpl-full-body-basics'), restDay(6), workoutDay(7, 'Arms + Core', 'tpl-arms-day')],
    ],
  },
  {
    id: 'prog-shred-mode',
    name: 'Shred Mode',
    description: '4-week high-intensity program to burn fat and maintain muscle. Not for the faint of heart — this is where comfort zones go to die and new physiques are born.',
    difficulty: 'intermediate',
    weeks: 4,
    daysPerWeek: 5,
    schedule: [
      [workoutDay(1, 'Upper Strength', 'tpl-push-day'), workoutDay(2, 'Lower Strength', 'tpl-leg-day'), workoutDay(3, 'HIIT Burn', 'tpl-hiit-circuit'), workoutDay(4, 'Pull Power', 'tpl-pull-day'), workoutDay(5, 'Full Body Blaze', 'tpl-full-body-basics'), restDay(6), restDay(7)],
    ],
  },
];
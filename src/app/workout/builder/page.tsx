import Link from 'next/link';
import WorkoutBuilder from '@/components/workout/WorkoutBuilder';

export default function WorkoutBuilderPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <header className="sticky top-0 z-10 bg-gray-950/80 backdrop-blur-md border-b border-gray-800/50 px-4 py-4">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <Link href="/" className="text-gray-500 hover:text-gray-300 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>
          <div>
            <h1 className="text-lg font-bold text-gray-100">Workout Builder</h1>
            <p className="text-xs text-gray-500">Create your custom workout</p>
          </div>
        </div>
      </header>
      <main className="pt-4">
        <WorkoutBuilder />
      </main>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { Settings } from 'lucide-react';

export default function TopBar() {
  return (
    <header className="sticky top-0 z-40 bg-zinc-900/95 backdrop-blur-sm border-b border-zinc-800">
      <div className="flex items-center justify-between px-4 h-14">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">G</span>
          </div>
          <span className="text-lg font-bold text-white">Gymy</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/workout/builder"
            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Start Workout
          </Link>
          <Link
            href="/settings"
            className="p-2 text-zinc-400 hover:text-white transition-colors"
          >
            <Settings className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
'use client';

import Link from 'next/link';
import { Plus, Settings } from 'lucide-react';

export default function TopBar() {
  return (
    <header className="sticky top-0 z-40 bg-gray-950/90 backdrop-blur-xl border-b border-white/[0.06]">
      <div className="max-w-3xl mx-auto flex items-center justify-between h-14 px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-black tracking-tight">
            <span className="bg-gradient-to-r from-emerald-400 to-orange-400 bg-clip-text text-transparent">
              Gymy
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/workout/builder"
            className="flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/25 transition-colors min-w-[44px] min-h-[44px] md:w-auto md:h-auto md:px-3 md:py-2 md:gap-1.5 md:text-sm md:font-medium"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden md:inline">Workout</span>
          </Link>
          <Link
            href="/settings"
            className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/[0.04] text-gray-400 border border-white/[0.06] hover:bg-white/[0.08] hover:text-gray-300 transition-colors min-w-[44px] min-h-[44px]"
          >
            <Settings className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}

'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 p-6 text-center">
      <div className="text-6xl mb-4">🏋️</div>
      <h1 className="text-4xl font-bold text-white mb-2">404</h1>
      <p className="text-zinc-400 mb-6">This page must have skipped leg day.</p>
      <Link
        href="/"
        className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-colors"
      >
        Go Home
      </Link>
    </div>
  );
}
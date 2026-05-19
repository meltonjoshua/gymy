'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="page-container flex flex-col items-center justify-center min-h-[60vh] text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="text-8xl font-black bg-gradient-to-r from-emerald-400 to-orange-400 bg-clip-text text-transparent mb-4">
          404
        </div>
        <h2 className="text-xl font-bold text-gray-100 mb-2">Page not found</h2>
        <p className="text-gray-500 text-sm mb-8 max-w-sm">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/" className="btn-primary">
            Go Home
          </Link>
          <Link href="/exercises" className="btn-secondary">
            Browse Exercises
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

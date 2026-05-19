'use client';

import { useCallback } from 'react';

export function useConfetti() {
  const fire = useCallback(async () => {
    try {
      const canvasConfetti = await import('canvas-confetti');
      const confetti = canvasConfetti.default;
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#10b981', '#f97316', '#3b82f6', '#8b5cf6', '#fbbf24'],
      });
    } catch {
      // canvas-confetti not available, skip confetti
    }
  }, []);

  return { fire };
}

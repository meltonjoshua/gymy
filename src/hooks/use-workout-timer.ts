'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

export function useWorkoutTimer(defaultRestSeconds: number = 90, soundEnabled: boolean = true) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [restSeconds, setRestSeconds] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const elapsedInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const restInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const playBeep = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      gain.gain.value = 0.3;
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
      setTimeout(() => {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.frequency.value = 1100;
        gain2.gain.value = 0.3;
        osc2.start();
        osc2.stop(ctx.currentTime + 0.2);
      }, 200);
    } catch {}
  }, [soundEnabled]);

  const startWorkout = useCallback(() => {
    setIsRunning(true);
    setElapsedSeconds(0);
    setIsPaused(false);
  }, []);

  const startRest = useCallback((seconds?: number) => {
    const rest = seconds ?? defaultRestSeconds;
    setRestSeconds(rest);
    setIsResting(true);
  }, [defaultRestSeconds]);

  const skipRest = useCallback(() => {
    setIsResting(false);
    setRestSeconds(0);
  }, []);

  const pause = useCallback(() => {
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    setIsPaused(false);
  }, []);

  const stopWorkout = useCallback(() => {
    setIsRunning(false);
    setIsResting(false);
    setIsPaused(false);
    setRestSeconds(0);
  }, []);

  useEffect(() => {
    if (isRunning && !isPaused) {
      elapsedInterval.current = setInterval(() => {
        setElapsedSeconds((s) => s + 1);
      }, 1000);
    }
    return () => {
      if (elapsedInterval.current) clearInterval(elapsedInterval.current);
    };
  }, [isRunning, isPaused]);

  useEffect(() => {
    if (isResting && !isPaused && restSeconds > 0) {
      restInterval.current = setInterval(() => {
        setRestSeconds((s) => {
          if (s <= 1) {
            setIsResting(false);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => {
      if (restInterval.current) clearInterval(restInterval.current);
    };
  }, [isResting, isPaused, restSeconds]);

  useEffect(() => {
    if (restSeconds === 0 && isResting) {
      playBeep();
    }
  }, [restSeconds, isResting, playBeep]);

  return {
    elapsedSeconds,
    restSeconds,
    isResting,
    isPaused,
    isRunning,
    startWorkout,
    startRest,
    skipRest,
    pause,
    resume,
    stopWorkout,
  };
}
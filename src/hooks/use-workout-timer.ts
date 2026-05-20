'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

export function useWorkoutTimer(defaultRestSeconds: number = 90, soundEnabled: boolean = true) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [restSeconds, setRestSeconds] = useState(0);
  const [restTotalSeconds, setRestTotalSeconds] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [restComplete, setRestComplete] = useState(false);
  const elapsedInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const restInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
      audioCtxRef.current = new AudioContext();
    }
    return audioCtxRef.current;
  }, []);

  const playBeep = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') ctx.resume();

      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.frequency.value = 880;
      gain1.gain.value = 0.3;
      osc1.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 0.15);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.frequency.value = 1100;
      gain2.gain.value = 0.3;
      osc2.start(ctx.currentTime + 0.2);
      osc2.stop(ctx.currentTime + 0.4);
    } catch {}
  }, [soundEnabled, getAudioContext]);

  const vibrate = useCallback(() => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([200, 100, 200]);
    }
  }, []);

  const startWorkout = useCallback(() => {
    setIsRunning(true);
    setElapsedSeconds(0);
    setIsPaused(false);
  }, []);

  const startRest = useCallback((seconds?: number) => {
    const rest = seconds ?? defaultRestSeconds;
    setRestSeconds(rest);
    setRestTotalSeconds(rest);
    setIsResting(true);
    setRestComplete(false);
  }, [defaultRestSeconds]);

  const skipRest = useCallback(() => {
    setIsResting(false);
    setRestSeconds(0);
    setRestTotalSeconds(0);
    setRestComplete(true);
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
    setRestTotalSeconds(0);
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

  const isRestingAndNotPaused = isResting && !isPaused;

  useEffect(() => {
    if (isRestingAndNotPaused) {
      restInterval.current = setInterval(() => {
        setRestSeconds((s) => {
          if (s <= 1) {
            setIsResting(false);
            setRestComplete(true);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => {
      if (restInterval.current) clearInterval(restInterval.current);
    };
  }, [isRestingAndNotPaused]);

  useEffect(() => {
    if (restComplete) {
      playBeep();
      vibrate();
    }
  }, [restComplete, playBeep, vibrate]);

  const clearRestComplete = useCallback(() => {
    setRestComplete(false);
  }, []);

  return {
    elapsedSeconds,
    restSeconds,
    restTotalSeconds,
    isResting,
    isPaused,
    isRunning,
    restComplete,
    startWorkout,
    startRest,
    skipRest,
    pause,
    resume,
    stopWorkout,
    clearRestComplete,
  };
}
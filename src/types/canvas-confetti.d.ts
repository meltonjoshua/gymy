declare module 'canvas-confetti' {
  interface Options {
    particleCount?: number;
    spread?: number;
    origin?: { x?: number; y?: number };
    colors?: string[];
  }

  interface Confetti {
    (options?: Options): Promise<null>;
  }

  const confetti: Confetti;
  export default confetti;
}

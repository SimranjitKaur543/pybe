// Tweening primitives. Everything that moves goes through `tween`, so every
// motion is interruptible, awaitable, and honours reduced-motion in one place.

export const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── run generations ────────────────────────────────────────────────────────
// Scenes are long async functions. Starting a new run while an old one is still
// awaiting would leave TWO directors driving the same camera and actors, each
// overwriting the other. Bumping the generation makes every in-flight wait and
// tween stop and never resolve, so the old scene is suspended for good.
let generation = 0;
export const currentGeneration = () => generation;
export function newRun() {
  generation += 1;
  return generation;
}

export const ease = {
  linear: (t) => t,
  inOut: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  out: (t) => 1 - Math.pow(1 - t, 3),
  in: (t) => t * t * t,
  // A gentle overshoot, for things that should feel alive rather than mechanical.
  back: (t) => 1 + 2.2 * Math.pow(t - 1, 3) + 1.2 * Math.pow(t - 1, 2)
};

/** Resolves after `ms`, unless a newer run has started — then it never does. */
export function wait(ms) {
  const mine = generation;
  return new Promise((resolve) => {
    const id = setTimeout(() => {
      if (mine === generation) resolve();
    }, REDUCED ? 0 : ms);
    if (mine !== generation) clearTimeout(id);
  });
}

/**
 * Drives `onUpdate(value 0..1)` across `duration`, resolving when done.
 * Returns a promise with a `.cancel()` so a scene can be skipped mid-motion.
 */
export function tween({ duration = 600, easing = ease.inOut, onUpdate, onDone } = {}) {
  let raf = null;
  let cancelled = false;

  const mine = generation;
  const promise = new Promise((resolve) => {
    if (REDUCED || duration <= 0) {
      onUpdate?.(1);
      onDone?.();
      resolve();
      return;
    }
    const start = performance.now();
    const step = (now) => {
      if (cancelled) return resolve();
      // a newer run has taken over: stop, and never resolve
      if (mine !== generation) return;
      const t = Math.min(1, (now - start) / duration);
      onUpdate?.(easing(t));
      if (t < 1) raf = requestAnimationFrame(step);
      else {
        onDone?.();
        resolve();
      }
    };
    raf = requestAnimationFrame(step);
  });

  promise.cancel = () => {
    cancelled = true;
    if (raf) cancelAnimationFrame(raf);
  };
  return promise;
}

/** Interpolate between two numbers. */
export const lerp = (a, b, t) => a + (b - a) * t;

/** Run several awaitables at once — the basis of "she walks WHILE the camera pans". */
export const parallel = (...jobs) => Promise.all(jobs.map((j) => (typeof j === 'function' ? j() : j)));

/** Run awaitables one after another. */
export async function sequence(...jobs) {
  for (const job of jobs) await (typeof job === 'function' ? job() : job);
}

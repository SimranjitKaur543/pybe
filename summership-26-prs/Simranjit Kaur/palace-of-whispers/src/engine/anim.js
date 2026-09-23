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

// Anything waiting on the LEARNER rather than on time — a choice, a
// prediction — has DOM listeners that a generation bump alone cannot reach.
// A halted scene simply never resumes, so its buttons would sit on screen
// wired to a promise nobody is awaiting. Handlers register here and are torn
// down the moment a new run starts.
const pending = new Set();
export function onRunCancel(fn) {
  pending.add(fn);
  return () => pending.delete(fn);
}

export function newRun() {
  generation += 1;
  for (const cancel of pending) {
    try { cancel(); } catch { /* a torn-down handler must not block the reset */ }
  }
  pending.clear();
  return generation;
}


// ── the story clock ────────────────────────────────────────────────────────
// Everything that measures time reads this, never performance.now() directly.
// Pausing simply stops the clock: tweens freeze mid-motion and the holds
// between beats stop counting down, so the story resumes exactly where it
// stopped instead of jumping forward by however long the viewer was away.
//
// It also fixes a desync that existed before there was a pause button at all.
// Holds used to be setTimeout and motion used to be requestAnimationFrame. A
// browser pauses rAF in a hidden tab but keeps firing timers, so switching
// tabs mid-story left the holds racing ahead of frozen animation. Both now run
// off the same clock and the same rAF loop, so they cannot drift apart.
let paused = false;
let pausedAt = 0;
let lostTime = 0;

const clock = () => (paused ? pausedAt : performance.now()) - lostTime;

export const isPaused = () => paused;

// dev-only window into the clock, so pause behaviour can be measured
export const clockDebug = () => ({ paused, pausedAt, lostTime, now: clock() });

export function pause() {
  if (paused) return;
  pausedAt = performance.now();
  paused = true;
}

export function resume() {
  if (!paused) return;
  lostTime += performance.now() - pausedAt;
  paused = false;
}

export function togglePause() {
  paused ? resume() : pause();
  return paused;
}

export const ease = {
  linear: (t) => t,
  inOut: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  out: (t) => 1 - Math.pow(1 - t, 3),
  in: (t) => t * t * t,
  // A gentle overshoot, for things that should feel alive rather than mechanical.
  back: (t) => 1 + 2.2 * Math.pow(t - 1, 3) + 1.2 * Math.pow(t - 1, 2)
};

/**
 * Resolves after `ms` of STORY time, unless a newer run has started — then it
 * never does. Driven by the story clock rather than setTimeout, so a hold
 * pauses with everything else.
 */
export function wait(ms) {
  const mine = generation;
  if (REDUCED) return Promise.resolve();
  return new Promise((resolve) => {
    const end = clock() + ms;
    const step = () => {
      if (mine !== generation) return;      // superseded: never resolve
      if (clock() >= end) return resolve();
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
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
    const start = clock();
    const step = () => {
      if (cancelled) return resolve();
      // a newer run has taken over: stop, and never resolve
      if (mine !== generation) return;
      const t = Math.min(1, (clock() - start) / duration);
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

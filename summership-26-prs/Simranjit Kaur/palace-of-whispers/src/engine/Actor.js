// An Actor wraps a drawn character so a scene can direct it like a performer:
//   await tara.walkTo(1840);
//   tara.face('left'); tara.express('surprised');
//
// Position and facing live on the OUTER group (driven by JS), while the walk
// cycle, breathing and blinking live on INNER elements (driven by CSS). They
// compose without fighting, which is what lets her walk and react at once.

import { tween, ease, wait } from './anim.js';

export class Actor {
  /**
   * @param {SVGGElement} el   outer <g> for this character
   * @param {object} opts      { x, y, facing, scale }
   */
  constructor(el, { x = 0, y = 0, facing = 'right', scale = 1 } = {}) {
    // `el` is the positioning wrapper; `figure` is the drawn character inside
    // it. Poses and moods MUST go on the figure — it ships with its own
    // `pose-idle` class, so classes put on the wrapper are simply outvoted.
    this.el = el;
    this.figure = el.firstElementChild || el;
    this.x = x;
    this.y = y;
    this.facing = facing;
    this.scale = scale;
    this.pose = 'idle';
    this.apply();
  }

  apply() {
    const flip = this.facing === 'left' ? -1 : 1;
    this.el.setAttribute(
      'transform',
      `translate(${this.x} ${this.y}) scale(${flip * this.scale} ${this.scale})`
    );
  }

  at(x, y) {
    this.x = x;
    if (y !== undefined) this.y = y;
    this.apply();
    return this;
  }

  /** Swap the pose class; CSS owns what each pose looks like and animates. */
  setPose(pose) {
    this.figure.classList.remove(`pose-${this.pose}`);
    this.pose = pose;
    this.figure.classList.add(`pose-${pose}`);
    return this;
  }

  /** Eyebrows and mouth carry the emotion; the class drives both. */
  express(mood) {
    this.figure.dataset.mood = mood;
    return this;
  }

  /** Turn on the spot — a beat of anticipation, not an instant flip. */
  async face(dir, { duration = 260 } = {}) {
    if (this.facing === dir) return;
    const flip = dir === 'left' ? -1 : 1;
    // Squash horizontally through zero so the turn reads as a turn.
    await tween({
      duration: duration / 2,
      easing: ease.in,
      onUpdate: (t) => {
        const s = (1 - t) * this.scale;
        this.el.setAttribute(
          'transform',
          `translate(${this.x} ${this.y}) scale(${(this.facing === 'left' ? -1 : 1) * s} ${this.scale})`
        );
      }
    });
    this.facing = dir;
    await tween({
      duration: duration / 2,
      easing: ease.out,
      onUpdate: (t) => {
        const s = t * this.scale;
        this.el.setAttribute(
          'transform',
          `translate(${this.x} ${this.y}) scale(${flip * s} ${this.scale})`
        );
      }
    });
    this.apply();
  }

  /**
   * Walk to a world x. Turns first if needed, runs the walk cycle while moving,
   * and settles back to idle. Speed is world-units per second so long walks
   * take proportionally longer — pacing stays believable.
   */
  async walkTo(x, { speed = 300, pose = 'walk' } = {}) {
    const dir = x < this.x ? 'left' : 'right';
    await this.face(dir);
    const from = this.x;
    const distance = Math.abs(x - from);
    if (distance < 1) return;
    const duration = (distance / speed) * 1000;
    this.setPose(pose);
    await tween({
      duration,
      easing: ease.inOut,
      onUpdate: (t) => {
        this.x = from + (x - from) * t;
        this.apply();
      }
    });
    this.setPose('idle');
  }

  /** A small held beat — used constantly so nothing snaps between actions. */
  beat(ms = 500) {
    return wait(ms);
  }
}

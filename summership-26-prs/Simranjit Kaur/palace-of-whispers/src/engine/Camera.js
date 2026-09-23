// The camera.
//
// This is the single most important piece for not-being-a-slideshow. There is
// ONE continuous world laid out in world coordinates — room, courtyard, palace,
// kingdom all exist at the same time, side by side. We never swap scenes; we
// move this camera through a world that is always there.

import { tween, ease, lerp, currentGeneration } from './anim.js';

export class Camera {
  /**
   * @param {SVGGElement} worldEl the <g> wrapping the entire world
   * @param {{width:number,height:number}} view the SVG viewBox size
   */
  constructor(worldEl, view) {
    this.el = worldEl;
    this.view = view;
    this.state = { x: view.width / 2, y: view.height / 2, zoom: 1 };
    this.following = null;
    this.shakeAmount = 0;
    this.shakePhase = 0;
    this.shakeAngle = 0;
    this.apply();
    this.tick = this.tick.bind(this);
    requestAnimationFrame(this.tick);
  }

  /** world point (x,y) that should sit at the centre of the frame */
  apply() {
    const { x, y, zoom } = this.state;
    const cx = this.view.width / 2;
    const cy = this.view.height / 2;
    // A DAMPED OSCILLATION, not noise. Picking a fresh random offset every
    // frame is a buzz — sixty unrelated positions a second reads as the image
    // vibrating, which is what it looked like after the error. A real impact
    // has a direction and rings down: one axis, chosen when the shake starts,
    // swung back and forth a few times while the amplitude decays.
    const osc = this.shakeAmount ? Math.sin(this.shakePhase) * this.shakeAmount : 0;
    const sx = osc * Math.cos(this.shakeAngle);
    const sy = osc * Math.sin(this.shakeAngle) * 0.6;   // less vertical: it reads calmer
    this.el.setAttribute(
      'transform',
      `translate(${cx + sx} ${cy + sy}) scale(${zoom}) translate(${-x} ${-y})`
    );
  }

  /** Per-frame follow + shake decay. Runs forever; costs nothing when idle. */
  tick() {
    // A follow belongs to the run that started it. Without this, a scene halted
    // mid-follow leaves the camera welded to an actor, and every later
    // camera.to() is silently dragged back — the move plays, then snaps home.
    if (this.following && this.following.gen !== currentGeneration()) {
      this.following = null;
    }

    if (this.following) {
      const { actor, offsetX = 0, offsetY = 0, lag = 0.08, map } = this.following;
      // `map` converts a target's own space into world space — needed for
      // anyone inside the room portal, whose coordinates are room-space.
      const p = map ? map(actor.x, actor.y) : { x: actor.x, y: actor.y };
      const target = p.x + offsetX;
      const targetY = p.y + offsetY;
      // Lag makes the camera feel like it is chasing, not welded to, the actor.
      this.state.x = lerp(this.state.x, target, lag);
      this.state.y = lerp(this.state.y, targetY, lag);
      this.apply();
    } else if (this.shakeAmount > 0) {
      this.apply();
    }
    if (this.shakeAmount > 0) {
      this.shakePhase += 0.62;      // roughly 6 swings a second, not 60
      this.shakeAmount *= 0.88;
    }
    if (this.shakeAmount < 0.05) { this.shakeAmount = 0; this.shakePhase = 0; }
    requestAnimationFrame(this.tick);
  }

  set({ x, y, zoom } = {}) {
    if (x !== undefined) this.state.x = x;
    if (y !== undefined) this.state.y = y;
    if (zoom !== undefined) this.state.zoom = zoom;
    this.apply();
    return this;
  }

  /** Glide to a framing. Awaitable, so beats can run before/after or alongside. */
  to({ x, y, zoom, duration = 1400, easing = ease.inOut } = {}) {
    const from = { ...this.state };
    const to = {
      x: x ?? from.x,
      y: y ?? from.y,
      zoom: zoom ?? from.zoom
    };
    return tween({
      duration,
      easing,
      onUpdate: (t) => {
        this.state.x = lerp(from.x, to.x, t);
        this.state.y = lerp(from.y, to.y, t);
        this.state.zoom = lerp(from.zoom, to.zoom, t);
        this.apply();
      }
    });
  }

  /** Keep an actor framed while they move. The camera follows her through doors. */
  follow(actor, opts = {}) {
    this.following = { actor, ...opts, gen: currentGeneration() };
    return this;
  }

  unfollow() {
    this.following = null;
    return this;
  }

  /**
   * Zoom at which at least  world-units are visible across the frame.
   *
   * The SVG uses slice, so a narrow phone shows the full 900 units of HEIGHT
   * and crops width. Wide establishing shots must therefore be framed by how
   * much world should be visible, not by a hardcoded zoom, or the palace ends
   * up cropped off the sides on mobile.
   */
  zoomToFitWidth(units) {
    const svg = this.el.ownerSVGElement;
    const r = svg.getBoundingClientRect();
    if (!r.width || !r.height) return 1;
    const s = Math.max(r.width / this.view.width, r.height / this.view.height);
    return (r.width / s) / units;
  }

  /**
   * Frame N room-units across. Scenes inside the room portal think in room
   * units, and code written in the air must be sized against the frame, not
   * against a zoom number that means something different on every screen.
   */
  fitRoom(roomUnits, portalScale = 0.225) {
    return this.zoomToFitWidth(roomUnits * portalScale);
  }

  /** A small knock — a door slamming, a word bursting. */
  /** A knock, with a direction. Rings down over about half a second. */
  shake(amount = 10) {
    this.shakeAmount = amount;
    this.shakePhase = 0;
    // mostly sideways, with a little tilt, so repeated shakes are not identical
    this.shakeAngle = (Math.random() - 0.5) * 0.9;
    return this;
  }
}

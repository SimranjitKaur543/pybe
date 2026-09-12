// Room-space ↔ world-space. Lives on its own so scenes can share it without
// importing each other (scenes.js and scenes/whisper.js would otherwise form
// an import cycle).

import { HERO } from './art/scenes/palaceNight.js';

/** Room-space point → world point, for aiming the camera inside the portal. */
export const inRoom = (rx, ry) => ({
  x: HERO.x + rx * HERO.scale,
  y: HERO.y + ry * HERO.scale
});

/** Zoom at which one room-unit equals one world-unit: we are "inside". */
export const INSIDE_ZOOM = 1 / HERO.scale;

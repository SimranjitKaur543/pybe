// The story, as choreography.
//
// A scene is an async function that DIRECTS the stage. It reads like shot
// notes, and every beat is a real motion the camera or an actor performs —
// there is deliberately no way here to advance the story by showing text.

import { tween, ease, wait, parallel } from './engine/anim.js';
import { HERO } from './art/scenes/palaceNight.js';
import { ROOM } from './art/scenes/taraRoom.js';
import { inRoom, INSIDE_ZOOM } from './roomSpace.js';
import { whisper } from './scenes/whisper.js';
import { courtyardScene } from './scenes/courtyardScene.js';
import { layersScene } from './scenes/layersScene.js';
import { searchScene } from './scenes/searchScene.js';
import { localScene } from './scenes/localScene.js';
import { globalScene } from './scenes/globalScene.js';
import { errorScene } from './scenes/errorScene.js';
import { lessonScene } from './scenes/lessonScene.js';
import { endingScene } from './scenes/endingScene.js';

export { inRoom, INSIDE_ZOOM };

/**
 * SCENE 0 — the opening. Sky, to palace, to window, through the glass, into
 * the room, to the spark, to the title. One unbroken camera move.
 */
export async function opening(stage) {
  const { camera, tara, spark, ui } = stage;

  // ── 1. adrift in the night sky ────────────────────────────────────────────
  camera.set({ x: 300, y: -1080, zoom: camera.zoomToFitWidth(2000) });
  tara.setPose('idle').express('neutral');

  await wait(1200);

  // drift across the stars, the palace still out of frame below
  await camera.to({
    x: 1150, y: -560,
    zoom: camera.zoomToFitWidth(2300),
    duration: 7000,
    easing: ease.inOut
  });

  // ── 2. the palace rises into view ────────────────────────────────────────
  await camera.to({
    x: 1600, y: 420,
    zoom: camera.zoomToFitWidth(1900),
    duration: 6500,
    easing: ease.inOut
  });

  // let the windows breathe before moving again
  await wait(900);

  // ── 3. approach: one window among many starts to matter ──────────────────
  await camera.to({
    x: HERO.x, y: HERO.y + 60,
    zoom: camera.zoomToFitWidth(900),
    duration: 5200,
    easing: ease.inOut
  });

  await camera.to({
    x: HERO.x, y: HERO.y,
    zoom: camera.zoomToFitWidth(520),
    duration: 4200,
    easing: ease.inOut
  });

  // ── 4. the shutters open ─────────────────────────────────────────────────
  stage.root.querySelector('.hero-window').classList.add('is-open');
  await wait(1500);

  // Tara turns to the night while we are still outside looking in
  tara.express('curious');
  await tara.face('right');
  await wait(700);

  // ── 5. through the glass ─────────────────────────────────────────────────
  // The frame leaves the viewport first; only then is the clip dropped, so the
  // room opening up is invisible and the move reads as one continuous push.
  const through = camera.to({
    ...inRoom(0, 40),
    zoom: INSIDE_ZOOM * 0.92,
    duration: 5200,
    easing: ease.inOut
  });
  await wait(3000);
  stage.root.querySelector('.portal').classList.add('is-inside');
  stage.root.querySelector('.hero-window').classList.add('is-passed');
  await through;

  // ── 6. inside. she moves about her room ──────────────────────────────────
  await camera.to({ ...inRoom(-40, 90), zoom: INSIDE_ZOOM * 0.96, duration: 2200 });
  await wait(600);

  await parallel(
    tara.walkTo(ROOM.taraX - 360, { speed: 210 }),
    camera.to({ ...inRoom(-220, 110), zoom: INSIDE_ZOOM * 0.95, duration: 3000 })
  );
  await wait(700);
  await tara.face('right');
  await wait(500);

  // ── 7. a spark she was not expecting ─────────────────────────────────────
  spark.el.classList.add('is-live');
  await spark.moveTo(360, -160, { duration: 1600, easing: ease.out });

  tara.express('curious');
  await wait(700);

  // it drifts toward her; she watches it come
  await parallel(
    spark.moveTo(-60, -60, { duration: 2600, easing: ease.inOut }),
    camera.to({ ...inRoom(-160, 40), zoom: INSIDE_ZOOM * 1.08, duration: 2600 })
  );

  // she reaches — and it slips away
  tara.setPose('reach');
  await wait(520);
  await spark.moveTo(300, -240, { duration: 900, easing: ease.out });
  tara.setPose('idle');
  tara.express('surprised');
  camera.shake(5);
  await wait(700);

  // she follows it
  tara.express('curious');
  await parallel(
    tara.walkTo(ROOM.taraX - 60, { speed: 190 }),
    camera.to({ ...inRoom(40, -10), zoom: INSIDE_ZOOM * 1.02, duration: 2400 })
  );
  await wait(500);

  // ── 8. the spark blooms into a word ──────────────────────────────────────
  await spark.moveTo(150, -170, { duration: 1100, easing: ease.inOut });
  await wait(400);
  spark.el.classList.add('is-word');
  camera.shake(7);
  tara.setPose('surprise');
  tara.express('surprised');
  await wait(1400);

  tara.setPose('idle');
  tara.express('curious');
  await wait(1600);

  // ── 9. the title gathers out of the air ──────────────────────────────────
  await camera.to({ ...inRoom(30, 10), zoom: INSIDE_ZOOM * 0.9, duration: 2600 });
  ui.classList.add('show-title');
  await wait(4200);
  ui.classList.add('show-sub');

  // the world keeps living behind the title
  await wait(4000);
}

/** The story so far. Each entry continues the last; the stage is never rebuilt. */
export const scenes = [
  opening,
  whisper,
  courtyardScene,
  layersScene,
  searchScene,
  localScene,
  globalScene,
  errorScene,
  lessonScene,
  endingScene
];

/** Plays the built scenes back to back as one continuous piece. */
export async function playStory(stage) {
  for (const scene of scenes) await scene(stage);
}

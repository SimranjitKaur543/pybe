// SCENE 10 — THE PALACE AT NIGHT
//
// The ending. No new ideas are introduced; everything here is the story
// settling. Tara walks out to look across the palace she now understands, the
// windows come up one by one, her last word rises into the sky as a star, and
// the title forms out of the same particles the opening used.

import { ease, wait, parallel } from '../engine/anim.js';
import { COURT } from '../art/scenes/courtyard.js';
import { inRoom } from '../roomSpace.js';

const LAYER_IDS = ['local', 'enclosing', 'global', 'builtin'];

export async function endingScene(stage) {
  const { camera, tara, spark, hers, code, ui, root } = stage;
  const fig = root.querySelector('.tara');
  const perch = root.querySelector('.perch-stand');

  // ── 1. the lesson packs itself away ─────────────────────────────────────
  await code.clear();
  perch.classList.remove('is-up');
  fig.classList.remove('mithu-away');          // Mithu returns to her shoulder
  root.querySelectorAll('.mlabel').forEach((m) => m.classList.remove('is-named', 'is-inline'));
  root.querySelectorAll('.lg').forEach((g) => g.classList.remove('is-lit'));
  await wait(600);

  // ── 2. out to the balcony, with the camera easing back ──────────────────
  tara.setPose('idle').express('happy');
  await parallel(
    tara.walkTo(COURT.centreX + 620, { speed: 190 }),
    camera.to({ ...inRoom(COURT.centreX + 300, -260), zoom: camera.fitRoom(2200), duration: 4100 })
  );
  await tara.face('right');
  await wait(600);

  // ── 3. the palace comes up, window by window ────────────────────────────
  root.querySelector('.portal').classList.add('show-shell');
  await camera.to({ ...inRoom(900, -620), zoom: camera.fitRoom(3600), duration: 3600 });

  const windows = [...root.querySelectorAll('.shell-lit, .courtyard .lantern-glow, .room-window ~ * .lit-window')];
  root.querySelector('.portal').classList.add('is-warming');
  for (const w of windows.slice(0, 10)) {
    w.classList.add('is-waking');
    await wait(300);
  }
  await wait(700);

  // the names rest quietly where they belong
  hers.el.classList.add('is-settled');
  spark.el.classList.add('is-settled');
  await camera.to({ ...inRoom(980, -940), zoom: camera.zoomToFitWidth(1760), duration: 3000 });
  await wait(800);

  // ── 4. back to her, one last time ───────────────────────────────────────
  await camera.to({
    ...inRoom(COURT.centreX + 640, -180),
    zoom: camera.fitRoom(1100),
    duration: 3600,
    easing: ease.inOut
  });
  fig.classList.add('looks-out');               // she turns to us
  tara.express('happy');
  await wait(700);

  ui.dataset.line = 'whenever';
  ui.classList.add('show-line');
  await wait(1900);
  ui.classList.remove('show-line');

  // she looks around her palace before finishing the thought
  await tara.face('left');
  await wait(400);
  await tara.face('right');
  await wait(300);

  ui.dataset.line = 'belong';
  ui.classList.add('show-line');
  await wait(3800);
  ui.classList.remove('show-line');

  fig.classList.add('mithu-nods');
  await wait(900);
  fig.classList.remove('mithu-nods');

  ui.dataset.line = 'whichscope';
  ui.classList.add('show-line');
  await wait(3600);
  ui.classList.remove('show-line');

  // ── 5. the four names, softly, one last time ────────────────────────────
  await camera.to({ ...inRoom(980, -940), zoom: camera.zoomToFitWidth(1760), duration: 3000 });
  root.querySelector('.layer-glows').classList.add('is-live', 'is-soft');
  for (const id of LAYER_IDS) {
    root.querySelector(`.lg-${id}`).classList.add('is-lit');
    root.querySelector(`.mlabel-${id}`).classList.add('is-named');
    await wait(400);
  }
  await wait(1200);

  root.querySelectorAll('.mlabel').forEach((m) => m.classList.add('is-fading'));
  root.querySelectorAll('.lg').forEach((g) => g.classList.add('is-fading'));
  await wait(1100);
  root.querySelectorAll('.mlabel').forEach((m) => m.classList.remove('is-named', 'is-fading'));
  root.querySelectorAll('.lg').forEach((g) => g.classList.remove('is-lit', 'is-fading'));
  root.querySelector('.layer-glows').classList.remove('is-soft');

  // ── 6. the last word rises, and becomes a star ──────────────────────────
  hers.el.classList.remove('is-settled');
  await camera.to({ ...inRoom(-300, -500), zoom: camera.fitRoom(1600), duration: 2400 });
  await wait(400);

  hers.el.classList.add('is-rising');
  await parallel(
    hers.moveTo(-200, -3200, { duration: 4100, easing: ease.inOut }),
    hers.scaleTo(0.08, { duration: 4100, easing: ease.in }),
    camera.to({ ...inRoom(-160, -2400), zoom: camera.fitRoom(2600), duration: 4100 })
  );
  hers.el.classList.add('is-star');
  await wait(1000);

  // and the camera drifts back down to the palace
  await camera.to({ ...inRoom(900, -820), zoom: camera.zoomToFitWidth(1900), duration: 3600 });
  await wait(600);

  ui.dataset.line = 'beginssearch';
  ui.classList.add('show-line');
  await wait(4200);
  ui.classList.remove('show-line');
  await wait(400);

  // ── 6b. the bridge out of the palace and into real code ────────────────
  ui.dataset.line = 'bridge';
  ui.classList.add('show-line');
  await wait(4200);
  ui.classList.remove('show-line');
  await wait(400);

  // ── 7. the title, formed from the same particles as the opening ─────────
  ui.classList.add('is-ending');
  ui.classList.add('show-title');
  await wait(4200);
  ui.classList.add('show-sub');
  await wait(1600);

  // the replay offer, only once everything has been said
  root.querySelector('.replay').classList.add('is-offered');
}

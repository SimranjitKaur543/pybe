// SCENE 3 — THE PALACE REVEALS ITS LAYERS
//
// The camera keeps pulling back until the nesting is simply visible, then the
// palace names its own layers.
//
// The light starts at the WORD, in the room where it was spoken, and spreads
// outward from there. That ordering is the whole point: it says a name belongs
// to the place it was written in, not to whoever happens to be walking past.
// Tara is deliberately not the origin of the glow, and does not move during it.
//
// This is also where the Python starts. The image always lands first and the
// code answers it a beat later, so the concept still arrives before the syntax
// — but from here on every palace beat is said twice, once in each language.

import { ease, wait } from '../engine/anim.js';
import { inRoom } from '../roomSpace.js';

const LAYERS = [
  { id: 'local',     cls: 'lg-local'     },
  { id: 'enclosing', cls: 'lg-enclosing' },
  { id: 'global',    cls: 'lg-global'    },
  { id: 'builtin',   cls: 'lg-builtin'   }
];

export async function layersScene(stage) {
  const { camera, tara, code, ui, root } = stage;
  const glows = root.querySelector('.layer-glows');
  const labels = root.querySelector('.magic-labels');

  tara.setPose('idle').express('curious');

  // ── 1. keep rising: she becomes small, the structure becomes the subject ─
  // Framed by how much world must be visible, not by a fixed zoom: on a narrow
  // phone or a portrait tablet a hardcoded zoom crops the structure away and
  // most of the labels never make it on screen.
  await camera.to({
    ...inRoom(900, -420),
    zoom: camera.zoomToFitWidth(1080),
    duration: 2900,
    easing: ease.inOut
  });
  await wait(400);

  // reveal the shell and the world beyond it as we clear the roofline
  root.querySelector('.portal').classList.add('show-shell');
  await camera.to({
    ...inRoom(980, -940),
    zoom: camera.zoomToFitWidth(1760),
    duration: 3200,
    easing: ease.inOut
  });
  await wait(600);

  // ── 2. the palace lights its layers, from the word outward ──────────────
  glows.classList.add('is-live');

  for (const layer of LAYERS) {
    root.querySelector(`.${layer.cls}`).classList.add('is-lit');
    await wait(500);
    labels.querySelector(`.mlabel-${layer.id}`).classList.add('is-named');
    await wait(1200);
  }

  await wait(700);

  ui.dataset.line = 'names';
  ui.classList.add('show-line');
  await wait(3600);
  ui.classList.remove('show-line');

  // ── 3. the rule, said plainly, once ─────────────────────────────────────
  // The lantern search in the next scene performs this order. Saying it here
  // first means the search is recognised as the rule rather than as a mood.
  ui.dataset.line = 'legb';
  ui.classList.add('show-line');
  await wait(4600);
  ui.classList.remove('show-line');

  // ── 4. the first line of Python, answering the widest ring ──────────────
  code.dock();
  await code.write(['name = "Mithu"'], { stagger: 0 });
  code.note(0, 'Global — out in the open palace');
  await wait(2100);
}

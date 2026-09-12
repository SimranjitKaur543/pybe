// SCENE 2 — THE COURTYARD
//
// Picks up with her hand still on the wall. She goes out through her own door,
// asks the palace for her secret, and is answered by nothing at all.
//
// The absence has to be honest: the word is never moved, hidden or teased
// somewhere off-frame. It simply stays in her room, and we cut back to it
// still glowing there so the viewer sees it never left.

import { ease, wait, parallel } from '../engine/anim.js';
import { ROOM } from '../art/scenes/taraRoom.js';
import { COURT } from '../art/scenes/courtyard.js';
import { inRoom, INSIDE_ZOOM } from '../roomSpace.js';

export async function courtyardScene(stage) {
  const { camera, tara, hers, ui, root } = stage;
  const door = root.querySelector('.room-door');
  const prompt = root.querySelector('.ask-prompt');
  const speech = root.querySelector('.ask-speech');
  const qMotes = root.querySelector('.q-motes');

  // ── 1. the word she made comes back, and stays home ─────────────────────
  // It must be visibly present in her room for the rest of the scene, so its
  // absence outside reads as absence, not as something we forgot to draw.
  hers.at(-620, -240).setScale(1);
  hers.el.classList.add('is-live', 'is-word', 'is-homebound');
  await wait(500);

  // ── 2. Mithu has the idea first ─────────────────────────────────────────
  root.querySelector('.tara').classList.add('mithu-alert');
  await wait(700);
  tara.express('curious');
  await tara.face('right');
  await wait(400);

  // ── 3. out through her own door ─────────────────────────────────────────
  door.classList.add('is-open');
  await wait(600);

  camera.follow(tara, { map: (x, y) => inRoom(x, y), offsetY: -150, lag: 0.028 });
  await tara.walkTo(ROOM.doorX + 40, { speed: 210 });

  // hold on the doorway a moment: her room is still there behind her
  await wait(500);
  await tara.walkTo(COURT.x0 + 300, { speed: 200 });

  // ── 4. the courtyard opens up ───────────────────────────────────────────
  camera.unfollow();
  await camera.to({
    ...inRoom(COURT.centreX - 260, -120),
    zoom: INSIDE_ZOOM * 0.52,
    duration: 2900,
    easing: ease.inOut
  });

  tara.express('surprised');
  await wait(600);

  // she looks around the bigger space
  await tara.face('left');
  await wait(400);
  await tara.face('right');
  tara.express('curious');
  await wait(500);

  // ── 5. the only interaction in the story ────────────────────────────────
  prompt.setAttribute('transform', `translate(${COURT.centreX + 40} -520)`);
  prompt.classList.add('is-offered');

  await new Promise((resolve) => {
    const go = () => {
      prompt.removeEventListener('click', go);
      prompt.removeEventListener('keydown', key);
      resolve();
    };
    const key = (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); }
    };
    prompt.addEventListener('click', go);
    prompt.addEventListener('keydown', key);
  });

  prompt.classList.remove('is-offered');
  prompt.classList.add('is-taken');

  // ── 6. she asks ─────────────────────────────────────────────────────────
  await parallel(
    tara.walkTo(COURT.askX, { speed: 190 }),
    camera.to({ ...inRoom(COURT.askX + 60, -180), zoom: INSIDE_ZOOM * 0.6, duration: 2100 })
  );
  await wait(300);

  await tara.face('left');
  await wait(300);
  tara.setPose('reach');
  tara.express('curious');

  speech.setAttribute('transform', `translate(${COURT.askX + 30} -330)`);
  speech.classList.add('is-spoken');
  await wait(1400);
  tara.setPose('idle');
  speech.classList.remove('is-spoken');

  // ── 7. and nothing answers ──────────────────────────────────────────────
  qMotes.setAttribute('transform', `translate(${COURT.askX + 40} -420)`);
  qMotes.classList.add('is-asking');
  root.querySelector('.courtyard').classList.add('is-hushed');
  await wait(1400);
  qMotes.classList.remove('is-asking');

  tara.express('confused');
  root.querySelector('.tara').classList.add('mithu-alert');
  await wait(900);

  // ── 8. she looks back — and it is still in there ────────────────────────
  await tara.face('left');
  await wait(300);

  // pull wide enough to hold the courtyard AND her lit room in one frame, so
  // the comparison is made by the shot itself rather than by a caption
  await camera.to({
    ...inRoom(700, -180),
    zoom: INSIDE_ZOOM * 0.34,
    duration: 2900,
    easing: ease.inOut
  });
  hers.el.classList.add('is-beckoning');
  await wait(1400);

  // ── 9. the line ─────────────────────────────────────────────────────────
  ui.dataset.line = 'born';
  ui.classList.add('show-line');
  await wait(4800);
  ui.classList.remove('show-line');
  await wait(500);

  root.querySelector('.tara').classList.remove('mithu-alert');
  root.querySelector('.courtyard').classList.remove('is-hushed');
  hers.el.classList.remove('is-beckoning');
}

// SCENE 2 — THE COURTYARD
//
// Picks up with her hand still on the wall. She goes out through her own door,
// asks the palace for her secret, and is answered by nothing at all.
//
// The absence has to be honest: the word is never moved, hidden or teased
// somewhere off-frame. It simply stays in her room, and we cut back to it
// still glowing there so the viewer sees it never left.

import { ease, wait, parallel } from '../engine/anim.js';
import { choose, say, react } from '../engine/Ask.js';
import { beats } from '../story/beats.js';
import { ROOM } from '../art/scenes/taraRoom.js';
import { COURT } from '../art/scenes/courtyard.js';
import { inRoom } from '../roomSpace.js';

export async function courtyardScene(stage) {
  const { camera, tara, hers, ui, root } = stage;
  const door = root.querySelector('.room-door');
  const prompt = root.querySelector('.ask-prompt');
  const promptAt = root.querySelector('.ask-anchor');
  const speech = root.querySelector('.ask-speech');
  const speechAt = root.querySelector('.ask-speech-anchor');
  const qMotes = root.querySelector('.q-motes');

  // ── 1. the word she made comes back, and stays home ─────────────────────
  // It must be visibly present in her room for the rest of the scene, so its
  // absence outside reads as absence, not as something we forgot to draw.
  hers.at(-620, -240).setScale(1);
  hers.el.classList.add('is-live', 'is-word', 'is-homebound');
  await wait(400);

  // ── 2. Mithu has the idea first ─────────────────────────────────────────
  root.querySelector('.tara').classList.add('mithu-alert');
  await wait(500);
  tara.express('curious');
  await tara.face('right');
  await wait(300);

  // ── 3. out through her own door ─────────────────────────────────────────
  door.classList.add('is-open');
  await wait(500);

  camera.follow(tara, { map: (x, y) => inRoom(x, y), offsetY: -150, lag: 0.028 });
  await tara.walkTo(ROOM.doorX + 40, { speed: 210 });

  // hold on the doorway a moment: her room is still there behind her
  await wait(400);
  await tara.walkTo(COURT.x0 + 300, { speed: 200 });

  // ── 4. the courtyard opens up ───────────────────────────────────────────
  camera.unfollow();
  await camera.to({
    ...inRoom(COURT.centreX - 260, -120),
    zoom: camera.fitRoom(3077),
    duration: 2300,
    easing: ease.inOut
  });

  tara.express('surprised');
  await wait(500);

  // she looks around the bigger space
  await tara.face('left');
  await wait(300);
  await tara.face('right');
  tara.express('curious');
  await wait(400);

  // ── 5. the only interaction in the story ────────────────────────────────
  // NOTE: the position goes on the anchor. Setting it on .ask-prompt itself is
  // silently discarded by its own CSS transform animation.
  promptAt.setAttribute('transform', `translate(${COURT.askX} -470)`);

  // Frame the shot ON the prompt before offering it. The story stops dead here
  // until it is clicked, so it cannot be something the viewer has to hunt for:
  // if they miss it they are left staring at a palace that appears to have
  // frozen, with nothing on screen telling them what is wanted.
  await camera.to({
    ...inRoom(COURT.askX, -250),
    zoom: camera.fitRoom(2150),
    duration: 1600,
    easing: ease.inOut
  });
  await tara.face('right');
  prompt.classList.add('is-offered');

  await new Promise((resolve) => {
    // and if it still goes unnoticed, insist a little harder rather than
    // waiting silently forever
    const urge = setTimeout(() => prompt.classList.add('is-urging'), 7000);
    const go = () => {
      clearTimeout(urge);
      prompt.classList.remove('is-urging');
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
    camera.to({ ...inRoom(COURT.askX + 60, -180), zoom: camera.fitRoom(2667), duration: 1700 })
  );
  await wait(300);

  await tara.face('left');
  await wait(300);
  tara.setPose('reach');
  tara.express('curious');

  speechAt.setAttribute('transform', `translate(${COURT.askX + 30} -330)`);
  speech.classList.add('is-spoken');
  await wait(1100);
  tara.setPose('idle');
  speech.classList.remove('is-spoken');

  // ── 7. and nothing answers ──────────────────────────────────────────────
  qMotes.setAttribute('transform', `translate(${COURT.askX + 40} -420)`);
  qMotes.classList.add('is-asking');
  root.querySelector('.courtyard').classList.add('is-hushed');
  await wait(1100);
  qMotes.classList.remove('is-asking');

  tara.express('confused');
  root.querySelector('.tara').classList.add('mithu-alert');
  await wait(700);

  // ── 7b. the prediction the whole idea turns on ──────────────────────────
  // Asked BEFORE the reveal, while the learner still holds whatever belief
  // they walked in with. Answering "it followed her" is the misconception this
  // story exists to correct, so it is offered as a real option rather than
  // hidden — and the reply to it is a nudge to look, not a verdict.
  const guess = await choose(stage, beats.whereDidItGo);
  // She answers the learner before the shot does. A guess that lands gets a
  // small brightening; one that does not gets a puzzled look — not a scold.
  await react(stage, guess === beats.whereDidItGo.answer ? 'happy' : 'confused', { nod: true, ms: 800 });
  await say(stage, beats.whereDidItGo.feedback[guess], 2400);

  // ── 8. she looks back — and it is still in there ────────────────────────
  // This shot is now the ANSWER to a question the learner just committed to,
  // which is the whole difference between watching and finding out.
  await tara.face('left');
  await wait(300);

  // pull wide enough to hold the courtyard AND her lit room in one frame, so
  // the comparison is made by the shot itself rather than by a caption
  await camera.to({
    ...inRoom(700, -180),
    zoom: camera.fitRoom(4706),
    duration: 2300,
    easing: ease.inOut
  });
  hers.el.classList.add('is-beckoning');
  await wait(1100);

  // ── 9. the line ─────────────────────────────────────────────────────────
  ui.dataset.line = 'born';
  ui.classList.add('show-line');
  await wait(4800);
  ui.classList.remove('show-line');
  await wait(400);

  stage.journey.done('local').at('enclosing');

  root.querySelector('.tara').classList.remove('mithu-alert');
  root.querySelector('.courtyard').classList.remove('is-hushed');
  hers.el.classList.remove('is-beckoning');
}

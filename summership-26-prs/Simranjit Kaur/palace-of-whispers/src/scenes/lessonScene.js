// SCENE 9 — MITHU EXPLAINS
//
// The one place the story becomes teaching. It stays a story: the code is
// written in the air beside the very rooms it describes, and every line is
// traced by light into the architecture rather than described in prose.
//
// Example 3 keeps the ordering the previous scene established — the room claims
// the name before the read is attempted — because that is the whole reason
// UnboundLocalError exists.

import { ease, wait, parallel } from '../engine/anim.js';
import { ROOM } from '../art/scenes/taraRoom.js';
import { inRoom } from '../roomSpace.js';

const CODE_AT = { x: 620, y: -1180 };


export async function lessonScene(stage) {
  const { camera, tara, hers, code, ui, root } = stage;
  const fig = root.querySelector('.tara');
  const perch = root.querySelector('.perch-stand');

  // ── 1. everyone settles ─────────────────────────────────────────────────
  await parallel(
    tara.walkTo(ROOM.taraX - 220, { speed: 200 }),
    camera.to({ ...inRoom(-120, -260), zoom: camera.fitRoom(1300), duration: 1900 })
  );
  await tara.face('right');
  tara.setPose('sit');
  tara.express('curious');

  perch.setAttribute('transform', `translate(${ROOM.taraX + 190} ${ROOM.floorY})`);
  perch.classList.add('is-up');
  fig.classList.add('mithu-away');     // he has hopped off her shoulder
  await wait(500);

  ui.dataset.line = 'rules';
  ui.classList.add('show-line');
  await wait(3800);
  ui.classList.remove('show-line');

  // ── 2. the one thing the story has NOT already shown ───────────────────
  // Three examples used to live here: reading a name from an outer scope,
  // shadowing it, and UnboundLocalError. Every one of them had already been
  // played out in the palace AND written in the code panel as it happened —
  // and the error had been predicted by the learner a scene earlier. Teaching
  // them again in the same words was not reinforcement, it was the film
  // saying the same thing twice while the viewer waited.
  //
  // The camera also stays CLOSE here. This beat used to frame her at roughly
  // a twelfth of the screen height with the code centred on top of her, so
  // the person supposedly giving the lesson was a detail behind a panel.
  code.dock();
  await code.clear({ duration: 300 });
  await camera.to({ ...inRoom(-40, -300), zoom: camera.fitRoom(1150), duration: 1600 });
  await wait(400);

  // ── 4b. Example 4 — the same trick played on a built-in name ────────────
  // Everything so far shadowed a name the story invented. Built-ins are not
  // special: shadow one and it is gone for the rest of that scope. This is the
  // form of the mistake people actually hit, so it is worth its own example.
  await code.write([
    'len = 5',
    'print(len("palace"))'
  ], { stagger: 380 });
  await wait(300);

  code.focus(0);
  code.note(0, 'this hides the built-in len');
  root.querySelector('.lg-builtin').classList.add('is-lit');
  root.querySelector('.mlabel-builtin').classList.add('is-named');
  await wait(900);

  code.focus(1);
  code.mark(1, 'is-error');
  code.note(1, 'TypeError — 5 is not a function');
  camera.shake(6);
  tara.express('surprised');
  await wait(1100);

  // shadowing len() is where Built-in stops being a ring on a diagram
  stage.journey.done('builtin');

  ui.dataset.line = 'shadowbuiltin';
  ui.classList.add('show-line');
  await wait(4400);
  ui.classList.remove('show-line');

  root.querySelector('.mlabel-builtin').classList.remove('is-named');
  root.querySelector('.lg-builtin').classList.remove('is-lit');
  code.unfocus();
  code.unmark('is-error');
  code.clearNotes();
  await code.clear();
  tara.express('curious');

  // ── 5. a fresh room every time she steps in ─────────────────────────────
  await camera.to({ ...inRoom(-140, -180), zoom: camera.fitRoom(1500), duration: 1600 });
  tara.setPose('idle');

  for (let pass = 0; pass < 2; pass += 1) {
    // she steps in, and the room's own names appear with her
    await tara.walkTo(ROOM.taraX - 160, { speed: 240 });
    hers.setText(pass === 0 ? 'TARA' : 'TARA').at(-560, -300).setScale(0.1);
    hers.el.classList.remove('is-hollow', 'is-claimed');
    hers.el.classList.add('is-live', 'is-inner');
    await hers.scaleTo(1, { duration: 700, easing: ease.back });
    hers.el.classList.add('is-word');
    await wait(500);

    // she steps out, and the room empties
    await tara.walkTo(ROOM.doorX + 60, { speed: 240 });
    hers.el.classList.add('is-clearing');
    await wait(400);
    hers.el.classList.remove('is-live', 'is-word', 'is-clearing', 'is-inner');
    await wait(300);
  }

  ui.dataset.line = 'freshcall';
  ui.classList.add('show-line');
  await wait(4000);
  ui.classList.remove('show-line');

  // ── 6. and that is the lesson ───────────────────────────────────────────
  // This used to pull out to zoomToFitWidth(1760) and light the four rings
  // again. The ending now performs that far better — four lookups, one per
  // ring, each with a different answer — so doing it here as well meant the
  // story reprised the same diagram twice within a few minutes, and did it
  // the weaker way first. The line still lands; the camera just stays with
  // her to say it.
  await tara.face('right');
  tara.express('happy');
  await camera.to({ ...inRoom(-60, -280), zoom: camera.fitRoom(1050), duration: 1500 });
  await wait(500);

  ui.dataset.line = 'begins';
  ui.classList.add('show-line');
  await wait(4400);
  ui.classList.remove('show-line');

  // the palace is left glowing; the ending comes later
  await wait(500);
}

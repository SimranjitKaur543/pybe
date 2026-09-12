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
  const { camera, tara, spark, hers, code, ui, root } = stage;
  const fig = root.querySelector('.tara');
  const trails = root.querySelector('.trails');
  const perch = root.querySelector('.perch-stand');
  const err = root.querySelector('.error-spell');

  // ── 1. everyone settles ─────────────────────────────────────────────────
  await parallel(
    tara.walkTo(ROOM.taraX - 220, { speed: 200 }),
    camera.to({ ...inRoom(-120, -260), zoom: camera.fitRoom(1300), duration: 2400 })
  );
  await tara.face('right');
  tara.setPose('sit');
  tara.express('curious');

  perch.setAttribute('transform', `translate(${ROOM.taraX + 190} ${ROOM.floorY})`);
  perch.classList.add('is-up');
  fig.classList.add('mithu-away');     // he has hopped off her shoulder
  await wait(600);

  ui.dataset.line = 'rules';
  ui.classList.add('show-line');
  await wait(3800);
  ui.classList.remove('show-line');

  // ── 2. Example 1 — the name is not hers, so Python may look outward ─────
  code.at(CODE_AT.x, CODE_AT.y);
  code.undock();
  await code.clear({ duration: 400 });
  await camera.to({ ...inRoom(520, -760), zoom: camera.fitRoom(2100), duration: 2200 });

  hers.el.classList.remove(
    'is-word', 'is-live', 'is-hollow', 'is-claimed', 'is-hollow-pulse',
    'is-inner', 'is-shadowing', 'is-clearing'
  );
  spark.setText('MITHU').at(1900, -1180);
  spark.el.classList.add('is-live', 'is-word', 'is-outer');

  await code.write([
    'name = "Mithu"',
    '',
    'def room():',
    '    print(name)'
  ]);
  await wait(300);

  code.focus(3);
  trails.classList.add('show-out');
  await wait(600);
  spark.el.classList.add('is-answering');
  await wait(900);

  ui.dataset.line = 'lookout';
  ui.classList.add('show-line');
  await wait(3900);
  ui.classList.remove('show-line');
  trails.classList.remove('show-out');
  spark.el.classList.remove('is-answering');
  code.unfocus();
  await code.clear();

  // ── 3. Example 2 — she makes her own, and it hides the outer one ────────
  await code.write([
    'name = "Mithu"',
    '',
    'def room():',
    '    name = "Tara"',
    '    print(name)'
  ]);
  await wait(300);

  code.focus(3);
  hers.setText('TARA').at(-560, -300).setScale(0.1);
  hers.el.classList.remove('is-hollow', 'is-claimed');
  hers.el.classList.add('is-live', 'is-inner');
  await hers.scaleTo(1, { duration: 900, easing: ease.back });
  hers.el.classList.add('is-word');
  await wait(500);

  code.focus(4);
  trails.classList.add('show-local');
  hers.el.classList.add('is-shadowing');
  spark.el.classList.add('is-shadowed');
  await wait(1100);

  ui.dataset.line = 'hides';
  ui.classList.add('show-line');
  await wait(3800);
  ui.classList.remove('show-line');

  const shadowTag = root.querySelector('.shadow-tag .mlabel');
  shadowTag.classList.add('is-named');
  await wait(1400);
  shadowTag.classList.remove('is-named');

  trails.classList.remove('show-local');
  spark.el.classList.remove('is-shadowed');
  hers.el.classList.remove('is-shadowing');
  code.unfocus();
  await code.clear();

  // ── 4. Example 3 — the same two lines, the other way round ──────────────
  await code.write([
    'name = "Mithu"',
    '',
    'def room():',
    '    print(name)',
    '    name = "Tara"'
  ]);
  await wait(400);

  // the claim is made by the assignment on the LAST line, before anything runs
  code.focus(4);
  await wait(600);
  hers.setText('name').at(-560, -300).setScale(0.1);
  hers.el.classList.remove('is-inner');
  hers.el.classList.add('is-live', 'is-hollow');
  await hers.scaleTo(1, { duration: 800, easing: ease.back });
  hers.el.classList.add('is-word', 'is-claimed');
  camera.shake(4);
  await wait(900);

  // only now is the read attempted, and it finds an empty name
  code.focus(3);
  trails.classList.add('show-blocked');
  hers.el.classList.add('is-hollow-pulse');
  await wait(700);
  trails.classList.add('is-barred');
  camera.shake(8);
  await wait(600);
  trails.classList.remove('show-blocked', 'is-barred');

  // clear of the code block, which runs from -1180 down to about -700
  err.setAttribute('transform', 'translate(620 -320)');
  root.querySelector('.stage').classList.add('is-darkened');
  err.classList.add('is-cast');
  code.mark(3, 'is-error');
  await wait(1200);

  ui.dataset.line = 'assigns';
  ui.classList.add('show-line');
  await wait(4400);
  ui.classList.remove('show-line');
  await wait(300);

  ui.dataset.line = 'novalue';
  ui.classList.add('show-line');
  await wait(4000);
  ui.classList.remove('show-line');

  err.classList.remove('is-cast');
  root.querySelector('.stage').classList.remove('is-darkened');
  code.unfocus();
  code.unmark('is-error');
  await code.clear();
  hers.el.classList.remove('is-hollow-pulse');

  // ── 4b. Example 4 — the same trick played on a built-in name ────────────
  // Everything so far shadowed a name the story invented. Built-ins are not
  // special: shadow one and it is gone for the rest of that scope. This is the
  // form of the mistake people actually hit, so it is worth its own example.
  await code.write([
    'len = 5',
    'print(len("palace"))'
  ], { stagger: 380 });
  await wait(400);

  code.focus(0);
  code.note(0, 'this hides the built-in len');
  root.querySelector('.lg-builtin').classList.add('is-lit');
  root.querySelector('.mlabel-builtin').classList.add('is-named');
  await wait(1200);

  code.focus(1);
  code.mark(1, 'is-error');
  code.note(1, 'TypeError — 5 is not a function');
  camera.shake(6);
  tara.express('surprised');
  await wait(1400);

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
  await camera.to({ ...inRoom(-140, -180), zoom: camera.fitRoom(1500), duration: 2000 });
  tara.setPose('idle');

  for (let pass = 0; pass < 2; pass += 1) {
    // she steps in, and the room's own names appear with her
    await tara.walkTo(ROOM.taraX - 160, { speed: 240 });
    hers.setText(pass === 0 ? 'TARA' : 'TARA').at(-560, -300).setScale(0.1);
    hers.el.classList.remove('is-hollow', 'is-claimed');
    hers.el.classList.add('is-live', 'is-inner');
    await hers.scaleTo(1, { duration: 700, easing: ease.back });
    hers.el.classList.add('is-word');
    await wait(600);

    // she steps out, and the room empties
    await tara.walkTo(ROOM.doorX + 60, { speed: 240 });
    hers.el.classList.add('is-clearing');
    await wait(500);
    hers.el.classList.remove('is-live', 'is-word', 'is-clearing', 'is-inner');
    await wait(400);
  }

  ui.dataset.line = 'freshcall';
  ui.classList.add('show-line');
  await wait(4000);
  ui.classList.remove('show-line');

  // ── 6. the architecture, one last time ──────────────────────────────────
  await tara.walkTo(ROOM.taraX - 160, { speed: 220 });
  await tara.face('right');
  tara.express('happy');

  await camera.to({ ...inRoom(980, -940), zoom: camera.zoomToFitWidth(1760), duration: 3000 });
  root.querySelector('.layer-glows').classList.add('is-live');
  for (const id of ['local', 'enclosing', 'global', 'builtin']) {
    root.querySelector(`.lg-${id}`).classList.add('is-lit');
    await wait(300);
  }
  await wait(600);

  ui.dataset.line = 'begins';
  ui.classList.add('show-line');
  await wait(4400);
  ui.classList.remove('show-line');

  // the palace is left glowing; the ending comes later
  await wait(600);
}

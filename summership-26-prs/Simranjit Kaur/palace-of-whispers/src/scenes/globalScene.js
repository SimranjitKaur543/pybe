// SCENE 7 — SPEAKING TO THE PALACE
//
// She stops making copies and changes the palace's own name instead.
//
// ── Accuracy ──────────────────────────────────────────────────────────────
// The beam runs from her room to the PALACE layer, and the palace's word is the
// thing that changes — `global` rebinds the name in the module scope rather
// than creating a local one.
//
// `nonlocal` is then shown as a deliberately SHORTER reach: it stops at the
// space her room sits inside, never at the palace. Drawing it to the same place
// as the beam would teach something false.

import { ease, wait } from '../engine/anim.js';
import { inRoom } from '../roomSpace.js';

export async function globalScene(stage) {
  const { camera, tara, spark, hers, code, ui, root } = stage;
  const fig = root.querySelector('.tara');
  const reach = root.querySelector('.reach');

  // undo the shadow stack; she is about to try something else
  reach.classList.remove('show-shadow');
  spark.el.classList.remove('is-shadowed');
  hers.el.classList.remove('is-shadowing');
  await wait(500);

  // ── 1. she looks out at the palace's name ───────────────────────────────
  await camera.to({ ...inRoom(400, -620), zoom: camera.zoomToFitWidth(1420), duration: 2200 });
  await tara.face('right');
  tara.express('curious');
  await wait(900);

  // ── 2. Mithu: then you must speak to the palace ─────────────────────────
  fig.classList.add('mithu-alert');
  ui.dataset.line = 'speak';
  ui.classList.add('show-line');
  await wait(3600);
  ui.classList.remove('show-line');
  fig.classList.remove('mithu-alert');

  // ── 3. the megaphone ────────────────────────────────────────────────────
  await camera.to({ ...inRoom(-200, -300), zoom: camera.zoomToFitWidth(880), duration: 2000 });
  fig.classList.add('has-megaphone');
  await wait(600);
  tara.setPose('reach');
  tara.express('happy');
  await wait(600);

  // ── 4. the reach: out of her room, all the way to the palace ────────────
  await camera.to({ ...inRoom(700, -700), zoom: camera.zoomToFitWidth(1620), duration: 2100 });

  // the declaration goes in ABOVE the assignment, because that is where it has
  // to be: it changes what the assignment on the next line means
  await code.retype(3, '    global name');
  code.mark(3, 'is-claim');
  code.note(3, "rebinds the palace name, not a local one");
  await code.append(['    name = "Tara"'], { stagger: 0 });
  await wait(1000);

  reach.classList.add('show-global');
  camera.shake(6);
  await wait(1500);

  // the palace's own name changes — not a copy of it
  spark.el.classList.add('is-touched');
  await spark.morphTo('TARA', { duration: 1200 });
  spark.el.classList.remove('is-touched');
  spark.el.classList.add('is-answering');
  camera.shake(8);
  await wait(1400);

  tara.setPose('idle');
  spark.el.classList.remove('is-answering');
  reach.classList.remove('show-global');
  fig.classList.remove('has-megaphone');
  await wait(600);

  // ── 5. name the thing she just did ──────────────────────────────────────
  const globalTag = root.querySelector('.mlabel-global');
  globalTag.classList.add('is-named', 'is-inline');
  await wait(2200);
  globalTag.classList.remove('is-inline', 'is-named');

  // ── 6. one mention of the other one ─────────────────────────────────────
  // Shown as a shorter reach that stops at the enclosing space, so the
  // difference from `global` is visible rather than asserted.
  await camera.to({ ...inRoom(260, -420), zoom: camera.zoomToFitWidth(1240), duration: 2100 });
  fig.classList.add('mithu-alert');

  // The enclosing layer has been architecture up to now. Here it finally gets
  // the shape that creates it in Python — a function written INSIDE another —
  // which is also the only shape in which `nonlocal` means anything.
  code.unmark('is-claim');
  code.clearNotes();
  await code.write([
    'def palace():',
    '    name = "Mithu"',
    '',
    '    def room():',
    '        nonlocal name',
    '        name = "Tara"'
  ], { stagger: 300 });
  code.focus(4);
  code.note(4, 'reaches the ENCLOSING room only');
  reach.classList.add('show-nonlocal');
  await wait(1400);

  ui.dataset.line = 'nonlocal';
  ui.classList.add('show-line');
  await wait(4600);
  ui.classList.remove('show-line');
  reach.classList.remove('show-nonlocal');
  fig.classList.remove('mithu-alert');
  code.unfocus();
  code.clearNotes();

  tara.express('happy');
  await wait(900);
}

// SCENES 5 & 6 — HER OWN COPY, AND SHADOWING
//
// She makes a name of her own with the same name as the palace's, changes hers,
// and the palace's is untouched. Then the two are stacked so the nearer one
// visibly covers the wider one.
//
// ── Accuracy ──────────────────────────────────────────────────────────────
// "Nearer" here means nearer in the NESTING, not in the room. The shadowing
// shot is deliberately framed on her room sitting inside the palace, with the
// outer word sliding behind her room's own boundary — it is the architecture
// that hides it, not proximity to Tara.
//
// This is also where the read/assign asymmetry gets stated outright. The
// previous scene read a name and Python looked outward; one assignment in the
// same function changes that completely, and the panel shows both versions of
// the same four lines so the difference is a diff, not a paragraph.

import { ease, wait, parallel } from '../engine/anim.js';
import { ROOM } from '../art/scenes/taraRoom.js';
import { inRoom, INSIDE_ZOOM } from '../roomSpace.js';

const HER_WORD = { x: -560, y: -300 };

export async function localScene(stage) {
  const { camera, tara, spark, hers, code, ui, root } = stage;
  const fig = root.querySelector('.tara');

  // ── 1. back to her room, the palace's name still glowing out there ──────
  await parallel(
    tara.walkTo(ROOM.taraX - 120, { speed: 240 }),
    camera.to({ ...inRoom(-120, -240), zoom: camera.zoomToFitWidth(760), duration: 2800 })
  );
  fig.classList.remove('has-lantern');
  await tara.face('right');
  tara.express('curious');
  await wait(700);

  // ── 2. "I'll make my own." ──────────────────────────────────────────────
  tara.setPose('whisper');
  await wait(600);

  hers.setText('MITHU').at(HER_WORD.x, HER_WORD.y).setScale(0.05);
  hers.el.classList.remove('is-homebound', 'is-beckoning');
  hers.el.classList.add('is-live', 'is-inner');
  await hers.scaleTo(1, { duration: 1000, easing: ease.back });
  hers.el.classList.add('is-word');
  tara.setPose('idle');

  // the program changes by exactly one line, and that one line changes
  // everything about how the name is resolved
  await code.retype(3, '    name = "Tara"');
  code.mark(3, 'is-claim');
  code.note(3, 'assigning MAKES a new local name');
  await code.append(['    print(name)'], { stagger: 0 });
  await wait(1300);

  // both exist: same name, two different places
  await camera.to({ ...inRoom(560, -620), zoom: camera.zoomToFitWidth(1500), duration: 2200 });
  await wait(1000);

  // ── 3. she changes HERS ─────────────────────────────────────────────────
  await camera.to({ ...inRoom(-260, -260), zoom: camera.zoomToFitWidth(820), duration: 2000 });
  await tara.walkTo(HER_WORD.x + 250, { speed: 200 });
  await tara.face('left');
  tara.setPose('reach');
  await wait(400);

  hers.el.classList.add('is-touched');
  camera.shake(4);
  await hers.morphTo('TARA', { duration: 1100 });
  hers.el.classList.remove('is-touched');
  tara.setPose('idle');
  tara.express('surprised');
  await wait(700);

  // ── 4. and the palace's is exactly as it was ────────────────────────────
  await camera.to({ ...inRoom(620, -640), zoom: camera.zoomToFitWidth(1560), duration: 2200 });
  spark.el.classList.add('is-answering');
  code.note(0, 'untouched');
  await wait(1400);
  spark.el.classList.remove('is-answering');
  code.note(0, '');

  tara.express('happy');
  fig.classList.add('mithu-alert');
  await wait(1000);
  fig.classList.remove('mithu-alert');

  // ── 5. only now, the word for it ────────────────────────────────────────
  const localTag = root.querySelector('.mlabel-local');
  localTag.classList.add('is-named', 'is-inline');
  await wait(2200);

  // ── 6. the asymmetry, said once and plainly ─────────────────────────────
  // Reading looked outward one scene ago. Assigning did not. Same function,
  // same name — the only difference is which side of the "=" it sat on.
  code.unmark('is-claim');
  code.focus(3);
  await wait(900);
  ui.dataset.line = 'readassign';
  ui.classList.add('show-line');
  await wait(4400);
  ui.classList.remove('show-line');
  code.unfocus();

  // ── 7. shadowing: the nearer name covers the wider one ──────────────────
  await camera.to({ ...inRoom(-160, -420), zoom: camera.zoomToFitWidth(1120), duration: 2200 });
  await wait(500);

  root.querySelector('.reach').classList.add('show-shadow');
  spark.el.classList.add('is-shadowed');
  hers.el.classList.add('is-shadowing');
  code.focus(4);
  code.note(4, 'finds the local one; outer is hidden');
  await wait(1800);

  ui.dataset.line = 'hides';
  ui.classList.add('show-line');
  await wait(4200);
  ui.classList.remove('show-line');

  await wait(700);
  code.unfocus();
  code.clearNotes();
  localTag.classList.remove('is-inline');
}

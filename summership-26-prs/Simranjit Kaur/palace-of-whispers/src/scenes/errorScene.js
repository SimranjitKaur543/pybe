// SCENE 8 — THE EMPTY ECHO
//
// ── The one thing this scene must not get wrong ───────────────────────────
//
// The tempting staging is: she reads the palace's name, it works, she then
// makes her own, and something breaks. That is a lie about Python.
//
// `name` is local to the function because the function ASSIGNS to it somewhere
// in its body — a fact settled before a single line runs. So the order here is:
//
//     the room is established
//       → the room claims `name` (empty)
//         → she tries to read it
//           → UnboundLocalError
//
// The claim is deliberately staged before any reading, and the outer word stays
// visible the whole time so it is obvious Python is not failing to find it —
// it is not looking out there at all.

import { ease, wait } from '../engine/anim.js';
import { predict, react, afterBeat } from '../engine/Ask.js';
import { beats } from '../story/beats.js';
import { inRoom } from '../roomSpace.js';

export async function errorScene(stage) {
  const { camera, tara, spark, hers, code, ui, root } = stage;
  const fig = root.querySelector('.tara');
  const trails = root.querySelector('.trails');
  const err = root.querySelector('.error-spell');

  // ── 1. her room, as she left it. The palace still holds its own name ────
  spark.setText('MITHU').at(1900, -1180);
  spark.el.classList.add('is-live', 'is-word', 'is-outer');
  spark.el.classList.remove('is-shadowed');

  // her room has NO name of its own right now
  hers.el.classList.remove('is-word', 'is-live', 'is-inner', 'is-shadowing', 'is-hollow');

  await camera.to({ ...inRoom(40, -140), zoom: camera.fitRoom(1500), duration: 2000 });
  await tara.face('right');
  tara.express('curious');

  // The same four lines as the very first example, with the two inner lines
  // swapped. That is the whole difference, and it is worth being able to see.
  await code.write([
    'name = "Mithu"',
    '',
    'def room():',
    '    print(name)',
    '    name = "Tara"'
  ], { stagger: 300 });
  await wait(500);

  // ── 2. she can see the palace's name from here ──────────────────────────
  trails.classList.add('show-out');
  spark.el.classList.add('is-answering');
  await wait(1100);
  trails.classList.remove('show-out');
  spark.el.classList.remove('is-answering');
  await wait(400);

  // ── 2b. the prediction the whole topic turns on ─────────────────────────
  // Asked BEFORE the claim, while "Mithu" still looks like the obvious answer.
  // It is the trap, and a learner who commits to it and then watches the room
  // take the name has understood something a correct-first-time answer would
  // have skipped straight past.
  const guessed = await predict(stage, beats.errorPredict);
  await react(stage, guessed.correct ? 'happy' : 'surprised', { nod: true, ms: 850 });

  // ── 3. she decides to make one of her own ───────────────────────────────
  // THE CLAIM. This happens now — before any attempt to read — because the
  // function assigning to `name` is what makes `name` local at all.
  await camera.to({ ...inRoom(-380, -200), zoom: camera.fitRoom(1000), duration: 1600 });
  await tara.face('left');
  tara.setPose('reach');
  await wait(400);

  hers.setText('name').at(-560, -300).setScale(0.1);
  hers.el.classList.add('is-live', 'is-hollow');
  await hers.scaleTo(1, { duration: 900, easing: ease.back });
  hers.el.classList.add('is-word');
  camera.shake(4);
  tara.setPose('idle');
  await wait(700);

  // the room now owns the name, and it is holding nothing
  hers.el.classList.add('is-claimed');
  code.focus(4);
  code.note(4, 'seen first — so name is local everywhere');
  await wait(1400);

  // ── 4. she tries to read it ─────────────────────────────────────────────
  tara.setPose('reach');
  tara.express('curious');
  trails.classList.add('show-local');
  code.focus(3);
  code.note(3, 'runs first — local name still empty');
  await wait(1000);

  // nothing comes back
  hers.el.classList.add('is-hollow-pulse');
  await wait(800);
  trails.classList.remove('show-local');

  // ── 5. and the way out is shut, because the room already owns the name ──
  await camera.to({ ...inRoom(140, -300), zoom: camera.fitRoom(1700), duration: 1600 });
  trails.classList.add('show-blocked');
  await wait(500);
  trails.classList.add('is-barred');
  camera.shake(9);
  tara.setPose('surprise');
  tara.express('surprised');
  fig.classList.add('mithu-alert');
  await wait(800);
  trails.classList.remove('show-blocked', 'is-barred');

  // ── 6. the error ────────────────────────────────────────────────────────
  root.querySelector('.stage').classList.add('is-darkened');
  err.setAttribute('transform', 'translate(120 -760)');
  err.classList.add('is-cast');
  code.mark(3, 'is-error');
  code.focus(3);
  camera.shake(12);
  await wait(1400);

  ui.dataset.line = 'claimed';
  ui.classList.add('show-line');
  await wait(4200);
  ui.classList.remove('show-line');
  await wait(300);

  ui.dataset.line = 'lookedthere';
  ui.classList.add('show-line');
  await wait(4400);
  ui.classList.remove('show-line');

  // ── 7. see it again, or move on ─────────────────────────────────────────
  // This is the hardest beat in the piece and it goes past quickly. Offering
  // it a second time costs nothing and means a learner who was still reading
  // the error text when it faded is not simply left behind. The loop is
  // bounded rather than endless: the offer does not return after the replay,
  // because a control that keeps reappearing starts to feel like a gate.
  if (await afterBeat(stage, { again: 'See that again', go: 'I follow — continue' }) === 'again') {
    err.classList.remove('is-cast');
    await wait(500);
    trails.classList.add('show-blocked', 'is-barred');
    err.classList.add('is-cast');
    code.mark(3, 'is-error');
    camera.shake(7);
    await wait(2600);
    trails.classList.remove('show-blocked', 'is-barred');
  }

  await wait(700);
  err.classList.remove('is-cast');
  root.querySelector('.stage').classList.remove('is-darkened');
  fig.classList.remove('mithu-alert');
  tara.setPose('idle');
  hers.el.classList.remove('is-hollow-pulse');
  code.unmark('is-error');
  code.unfocus();
  code.clearNotes();
  stage.journey.done('builtin');
  await wait(500);
}

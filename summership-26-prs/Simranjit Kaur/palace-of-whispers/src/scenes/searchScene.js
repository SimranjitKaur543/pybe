// SCENE 4 — THE SEARCH
//
// ── The accuracy problem this scene has to solve ──────────────────────────
//
// A girl walking around with a lantern until she bumps into a word would teach
// DYNAMIC scope: "whoever is nearest wins". Python does not work that way.
//
// So the searching is not done by Tara. The lantern's light is anchored to HER
// ROOM and widens outward through the nested architecture — room, then the
// space her room sits inside, then the palace. Tara walks alongside because it
// is her lantern, but she is never the probe, and the light never waits for her
// to arrive. The nesting does the looking.
//
// The search also STOPS at the palace, where the name is found. Lighting the
// kingdom as well would say Python keeps looking after it has an answer.
//
// The docked code tracks the same search line by line, so the viewer sees the
// rule stated (previous scene), performed (here, in the architecture), and
// written (here, in Python) — three times, without three explanations.

import { wait, parallel } from '../engine/anim.js';
import { choose, say, react } from '../engine/Ask.js';
import { beats } from '../story/beats.js';
import { COURT } from '../art/scenes/courtyard.js';
import { inRoom } from '../roomSpace.js';

const STEPS = [
  { cls: 'lg-local',     found: false, note: 'not in room() — look outward' },
  { cls: 'lg-enclosing', found: false, note: 'not in the enclosing space either' },
  { cls: 'lg-global',    found: true,  note: 'found it — the palace name' }
];

export async function searchScene(stage) {
  const { camera, tara, spark, hers, code, ui, root } = stage;
  const glows = root.querySelector('.layer-glows');
  const fig = root.querySelector('.tara');

  // clear the named labels; this scene is about looking, not naming
  root.querySelectorAll('.mlabel').forEach((m) => m.classList.remove('is-named'));
  root.querySelectorAll('.lg').forEach((g) => g.classList.remove('is-lit'));

  // ── 1. the palace already holds a name of its own ───────────────────────
  spark.setText('MITHU').at(1900, -1180).setScale(1);
  spark.el.classList.remove('is-dimmed');
  spark.el.classList.add('is-live', 'is-word', 'is-outer');

  await camera.to({ ...inRoom(760, -560), zoom: camera.zoomToFitWidth(1180), duration: 1700 });
  tara.express('curious');
  await wait(500);

  // ── 2. Mithu's line ─────────────────────────────────────────────────────
  fig.classList.add('mithu-alert');
  ui.dataset.line = 'wider';
  ui.classList.add('show-line');
  await wait(3400);
  ui.classList.remove('show-line');
  fig.classList.remove('mithu-alert');

  // ── 3. the room that will do the asking, written down ───────────────────
  code.clearNotes();
  await code.append(['', 'def room():', '    print(name)'], { stagger: 380 });
  code.focus(3);
  await wait(500);

  // ── 4. she takes up the lantern ─────────────────────────────────────────
  fig.classList.add('has-lantern');
  await wait(500);

  // ── 5. the light widens outward, one nested space at a time ─────────────
  glows.classList.add('is-live', 'is-searching');

  for (const step of STEPS) {
    // ── the learner picks the order, which IS the rule ──────────────────
    // Asked once, after her own room has come up empty and before the light
    // moves on. "Straight to the palace" is where the name actually turns out
    // to be, which makes it a real temptation — and being right by luck is
    // still the wrong rule, so it gets corrected rather than rewarded.
    if (step.cls === 'lg-enclosing') {
      const next = await choose(stage, beats.lookNext);
      await react(stage, next === beats.lookNext.answer ? 'happy' : 'curious', { ms: 700 });
      await say(stage, beats.lookNext.feedback[next], 2600);
      stage.journey.at('enclosing');
    }

    const layer = root.querySelector(`.${step.cls}`);
    layer.classList.add('is-lit', 'is-probing');
    code.note(3, step.note);

    // she keeps walking outward while the light widens — alongside it, not
    // driving it, and never arriving before the light does
    if (step.cls === 'lg-enclosing') {
      parallel(
        tara.walkTo(COURT.centreX - 200, { speed: 230 }),
        camera.to({ ...inRoom(900, -640), zoom: camera.zoomToFitWidth(1420), duration: 1800 })
      );
    }
    if (step.cls === 'lg-global') {
      camera.to({ ...inRoom(980, -860), zoom: camera.zoomToFitWidth(1780), duration: 1900 });
    }

    await wait(1100);

    if (step.found) {
      stage.journey.done('enclosing').at('global');
      layer.classList.remove('is-probing');
      layer.classList.add('is-found');
      spark.el.classList.add('is-answering');
      code.mark(3, 'is-ok');
      tara.express('happy');
      camera.shake(5);
      await wait(1400);
    } else {
      layer.classList.remove('is-probing');
      layer.classList.add('is-empty');
      await wait(300);
    }
  }

  // the kingdom stays dark: the looking ended the moment the name was found
  await wait(800);

  // ── 6. and the Built-in ring finally earns its keep ─────────────────────
  // `print` was on screen the whole time. It is not hers, not the courtyard's
  // and not the palace's — it was found in the outermost ring, which is why
  // that ring is drawn around everything and why it is searched last.
  code.unmark('is-ok');
  code.note(3, 'and print? found in the outermost ring');
  root.querySelector('.lg-builtin').classList.add('is-lit', 'is-found');
  root.querySelector('.mlabel-builtin').classList.add('is-named');
  await wait(1000);

  // print has been on screen since the first code panel; the question is not
  // what it does but who it belongs to, which is the only thing that makes
  // the outermost ring mean anything.
  // the name was found in the palace, and print is about to be placed in the
  // ring beyond it
  stage.journey.done('global').at('builtin');
  const who = await choose(stage, beats.whoMadePrint);
  await react(stage, who === beats.whoMadePrint.answer ? 'happy' : 'surprised', { nod: true, ms: 800 });
  await say(stage, beats.whoMadePrint.feedback[who], 2800);

  ui.dataset.line = 'builtin';
  ui.classList.add('show-line');
  await wait(4400);
  ui.classList.remove('show-line');

  root.querySelector('.mlabel-builtin').classList.remove('is-named');
  root.querySelectorAll('.lg').forEach((g) => g.classList.remove('is-empty', 'is-found'));
  glows.classList.remove('is-searching');
  spark.el.classList.remove('is-answering');
  code.unfocus();
  code.clearNotes();
}

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

// The four closing lookups. Deliberately one per layer, in order, so the
// answer moves steadily outward and the last one is the ring that holds the
// names Python already knew.
const LAST_QUESTIONS = [
  { name: 'secret', target: 0 },
  { name: 'place',  target: 1 },
  { name: 'name',   target: 2 },
  { name: 'print',  target: 3 }
];

// Which line of the closing program belongs to which layer.
const THEORY = [
  { line: 6, id: 'local',     note: 'Local — this call only' },
  { line: 3, id: 'enclosing', note: 'Enclosing — the function wrapped around it' },
  { line: 0, id: 'global',    note: 'Global — the top level of the file' },
  { line: 7, id: 'builtin',   note: 'print — Built-in, always there' }
];

function clearRings(root) {
  LAYER_IDS.forEach((id) => {
    root.querySelector(`.lg-${id}`).classList.remove('is-lit', 'is-probing', 'is-found', 'is-empty');
  });
}

/**
 * One lookup, performed by the architecture: the light steps outward ring by
 * ring, darkening each one that does not hold the name, and stops the instant
 * it finds it. The pause before each resolution is deliberate.
 */
async function askWhere(root, spark, name, target) {
  clearRings(root);
  spark.setText(name).at(1900, -1180).setScale(1);
  spark.el.classList.remove('is-dimmed', 'is-answering');
  spark.el.classList.add('is-live', 'is-word');
  await wait(900);

  for (let i = 0; i <= target; i += 1) {
    const ring = root.querySelector(`.lg-${LAYER_IDS[i]}`);
    ring.classList.add('is-lit', 'is-probing');
    await wait(i === target ? 850 : 600);      // the held beat: the question
    ring.classList.remove('is-probing');

    if (i === target) {
      ring.classList.add('is-found');
      root.querySelector(`.mlabel-${LAYER_IDS[i]}`).classList.add('is-named');
      spark.el.classList.add('is-answering');
      await wait(1700);
      root.querySelector(`.mlabel-${LAYER_IDS[i]}`).classList.remove('is-named');
      spark.el.classList.remove('is-answering');
    } else {
      ring.classList.add('is-empty');
      await wait(260);
    }
  }
  await wait(400);
}

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

  // ── 3. she steps out to look at the palace she now understands ──────────
  // This used to light ten windows one at a time and then spend three more
  // narration lines on the same feeling. It is the same beat; it does not need
  // ninety seconds to land.
  root.querySelector('.portal').classList.add('show-shell', 'is-warming');
  await camera.to({ ...inRoom(900, -620), zoom: camera.fitRoom(3200), duration: 3000 });
  hers.el.classList.add('is-settled');
  spark.el.classList.add('is-settled');
  fig.classList.add('looks-out');
  tara.express('happy');
  await wait(900);

  ui.dataset.line = 'belong';
  ui.classList.add('show-line');
  await wait(3400);
  ui.classList.remove('show-line');

  // ── 5. THE LAST QUESTION ────────────────────────────────────────────────
  // The palace performs the rule four times, wordlessly, with a different
  // answer each time. Two jobs at once:
  //
  //  • It restates the whole lookup order at the point of maximum retention,
  //    as motion rather than as a summary.
  //  • Beat 2 is the only place in the entire story where a name is
  //    successfully found in the ENCLOSING layer. Everywhere else that layer
  //    is either an empty room the search passes through, or a thing that
  //    `nonlocal` writes to. Without this beat the E in LEGB is never once
  //    shown succeeding.
  //
  // Each beat holds for a moment before it resolves. That pause is the only
  // question the story ever asks: the viewer answers it in their head before
  // the palace does. No prompt, no UI — just a beat of silence.
  await camera.to({ ...inRoom(980, -940), zoom: camera.zoomToFitWidth(1760), duration: 3000 });
  root.querySelector('.layer-glows').classList.add('is-live');
  await wait(700);

  ui.dataset.line = 'fourplaces';
  ui.classList.add('show-line');
  await wait(3400);
  ui.classList.remove('show-line');

  for (const { name, target } of LAST_QUESTIONS) {
    await askWhere(root, spark, name, target);
  }
  clearRings(root);
  spark.el.classList.remove('is-live', 'is-word');
  await wait(800);

  // ── 5b. and now, plainly, the theory ────────────────────────────────────
  // One program that contains all four scopes at once. `place` is read from
  // the enclosing function — the ordinary closure case the story owed the
  // viewer — and `print` is the built-in that was there the whole time.
  code.undock();
  await code.write([
    'name = "Mithu"',
    '',
    'def palace():',
    '    place = "courtyard"',
    '',
    '    def room():',
    '        secret = "laddoo"',
    '        print(name, place, secret)'
  ], { stagger: 300 });
  await wait(900);

  root.querySelector('.layer-glows').classList.add('is-soft');
  for (const { line, id, note } of THEORY) {
    code.focus(line);
    code.note(line, note);
    const ring = root.querySelector(`.lg-${id}`);
    ring.classList.add('is-lit');
    root.querySelector(`.mlabel-${id}`).classList.add('is-named');
    await wait(2600);
    root.querySelector(`.mlabel-${id}`).classList.remove('is-named');
  }
  code.unfocus();
  await wait(900);

  // the two rules, stated outright, over the finished program
  ui.dataset.line = 'legb';
  ui.classList.add('show-line');
  await wait(4600);
  ui.classList.remove('show-line');
  await wait(500);

  ui.dataset.line = 'assignrule';
  ui.classList.add('show-line');
  await wait(4800);
  ui.classList.remove('show-line');
  await wait(600);

  await code.clear();
  root.querySelectorAll('.mlabel').forEach((m) => m.classList.add('is-fading'));
  root.querySelectorAll('.lg').forEach((g) => g.classList.add('is-fading'));
  await wait(1100);
  root.querySelectorAll('.mlabel').forEach((m) => m.classList.remove('is-named', 'is-fading'));
  root.querySelectorAll('.lg').forEach((g) => g.classList.remove('is-lit', 'is-fading'));
  root.querySelector('.layer-glows').classList.remove('is-soft');

  // The word rising into the sky as a star lived here. It was lovely and it
  // taught nothing, and by that point the film had already ended twice.
  await camera.to({ ...inRoom(900, -820), zoom: camera.zoomToFitWidth(1900), duration: 3000 });
  await wait(600);

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

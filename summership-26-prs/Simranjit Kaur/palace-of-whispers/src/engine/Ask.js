// Asking the learner something, and waiting.
//
// The story is a chain of async scenes, so "stop and let them decide" needs no
// engine of its own: a scene awaits a promise the learner resolves. That is
// exactly how the original single interaction worked. This module turns that
// one-off into something any scene can call.
//
// ── Two rules this module exists to keep ──────────────────────────────────
//
// 1. The palace keeps living behind the question. These are NOT modal dialogs.
//    The camera, the flames and the motes go on moving while the learner
//    decides, because the moment the world freezes behind a panel of buttons
//    the piece stops being a film and becomes a quiz with a picture on it.
//
// 2. Nothing outlives its run. A choice holds DOM listeners, and a generation
//    bump cannot reach those — the halted scene simply never resumes, leaving
//    live buttons wired to a promise nobody awaits. Every handler registers
//    with onRunCancel so Replay tears it down.

import { onRunCancel, currentGeneration, REDUCED } from './anim.js';

/**
 * Put a question to the learner and wait for an answer.
 *
 * @param {object} stage
 * @param {object} spec
 * @param {string} spec.question  short — one line, it sits under the palace
 * @param {Array<{label:string, value:any, note?:string}>} spec.options  2–3
 * @param {string} [spec.kind]  'choice' (default) or 'predict'
 * @returns {Promise<any>} the chosen option's `value`
 */

/** Marks the stage as waiting on the learner. Scenery recedes; Tara attends. */
function deciding(stage, on) {
  const st = stage.root.querySelector('.stage');
  if (st) st.classList.toggle('is-deciding', on);
  const fig = stage.root.querySelector('.tara');
  if (fig) fig.classList.toggle('is-attending', on);
}

/**
 * A visible response from Tara, before the story moves on.
 * Small on purpose: a reaction that takes two seconds stops being a reaction
 * and becomes another scene.
 */
export async function react(stage, mood = 'curious', { nod = false, ms = 900 } = {}) {
  const fig = stage.root.querySelector('.tara');
  stage.tara?.express?.(mood);
  if (nod && fig) fig.classList.add('mithu-alert');
  await new Promise((r) => setTimeout(r, REDUCED ? 0 : ms));
  if (nod && fig) fig.classList.remove('mithu-alert');
}

export function choose(stage, { question, options, kind = 'choice' } = {}) {
  const host = stage.root.querySelector('.interact');
  const mine = currentGeneration();

  return new Promise((resolve) => {
    const panel = document.createElement('div');
    panel.className = `ask ask-${kind}`;
    panel.setAttribute('role', 'group');
    panel.setAttribute('aria-label', question);

    const q = document.createElement('p');
    q.className = 'ask-q';
    q.textContent = question;
    panel.appendChild(q);

    const row = document.createElement('div');
    row.className = 'ask-options';
    panel.appendChild(row);

    let done = false;
    const cleanup = () => {
      if (done) return;
      done = true;
      deciding(stage, false);
      unregister();
      panel.classList.add('is-going');
      // let it fade rather than vanish under the learner's cursor
      setTimeout(() => panel.remove(), REDUCED ? 0 : 420);
    };

    const pick = (opt) => {
      if (done) return;
      // mark what they chose so the answer stays visible for a beat
      [...row.children].forEach((b) => b.classList.toggle('is-chosen', b.dataset.value === String(opt.value)));
      cleanup();
      // a newer run started while this was open: resolve nothing, ever
      if (mine !== currentGeneration()) return;
      resolve(opt.value);
    };

    options.forEach((opt, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'choice';
      b.dataset.value = String(opt.value);
      b.innerHTML = `<span class="choice-label"></span>${opt.note ? '<span class="choice-note"></span>' : ''}`;
      b.querySelector('.choice-label').textContent = opt.label;
      if (opt.note) b.querySelector('.choice-note').textContent = opt.note;
      b.addEventListener('click', () => pick(opt));
      row.appendChild(b);
      if (i === 0) requestAnimationFrame(() => b.focus({ preventScroll: true }));
    });

    // Replay while this is open must take the buttons with it.
    const unregister = onRunCancel(() => {
      done = true;
      panel.remove();
    });

    deciding(stage, true);
    host.appendChild(panel);
    requestAnimationFrame(() => panel.classList.add('is-open'));
  });
}

/**
 * The beat after something important: let them sit with it, or see it again.
 * Returns 'again' or 'continue'.
 */
export function afterBeat(stage, { again = 'See it again', go = 'Continue' } = {}) {
  return choose(stage, {
    kind: 'after',
    question: '',
    options: [
      { label: go, value: 'continue' },
      { label: again, value: 'again' }
    ]
  });
}

/**
 * A short reply to what they just chose, shown where the question was.
 *
 * Deliberately not part of the narration system: those lines are fixed story
 * text selected by attribute, and this is a response to a decision the learner
 * made a second ago. Mixing the two would mean the story's own script had to
 * contain a line for every possible answer.
 */
export async function say(stage, text, ms = 2600) {
  const host = stage.root.querySelector('.interact');
  const mine = currentGeneration();

  const p = document.createElement('p');
  p.className = 'ask-said';
  p.setAttribute('role', 'status');      // announced, since it answers an action
  p.textContent = text;
  host.appendChild(p);

  const unregister = onRunCancel(() => p.remove());
  requestAnimationFrame(() => p.classList.add('is-open'));

  await new Promise((r) => setTimeout(r, REDUCED ? 0 : ms));
  unregister();
  p.classList.remove('is-open');
  setTimeout(() => p.remove(), REDUCED ? 0 : 420);

  // a newer run started mid-sentence: stop the scene here
  if (mine !== currentGeneration()) await new Promise(() => {});
}

/**
 * Ask the learner what a piece of Python will do, BEFORE showing them.
 *
 * ── Why this shape ────────────────────────────────────────────────────────
 *
 * The code sits INSIDE the question panel rather than in the story's usual
 * code overlay. A prediction is read as one object — these lines, this
 * question, these answers — and splitting it across two places on screen
 * makes the learner hunt between them while trying to hold a mental model.
 *
 * A wrong answer is not an ending. It shows what actually happens and offers
 * the question again, because the misconception is the thing being taught and
 * a learner who is told "no" and moved past has learned nothing. After two
 * tries it simply explains, kindly — being stuck is not a punishment either.
 *
 * Hints guide; they do not answer. They are revealed one at a time and the
 * last one still stops short of saying it outright.
 *
 * @returns {Promise<{value:any, correct:boolean, attempts:number, usedHint:boolean}>}
 */
export async function predict(stage, spec) {
  const { code = [], question, options, answer, hints = [], feedback = {}, reveal } = spec;
  const host = stage.root.querySelector('.interact');
  const mine = currentGeneration();

  let attempts = 0;
  let usedHint = false;

  for (;;) {
    const result = await new Promise((resolve) => {
      const panel = document.createElement('div');
      panel.className = 'ask ask-predict';
      panel.setAttribute('role', 'group');
      panel.setAttribute('aria-label', question);

      if (code.length) {
        const pre = document.createElement('pre');
        pre.className = 'ask-code';
        pre.textContent = code.join('\n');
        panel.appendChild(pre);
      }

      const q = document.createElement('p');
      q.className = 'ask-q';
      q.textContent = question;
      panel.appendChild(q);

      const row = document.createElement('div');
      row.className = 'ask-options';
      panel.appendChild(row);

      // the hint rail: one line at a time, never the answer
      const rail = document.createElement('div');
      rail.className = 'hint-rail';
      panel.appendChild(rail);

      let shown = 0;
      let hintBtn = null;
      if (hints.length) {
        hintBtn = document.createElement('button');
        hintBtn.type = 'button';
        hintBtn.className = 'hintbtn';
        hintBtn.innerHTML = '<span aria-hidden="true">\u{1F4A1}</span> Hint';
        hintBtn.addEventListener('click', () => {
          usedHint = true;
          const line = document.createElement('p');
          line.className = 'hint';
          line.setAttribute('role', 'status');
          line.textContent = hints[shown];
          rail.appendChild(line);
          requestAnimationFrame(() => line.classList.add('is-open'));
          shown += 1;
          if (shown >= hints.length) hintBtn.disabled = true;
        });
        panel.appendChild(hintBtn);
      }

      let done = false;
      const finish = (opt) => {
        if (done) return;
        done = true;
        deciding(stage, false);
        unregister();
        [...row.children].forEach((b) =>
          b.classList.toggle('is-chosen', b.dataset.value === String(opt.value)));
        panel.classList.add('is-going');
        setTimeout(() => panel.remove(), REDUCED ? 0 : 420);
        if (mine !== currentGeneration()) return;
        resolve(opt.value);
      };

      options.forEach((opt, i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'choice choice-tight';
        b.dataset.value = String(opt.value);
        b.textContent = opt.label;
        b.addEventListener('click', () => finish(opt));
        row.appendChild(b);
        if (i === 0) requestAnimationFrame(() => b.focus({ preventScroll: true }));
      });

      const unregister = onRunCancel(() => { done = true; deciding(stage, false); panel.remove(); });
      deciding(stage, true);
      host.appendChild(panel);
      requestAnimationFrame(() => panel.classList.add('is-open'));
    });

    attempts += 1;
    const correct = result === answer;

    if (correct) {
      await say(stage, feedback[result] || 'That is it.', 2400);
      return { value: result, correct: true, attempts, usedHint };
    }

    // Not right — say what actually happens, and offer it again. Twice is
    // enough; after that, being stuck should not feel like a wall.
    await say(stage, feedback[result] || 'Not quite — look again at where it was made.', 2600);
    if (attempts >= 2) {
      if (reveal) await say(stage, reveal, 3000);
      return { value: result, correct: false, attempts, usedHint };
    }
  }
}

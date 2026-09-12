// Code written in the air.
//
// This is an HTML overlay, not SVG in the world, and that is a deliberate
// reversal. In-world text is sized in room-units, so the camera had to be
// framed to the block — but the block's width depends on the font, so a larger
// font simply pulled the camera further back and the apparent size never
// changed. Legibility and camera framing were fighting each other.
//
// As an overlay the code is sized with plain CSS clamp(), so it is readable at
// 375px by construction. It keeps the glow and the line-by-line reveal, has no
// editor chrome of any kind, and the palace goes on animating behind it.
//
// ── Two modes ─────────────────────────────────────────────────────────────
// DOCKED   a small panel in the corner that PERSISTS and GROWS while the story
//          plays, so every palace beat is mirrored by the Python that means the
//          same thing. The palace stays the subject; the code accumulates.
// STAGE    the centred block Mithu teaches from, once the story hands over.
//
// The docked panel is why the first half of the film can teach at all: the
// image still lands first, and the code follows it a beat later.

import { wait } from './anim.js';

export class CodeSpell {
  constructor(el) {
    this.el = el;                       // .code-air
    this.pre = el.querySelector('.ca-lines');
    this.lines = [];
    this.texts = [];
  }

  /** Kept so scenes can keep calling it; the overlay positions itself. */
  at() {
    return this;
  }

  /** Small corner panel: the palace keeps the frame, the code rides along. */
  dock() {
    this.el.classList.add('is-docked');
    return this;
  }

  undock() {
    this.el.classList.remove('is-docked');
    return this;
  }

  /** Replace everything and write it out one line at a time. */
  async write(lines, { stagger = 420 } = {}) {
    this.pre.innerHTML = '';
    this.lines = [];
    this.texts = [];
    this.el.classList.add('is-open');
    return this.append(lines, { stagger });
  }

  /** Add lines WITHOUT wiping what is already there. Blank strings are gaps. */
  async append(lines, { stagger = 420 } = {}) {
    this.el.classList.add('is-open');

    for (const text of lines) {
      const indent = text.match(/^\s*/)[0].length;
      const span = document.createElement('span');
      span.className = 'ca-line';
      span.style.paddingLeft = `${indent * 0.62}em`;
      span.innerHTML = escapeHtml(text.trim()) || '&nbsp;';
      this.pre.appendChild(span);
      this.lines.push(span);
      this.texts.push(text);

      // next frame, so the entry animation actually runs
      requestAnimationFrame(() => span.classList.add('is-written'));
      await wait(stagger);
    }
    return this;
  }

  /** Rewrite one line in place — used when a name is reassigned. */
  async retype(index, text, { flash = true } = {}) {
    const line = this.lines[index];
    if (!line) return this;
    const indent = text.match(/^\s*/)[0].length;
    line.style.paddingLeft = `${indent * 0.62}em`;
    line.innerHTML = escapeHtml(text.trim()) || '&nbsp;';
    this.texts[index] = text;
    if (flash) {
      line.classList.remove('is-written');
      requestAnimationFrame(() => line.classList.add('is-written'));
      await wait(700);
    }
    return this;
  }

  /**
   * A short annotation pinned to a line. This is how the panel teaches without
   * turning into prose — the comment says the rule, the palace shows it.
   */
  note(index, text) {
    const line = this.lines[index];
    if (!line) return this;
    line.querySelector('.ca-note')?.remove();
    if (!text) return this;
    const n = document.createElement('span');
    n.className = 'ca-note';
    n.textContent = `  # ${text}`;
    line.appendChild(n);
    return this;
  }

  clearNotes() {
    this.pre.querySelectorAll('.ca-note').forEach((n) => n.remove());
    return this;
  }

  /** Mark a line's state: 'is-ok', 'is-error', 'is-claim'. */
  mark(index, cls) {
    this.lines[index]?.classList.add(cls);
    return this;
  }

  unmark(cls) {
    this.lines.forEach((l) => l.classList.remove(cls));
    return this;
  }

  /** Put the light on one line — the line currently being "run". */
  focus(index) {
    this.lines.forEach((l, i) => l.classList.toggle('is-running', i === index));
    return this;
  }

  unfocus() {
    this.lines.forEach((l) => l.classList.remove('is-running'));
    return this;
  }

  async clear({ duration = 700 } = {}) {
    this.el.classList.remove('is-open');
    await wait(duration);
    this.pre.innerHTML = '';
    this.lines = [];
    this.texts = [];
    return this;
  }
}

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
